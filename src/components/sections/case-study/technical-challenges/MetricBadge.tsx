interface MetricBadgeProps {
  label: string;
  value: string;
}

export function MetricBadge({ label, value }: MetricBadgeProps) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-1.5 text-xs text-white/80">
      <span className="font-semibold text-white">{value}</span>
      <span className="ml-2 text-white/50">{label}</span>
    </div>
  );
}
