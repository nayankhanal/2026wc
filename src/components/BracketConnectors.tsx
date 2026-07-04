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
}: {
  matches: MatchWithTeams[];
  containerRef: RefObject<HTMLDivElement | null>;
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

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(container);
    window.addEventListener("resize", compute);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [matches, containerRef]);

  if (size.width === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: size.width, height: size.height }}
    >
      <defs>
        <marker id="bracket-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-gold/70" />
        </marker>
      </defs>
      {lines.map((l, i) => {
        const midX = (l.x1 + l.x2) / 2;
        const path = `M ${l.x1} ${l.y1} C ${midX} ${l.y1}, ${midX} ${l.y2}, ${l.x2} ${l.y2}`;
        return (
          <path
            key={i}
            d={path}
            className="stroke-gold/40"
            strokeWidth={1.5}
            fill="none"
            markerEnd="url(#bracket-arrow)"
          />
        );
      })}
    </svg>
  );
}
