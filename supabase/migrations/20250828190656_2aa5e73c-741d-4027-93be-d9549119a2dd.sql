-- Fix security vulnerability in profiles table RLS policies
-- Drop existing policies that may have security gaps
DROP POLICY IF EXISTS "Authenticated users can insert only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Deny all access to anonymous users" ON public.profiles;

-- Create more secure and explicit RLS policies
-- Policy for SELECT: Users can only view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- Policy for INSERT: Users can only create their own profile  
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Policy for UPDATE: Users can only update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy for DELETE: Users can only delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = id);

-- Explicitly deny all access to anonymous users
CREATE POLICY "profiles_deny_anonymous" ON public.profiles
    FOR ALL 
    TO anon
    USING (false);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;