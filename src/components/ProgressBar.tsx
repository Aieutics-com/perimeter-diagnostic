"use client";

interface Label {
  name: string;
  count: number;
}

interface ProgressBarProps {
  total: number;
  current: number; // 0-indexed
  labels: Label[];
}

export default function ProgressBar({ total, current, labels }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const isComplete = i < current;
          const isActive = i === current;
          return (
            <div key={i} className="flex-1">
              <div className="h-1 rounded-full bg-[var(--color-grey-light)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: isComplete ? "100%" : isActive ? "50%" : "0%",
                    backgroundColor:
                      isComplete || isActive ? "var(--color-orange)" : "transparent",
                    opacity: isActive ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-orange)] font-medium">
          {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        {labels.map((label, i) => {
          const start = labels.slice(0, i).reduce((s, l) => s + l.count, 0);
          const end = start + label.count;
          const isActive = current >= start && current < end;
          return (
            <span
              key={label.name}
              className={`font-[family-name:var(--font-body)] text-xs ${
                isActive
                  ? "text-[var(--color-foreground)]"
                  : "text-[var(--color-grey-lighter)]"
              }`}
            >
              {i > 0 && <span className="mr-2">/</span>}
              {label.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
