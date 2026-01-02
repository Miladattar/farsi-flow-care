import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const Step1Welcome = () => {
  const { userName, setUserName, setSessionId, nextStep } = useFunnelStore();
  const [name, setName] = useState(userName);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      toast.error('لطفاً نام خود را وارد کنید');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('funnel_sessions')
        .insert({ user_name: name.trim() })
        .select('id')
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setUserName(name.trim());
      nextStep();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('خطا در ایجاد جلسه. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StepContent>
        <div className="text-center space-y-6">
          {/* Welcome Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl gradient-medical flex items-center justify-center shadow-medical">
            <span className="text-4xl">👋</span>
          </div>

          {/* Welcome Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground leading-relaxed">
              سلام!
            </h2>
            <p className="text-lg text-foreground leading-relaxed">
              به <span className="text-primary font-semibold">کلینیک درمانی نوین</span> خوش آمدید
            </p>
            <p className="text-muted-foreground leading-relaxed">
              ما تا رفع مشکل کامل شما، کنارتان هستیم
            </p>
          </div>

          {/* Name Input */}
          <div className="pt-6 space-y-3">
            <label className="block text-right text-sm font-medium text-foreground">
              برای شروع، لطفاً نام و نام خانوادگی‌تان را وارد کنید
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              className="h-14 text-lg text-center rounded-xl border-2 border-border focus:border-primary transition-smooth"
              dir="rtl"
            />
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>کاملاً محرمانه</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>بدون نیاز به مراجعه</span>
            </div>
          </div>
        </div>
      </StepContent>

      <StickyButton onClick={handleContinue} isLoading={isLoading} disabled={!name.trim()}>
        تأیید و ادامه
      </StickyButton>
    </>
  );
};
