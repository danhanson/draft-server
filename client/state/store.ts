import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { feedMiddleware } from './feed';
import { auctionSettingsSlice, auctionSettingsMiddleware } from './auction-settings';
import { teamsMiddleware, teamsSlice } from './teams';
import { auctionMiddleware, auctionSlice } from './auction';

export const store = configureStore({
  reducer: combineReducers({
    [teamsSlice.name]: teamsSlice.reducer,
    [auctionSettingsSlice.name]: auctionSettingsSlice.reducer,
    [auctionSlice.name]: auctionSlice.reducer,
  }),
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().prepend(
      feedMiddleware,
      auctionSettingsMiddleware,
      teamsMiddleware,
      auctionMiddleware,
    );
  },
});

setupListeners(store.dispatch);

export type Store = typeof store
