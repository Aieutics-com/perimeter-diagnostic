"use client";

interface OptionCardProps {
  label: string;
  description: string;
  example?: string;
  selected: boolean;
  onSelect: () => void;
}

export default function OptionCard({
  label,
  description,
  example,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
          : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-grey-lighter)]"
      }`}
    >
      <span
        className={`block font-[family-name:var(--font-heading)] text-sm font-bold mb-1 ${
          selected
            ? "text-[var(--color-orange)]"
            : "text-[var(--color-foreground)]"
        }`}
      >
        {label}
      </span>
      <span className="block font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--color-grey)]">
        {description}
      </span>
      {example && (
        <span className="block mt-1 font-[family-name:var(--font-body)] text-xs leading-relaxed text-[var(--color-grey)] italic">
          {example}
        </span>
      )}
    </button>
  );
}
