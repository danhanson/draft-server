'use server';

import { open } from 'fs/promises';
import { type ProTeam } from './pro-team';
import { type Player } from './player';
import { type Game } from './game';
import { type ScoringPeriod } from './scoring-period';
import { STATS, type PlayerStats } from './player-stat';

const slotToPosition = [
  'PG',
  'SG',
  'SF',
  'PF',
  'C',
] as const;


interface DraftRankings<RankType extends string> {
  auctionValue: number;
  published: boolean;
  rank: number;
  rankSourceId: number;
  rankType: RankType;
  slotId: number;
}

interface PlayerStatsData {
  appliedAverage: number;
  appliedTotal: number;
  averageStats?: {
    [statId: number]: number | undefined;
  };
  externalId: string;
  id: string;
  proTeamId: number;
  scoringPeriodId: number;
  seasonId: number;
  statSourceId: number;
  statSplitTypeId: number;
  stats: {
    [statId: number]: number | undefined;
  };
}

interface PlayerData {
  draftAuctionValue: number;
  id: number;
  keeperValue: number;
  keeperValueFuture: number;
  lineupLocked: boolean;
  onTeamId: number;
  player: {
    active: boolean;
    defaultPositionId: number;
    draftRankingsByType: {
      STANDARD: DraftRankings<'STANDARD'>,
      ROTO: DraftRankings<'ROTO'>,
    };
    droppable: boolean;
    eligibleSlots: Array<number>;
    firstName: string;
    fullName: string;
    id: number;
    injured: boolean;
    injuryStatus: string;
    jersey: string;
    lastName: string;
    lastNewsDate: number;
    lastVideoDate: number;
    ownership: {
      activityLevel: null;
      auctionValueAverage: number;
      auctionValueAverageChange: number;
      averageDraftPosition: number;
      averageDraftPositionPercentChange: number;
      date: number;
      leageType: 0;
      percentChange: number;
      percentOwned: number;
      percentStarted: number;
    };
    proTeamId: number;
    seasonOutlook: string;
    stats: Array<PlayerStatsData>;
  };
  ratings: {
    [sourceId: number]: {
      positionalRanking: number;
      totalRanking: number;
      totalRating: number;
    } | undefined;
  };
  rosterLocked: boolean;
  status: string;
  tradeLocked: boolean;
  waiverProcessDate: number;
}

interface GameData {
  awayProTeamId: number;
  date: number;
  homeProTeamId: number;
  id: number;
  scoringPeriodId: number;
  startTimeTBD: boolean;
  statsOfficial: boolean;
  validForLocking: boolean;
}

interface ProTeamData {
  abbrev: string;
  byeWeek: number;
  id: number;
  location: string;
  name: string;
  proGamesByScoringPeriod: {
    [scoringPeriodId: string]: Array<GameData> | undefined;
  };
  universeId: number;
}

export interface LoadedData {
  players: Record<number, Player>;
  teams: Record<number, ProTeam>;
  scoringPeriods: Array<ScoringPeriod>;
}

export default async function LoadData(): Promise<LoadedData> {
  const teamsFile = await open('downloads/team.json');
  const teamsStr = await teamsFile.readFile('utf8');
  await teamsFile.close();
  const teamsData = JSON.parse(teamsStr) as Array<ProTeamData>;
  const teams: Record<number, ProTeam> = {};
  const games: Record<number, Game | undefined> = {};
  const scoringPeriods: Record<string, ScoringPeriod | undefined> = {};
  for (let { id, abbrev, location, name } of teamsData) {
    teams[id] = {
      id,
      abbrev,
      location,
      name,
      players: [],
      games: {},
    };
  }
  for (let { 'id': teamId, proGamesByScoringPeriod } of teamsData) {
    for (let scoringPeriodId in proGamesByScoringPeriod) {
      const scoringPeriodNum = parseInt(scoringPeriodId, 10);
      const gameDatas = proGamesByScoringPeriod[scoringPeriodId] ?? [];
      let scoringPeriod = scoringPeriods[scoringPeriodId];
      if (!scoringPeriod) {
        scoringPeriod = {
          id: scoringPeriodNum,
          games: [],
          playerStats: {},
        };
        scoringPeriods[scoringPeriodId] = scoringPeriod;
      }
      for (let { 'id': gameId, date, homeProTeamId, awayProTeamId } of gameDatas) {
        let game = games[gameId];
        if (!game) {
          game = {
            id: gameId,
            homeTeam: teams[homeProTeamId],
            awayTeam: teams[awayProTeamId],
            date: new Date(date),
            scoringPeriod
          }
          for (let teamId of [homeProTeamId, awayProTeamId]) {
            let teamGames = scoringPeriod.games[teamId];
            if (!teamGames) {
              teamGames = [];
              scoringPeriod.games[teamId] = teamGames;
            }
            teamGames.push(game);
          }
          games[gameId] = game;
        }
      }
      teams[teamId].games[scoringPeriodNum] = scoringPeriod.games[teamId] ?? [];
    }
  }
  const playersFile = await open('downloads/players.json');
  const playersStr = await playersFile.readFile('utf-8');
  const playersData = JSON.parse(playersStr) as Array<PlayerData>;
  const players: Record<number, Player> = {};
  for (let { 'player': { id, eligibleSlots, fullName, proTeamId, 'stats': statsData } } of playersData) {
    const team = teams[proTeamId];
    const positions = new Array<string>();
    let i = 0;
    do {
      positions.push(slotToPosition[i]);
    } while (eligibleSlots[++i] < positions.length);
    let statsPerPeriod: Record<number, PlayerStats> = {};
    for (let periodStr in statsData) {
      const periodStatsData = statsData[periodStr];
      if (periodStatsData.statSplitTypeId !== 0) {
        continue;
      }
      const periodId = parseInt(periodStr, 10);
      const periodStats = new Array<number|undefined>(STATS.length);
      for (let i = 0; i < STATS.length; ++i) {
        periodStats[i] = periodStatsData.stats[i]
      }
      statsPerPeriod[periodId] = periodStats;
      const periodPlayerStats = scoringPeriods[periodId]?.playerStats;
      if (periodPlayerStats) {
        periodPlayerStats[id] = periodStats;
      }
    }
    const player = {
      id,
      name: fullName,
      positions,
      team,
      stats: statsPerPeriod,
    };
    players[id] = player;
    team.players.push(player);
  }
  const scoringPeriodArray = Object.keys(scoringPeriods).map((key) => scoringPeriods[key] ?? { id: -1, games: {}, playerStats: {} }
  ).sort((p1, p2) => p1.id - p2.id);
  return {
    teams,
    players,
    scoringPeriods: scoringPeriodArray,
  };
}