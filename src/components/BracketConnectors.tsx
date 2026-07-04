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
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let observer: ResizeObserver | null = null;
    let observing = false;

    function compute() {
      const container = containerRef.current;
      if (!container) return;

      // Attach observers once the container is available.
      if (observer && !observing) {
        observer.observe(container);
        const inner = container.firstElementChild;
        if (inner) observer.observe(inner);
        observing = true;
      }

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

    observer = new ResizeObserver(compute);
    // containerRef belongs to the parent, so it may not be attached during this
    // child's first layout effect. Try synchronously, then a few times after
    // paint/reflow. setTimeout (not rAF) so it still fires in a background tab.
    compute();
    timeouts.push(setTimeout(compute, 0));
    timeouts.push(setTimeout(compute, 100));
    timeouts.push(setTimeout(compute, 400));
    window.addEventListener("resize", compute);
    return () => {
      timeouts.forEach(clearTimeout);
      observer?.disconnect();
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
