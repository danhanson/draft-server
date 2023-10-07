use std::collections::HashMap;
use std::sync::RwLock;
use axum::extract::ws;

#[derive(Debug)]
pub struct DraftData {
    teams: RwLock<HashMap<String, String>>,
}

impl DraftData {
    pub fn new() -> Self {
        DraftData {
            teams: RwLock::new(HashMap::new()),
        }
    }
    pub fn update(&self, id: String, team: String) -> ws::Message {
        let mut teams = self.teams.write().unwrap();
        let msg = ws::Message::Text(format!("{{\"action\":\"update\",\"id\":\"{}\",\"value\":{}}}", id, team));
        teams.insert(id, team);
        msg
    }
    pub fn delete(&self, id: &str) -> Option<ws::Message> {
        let mut teams = self.teams.write().unwrap();
        teams.remove(id).map(
            |_| ws::Message::Text(format!("{{\"action\":\"delete\",\"id\":\"{}\"}}", id))
        )
    }
    pub fn load(&self) -> String {
        let teams = self.teams.read().unwrap();
        let front = "{{\"action\":\"load\",\"value\":[";
        let back = "]}";
        let team_length = teams.values().into_iter().map(|item| item.len() + 1).reduce(|x, y| x + y).unwrap_or(1) - 1;
        let length = front.len() + back.len() + team_length;
        let mut message = String::with_capacity(length);
        message.push_str(front);
        let mut iter = teams.values().into_iter();
        if let Some(first) = iter.next() {
            message.push_str(first);
            for team in iter {
                message.push(',');
                message.push_str(team);
            }
        }
        message.push_str(back);
        return message;
    }
}