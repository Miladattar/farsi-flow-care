import { useState } from 'react';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { packageDetails, testimonials, problemLabels } from '@/data/questionnaireData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Check, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Step6Offer = () => {
  const navigate = useNavigate();
  const { userName, selectedProblems, nextStep } = useFunnelStore();
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const primaryProblem = selectedProblems[0];
  const pkg = packageDetails[primaryProblem];

  return (
    <>
      <StepContent>
        <div className="space-y-5">
          <div className="text-center bg-gradient-to-b from-primary/10 to-transparent rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-1">با توجه به پاسخ‌هایی که دادید</p>
            <h2 className="text-lg font-bold text-foreground">جناب آقای {userName}</h2>
            <p className="text-primary font-medium mt-2">مشکل شما کاملاً قابل بهبود است ✨</p>
          </div>

          <div className="bg-card rounded-2xl border-2 border-primary shadow-medical overflow-hidden">
            <div className="gradient-medical p-4">
              <h3 className="text-primary-foreground font-bold text-center">{pkg.name}</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                {pkg.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">{pkg.duration}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 text-xs h-10" onClick={() => setShowDetails(true)}>
              توضیحات تکمیلی
            </Button>
            <Button variant="outline" className="flex-1 text-xs h-10" onClick={() => setShowTestimonials(true)}>
              نظرات درمانجویان
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="w-full text-sm text-muted-foreground"
            onClick={() => navigate('/consultation')}
          >
            <MessageCircle className="w-4 h-4 ml-2" />
            نیاز به مشاوره خصوصی با پزشک دارم
          </Button>
        </div>
      </StepContent>

      <div className="space-y-2 sticky bottom-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <div className="max-w-lg mx-auto space-y-2">
          <Button onClick={nextStep} className="w-full h-14 text-lg font-semibold rounded-xl gradient-medical">
            بله، ثبت سفارش
            <span className="text-xs opacity-80 mr-2">(پرداخت درب منزل)</span>
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground">خیر</Button>
        </div>
      </div>

      {/* Testimonials Modal */}
      <Dialog open={showTestimonials} onOpenChange={setShowTestimonials}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>نظرات درمانجویان</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-muted rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.name} ({t.age} ساله)</span>
                  <div className="flex">{Array(t.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{t.text}</p>
                <span className="text-xs text-primary">{t.problem}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{pkg.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">محتویات پکیج:</h4>
              <ul className="space-y-1">
                {pkg.contents.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">{pkg.duration}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
