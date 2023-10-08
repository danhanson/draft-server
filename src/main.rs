mod draft_data;

use axum::{
    extract::{
        State,
        Path,
        WebSocketUpgrade,
        ws,
    },
    response::IntoResponse,
    routing::{get, put},
    Router, http::StatusCode,
};
use std::sync::{Arc, RwLock};
use std::{net::SocketAddr, str::FromStr};
use tower_http::services::ServeDir;
use tokio::sync::broadcast;
use draft_data::DraftData;

const ASSETS_DIR: &str = "assets";

#[derive(Debug, Clone)]
struct AppState {
    websocket_channel: broadcast::Sender<ws::Message>,
    draft_data: Arc<RwLock<DraftData>>,
}

impl AppState {
    fn new(websocket_channel: broadcast::Sender<ws::Message>) -> Self {
        Self {
            websocket_channel: websocket_channel,
            draft_data: Arc::new(RwLock::new(DraftData::new())),
        }
    }
}

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    let args: Vec<String> = std::env::args().collect();

    let (websocket_sender, websocket_receiver) = broadcast::channel::<ws::Message>(16);
    tokio::spawn(log_ws_messages(websocket_receiver));

    let state = AppState::new(websocket_sender);
    let routes = Router::new()
        .route("/feed.ws", get(websocket_route))
        .route("/team/:team_id", put(put_team).delete(delete_team))
        .fallback_service(ServeDir::new(ASSETS_DIR).append_index_html_on_directories(true))
        .with_state::<()>(state);

    let addr = SocketAddr::from_str(&args[1]).expect("bad argument");
    axum::Server::bind(&addr).serve(routes.into_make_service_with_connect_info::<SocketAddr>()).await.expect("failed to start server");
}

async fn log_ws_messages(mut receiver: broadcast::Receiver<ws::Message>) {
    loop {
        match receiver.recv().await {
            Ok(message) => {
                println!("WebSockets Message: {:?}", message);
            },
            Err(broadcast::error::RecvError::Lagged(_)) => {
                println!("Lagging");
            },
            Err(broadcast::error::RecvError::Closed) => {
                break;
            }
        }
    }
}

async fn websocket_route(State(state): State<AppState>, ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_failed_upgrade(|error| print!("Error upgrade {:?}", error)).on_upgrade(|socket| subscribe(state, socket))
}

async fn subscribe(state: AppState, mut socket: ws::WebSocket) {
    let (result, mut receiver) = {  // use block scope to avoid Send error, see https://github.com/rust-lang/rust/issues/57478
        let data = state.draft_data.read().unwrap();
        let result = ws::Message::Text(data.load());
        let receiver = state.websocket_channel.subscribe();
        drop(data);  // hold lock after subscribe to avoid missing writes
        (result, receiver)
    };
    if let Err(error) = socket.send(result).await {
        print!("Unexpected error: {:?}", error);
        if let Err(error) = socket.close().await {
            print!("Unexpected error: {:?}", error);
        }
        return;
    }
    loop {
        let result = tokio::select! {
            biased;  // prioritize processing the channel to avoid Lagged error
            update_message = receiver.recv() => {
                match update_message {
                    Ok(msg) => Some(msg),
                    Err(broadcast::error::RecvError::Lagged(_)) => {
                        println!("LAGGING!");
                        None
                    },
                    Err(broadcast::error::RecvError::Closed) => None
                }
            },
            ws_message = socket.recv() => {
                match ws_message {
                    None => {
                        break;
                    },
                    Some(Ok(ws::Message::Close(_))) => None,
                    Some(Ok(msg)) => {
                        print!("Unexpected message: {:?}", msg);
                        continue;
                    },
                    Some(Err(error)) => {
                        print!("Unexpected error: {:?}", error);
                        None
                    }
                }
            },
        };
        // extract async code from select! to ensure that its tasks are cancellation safe
        if let Some(msg) = result {
            if let Err(error) = socket.send(msg).await {
                println!("Unexpected error: {:?}", error);
            }
        } else {
            if let Err(error) = socket.close().await {
                println!("Unexpected error: {:?}", error)
            }
            break;
        }
    }
}

async fn put_team(State(state): State<AppState>, Path(team_id): Path<String>, body: String) -> impl IntoResponse {
    let mut draft_data = state.draft_data.write().unwrap();
    let msg = draft_data.update(team_id, body);
    let _ = state.websocket_channel.send(msg);
    drop(draft_data);  // hold lock to after send to ensure writes in correct order
    StatusCode::OK
}

async fn delete_team(State(state): State<AppState>, Path(team_id): Path<String>) -> impl IntoResponse {
    let mut draft_data = state.draft_data.write().unwrap();
    let is_deleted = draft_data.delete(&team_id).map(
        |msg| state.websocket_channel.send(msg)
    ).is_some();
    drop(draft_data);  // hold lock to after send to ensure writes in correct order
    if is_deleted {
        StatusCode::OK
    } else {
        StatusCode::NOT_FOUND
    }
}
