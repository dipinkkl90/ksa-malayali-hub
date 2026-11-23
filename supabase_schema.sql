-- ==============================================================================
-- KSA Malayali Hub - Supabase Activity Logs Schema & Row-Level Security (RLS)
-- Developed by D&J Techies (+44 7460 646263)
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create the activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  event_type text NOT NULL,
  page_path text,
  details text,
  device_type text
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow any visitor (anon & authenticated) to insert privacy-safe logs
DROP POLICY IF EXISTS "Allow public insert" ON public.activity_logs;
CREATE POLICY "Allow public insert"
ON public.activity_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow ONLY your authenticated admin email to read cloud logs
-- NOTE: Replace 'your-admin-email@gmail.com' with your actual admin email,
-- or leave as authenticated if you want all authenticated team members to view.
DROP POLICY IF EXISTS "Allow admin read" ON public.activity_logs;
CREATE POLICY "Allow admin read"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'your-admin-email@gmail.com');

-- 5. Policy: Allow ONLY your authenticated admin email to clear/delete logs
DROP POLICY IF EXISTS "Allow admin delete" ON public.activity_logs;
CREATE POLICY "Allow admin delete"
ON public.activity_logs
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'your-admin-email@gmail.com');

-- Helpful index for fast ordering by timestamp
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_event_type ON public.activity_logs (event_type);
