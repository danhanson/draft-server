import { type TeamAction } from '@/data/teams';
import { type AuctionSettingsAction } from '@/data/auction-settings';
import { type AuctionAction } from '@/data/auction';

export type ClientAction = TeamAction | AuctionSettingsAction | AuctionAction;
