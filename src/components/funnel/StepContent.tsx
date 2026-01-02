import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepContentProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export const StepContent = ({ children, className, animate = true }: StepContentProps) => {
  return (
    <div className={cn(
      "flex-1 px-4 py-6",
      animate && "animate-fade-in",
      className
    )}>
      <div className="max-w-lg mx-auto">
        {children}
      </div>
    </div>
  );
};
