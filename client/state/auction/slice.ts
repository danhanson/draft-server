import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Auction {
    is_checked: Array<string>,
    name: string;
    position: string;
};

export const auctionSlice = createSlice({
    name: 'auction',
    initialState: null as Auction | null,
    reducers: {
        updateAuction(state, action: PayloadAction<Auction | null>) {
            return action.payload;
        },
    }
});

export const { updateAuction } = auctionSlice.actions;
export const selectAuction = (state: { auction: Auction | null }) => state.auction;
