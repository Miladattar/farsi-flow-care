-- Create enum for problem types
CREATE TYPE public.problem_type AS ENUM ('ejaculation', 'size', 'erection');

-- Funnel sessions table to track user journey
CREATE TABLE public.funnel_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    selected_problems problem_type[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Questionnaire responses table
CREATE TABLE public.questionnaire_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.funnel_sessions(id) ON DELETE CASCADE NOT NULL,
    problem_type problem_type NOT NULL,
    responses JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.funnel_sessions(id) ON DELETE CASCADE NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
    package_type problem_type[] NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Consultation messages for AI doctor chat
CREATE TABLE public.consultation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.funnel_sessions(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.funnel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

-- Public insert/select policies (no auth required for this funnel)
CREATE POLICY "Allow public insert on funnel_sessions" ON public.funnel_sessions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select own session" ON public.funnel_sessions
    FOR SELECT USING (true);

CREATE POLICY "Allow public update on funnel_sessions" ON public.funnel_sessions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on questionnaire_responses" ON public.questionnaire_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on questionnaire_responses" ON public.questionnaire_responses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on orders" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on consultation_messages" ON public.consultation_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on consultation_messages" ON public.consultation_messages
    FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to funnel_sessions
CREATE TRIGGER update_funnel_sessions_updated_at
    BEFORE UPDATE ON public.funnel_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();