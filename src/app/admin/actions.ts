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

  const update = {
    home_score: homeScoreRaw ? Number(homeScoreRaw) : null,
    away_score: awayScoreRaw ? Number(awayScoreRaw) : null,
    home_pen: homePenRaw ? Number(homePenRaw) : null,
    away_pen: awayPenRaw ? Number(awayPenRaw) : null,
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
