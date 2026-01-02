import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FunnelContainerProps {
  children: ReactNode;
  className?: string;
}

export const FunnelContainer = ({ children, className }: FunnelContainerProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      className
    )}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-medical flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">ن</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">کلینیک درمانی نوین</h1>
              <p className="text-xs text-muted-foreground">مرکز تخصصی سلامت مردان</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};
