import { createListenerMiddleware } from "@reduxjs/toolkit";
import { updateAuctionSettings } from "./slice";
import { messageAction } from "@/data/feed";

const auctionSettingsListener = createListenerMiddleware();

auctionSettingsListener.startListening({
    actionCreator: messageAction,
    effect ({ 'payload': { roster_size, total_budget} }, { dispatch }) {
        dispatch(updateAuctionSettings({
            roster_size,
            total_budget,
        }));
    },
});

export const auctionSettingsMiddleware = auctionSettingsListener.middleware;
