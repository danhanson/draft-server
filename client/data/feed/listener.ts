import { createListenerMiddleware, isAnyOf, type Action } from '@reduxjs/toolkit';
import { subscribeAction, unsubscribeAction, openAction, messageAction, errorAction, closeAction } from './actions';
import { API_SERVER } from '@/constants';

const WS_URL = `ws://${API_SERVER}/feed.ws`;

class Feed {
  socket: WebSocket | null = null;
  subscribers: number = 0;
  subscribe(dispatch: (action: Action) => void) {
    this.subscribers += 1;
    if (!this.socket) {
      this.socket = new WebSocket(WS_URL);
      this.socket.addEventListener("open", () => dispatch(openAction()))
      this.socket.addEventListener("message", event => dispatch(messageAction(JSON.parse(event.data))));
      this.socket.addEventListener("error", () => dispatch(errorAction()));
      this.socket.addEventListener("close", () => dispatch(closeAction()));
    }
  }
  unsubscribe() {
    this.subscribers = Math.max(0, this.subscribers - 1);
    if (this.subscribers === 0 && this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const feedListener = createListenerMiddleware({ extra: new Feed() });

feedListener.startListening({
  matcher: isAnyOf(subscribeAction, unsubscribeAction),
  effect (action, { 'extra': feed, dispatch }) {
    switch (action.type) {
      case "feed/subscribe":
        feed.subscribe(dispatch);
        break;
      case "feed/unsubscribe":
        feed.unsubscribe();
        break;
      default:
        throw Error(`unexpected action: ${action}`);
    }
  }
});

export const feedMiddleware = feedListener.middleware;
