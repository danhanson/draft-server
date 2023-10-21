import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuctionSettings {
    roster_size: number;
    total_budget: number;
}

export const auctionSettingsSlice = createSlice({
    name: 'auctionSettings',
    initialState: {
        roster_size: 0,
        total_budget: 0
    },
    reducers: {
        updateAuctionSettings(state, action: PayloadAction<AuctionSettings>) {
            return action.payload;
        }
    }
});

export const { updateAuctionSettings } = auctionSettingsSlice.actions;
export const selectAuctionSettings = (state: { auctionSettings: AuctionSettings }) => state.auctionSettings;