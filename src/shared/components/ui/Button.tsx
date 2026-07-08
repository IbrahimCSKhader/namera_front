import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({ children, isLoading = false, variant = 'primary', disabled, ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? 'جاري المعالجة...' : children}
    </button>
  );
}
