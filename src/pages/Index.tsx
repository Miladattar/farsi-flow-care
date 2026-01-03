import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FunnelContainer } from '@/components/funnel/FunnelContainer';
import { useFunnelStore } from '@/stores/funnelStore';
import { Step1Welcome } from '@/components/funnel/steps/Step1Welcome';
import { Step2ProblemSelect } from '@/components/funnel/steps/Step2ProblemSelect';
import { Step3Questionnaire } from '@/components/funnel/steps/Step3Questionnaire';
import { Step4Empathy } from '@/components/funnel/steps/Step4Empathy';
import { Step5Consultation } from '@/components/funnel/steps/Step5Consultation';
import { Step6Solution } from '@/components/funnel/steps/Step6Solution';
import { Step7Offer } from '@/components/funnel/steps/Step7Offer';
import { Step8Order } from '@/components/funnel/steps/Step8Order';

const Index = () => {
  const { currentStep, reset } = useFunnelStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Reset funnel when ?reset=true is in URL
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      reset();
      setSearchParams({});
    }
  }, [searchParams, reset, setSearchParams]);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Welcome />;
      case 2: return <Step2ProblemSelect />;
      case 3: return <Step3Questionnaire />;
      case 4: return <Step4Empathy />;
      case 5: return <Step5Consultation />;
      case 6: return <Step6Solution />;
      case 7: return <Step7Offer />;
      case 8: return <Step8Order />;
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
