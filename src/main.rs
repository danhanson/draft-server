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
use std::sync::Arc;
use std::{net::SocketAddr, str::FromStr};
use tower_http::services::ServeDir;
use tokio::sync::broadcast;
use draft_data::DraftData;

const ASSETS_DIR: &str = "assets";

#[derive(Debug, Clone)]
struct AppState {
    websocket_channel: broadcast::Sender<ws::Message>,
    draft_data: Arc<DraftData>,
}


impl AppState {
    fn new(websocket_channel: broadcast::Sender<ws::Message>) -> Self {
        Self {
            websocket_channel: websocket_channel,
            draft_data: Arc::new(DraftData::new()),
        }
    }
}


#[tokio::main(flavor = "current_thread")]
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
    let mut receiver = state.websocket_channel.subscribe();
    let data = state.draft_data.load();
    if let Err(error) = socket.send(ws::Message::Text(data)).await {
        print!("Unexpected error: {:?}", error);
        let _ = socket.close();
        return;
    }
    loop {
        tokio::select! {
            ws_message = socket.recv() => {
                match ws_message {
                    None => {
                        break;
                    },
                    Some(Ok(ws::Message::Close(_))) => {
                        let _ = socket.close().await;
                        break;
                    },
                    Some(Ok(msg)) => {
                        print!("Unexpected message: {:?}", msg);
                    },
                    Some(Err(error)) => {
                        print!("Unexpected error: {:?}", error);
                        let _ = socket.close().await;
                        break;
                    }
                }
                todo!()
            },
            update_message = receiver.recv() => {
                match update_message {
                    Ok(msg) => {
                        if let Err(error) = socket.send(msg).await {
                            println!("Unexpected error: {:?}", error);
                        }
                    },
                    Err(broadcast::error::RecvError::Lagged(_)) => {
                        println!("LAGGING!");
                    },
                    Err(broadcast::error::RecvError::Closed) => {
                        break;
                    }
                }
            }
        }
    }
}


async fn put_team(State(state): State<AppState>, Path(team_id): Path<String>, body: String) -> impl IntoResponse {
    let result = state.draft_data.update(team_id, body);
    if let Err(error) = state.websocket_channel.send(result) {
        println!("Unexpected error: {:?}", error);
    }
    StatusCode::OK
}

async fn delete_team(State(state): State<AppState>, Path(team_id): Path<String>) -> impl IntoResponse {
    match state.draft_data.delete(&team_id) {
        Some(msg) => {
            if let Err(error) = state.websocket_channel.send(msg) {
                println!("Unexpected error: {:?}", error);
            }
            StatusCode::OK
        },
        None => StatusCode::NOT_FOUND
    }
}