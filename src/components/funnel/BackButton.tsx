import { ChevronRight, RotateCcw } from 'lucide-react';
import { useFunnelStore } from '@/stores/funnelStore';

interface BackButtonProps {
  onClick?: () => void;
  showRestart?: boolean;
}

export const BackButton = ({ onClick, showRestart = true }: BackButtonProps) => {
  const { prevStep, reset } = useFunnelStore();
  
  const handleClick = onClick || prevStep;
  
  return (
    <div className="flex items-center justify-between mb-4">
      <button 
        onClick={handleClick}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth"
      >
        <ChevronRight className="w-5 h-5" />
        <span className="text-sm">بازگشت</span>
      </button>
      
      {showRestart && (
        <button 
          onClick={reset}
          className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-smooth"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">شروع مجدد</span>
        </button>
      )}
    </div>
  );
};
