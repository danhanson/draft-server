import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { feedMiddleware } from './feed';
import { teamsMiddleware, teamsReducer, teamsApi } from './teams';

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
