import { useState } from 'react';
import { FunnelContainer } from '@/components/funnel/FunnelContainer';
import { StepContent } from '@/components/funnel/StepContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFunnelStore } from '@/stores/funnelStore';
import { doctorProfile } from '@/data/questionnaireData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Consultation = () => {
  const navigate = useNavigate();
  const { sessionId, setCurrentStep } = useFunnelStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Save user message
      if (sessionId) {
        await supabase.from('consultation_messages').insert({
          session_id: sessionId,
          role: 'user',
          content: userMessage,
        });
      }

      // Call AI
      const { data, error } = await supabase.functions.invoke('ai-doctor', {
        body: { message: userMessage, sessionId },
      });

      if (error) throw error;

      const assistantMessage = data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Save assistant message
      if (sessionId) {
        await supabase.from('consultation_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: assistantMessage,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در دریافت پاسخ');
    } finally {
      setIsLoading(false);
    }
  };

  const goToOrder = () => {
    setCurrentStep(7);
    navigate('/');
  };

  return (
    <FunnelContainer>
      <StepContent className="flex flex-col h-full">
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {/* Doctor Profile */}
          <div className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
            <img 
              src={doctorProfile.image} 
              alt={doctorProfile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-foreground">{doctorProfile.name}</h3>
              <p className="text-xs text-muted-foreground">{doctorProfile.specialty}</p>
              <p className="text-xs text-primary">{doctorProfile.experience}</p>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">{doctorProfile.bio}</p>
              <p className="text-sm mt-4">سوال خود را بپرسید...</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-muted rounded-2xl p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال خود را بنویسید..."
              className="flex-1 min-h-[50px] max-h-[100px] rounded-xl resize-none"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            />
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} className="h-auto">
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <Button variant="outline" className="w-full" onClick={goToOrder}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            سوالاتم برطرف شد، چطور ثبت سفارش کنم؟
          </Button>
        </div>
      </StepContent>
    </FunnelContainer>
  );
};

export default Consultation;
