import { CodeInput } from "@/components/sections/codes/CodeInput";
import { RecentCodesTable } from "@/components/sections/codes/RecentCodes";

import { MOCK_MATCHES } from "../../../../data/mock-matches";

export default function LivePage() {
  const match = MOCK_MATCHES[0];

  return (
    <div className="grid-column w-full">
      <h1 className="ml-12 mb-6 text-3xl font-bold">Live Mode</h1>
      <div className="ml-12 rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-xl font-semibold">Current Match</h2>
        <ul>
            <li key={match.id} className="flex justify-between border-b py-2">
              <span>{match.teams.home} vs {match.teams.away}</span>
            </li>
        </ul>
      </div>
      <CodeInput />
      <RecentCodesTable />
    </div>
  );
}