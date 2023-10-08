use std::collections::BTreeMap;
use std::collections::btree_map::Entry;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Team {
    name: String,
    owners: Vec<String>,
    image: String,
    players: Vec<u16>,
}

#[derive(Debug)]
pub struct DraftData {
    teams: BTreeMap<String, Team>,
}

impl DraftData {
    pub fn new() -> Self {
        DraftData {
            teams: BTreeMap::new(),
        }
    }
    pub fn update<'a>(&'a mut self, team: Team) -> &'a Team {
        match self.teams.entry(team.name.clone()) {
            Entry::Vacant(entry) => {
                entry.insert(team)
            },
            Entry::Occupied(entry) => {
                let value = entry.into_mut();
                *value = team;
                value
            }
        }
    }
    pub fn delete(&mut self, name: &str) -> bool {
        self.teams.remove(name).is_some()
    }
    pub fn load<'a>(&'a self) -> Vec<&'a Team> {
        self.teams.values().collect()
    }
}
