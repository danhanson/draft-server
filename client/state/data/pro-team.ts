import { type Player } from './player';
import { type Game } from './game';

export interface ProTeam {
  id: number;
  abbrev: string;
  location: string;
  name: string;
  players: Array<Player>;
  games: {
    [scoringPeriodId: number]: Array<Game>;
  };
}
