import { createListenerMiddleware } from '@reduxjs/toolkit';
import { messageAction } from '@/data/feed';
import { teamAction } from './slice';
import { type TeamAction } from './team';

const teamsActionsListener = createListenerMiddleware();

teamsActionsListener.startListening({
  actionCreator: messageAction,
  effect (action, listenerApi) {
    // no need to validate the message, server sends the correct data
    // will have to add a filter if we send multiple types of updates
    let message: TeamAction = action.payload as TeamAction;
    listenerApi.dispatch(teamAction(message));
  }
});

export const teamsMiddleware = teamsActionsListener.middleware;
