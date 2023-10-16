import { useDispatch, useSelector } from '@/data';
import styles from './auction-settings.module.css';
import { selectAuctionSettings, setRosterSizeAction, setBudgetAction } from '@/data/auction-settings';
import { addTeamAction } from '@/data/teams';

export default function AuctionSettings() {
  const dispatch = useDispatch();
  function addTeam() {
    const name = prompt('Enter a new team name!');
    if (!name) {
      alert('No name entered!')
      return;
    }
    dispatch(addTeamAction(name));
  }
  function setRosterSize() {
    const roster = parseInt(prompt('Enter a new roster size!') ?? '', 10);
    if (isNaN(roster)) {
      alert('Invalid roster size!');
      return;
    }
    dispatch(setRosterSizeAction(roster));
  }
  function setBudget() {
    const salary = parseInt(prompt('Enter a new salary!') ?? '', 10);
    if (isNaN(salary)) {
      alert('Invalid salary!');
      return;
    }
    dispatch(setBudgetAction(salary));
  }
  const settings = useSelector(selectAuctionSettings);
  return (
    <div className={styles.settings}>
      <div>
        <p>Salary Cap {settings.total_budget}</p>
        <button className={styles.edit} onClick={setBudget}>Edit</button>
      </div>
      <div>
        <p>Roster Size {settings.roster_size}</p>
        <button className={styles.edit} onClick={setRosterSize}>Edit</button>
      </div>
      <button onClick={addTeam}>Add Team</button>
    </div>
  );
}
