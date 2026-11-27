import type { MouseEventHandler } from 'react';
import { ArrowRight } from 'lucide-react';

interface RollButtonProps {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'surface' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function RollButton({
  label,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  disabled = false,
}: RollButtonProps) {
  const variantClasses = {
    primary:
      'bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)] shadow-[0_10px_28px_rgba(83,43,253,0.28)] dark:shadow-[0_10px_30px_rgba(83,43,253,0.34)]',
    surface:
      'bg-[var(--surface)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--accent)]',
    subtle:
      'bg-[var(--surface-subtle)] text-[var(--ink)] border border-[var(--border)] hover:border-[var(--accent)]',
  }[variant];

  const circleClasses = {
    primary:
      'bg-[var(--accent-ink)]/15 text-[var(--accent-ink)] group-hover:bg-[var(--accent-ink)]/25',
    surface:
      'bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]',
    subtle:
      'bg-[var(--surface)] text-[var(--ink)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)]',
  }[variant];

  const sizeClasses = {
    sm: 'h-10 pl-4 pr-1.5 gap-2.5 text-[0.875rem]',
    md: 'h-12 pl-5 pr-2 gap-3 text-[0.9375rem]',
    lg: 'h-[54px] pl-6 pr-2 gap-3.5 text-[0.95rem]',
  }[size];

  const circleSize = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
  }[size];

  const disabledClasses = disabled
    ? 'opacity-65 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.98]';

  const sharedClasses = `group inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${disabledClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const innerContent = (
    <>
      <span className="relative block h-[20px] overflow-hidden leading-[20px]">
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center rounded-full transition-colors duration-200 ${circleSize} ${circleClasses}`}
      >
        <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0" />
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} aria-label={ariaLabel} className={sharedClasses}>
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={sharedClasses}
    >
      {innerContent}
    </button>
  );
}
