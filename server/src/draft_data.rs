use std::collections::{
    BTreeMap,
    HashMap,
    btree_map,
    hash_map,
};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

/// Team resource used by API and stored in DraftData.
/// If team.id is present, it must match the id specified in the request.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Team {
    pub id: Option<Uuid>,
    pub name: String,
    pub image: Option<String>,
    pub owners: Vec<String>,
    pub players: Vec<u16>,
}

/// data structure which is the single source of truth and holds the draft data served by the API.
/// Each team is identified by a unique, immutable id, and each team must have a unique name. Teams
/// are ordered by name.
#[derive(Debug)]
pub struct DraftData {
    id_to_name: HashMap<Uuid, String>,
    name_to_team: BTreeMap<String, Team>,
}

impl DraftData {
    pub fn new() -> Self {
        DraftData {
            id_to_name: HashMap::new(),
            name_to_team: BTreeMap::new(),
        }
    }
    /// ensure that team has id field set to specified id, returns whether id is consistent
    fn enforce_id_consistency(id: &Uuid, team: &mut Team) -> bool {
        if let Some(ref team_id) = team.id {
            *team_id == *id
        } else {
            team.id = Some(*id);
            true
        }
    }
    /// get the team with the specified id
    pub fn get<'a>(&'a self, id: &Uuid) -> Option<&'a Team> {
        self.id_to_name.get(id).map(
            |name| self.name_to_team.get(name).unwrap_or_else(
                || panic!("Inconsistent state! Missing entry for name {}", name)
            )
        )
    }
    /// upserts the team with the specified id, returns Some with upserted value when successful
    /// and returns None if upsert fails due to inconsistency
    pub fn upsert<'a>(&'a mut self, id: Uuid, mut team: Team) -> Option<&'a Team> {
        if !Self::enforce_id_consistency(&id, &mut team) {
            return None;
        }
        match self.id_to_name.entry(id) {
            hash_map::Entry::Occupied(mut old_name_entry) => {
                if team.name == *old_name_entry.get() {
                    if let Some(old_team) = self.name_to_team.get_mut(&team.name) {
                        *old_team = team;
                        Some(old_team)
                    } else {
                        panic!("Inconsistent state! Missing entry for name {}", &team.name);
                    }
                } else {
                    // old id updated name 
                    if let btree_map::Entry::Vacant(new_team_entry) = self.name_to_team.entry(team.name.clone()) {
                        old_name_entry.insert(team.name.clone());
                        let new_team = new_team_entry.insert(team);
                        Some(new_team)  // new name for old id is claimed
                    } else {
                        None  // new name for old id already used
                    }
                }
            },
            hash_map::Entry::Vacant(new_name_entry) => {
                match self.name_to_team.entry(team.name.clone()) {
                    // new id existing name
                    btree_map::Entry::Occupied(_) => None, // conflict, name already used by other team
                    // new id new name
                    btree_map::Entry::Vacant(new_team_entry) => {
                        new_name_entry.insert(team.name.clone());
                        Some(new_team_entry.insert(team))
                    },
                }
            },
        }
    }
    /// inserts the team with the specified id, returns Some with inserted value when successful
    /// and returns None if insert fails due to inconsistency or id already in use
    pub fn insert<'a>(&'a mut self, id: Uuid, mut team: Team) -> Option<&'a Team> {
        if !Self::enforce_id_consistency(&id, &mut team) {
            return None;
        }
        if let hash_map::Entry::Vacant(new_name_entry) = self.id_to_name.entry(id) {
            if let btree_map::Entry::Vacant(new_team_entry) = self.name_to_team.entry(team.name.clone()) {
                new_name_entry.insert(team.name.clone());
                Some(new_team_entry.insert(team))
            } else {
                None  // name already used
            }
        } else {
            None  // id already used
        }
    }
    /// deletes the team with the specified id, returns true when the team with the id is removed, false if the team was not found
    pub fn delete(&mut self, id: &Uuid) -> bool {
        if let Some(name) = self.id_to_name.remove(id) {
            self.name_to_team.remove(&name).expect(
                &format!("DraftData in inconsistent state! Team named {:?} missing", &name)
            );
            true
        } else {
            false
        }
    }
    /// load all the teams ordered by name
    pub fn load<'a>(&'a self) -> Vec<&'a Team> {
        self.name_to_team.values().collect()
    }
}
