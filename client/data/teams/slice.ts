import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Team, type TeamAction } from './team';

const teamsSlice = createSlice({
  name: 'teams',
  initialState: [] as Array<Team>,
  reducers: {
    teamAction(state, action: PayloadAction<TeamAction>) {
      const teamAction = action.payload;
      switch (teamAction.action) {
        case 'Load':
          state.splice(0, state.length, ...teamAction.teams);
          break;
        case 'Update':
          let updatedTeam = teamAction.team;
          for (let i = 0; i < state.length; ++i) {
            if (updatedTeam.name == state[i].name) {
              state[i] = updatedTeam;
              return;
            } else if (updatedTeam.name < state[i].name) {
              state.splice(i, 0, updatedTeam);
              return;
            }
          }
          state.push(updatedTeam);
          break;
        case 'Delete':
          let deleteName = teamAction.name;
          let ix = state.findIndex(team => team.name == deleteName);
          if (ix >= 0) {
            state.splice(ix, 1);
          }
          break;
        default:
          console.warn(`Unrecognized event: ${JSON.stringify(teamAction)}`);
          break;
      }
    },
  },
});

export const { teamAction } = teamsSlice.actions;
export const teamsReducer = teamsSlice.reducer;
export const TeamsState = typeof teamsSlice

export const selectTeams = (state: { teams: Array<Team> }) => state.teams;
export const selectGetTeam = (state: { teams: Array<Team> }) => (id: string) => state.teams.find(team => team.id === id)