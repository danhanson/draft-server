import { type Game } from './game';
import { type PlayerStats } from './player-stat';

export interface ScoringPeriod {
  id: number;
  games: {
    [proTeamId: number]: Array<Game> | undefined;
  };
  playerStats: {
    [playerId: number]: PlayerStats | undefined;
  };
}
