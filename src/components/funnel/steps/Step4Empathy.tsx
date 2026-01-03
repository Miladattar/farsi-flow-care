import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { BackButton } from '../BackButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { empathyContent, problemLabels } from '@/data/questionnaireData';
import { Heart } from 'lucide-react';

export const Step4Empathy = () => {
  const { userName, selectedProblems, nextStep } = useFunnelStore();
  const primaryProblem = selectedProblems[0];
  const content = empathyContent[primaryProblem];

  return (
    <>
      <StepContent>
        <BackButton />
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
            <p className="text-sm text-primary">{userName} عزیز</p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border space-y-4 shadow-soft">
            <p className="text-foreground leading-relaxed">{content.text}</p>
            <div className="h-px bg-border" />
            <div>
              <p className="text-sm font-semibold text-primary mb-2">علت اصلی:</p>
              <p className="text-muted-foreground leading-relaxed text-sm">{content.rootCause}</p>
            </div>
          </div>

          {selectedProblems.length > 1 && (
            <div className="bg-accent/50 rounded-xl p-4">
              <p className="text-sm text-accent-foreground">
                مشکلات انتخابی شما: {selectedProblems.map(p => problemLabels[p]).join('، ')}
              </p>
            </div>
          )}
        </div>
      </StepContent>

      <StickyButton onClick={nextStep}>
        راه‌های بهبود گردش خون
      </StickyButton>
    </>
  );
};
