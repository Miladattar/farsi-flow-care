import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `شما دکتر احمد محمدی هستید، یک متخصص اورولوژی با ۱۵ سال تجربه در زمینه سلامت جنسی مردان.

قوانین مهم:
- پاسخ‌ها را به زبان فارسی و با لحن حرفه‌ای، دلسوزانه و محترمانه بنویسید
- هرگز تشخیص پزشکی قطعی ندهید
- هرگز نام دارو یا درمان خاصی تجویز نکنید
- به جای آن، راهنمایی‌های کلی در مورد سبک زندگی، تغذیه و گردش خون ارائه دهید
- پاسخ‌ها را کوتاه و مفید نگه دارید (حداکثر ۱۵۰ کلمه)
- در پایان پاسخ، به پکیج درمانی کلینیک اشاره کنید به عنوان راه‌حل جامع`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI error:', data);
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-doctor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
