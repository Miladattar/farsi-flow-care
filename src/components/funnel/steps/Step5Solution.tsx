import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { solutionContent } from '@/data/questionnaireData';
import { Zap, Droplets, Activity } from 'lucide-react';

export const Step5Solution = () => {
  const { selectedProblems, nextStep } = useFunnelStore();
  const primaryProblem = selectedProblems[0];
  const content = solutionContent[primaryProblem];

  const benefits = [
    { icon: Droplets, text: 'بهبود گردش خون' },
    { icon: Activity, text: 'کنترل عصبی بهتر' },
    { icon: Zap, text: 'عملکرد عروقی مطلوب' },
  ];

  return (
    <>
      <StepContent>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="bg-card rounded-xl p-3 border border-border text-center shadow-soft">
                <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
            <p className="text-foreground leading-relaxed">{content.text}</p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-center text-foreground">
              ✨ راه‌حل ما بدون عوارض جانبی و کاملاً طبیعی است
            </p>
          </div>
        </div>
      </StepContent>

      <StickyButton onClick={nextStep}>
        {content.buttonText}
      </StickyButton>
    </>
  );
};
