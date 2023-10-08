use serde::Serialize;
use serde_json;
use crate::draft_data::Team;


#[derive(Debug, Serialize)]
#[serde(tag = "action")]
pub enum Action<'a> {
    Load { teams: Vec<&'a Team> },
    Update { team: &'a Team },
    Delete { name: String },
}

impl Action<'_> {
    pub fn to_json(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}
