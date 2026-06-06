import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({
  error = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={[
        'w-full h-10 px-4 text-base text-text-primary placeholder:text-text-muted',
        'bg-bg-surface border rounded-md transition-colors duration-fast',
        error
          ? 'border-semantic-error focus:outline-none focus:ring-2 focus:ring-semantic-error/30'
          : 'border-border-default focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-subtle',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ]
        .join(' ')
        .trim()}
    />
  );
}