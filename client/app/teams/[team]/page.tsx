import { useSelector } from "@/data";
import { type Team } from "@/data/teams";
import { selectGetTeam } from "@/data/teams";
import { useRouter } from 'next/router';

export default function Team() {
  const router = useRouter();
  const teamId = router.query.team as string;
  const getTeam = useSelector(selectGetTeam);
  let team = getTeam(teamId);
  if (!team) {
    return (
      <h1>MISSING TEAM</h1>
    );
  }
  return (
    <div>
      <h1>{team.name}</h1>
      <ul>
        {team.players.map(id =>
          <li key={id}>{id}</li>
        )}
      </ul>
    </div>
  )
}
