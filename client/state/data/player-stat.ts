type Scope = 'Total' | 'Per Game';

export interface PlayerStat {
  scope: Scope;
  abbrev: string;
  name: string;
}

function stat<S extends Scope, A extends string, N extends string>(scope: S, abbrev: A, name: N) {
  return {
    scope,
    abbrev,
    name,
  } as const;
}

export const STATS = [
  stat('Total', 'PTS', 'Points Total'),
  stat('Total', 'BLK', 'Blocks Total'),
  stat('Total', 'STL', 'Steals Total'),
  stat('Total', 'AST', 'Assists Total'),
  stat('Total', 'OR', 'Offensive Rebounds Total'),
  stat('Total', 'DR', 'Defensive Rebounts Total'),
  stat('Total', 'REB', 'Rebounds Total'),
  stat('Total', 'DQ or EJECT', ''),
  stat('Total', 'FLAG', 'Flagrant Fowls Total'),
  stat('Total', 'PF', 'Fouls Total'),
  stat('Total', 'TECH', 'Technical Fouls Total'),
  stat('Total', 'TO', 'Turnovers Total'),
  stat('Total', 'DQ or EJECT', ''),
  stat('Total', 'FGM', 'Field Goals Made Total'),
  stat('Total', 'FGA', 'Field Goals Attempted Total'),
  stat('Total', 'FTM', 'Free Throws Made Total'),
  stat('Total', 'FTA', 'Free Throws Attempted Total'),
  stat('Total', '3PTM', '3-Point Field Goals Made Total'),
  stat('Total', '3PTA', '3-Point Field Goals Attempted Total'),
  stat('Total', 'FG%', 'Field Goal Percentage Total'),
  stat('Total', 'FT%', 'Free Throw Percentage Total'),
  stat('Total', '3PT%', '3-Point Field Goal Percentage Total'),
  stat('Total', 'SH-EFF', 'Shooting Efficiency Total'),
  stat('Total', 'FGF', 'Field Goal Attempts Failed Total'),
  stat('Total', 'FTF', 'Free Throw Attempts Failed Total'),
  stat('Total', '3PTF', '3-Point Field Goal Attempts Failed Total'),
  stat('Per Game', 'AST', 'Assists Per Game'),
  stat('Per Game', 'BLK', 'Blocks Per Game'),
  stat('Per Game', 'MIN', 'Minutes Per Game'),
  stat('Per Game', 'PTS', 'Points Per Game'),
  stat('Per Game', 'REB', 'Rebounds Per Game'),
  stat('Per Game', 'STL', 'Steals Per Game'),
  stat('Per Game', 'TO', 'Turnovers Per Game'),
  stat('Per Game', '3PTM', '3-Point Field Goals Made'),
  stat('Total', 'PTS/MIN', 'Points Per Minute'),
  stat('Total', 'AST/TO', 'Assists Per Turnover'),
  stat('Total', 'STL/TO', 'Steals Per Turnover'),
  stat('Total', 'DD2', 'Double Double'),
  stat('Total', 'TD3', 'Triple Double'),
  stat('Total', 'RAT', 'Rating'),
  stat('Total', 'MIN', 'Minutes Total'),
  stat('Total', 'GS', 'Games Started'),
  stat('Total', 'GP', 'Games Played'),
  stat('Total', 'Games?', '???'),
  stat('Total', 'Percentage?', '???'),
] as const;

export type PlayerStats = Record<number, number | undefined>;
