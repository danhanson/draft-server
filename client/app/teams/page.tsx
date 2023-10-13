'use client';
import styles from './page.module.css';
import { teamsApi, selectTeams } from '@/data/teams';
import { useMemo } from 'react';
import { useSelector } from '@/data/hooks';
import { useFeed } from '@/data/feed';
import Link from 'next/link';

export default function Teams({ children }: React.PropsWithChildren) {
  const [postTeam, postTeamResult] = teamsApi.usePostTeamMutation();
  useFeed();
  const teams = useSelector(selectTeams);
  const statusDiv = useMemo(
    () => {
      if (postTeamResult.isLoading) {
        return (
          <div>LOADING TEAM</div>
        );
      } else if (postTeamResult.isError) {
        return (
          <div>POST ERROR</div>
        );
      } else if (postTeamResult.isSuccess) {
        if (!postTeamResult.data) {
          return (
            <div>NAME ALREADY TAKEN</div>
          );
        } else {
          return null
        };
      }
    },
    [postTeamResult]
  )
  const teamsSections = useMemo(() => teams.map(team =>
    <section key={team.name} style={{ backgroundImage: team.image }} className={styles.team}>
      <h2><Link href={`/teams/${team.id}`}>{team.name}</Link></h2>
      <ul className={styles.owners}>
        {team.owners.map(owner =>
          <li key={owner}>{owner}</li>
        )}
      </ul>
    </section>
  ), [teams]);
  async function addTeam() {
    await postTeam({
      name: prompt("enter a team name") || "",
      owners: ["Steve", prompt("enter an owner") || ""],
      players: [],
    }).unwrap();
  }
  return (
    <main className={styles.main}>
      <h1>Teams</h1>
      <div className={styles.teams}>
        {teamsSections}
        <div>
          {statusDiv}
          <button disabled={postTeamResult.isLoading} onClick={addTeam}>+</button>
        </div>
      </div>
      {children}
    </main>
  );
}
