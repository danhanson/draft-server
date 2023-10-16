import { type Player } from '@/data/players';

export interface AuctionUpdate {
    is_checked: Array<string>;
    name: string;
    position: string;
}
export interface AuctionResultUpdate {
    dollar_amount: number;
    name: string;
    position: string;
}
export interface TeamUpdate {
  name: string;
  bg_url?: string;
  budget: number;
  players: Array<AuctionResultUpdate>;
}

export interface ServerUpdate {
    total_budget: number;
    roster_size: number;
    team_data: Array<TeamUpdate>;
    remaining_players: Array<Player>;
    current_auction?: AuctionUpdate;
}
