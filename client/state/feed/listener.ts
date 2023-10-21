import { createListenerMiddleware, isAnyOf, type Action } from '@reduxjs/toolkit';
import { subscribeAction, unsubscribeAction, openAction, messageAction, errorAction, closeAction, sendAction } from './actions';
import { type ClientUpdate } from './client-update';

const WS_URL = 'wss://ajmichael.net/draft_ws';

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
  send(update: ClientUpdate) {
    if (this.socket) {
      this.socket.send(JSON.stringify(update));
    } else {
      console.warn("Unable to send message, not subscribed to feed");
    }
  }
}

const feedListener = createListenerMiddleware({ extra: new Feed() });

feedListener.startListening({
  matcher: isAnyOf(subscribeAction, unsubscribeAction, sendAction),
  effect (action, { 'extra': feed, dispatch }) {
    switch (action.type) {
      case "feed/subscribe":
        feed.subscribe(dispatch);
        break;
      case "feed/unsubscribe":
        feed.unsubscribe();
        break;
      case "feed/send":
        feed.send(action.payload);
        break;
      default:
        throw Error(`unexpected action: ${action}`);
    }
  }
});

export const feedMiddleware = feedListener.middleware;
