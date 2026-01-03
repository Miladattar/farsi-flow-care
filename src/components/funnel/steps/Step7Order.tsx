import { useState } from 'react';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { BackButton } from '../BackButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Phone, MapPin, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Step7Order = () => {
  const { sessionId, selectedProblems, userName, reset } = useFunnelStore();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'online'>('cash_on_delivery');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!phone.trim() || !address.trim()) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          session_id: sessionId as string,
          phone_number: phone.trim(),
          address: address.trim(),
          payment_method: paymentMethod,
          package_type: selectedProblems,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('سفارش شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <StepContent>
        <div className="text-center space-y-6 py-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">سفارش شما ثبت شد!</h2>
          <p className="text-muted-foreground">{userName} عزیز، با تشکر از اعتماد شما</p>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-foreground">کارشناسان ما به زودی با شما تماس خواهند گرفت.</p>
          </div>
        </div>
      </StepContent>
    );
  }

  return (
    <>
      <StepContent>
        <BackButton />
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">ثبت سفارش</h2>
            <p className="text-sm text-muted-foreground">{userName} عزیز، اطلاعات زیر را تکمیل کنید</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Phone className="w-4 h-4 text-primary" />
                شماره تماس
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="h-12 rounded-xl"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                آدرس کامل
              </label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="استان، شهر، خیابان، پلاک..."
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="w-4 h-4 text-primary" />
                روش پرداخت
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'cash_on_delivery', label: 'پرداخت درب منزل' },
                  { value: 'online', label: 'پرداخت آنلاین' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPaymentMethod(option.value as typeof paymentMethod)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-sm transition-smooth",
                      paymentMethod === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </StepContent>

      <StickyButton onClick={handleSubmit} isLoading={isLoading} disabled={!phone.trim() || !address.trim()}>
        ثبت نهایی سفارش
      </StickyButton>
    </>
  );
};
