import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { feedMiddleware } from './feed';
import { type Team, teamsMiddleware, teamsReducer, teamsApi } from './teams';

interface State {
  teams: Array<Team>;
  [teamsApi.reducerPath]: Parameters<typeof teamsApi.reducer>[0];
}

export const store = configureStore({
  reducer: combineReducers({
    [teamsApi.reducerPath]: teamsApi.reducer,
    teams: teamsReducer,
  }),
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(feedMiddleware, teamsMiddleware).concat(teamsApi.middleware);
  },
});

setupListeners(store.dispatch);

export type Store = typeof store
