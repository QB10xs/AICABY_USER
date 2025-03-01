-- Create training_examples table
CREATE TABLE IF NOT EXISTS public.training_examples (
    id BIGSERIAL PRIMARY KEY,
    user_input TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create training_metadata table
CREATE TABLE IF NOT EXISTS public.training_metadata (
    id BIGSERIAL PRIMARY KEY,
    version TEXT NOT NULL DEFAULT '1.0.0',
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    total_examples INTEGER DEFAULT 0
);

-- Insert initial metadata
INSERT INTO public.training_metadata (version, last_updated, total_examples)
VALUES ('1.0.0', NOW(), 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.training_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for training_examples
CREATE POLICY "Allow authenticated users to read training examples"
ON public.training_examples
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert training examples"
ON public.training_examples
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update training examples"
ON public.training_examples
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete training examples"
ON public.training_examples
FOR DELETE
TO authenticated
USING (true);

-- Create policies for training_metadata
CREATE POLICY "Allow authenticated users to read training metadata"
ON public.training_metadata
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update training metadata"
ON public.training_metadata
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant access to authenticated users
GRANT ALL ON public.training_examples TO authenticated;
GRANT ALL ON public.training_metadata TO authenticated;
GRANT USAGE ON SEQUENCE public.training_examples_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.training_metadata_id_seq TO authenticated; 