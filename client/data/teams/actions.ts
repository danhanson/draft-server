import { sendAction } from '@/data/feed';
import { type Team } from './team';

export interface AddTeam {
  function: 'add_team';
  team_name: string;
}

export interface RemoveTeam {
  function: 'remove_team';
}

export interface RenameTeam {
  function: 'rename';
  team_name: string;
  new_name: string;
}

export interface SetTeamBackground {
  function: 'set_bg';
  team_name: string;
  bg_url: string | null;
}

export type TeamAction = AddTeam | RemoveTeam | RenameTeam | SetTeamBackground;

export const addTeamAction = (name: string) => sendAction({ function: "add_team", team_name: name });

export const deleteTeamAction = (team: Team) => sendAction({ function: "remove_team", team_name: team.name });

export const renameTeamAction = (team: Team, name: string) => sendAction({
  function: 'rename_team',
  team_name: team.name,
  new_name: name,
});

export const setTeamBackgroundAction = (team: Team, url: string | null) => sendAction({
  team_name: team.name,
  bg_url: url,
});
