import { useDispatch, useSelector } from '@/data';
import styles from './team.module.css';
import { deleteTeamAction, type Team, type AuctionResult, setTeamBackgroundAction, renameTeamAction } from '@/data/teams';
import { selectAuctionSettings } from '@/data/auction-settings';
import { selectAuction } from '@/data/auction';
import { finishAuctionAction } from '@/data/auction/actions';

export default function Team({ team }: { team: Team }) {
  const dispatch = useDispatch();
  const settings = useSelector(selectAuctionSettings);
  const auction = useSelector(selectAuction);
  const maxBid = team.budget - settings.roster_size + team.players.length;
  function removeTeam() {
    if (confirm(`Are you sure you want to remove team ${team.name}?`)) {
      dispatch(deleteTeamAction(team));
    }
  }
  function changeName() {
    const newName = prompt('What is the new name?');
    if (!newName) {
      alert('Not a valid name!');
      return;
    }
    dispatch(renameTeamAction(team, newName));
  }
  function removePlayer(player: AuctionResult) {

  }
  function winAuction() {
    const price = parseInt(prompt('What is the price?') ?? '', 10);
    if (isNaN(price)) {
      alert('Not a valid number!');
      return;
    }
    dispatch(finishAuctionAction(team, price));
  }
  function changeBackground() {
    const url = prompt('Enter a url (or none for no image');
    dispatch(setTeamBackgroundAction(team, url));
  }
  return (
    <section key={team.name} className={styles.team}>
      {team.bg_url ? (
        <img alt='' src={team.bg_url}/>
      ) : <></>}
      <h2>{team.name}</h2>
      <table className={styles['team-status']}>
        <tr>
          <th>Budget</th><td>{team.budget}</td>
        </tr>
        <tr>
          <th>Max Bid</th><td>{maxBid}</td>
        </tr>
      </table>
      <section className={styles['team-buttons']}>
        <button onClick={changeName}>Edit Name</button>
        <button onClick={changeBackground}>Edit Background</button>
        <button onClick={removeTeam}>Remove Team</button>
      </section>
      <table className={styles.players}>
        <thead>
          <tr><th>#</th><th>Player</th><th>Pos</th><th>$</th><th></th></tr>
        </thead>
        <tbody>
          {team.players.map((player, index) =>
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.position}</td>
              <td>{player.dollar_amount}</td>
              <td><button className={styles.remove} onClick={() => removePlayer(player)}>&times;</button></td>
            </tr>
          )}
        </tbody>
      </table>
        {(auction) ? (
          <section className={styles['team-bottom']}>
            <button onClick={winAuction}>Win Auction</button>
          </section>
        ) : null}
    </section>
  )
}