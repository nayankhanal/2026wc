import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { syncFromFootballData } from "@/lib/sync";

export const dynamic = "force-dynamic";

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
  if (request.nextUrl.searchParams.get("secret") === secret) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const report = await syncFromFootballData();

  if (report.updated > 0) {
    revalidatePath("/");
    revalidatePath("/groups");
    revalidatePath("/bracket");
  }

  return NextResponse.json(report, { status: report.ok ? 200 : 502 });
}
