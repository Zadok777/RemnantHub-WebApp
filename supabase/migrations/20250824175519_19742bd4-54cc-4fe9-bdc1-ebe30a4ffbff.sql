-- Fix the malformed default value for trust_level column
ALTER TABLE public.communities 
ALTER COLUMN trust_level SET DEFAULT 'New';