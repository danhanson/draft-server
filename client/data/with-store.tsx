"use client";
import { Provider } from 'react-redux';
import { store } from './store';

export function WithStore({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>{children}</Provider>
  );
}
