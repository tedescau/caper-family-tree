"use client";

import { edgeColors } from "@/lib/tokens";

const legendItems = [
  { type: "alumni", label: "Alumni" },
  { type: "founded", label: "Founded" },
  { type: "opened_new", label: "Opened new" },
  { type: "current_staff", label: "Current staff" },
  { type: "belongs_to", label: "Part of group" },
  { type: "family", label: "Family" },
  { type: "same_space", label: "Same space" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 px-4">
      {legendItems.map((item) => {
        const edge = edgeColors[item.type];
        return (
          <div key={item.type} className="flex items-center gap-1.5">
            <svg width="24" height="8" className="flex-shrink-0">
              <line
                x1="0"
                y1="4"
                x2="24"
                y2="4"
                stroke={edge.color}
                strokeWidth={Math.max(edge.width, 1.5)}
                strokeDasharray={
                  edge.style === "dashed"
                    ? "4,3"
                    : edge.style === "dotted"
                      ? "2,2"
                      : "none"
                }
              />
            </svg>
            <span className="text-[10px] font-sans opacity-50 tracking-wide uppercase">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
