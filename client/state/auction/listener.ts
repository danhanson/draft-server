import { createListenerMiddleware } from "@reduxjs/toolkit";
import { updateAuction } from "./slice";
import { messageAction } from "@/state/feed";

const auctionListener = createListenerMiddleware();

auctionListener.startListening({
    actionCreator: messageAction,
    effect ({ payload }, { dispatch }) {
        dispatch(updateAuction(payload.current_auction ?? null));
    },
});

export const auctionMiddleware = auctionListener.middleware;
