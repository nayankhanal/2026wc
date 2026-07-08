"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { propagateWinner } from "@/lib/bracket";
import { syncFromFootballData } from "@/lib/sync";
import type { Match, MatchStatus } from "@/types/db";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = formData.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export async function updateMatchResult(formData: FormData) {
  const id = Number(formData.get("id"));
  const homeScoreRaw = formData.get("home_score");
  const awayScoreRaw = formData.get("away_score");
  const homePenRaw = formData.get("home_pen");
  const awayPenRaw = formData.get("away_pen");
  const status = formData.get("status") as MatchStatus;

  const homeScore = homeScoreRaw !== null && homeScoreRaw !== "" ? Number(homeScoreRaw) : null;
  const awayScore = awayScoreRaw !== null && awayScoreRaw !== "" ? Number(awayScoreRaw) : null;
  // Penalties only matter on a level score; drop them otherwise so a decisive
  // result never shows a stale shootout score on the bracket.
  const isDraw = homeScore != null && awayScore != null && homeScore === awayScore;
  const homePen = isDraw && homePenRaw !== null && homePenRaw !== "" ? Number(homePenRaw) : null;
  const awayPen = isDraw && awayPenRaw !== null && awayPenRaw !== "" ? Number(awayPenRaw) : null;

  const update = {
    home_score: homeScore,
    away_score: awayScore,
    home_pen: homePen,
    away_pen: awayPen,
    status,
  };

  const { data: match, error } = await supabaseAdmin
    .from("matches")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await propagateWinner(match as Match);

  revalidatePath("/groups");
  revalidatePath("/bracket");
  revalidatePath("/admin");
}

export async function syncNow() {
  const report = await syncFromFootballData();
  if (report.updated > 0) {
    revalidatePath("/");
    revalidatePath("/groups");
    revalidatePath("/bracket");
  }
  revalidatePath("/admin");
}
