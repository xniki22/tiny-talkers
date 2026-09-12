interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percentage =
    total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="progress-text">
        {current} of {total}
      </span>
    </div>
  );
}