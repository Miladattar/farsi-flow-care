import { useState } from 'react';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { BackButton } from '../BackButton';
import { useFunnelStore, ProblemType } from '@/stores/funnelStore';
import { problemLabels } from '@/data/questionnaireData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const problemOptions: { value: ProblemType; icon: string }[] = [
  { value: 'ejaculation', icon: '⏱️' },
  { value: 'size', icon: '📏' },
  { value: 'erection', icon: '💪' },
];

export const Step2ProblemSelect = () => {
  const { userName, selectedProblems, setSelectedProblems, sessionId, nextStep } = useFunnelStore();
  const [selected, setSelected] = useState<ProblemType[]>(selectedProblems);
  const [isLoading, setIsLoading] = useState(false);

  const toggleProblem = (problem: ProblemType) => {
    setSelected(prev => 
      prev.includes(problem) 
        ? prev.filter(p => p !== problem)
        : [...prev, problem]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      toast.error('لطفاً حداقل یک مورد را انتخاب کنید');
      return;
    }

    setIsLoading(true);
    try {
      // Update session with selected problems
      const { error } = await supabase
        .from('funnel_sessions')
        .update({ selected_problems: selected })
        .eq('id', sessionId);

      if (error) throw error;

      setSelectedProblems(selected);
      nextStep();
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StepContent>
        <BackButton />
        <div className="space-y-6">
          {/* Greeting */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {userName} عزیز
            </h2>
            <p className="text-muted-foreground">
              مشکل اصلی که الان باهاش درگیری کدومه؟
            </p>
            <p className="text-sm text-muted-foreground">
              (می‌تونی چند مورد رو انتخاب کنی)
            </p>
          </div>

          {/* Problem Options */}
          <div className="space-y-3 pt-4">
            {problemOptions.map(({ value, icon }) => (
              <button
                key={value}
                onClick={() => toggleProblem(value)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-smooth flex items-center gap-4",
                  selected.includes(value)
                    ? "border-primary bg-primary/5 shadow-medical"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <span className="text-3xl">{icon}</span>
                <span className="flex-1 text-right font-medium text-foreground">
                  {problemLabels[value]}
                </span>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-smooth",
                  selected.includes(value)
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}>
                  {selected.includes(value) && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            اطلاعات شما کاملاً محرمانه است و فقط برای ارائه بهترین راه‌حل استفاده می‌شود
          </p>
        </div>
      </StepContent>

      <StickyButton 
        onClick={handleContinue} 
        isLoading={isLoading}
        disabled={selected.length === 0}
      >
        ادامه
      </StickyButton>
    </>
  );
};
