"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Soft-refreshes the current route's server data on an interval so viewers see
 * live score updates without a manual reload. Skips refreshing while the tab is
 * hidden to avoid needless work, and refreshes once on becoming visible again.
 */
export function AutoRefresh({ intervalMs = 60000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      if (!document.hidden) router.refresh();
    };

    const id = setInterval(tick, intervalMs);
    const onVisible = () => {
      if (!document.hidden) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs]);

  return null;
}
