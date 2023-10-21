import { sendAction } from '@/state/feed';
import { Team } from '@/state/teams';

export interface StartAuction {
  function: 'start_auction';
  player_name: string;
  player_position: string;
}

export interface SetPass {
  function: 'is_checked';
  is_checked: true;
  team_name: string;
}

export interface UnsetPass {
  function: 'is_checked';
  is_checked: false;
  team_name: string;
}

export interface CancelAuction {
  function: 'cancel_auction';
}

export interface FinishAuction {
  function: 'finish_auction';
  team_name: string;
  price: number;
}

export type AuctionAction = StartAuction | SetPass | UnsetPass | CancelAuction | FinishAuction;

export const startAuctionAction = (player: { name: string, position: string}) => sendAction({
  function: 'start_auction',
  player_name: player.name,
  player_position: player.position,
});

export const setPassAction = (team: Team) => sendAction({
  function: 'is_checked',
  is_checked: true,
  team_name: team.name,
});

export const unsetPassAction = (team: Team) => sendAction({
  function: 'is_checked',
  is_checked: false,
  team_name: team.name,
});

export const cancelAuctionAction = () => sendAction({
  function: 'cancel_auction',
});

export const finishAuctionAction = (team: Team, price: number) => sendAction({
  function: 'finish_auction',
  team_name: team.name,
  price,
});
