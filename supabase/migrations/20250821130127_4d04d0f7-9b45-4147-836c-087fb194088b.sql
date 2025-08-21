-- Fix profiles table security vulnerability
-- Drop all existing RLS policies on profiles table to start clean
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profiles." ON public.profiles;

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies that restrict access to authenticated users only
-- Users can only view their own profile
CREATE POLICY "Authenticated users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Authenticated users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Authenticated users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Explicitly deny access to anonymous/public users
CREATE POLICY "Deny all access to anonymous users"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Create index for better performance on user lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (id);

-- Add comment for documentation
COMMENT ON TABLE public.profiles IS 'User profile information with strict RLS policies to prevent data exposure';