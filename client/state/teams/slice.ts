import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Team, type TeamAction } from './team';

export const teamsSlice = createSlice({
  name: 'teams',
  initialState: [] as Array<Team>,
  reducers: {
    updateTeams(state, action: PayloadAction<TeamAction>) {
      const teams = action.payload;
      state.splice(0, state.length, ...teams);
    }
  },
});

export const { updateTeams } = teamsSlice.actions;
export type TeamsState = typeof teamsSlice

export const selectTeams = (state: { teams: Array<Team> }) => state.teams;
export const selectGetTeam = (state: { teams: Array<Team> }) => (name: string) => state.teams.find(team => team.name === name)