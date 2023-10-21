export interface AuctionResult {
  dollar_amount: number;
  name: string;
  position: string;
}

export interface Team {
  name: string;
  bg_url?: string;
  budget: number;
  players: Array<AuctionResult>;
}
