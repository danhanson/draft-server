import styles from './passes.module.css';
import { useSelector, useDispatch } from '@/data';
import { Team, selectTeams } from '@/data/teams';
import { selectAuction, setPassAction, unsetPassAction } from '@/data/auction';

export default function Passes() {
  const teams = useSelector(selectTeams);
  const auction = useSelector(selectAuction);
  const dispatch = useDispatch();
  function updatePass(team: Team, passed: boolean) {
    if (passed) {
      dispatch(setPassAction(team));
    } else {
      dispatch(unsetPassAction(team));
    }
  }
  if (auction) {
    return (
      <section className={styles.passes}>
        <h2 className={styles.header}>Passes</h2>
        <ul>
          {teams.map((team, i) =>
            <li key={i}>
              <label>
                <input
                  type="checkbox"
                  checked={auction.is_checked.indexOf(team.name) >= 0}
                  onChange={e => updatePass(team, e.currentTarget.checked)}
                /> {team.name}
              </label>
            </li>
          )}
        </ul>
      </section>
    )
  } else {
    <section className={styles.passes}/>
  }
}