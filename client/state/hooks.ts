import { TypedUseSelectorHook, useDispatch as innerUseDispatch, useSelector as innerUseSelector } from 'react-redux';
import { type Store } from './store';

export type RootState = ReturnType<Store['getState']>
export type Dispatch = Store['dispatch'];

export const useDispatch: () => Dispatch = innerUseDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = innerUseSelector;
