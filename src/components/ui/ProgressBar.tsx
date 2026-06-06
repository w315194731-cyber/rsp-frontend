import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;       // 0–100
  label?: string;
  showPercent?: boolean;
  variant?: 'default' | 'success' | 'error';
  className?: string;
}

/**
 * Horizontal progress bar with label and percentage.
 */
export function ProgressBar({
  value,
  label,
  showPercent = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const barColor = {
    default: 'bg-brand',
    success: 'bg-semantic-success',
    error: 'bg-semantic-error',
  }[variant];

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-text-secondary">{label}</span>}
          {showPercent && (
            <span className="text-text-muted font-mono">{clamped}%</span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-base ease-out ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Processing status line — text + spinner for indeterminate states.
 */
interface ProcessingStatusProps {
  processed?: number;
  total?: number;
  message?: string;
  className?: string;
}

export function ProcessingStatus({
  processed,
  total,
  message,
  className,
}: ProcessingStatusProps) {
  const defaultMsg =
    processed !== undefined && total !== undefined
      ? `Processing image ${processed}/${total}...`
      : 'Processing...';

  return (
    <div className={cn('flex items-center gap-2 text-sm text-text-secondary', className)}>
      <svg
        className="animate-spin text-brand shrink-0"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{message ?? defaultMsg}</span>
    </div>
  );
}