import { ProTeam } from './pro-team';
import { ScoringPeriod } from './scoring-period';

export interface Game {
  id: number;
  homeTeam: ProTeam;
  awayTeam: ProTeam;
  date: Date;
  scoringPeriod: ScoringPeriod;
}
