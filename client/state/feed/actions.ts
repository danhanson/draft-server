import { createAction } from '@reduxjs/toolkit';
import { type ServerUpdate } from './server-update';
import { type ClientUpdate } from './client-update';

export const subscribeAction = createAction("feed/subscribe");
export const unsubscribeAction = createAction("feed/unsubscribe");
export const messageAction = createAction<ServerUpdate>("feed/socket/message");
export const sendAction = createAction<ClientUpdate>("feed/send");
export const openAction = createAction("feed/socket/open");
export const closeAction = createAction("feed/socket/close");
export const errorAction = createAction("feed/socket/error");
