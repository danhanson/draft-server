import { createAction } from '@reduxjs/toolkit';

export const subscribeAction = createAction("feed/subscribe");
export const unsubscribeAction = createAction("feed/unsubscribe");
export const messageAction = createAction<unknown>("feed/socket/message");
export const sendAction = createAction<unknown>("feed/send");
export const openAction = createAction("feed/socket/open");
export const closeAction = createAction("feed/socket/close");
export const errorAction = createAction("feed/socket/error");
