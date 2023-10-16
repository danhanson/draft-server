import { createListenerMiddleware } from '@reduxjs/toolkit';
import { messageAction } from '@/data/feed';
import { updateTeams } from './slice';

const teamsActionsListener = createListenerMiddleware();

teamsActionsListener.startListening({
  actionCreator: messageAction,
  effect ({ 'payload': { team_data } }, { dispatch }) {
    dispatch(updateTeams(team_data));
  }
});

export const teamsMiddleware = teamsActionsListener.middleware;
