import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressIndicator = ({ currentStep, totalSteps, className }: ProgressIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full px-4 py-3", className)}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-muted-foreground">مرحله {currentStep} از {totalSteps}</span>
          <span className="text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-medical rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
