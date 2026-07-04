import { GroupTable } from "@/components/GroupTable";
import { AutoRefresh } from "@/components/AutoRefresh";
import { getAllMatches, getGroupsWithTeams } from "@/lib/data";
import { computeGroupStandings } from "@/lib/standings";

export const revalidate = 0;

export default async function GroupsPage() {
  const [groups, matches] = await Promise.all([getGroupsWithTeams(), getAllMatches()]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-2">
        Group Stage
      </h1>
      <p className="text-muted-foreground mb-8">
        Top 2 from each group, plus the 8 best third-placed teams, advance to the Round of 32.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(({ group, teams }) => (
          <GroupTable
            key={group.id}
            groupName={group.name}
            standings={computeGroupStandings(teams, matches)}
          />
        ))}
      </div>
      <AutoRefresh />
    </div>
  );
}
