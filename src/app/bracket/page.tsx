import { BracketView } from "@/components/BracketView";
import { AutoRefresh } from "@/components/AutoRefresh";
import { getAllMatches } from "@/lib/data";

export const revalidate = 0;

export default async function BracketPage() {
  const matches = await getAllMatches();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-2">
        Knockout Wallchart
      </h1>
      <p className="text-muted-foreground mb-8">
        Auto-advances as results come in — scroll to see the full bracket through the final.
      </p>
      <BracketView matches={matches} />
      <AutoRefresh />
    </div>
  );
}
