"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import type { MatchWithTeams } from "@/types/db";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function BracketConnectors({
  matches,
  containerRef,
  layout,
}: {
  matches: MatchWithTeams[];
  containerRef: RefObject<HTMLDivElement | null>;
  layout: string;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function compute() {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const newLines: Line[] = [];

      for (const m of matches) {
        if (!m.next_match_id) continue;
        const source = container.querySelector<HTMLElement>(`[data-match="${m.id}"]`);
        const target = container.querySelector<HTMLElement>(`[data-match="${m.next_match_id}"]`);
        if (!source || !target) continue;

        const s = source.getBoundingClientRect();
        const t = target.getBoundingClientRect();
        const goingRight = t.left >= s.left;

        newLines.push({
          x1: (goingRight ? s.right : s.left) - containerRect.left + container.scrollLeft,
          y1: s.top + s.height / 2 - containerRect.top + container.scrollTop,
          x2: (goingRight ? t.left : t.right) - containerRect.left + container.scrollLeft,
          y2: t.top + t.height / 2 - containerRect.top + container.scrollTop,
        });
      }

      setLines(newLines);
      setSize({ width: container.scrollWidth, height: container.scrollHeight });
    }

    // Recompute after layout settles (fonts, reflow) and on the next frame,
    // so a Linear<->Wallchart toggle doesn't leave stale line positions.
    compute();
    const raf = requestAnimationFrame(compute);

    const observer = new ResizeObserver(compute);
    observer.observe(container);
    // Observe the inner content too, so column reflow on layout toggle is caught.
    const inner = container.firstElementChild;
    if (inner) observer.observe(inner);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [matches, containerRef, layout]);

  if (size.width === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: size.width, height: size.height }}
    >
      <defs>
        <marker id="bracket-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-gold" />
        </marker>
      </defs>
      {lines.map((l, i) => {
        // Classic squared bracket elbow: out horizontally to the midpoint,
        // vertically to align with the target, then horizontally into it.
        const midX = (l.x1 + l.x2) / 2;
        const r = Math.min(8, Math.abs(l.y2 - l.y1) / 2, Math.abs(midX - l.x1));
        const goingRight = l.x2 >= l.x1;
        const dir = goingRight ? 1 : -1;
        const down = l.y2 >= l.y1 ? 1 : -1;

        // Rounded corners at the two bends for a cleaner look.
        const path =
          r > 1
            ? `M ${l.x1} ${l.y1} ` +
              `H ${midX - r * dir} ` +
              `Q ${midX} ${l.y1} ${midX} ${l.y1 + r * down} ` +
              `V ${l.y2 - r * down} ` +
              `Q ${midX} ${l.y2} ${midX + r * dir} ${l.y2} ` +
              `H ${l.x2}`
            : `M ${l.x1} ${l.y1} H ${midX} V ${l.y2} H ${l.x2}`;

        return (
          <path
            key={i}
            d={path}
            className="stroke-gold/70"
            strokeWidth={2}
            strokeLinejoin="round"
            fill="none"
            markerEnd="url(#bracket-arrow)"
          />
        );
      })}
    </svg>
  );
}
