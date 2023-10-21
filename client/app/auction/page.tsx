'use client';
import styles from './page.module.css';
import { selectTeams } from '@/state/teams';
import { useSelector } from '@/state/hooks';
import { useFeed } from '@/state/feed';
import AuctionSettings from './components/auction-settings';
import Auction from './components/auction';
import Passes from './components/passes';
import Team from './components/team';

export default function Teams({ children }: React.PropsWithChildren) {
  useFeed();
  const teams = useSelector(selectTeams);
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Division III Men&apos;s Collegiate Lacrosse 2023 Draft Auction
      </h1>
      <div className={styles['auction-control']}>
        <AuctionSettings/>
        <Auction/>
        <Passes/>
      </div>
      <div className={styles.teams}>
        {teams.map((team, id) =>
          <Team key={id} team={team}/>
        )}
      </div>
      {children}
    </main>
  );
}
