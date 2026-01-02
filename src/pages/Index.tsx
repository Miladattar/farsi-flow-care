import { FunnelContainer } from '@/components/funnel/FunnelContainer';
import { useFunnelStore } from '@/stores/funnelStore';
import { Step1Welcome } from '@/components/funnel/steps/Step1Welcome';
import { Step2ProblemSelect } from '@/components/funnel/steps/Step2ProblemSelect';
import { Step3Questionnaire } from '@/components/funnel/steps/Step3Questionnaire';
import { Step4Empathy } from '@/components/funnel/steps/Step4Empathy';
import { Step5Solution } from '@/components/funnel/steps/Step5Solution';
import { Step6Offer } from '@/components/funnel/steps/Step6Offer';
import { Step7Order } from '@/components/funnel/steps/Step7Order';

const Index = () => {
  const { currentStep } = useFunnelStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Welcome />;
      case 2: return <Step2ProblemSelect />;
      case 3: return <Step3Questionnaire />;
      case 4: return <Step4Empathy />;
      case 5: return <Step5Solution />;
      case 6: return <Step6Offer />;
      case 7: return <Step7Order />;
      default: return <Step1Welcome />;
    }
  };

  return (
    <FunnelContainer>
      {renderStep()}
    </FunnelContainer>
  );
};

export default Index;
