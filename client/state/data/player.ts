import { PlayerStats } from './player-stat';
import { ProTeam } from './pro-team';

export interface Player {
  id: number;
  name: string;
  positions: Array<string>;
  team: ProTeam;
  stats: {
    [scoringPeriodId: number]: PlayerStats;
  };
}
