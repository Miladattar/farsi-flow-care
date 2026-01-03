import { useState, useRef, useEffect } from 'react';
import { StepContent } from '../StepContent';
import { StickyButton } from '../StickyButton';
import { BackButton } from '../BackButton';
import { useFunnelStore } from '@/stores/funnelStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import doctorImage from '@/assets/doctor-welcome.jpg';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

export const Step5Consultation = () => {
  const { nextStep, sessionId } = useFunnelStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'دکتر باقری هستم، هر سوالی در مورد روند درمان دارید در خدمتم 🙂'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Save user message to database
      if (sessionId) {
        await supabase.from('consultation_messages').insert({
          session_id: sessionId,
          role: 'user',
          content: userMessage.content
        });
      }

      // Call AI doctor edge function
      const { data, error } = await supabase.functions.invoke('ai-doctor', {
        body: { message: userMessage.content }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'متاسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      if (sessionId) {
        await supabase.from('consultation_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: assistantMessage.content
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'متاسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <StepContent>
        <BackButton />
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
              <img 
                src={doctorImage} 
                alt="دکتر باقری" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-foreground">مشاوره با پزشک</h2>
            <p className="text-sm text-muted-foreground">
              قبل از ادامه می‌توانید سوالات خود را بپرسید
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                <img 
                  src={doctorImage} 
                  alt="دکتر باقری" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">دکتر باقری</h3>
                <p className="text-xs text-muted-foreground">متخصص سلامت مردان</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-full py-6 text-base font-semibold rounded-xl bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            <span>اگر نیاز به راهنمایی و سوالات بیشتری دارید، کلیک کنید</span>
          </Button>

          <div className="bg-accent/50 rounded-xl p-4 text-center">
            <p className="text-sm text-accent-foreground">
              یا می‌توانید مستقیماً به مرحله بعد بروید
            </p>
          </div>
        </div>
      </StepContent>

      <StickyButton onClick={nextStep}>
        ادامه به معرفی پکیج درمانی
      </StickyButton>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
          {/* Chat Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shadow-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-foreground/30">
              <img 
                src={doctorImage} 
                alt="دکتر باقری" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">دکتر باقری</h3>
              <p className="text-xs opacity-80">آنلاین</p>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4 bg-[#e5ddd5]">
            <div className="space-y-3 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-[#dcf8c6] rounded-tl-none'
                        : 'bg-white rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white rounded-lg rounded-tr-none px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="bg-[#f0f0f0] p-3 flex gap-2 items-center border-t">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-white border-0 rounded-full px-4"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Floating Order Button */}
          <div className="absolute bottom-20 left-4 right-4">
            <Button
              onClick={() => {
                setIsChatOpen(false);
                nextStep();
              }}
              className="w-full py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              ثبت سفارش پکیج درمانی
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
