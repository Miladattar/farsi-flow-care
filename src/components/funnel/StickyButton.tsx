import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StickyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
  isLoading?: boolean;
}

export const StickyButton = ({ 
  children, 
  onClick, 
  disabled,
  variant = 'default',
  className,
  type = 'button',
  isLoading = false,
}: StickyButtonProps) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
      <div className="max-w-lg mx-auto">
        <Button
          type={type}
          onClick={onClick}
          disabled={disabled || isLoading}
          variant={variant}
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-xl shadow-medical transition-smooth",
            variant === 'default' && "gradient-medical hover:opacity-90",
            className
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              در حال پردازش...
            </span>
          ) : children}
        </Button>
      </div>
    </div>
  );
};
