import { type TeamAction } from '@/state/teams';
import { type AuctionSettingsAction } from '@/state/auction-settings';
import { type AuctionAction } from '@/state/auction';

export type ClientAction = TeamAction | AuctionSettingsAction | AuctionAction;
