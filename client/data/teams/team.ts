export interface Team {
  id: string;
  name: string;
  image?: string;
  owners: Array<string>;
  players: Array<number>;
}

export type TeamWithoutId = Omit<Team, 'id'>;

export interface LoadAction {
  action: 'Load',
  teams: Array<Team>,
}

export interface UpdateAction {
  action: 'Update',
  team: Team,
}

export interface DeleteAction {
  action: 'Delete',
  name: string,
}

export type TeamAction = LoadAction | UpdateAction | DeleteAction;
