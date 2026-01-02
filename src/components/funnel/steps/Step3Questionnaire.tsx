import { useState, useMemo } from 'react';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { ProgressIndicator } from '../ProgressIndicator';
import { useFunnelStore, ProblemType } from '@/stores/funnelStore';
import { questionnaires, problemLabels } from '@/data/questionnaireData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';

export const Step3Questionnaire = () => {
  const { 
    selectedProblems, 
    currentQuestionnaireIndex,
    setCurrentQuestionnaireIndex,
    questionnaireAnswers,
    addQuestionnaireAnswer,
    sessionId,
    nextStep 
  } = useFunnelStore();

  const currentProblem = selectedProblems[currentQuestionnaireIndex];
  const questionnaire = questionnaires[currentProblem];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questionnaire?.questions[currentQuestionIndex];
  const currentAnswers = questionnaireAnswers[currentProblem] || [];
  const currentAnswer = currentAnswers.find(a => a.questionId === currentQuestion?.id);

  const totalQuestions = useMemo(() => {
    return selectedProblems.reduce((acc, problem) => acc + questionnaires[problem].questions.length, 0);
  }, [selectedProblems]);

  const completedQuestions = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentQuestionnaireIndex; i++) {
      count += questionnaires[selectedProblems[i]].questions.length;
    }
    count += currentQuestionIndex;
    return count;
  }, [currentQuestionnaireIndex, currentQuestionIndex, selectedProblems]);

  const selectAnswer = (answer: string) => {
    addQuestionnaireAnswer(currentProblem, {
      questionId: currentQuestion.id,
      answer,
    });
  };

  const handleNext = async () => {
    if (!currentAnswer) {
      toast.error('لطفاً یک گزینه را انتخاب کنید');
      return;
    }

    // Move to next question
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Save questionnaire responses to database
      setIsLoading(true);
      try {
        const responsesJson = JSON.parse(JSON.stringify(questionnaireAnswers[currentProblem]));
        const { error } = await supabase
          .from('questionnaire_responses')
          .insert([{
            session_id: sessionId as string,
            problem_type: currentProblem as "ejaculation" | "size" | "erection",
            responses: responsesJson,
          }]);

        if (error) throw error;

        // Move to next questionnaire or next step
        if (currentQuestionnaireIndex < selectedProblems.length - 1) {
          setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
          setCurrentQuestionIndex(0);
        } else {
          nextStep();
        }
      } catch (error) {
        console.error('Error saving responses:', error);
        toast.error('خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentQuestionnaireIndex > 0) {
      const prevProblem = selectedProblems[currentQuestionnaireIndex - 1];
      setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
      setCurrentQuestionIndex(questionnaires[prevProblem].questions.length - 1);
    }
  };

  if (!questionnaire || !currentQuestion) {
    return null;
  }

  return (
    <>
      <ProgressIndicator 
        currentStep={completedQuestions + 1} 
        totalSteps={totalQuestions} 
      />

      <StepContent>
        <div className="space-y-6">
          {/* Questionnaire Header */}
          <div className="flex items-center gap-2">
            {currentQuestionIndex > 0 || currentQuestionnaireIndex > 0 ? (
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ) : null}
            <div className="flex-1">
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                {problemLabels[currentProblem]}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground leading-relaxed">
              {currentQuestion.text}
            </h2>
            {currentQuestion.isMedical && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>🏥</span>
                <span>سوال پزشکی</span>
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => selectAnswer(option)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-right transition-smooth",
                  currentAnswer?.answer === option
                    ? "border-primary bg-primary/5 shadow-medical"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <span className="font-medium text-foreground">{option}</span>
              </button>
            ))}
          </div>

          {/* Question Counter */}
          <p className="text-center text-sm text-muted-foreground pt-4">
            سوال {currentQuestionIndex + 1} از {questionnaire.questions.length}
          </p>
        </div>
      </StepContent>

      <StickyButton 
        onClick={handleNext} 
        isLoading={isLoading}
        disabled={!currentAnswer}
      >
        {currentQuestionIndex < questionnaire.questions.length - 1 
          ? 'سوال بعدی'
          : currentQuestionnaireIndex < selectedProblems.length - 1
            ? `ادامه به ${problemLabels[selectedProblems[currentQuestionnaireIndex + 1]]}`
            : 'بررسی نتیجه'
        }
      </StickyButton>
    </>
  );
};
