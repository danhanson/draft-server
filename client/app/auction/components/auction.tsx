import styles from './auction.module.css';
import { useDispatch, useSelector } from '@/data';
import { selectAuction, startAuctionAction, cancelAuctionAction } from '@/data/auction';
import { selectTeams } from '@/data/teams';

export default function Auction() {
  const dispatch = useDispatch();
  const auction = useSelector(selectAuction);
  const teams = useSelector(selectTeams);
  function cancelAuction() {
    dispatch(cancelAuctionAction());
  }
  function startAuction() {
    const name = prompt("Player");
    if (!name) {
      alert("Invalid player name!");
      return;
    }
    const position = prompt("Position");
    if (!position) {
      alert("Invalid position!");
      return;
    }
    dispatch(startAuctionAction({
      name,
      position,
    }));
  }
  if (auction) {
    return (
      <section className={styles.auction}>
        <div className={styles['auction-player']}>
          <span>Now Auctioning</span>
          <h2 className={styles['auction-name']}>{auction.name}</h2>
          <span>{auction.position}</span>
        </div>
        <button className={styles.cancel} onClick={cancelAuction}>
          Cancel Auction
        </button>
      </section>
    );
  } else {
    return (
      <section className={styles.auction}>
        <button className={styles.start} onClick={startAuction}>Start Auction</button>
      </section>
    );
  }
}