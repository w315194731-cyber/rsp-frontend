import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'new' | 'limited';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'bg-brand-subtle text-brand border border-brand/20',
  success: 'bg-semantic-success/10 text-semantic-success border border-semantic-success/20',
  warning: 'bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20',
  error: 'bg-semantic-error/10 text-semantic-error border border-semantic-error/20',
  new: 'bg-semantic-info/10 text-semantic-info border border-semantic-info/20',
  limited: 'bg-semantic-warning/10 text-semantic-warning border border-semantic-warning/20',
};

export default function Badge({
  variant = 'brand',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .join(' ')
        .trim()}
    >
      {children}
    </span>
  );
}