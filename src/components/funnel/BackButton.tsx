import { ChevronRight } from 'lucide-react';
import { useFunnelStore } from '@/stores/funnelStore';

interface BackButtonProps {
  onClick?: () => void;
}

export const BackButton = ({ onClick }: BackButtonProps) => {
  const { prevStep } = useFunnelStore();
  
  const handleClick = onClick || prevStep;
  
  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-smooth mb-4"
    >
      <ChevronRight className="w-5 h-5" />
      <span className="text-sm">بازگشت</span>
    </button>
  );
};
