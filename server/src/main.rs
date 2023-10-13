mod draft_data;
mod action;

use axum::{
    extract::{
        State,
        Path,
        WebSocketUpgrade,
        ws,
        Json,
    },
    response::IntoResponse,
    routing::get,
    Router, http::{StatusCode, header, HeaderMap},
};
use std::sync::{Arc, RwLock};
use std::{net::SocketAddr, str::FromStr};
use tower_http::{
    services::ServeDir,
    cors::CorsLayer,
};
use tokio::sync::broadcast;
use uuid::Uuid;
use draft_data::{DraftData, Team};
use action::Action;

const ASSETS_DIR: &str = "assets";

#[derive(Debug, Clone)]
struct AppState {
    websocket_channel: broadcast::Sender<String>,
    draft_data: Arc<RwLock<DraftData>>,
}

impl AppState {
    fn new(websocket_channel: broadcast::Sender<String>) -> Self {
        Self {
            websocket_channel: websocket_channel,
            draft_data: Arc::new(RwLock::new(DraftData::new())),
        }
    }
}

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    let args: Vec<String> = std::env::args().collect();

    let (websocket_sender, websocket_receiver) = broadcast::channel::<String>(16);
    tokio::spawn(log_ws_messages(websocket_receiver));

    let state = AppState::new(websocket_sender);
    let routes = Router::new()
        .route("/feed.ws", get(websocket_route))
        .route("/teams/:team_id", get(get_team).put(put_team).delete(delete_team))
        .route("/teams", get(get_teams).post(post_team))
        .layer(CorsLayer::permissive())
        .fallback_service(ServeDir::new(ASSETS_DIR).append_index_html_on_directories(true))
        .with_state::<()>(state);

    let addr = SocketAddr::from_str(&args[1]).expect("bad argument");
    axum::Server::bind(&addr).serve(routes.into_make_service_with_connect_info::<SocketAddr>()).await.expect("failed to start server");
}

async fn log_ws_messages(mut receiver: broadcast::Receiver<String>) {
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
    let (message, mut receiver) = {  // use block scope to avoid Send error, see https://github.com/rust-lang/rust/issues/57478
        let data = state.draft_data.read().unwrap();
        let teams = data.load();
        let action = Action::Load { teams };
        let message = ws::Message::Text(serde_json::to_string(&action).unwrap());
        let receiver = state.websocket_channel.subscribe();
        drop(data);  // hold lock after subscribe to avoid missing writes
        (message, receiver)
    };
    if let Err(error) = socket.send(message).await {
        print!("{} Unexpected error: {:?}", line!(), error);
        if let Err(error) = socket.close().await {
            print!("{} Unexpected error: {:?}", line!(), error);
        }
        return;
    }
    loop {
        tokio::select! {
            biased;  // prioritize processing the channel to avoid Lagged error
            update_message = receiver.recv() => {
                match update_message {
                    Ok(msg) => {
                        if let Err(error) = socket.send(ws::Message::Text(msg)).await {
                            println!("{} Unexpected WebSocket send error: {:?}", line!(), error);
                        }
                    },
                    Err(channel_error) => {
                        println!("{} Unexpected channel error {:?}", line!(), channel_error);
                        if let Err(error) = socket.close().await {
                            println!("{} Unexpected WebSocket close error: {:?}", line!(), error);
                        }
                        break;
                    },
                }
            },
            ws_message = socket.recv() => {
                match ws_message {
                    None | Some(Ok(ws::Message::Close(_))) => {
                        break;
                    },
                    Some(Ok(msg)) => {
                        print!("{} Unexpected message: {:?}", line!(), msg);
                        // silently ignore for now
                        continue;
                    },
                    Some(Err(error)) => {
                        print!("{} Unexpected error: {:?}", line!(), error);
                        if let Err(error) = socket.close().await {
                            println!("{} Unexpected error: {:?}", line!(), error)
                        }
                        break;
                    }
                }
            },
        }
    }
}

async fn put_team(State(state): State<AppState>, Path(team_id): Path<Uuid>, Json(new_team): Json<Team>) -> impl IntoResponse {
    let mut draft_data = state.draft_data.write().unwrap();
    if let Some(team) = draft_data.upsert(team_id, new_team) {
        let action = Action::Update { team };
        let _ = state.websocket_channel.send(action.to_json());
        drop(draft_data); // hold lock to after send to ensure writes in correct order
        StatusCode::OK
    } else {
        StatusCode::UNPROCESSABLE_ENTITY
    }
}

async fn delete_team(State(state): State<AppState>, Path(team_id): Path<Uuid>) -> impl IntoResponse {
    let mut draft_data = state.draft_data.write().unwrap();
    if draft_data.delete(&team_id) {
        let action = Action::Delete { id: team_id };
        let _ = state.websocket_channel.send(action.to_json());
        StatusCode::OK
    } else {
        StatusCode::NOT_FOUND
    }
}

async fn post_team(State(state): State<AppState>, Json(new_team): Json<Team>) -> impl IntoResponse {
    let id = new_team.id.unwrap_or_else(|| Uuid::new_v4());
    let mut draft_data = state.draft_data.write().unwrap();
    if let Some(team) = draft_data.insert(id, new_team) {
        let action = Action::Update { team };
        let _ = state.websocket_channel.send(action.to_json());
        drop(draft_data);  // hold lock to after send to ensure writes in correct order
        let mut headers = HeaderMap::new();
        headers.append(header::LOCATION, format!("/team/{}", id.to_string()).parse().unwrap());
        (StatusCode::CREATED, headers)
    } else {
        (StatusCode::UNPROCESSABLE_ENTITY, HeaderMap::new())
    }
}

async fn get_teams(State(state): State<AppState>) -> impl IntoResponse {
    let draft_data = state.draft_data.read().unwrap();
    let teams = draft_data.load();
    Json(&teams).into_response()
}

async fn get_team(State(state): State<AppState>, Path(team_id): Path<Uuid>) -> impl IntoResponse {
    let draft_data = state.draft_data.read().unwrap();
    if let Some(team) = draft_data.get(&team_id) {
        Json(team).into_response()
    } else {
        StatusCode::NOT_FOUND.into_response()
    }
}
