import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProblemType = 'ejaculation' | 'size' | 'erection';

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
}

export interface FunnelState {
  // Session
  sessionId: string | null;
  userName: string;
  
  // Current step
  currentStep: number;
  
  // Problem selection
  selectedProblems: ProblemType[];
  
  // Questionnaire state
  currentQuestionnaireIndex: number;
  questionnaireAnswers: Record<ProblemType, QuestionnaireAnswer[]>;
  
  // Actions
  setSessionId: (id: string) => void;
  setUserName: (name: string) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedProblems: (problems: ProblemType[]) => void;
  setCurrentQuestionnaireIndex: (index: number) => void;
  addQuestionnaireAnswer: (problem: ProblemType, answer: QuestionnaireAnswer) => void;
  setQuestionnaireAnswers: (problem: ProblemType, answers: QuestionnaireAnswer[]) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  userName: '',
  currentStep: 1,
  selectedProblems: [] as ProblemType[],
  currentQuestionnaireIndex: 0,
  questionnaireAnswers: {
    ejaculation: [],
    size: [],
    erection: [],
  } as Record<ProblemType, QuestionnaireAnswer[]>,
};

export const useFunnelStore = create<FunnelState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSessionId: (id) => set({ sessionId: id }),
      
      setUserName: (name) => set({ userName: name }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
      
      setSelectedProblems: (problems) => set({ selectedProblems: problems }),
      
      setCurrentQuestionnaireIndex: (index) => set({ currentQuestionnaireIndex: index }),
      
      addQuestionnaireAnswer: (problem, answer) =>
        set((state) => ({
          questionnaireAnswers: {
            ...state.questionnaireAnswers,
            [problem]: [...state.questionnaireAnswers[problem].filter(a => a.questionId !== answer.questionId), answer],
          },
        })),
      
      setQuestionnaireAnswers: (problem, answers) =>
        set((state) => ({
          questionnaireAnswers: {
            ...state.questionnaireAnswers,
            [problem]: answers,
          },
        })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'clinic-funnel-storage',
    }
  )
);
