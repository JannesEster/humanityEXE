interface Props {
  label: string;
  value: number;
}

export function StatBar({ label, value }: Props) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="stat">
      <div className="stat-row">
        <span>{label}</span>
        <strong>{Math.round(value)}</strong>
      </div>
      <div className="bar" aria-hidden="true">
        <i style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
