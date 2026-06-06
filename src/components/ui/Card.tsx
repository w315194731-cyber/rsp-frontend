import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export default function Card({
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'bg-bg-surface border border-border-subtle rounded-lg p-6 shadow-sm',
        hoverable
          ? 'transition-all duration-base hover:border-border-strong hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
          : '',
        className,
      ]
        .join(' ')
        .trim()}
      {...props}
    >
      {children}
    </div>
  );
}