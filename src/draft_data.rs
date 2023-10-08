use std::collections::HashMap;
use axum::extract::ws;

#[derive(Debug)]
pub struct DraftData {
    teams: HashMap<String, String>,
}

impl DraftData {
    pub fn new() -> Self {
        DraftData {
            teams: HashMap::new(),
        }
    }
    pub fn update(&mut self, id: String, team: String) -> ws::Message {
        let msg = ws::Message::Text(format!("{{\"action\":\"update\",\"id\":\"{}\",\"value\":{}}}", id, team));
        self.teams.insert(id, team);
        msg
    }
    pub fn delete(&mut self, id: &str) -> Option<ws::Message> {
        self.teams.remove(id).map(
            |_| ws::Message::Text(format!("{{\"action\":\"delete\",\"id\":\"{}\"}}", id))
        )
    }
    pub fn load(&self) -> String {
        let front = "{{\"action\":\"load\",\"value\":[";
        let back = "]}";
        let team_length = self.teams.values().into_iter().map(|item| item.len() + 1).reduce(|x, y| x + y).unwrap_or(1) - 1;
        let length = front.len() + back.len() + team_length;
        let mut message = String::with_capacity(length);
        message.push_str(front);
        let mut iter = self.teams.values().into_iter();
        if let Some(first) = iter.next() {
            message.push_str(first);
            for team in iter {
                message.push(',');
                message.push_str(team);
            }
        }
        message.push_str(back);
        message
    }
}