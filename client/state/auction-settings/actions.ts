import { sendAction } from '@/state/feed';

export interface SetRosterSize {
    function: 'set_roster_size';
    roster_size: number;
}

export interface SetBudget {
    function: 'set_budget';
    budget: number;
}

export type AuctionSettingsAction = SetRosterSize | SetBudget;

export const setRosterSizeAction = (rosterSize: number) => sendAction({
    function: 'set_roster_size',
    roster_size: rosterSize,
});

export const setBudgetAction = (budget: number) => sendAction({
    function: 'set_budget',
    budget,
});
