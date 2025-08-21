-- Fix Google OAuth tokens security vulnerability
-- Drop the existing overly permissive RLS policy
DROP POLICY IF EXISTS "Secure Google credentials access" ON public.google_credentials;

-- Make user_id NOT NULL to prevent security gaps
ALTER TABLE public.google_credentials ALTER COLUMN user_id SET NOT NULL;

-- Create a new, more restrictive RLS policy that only allows authenticated users
-- to access their own credentials
CREATE POLICY "Authenticated users can access only their own Google credentials"
ON public.google_credentials
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled (it should already be, but just to be safe)
ALTER TABLE public.google_credentials ENABLE ROW LEVEL SECURITY;

-- Update the encryption functions to be more secure with proper search path
CREATE OR REPLACE FUNCTION public.encrypt_token(token_value text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    encrypted_token text;
BEGIN
    -- Only allow authenticated users to encrypt tokens
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required to encrypt tokens';
    END IF;
    
    -- Use Supabase's built-in encryption with a project-specific key
    SELECT encode(
        encrypt(
            token_value::bytea, 
            'google_oauth_key_2024_secure'::bytea, 
            'aes'
        ), 
        'base64'
    ) INTO encrypted_token;
    
    RETURN encrypted_token;
END;
$$;

-- Update the decryption function to be more secure
CREATE OR REPLACE FUNCTION public.decrypt_token(encrypted_token text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    decrypted_token text;
BEGIN
    -- Only allow authenticated users to decrypt their own tokens
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required to decrypt tokens';
    END IF;
    
    -- Additional validation: ensure the token belongs to the requesting user
    -- This is handled by RLS, but adding extra check for security
    IF NOT EXISTS (
        SELECT 1 FROM public.google_credentials 
        WHERE user_id = auth.uid() 
        AND (access_token_encrypted = encrypted_token OR refresh_token_encrypted = encrypted_token)
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Token does not belong to current user';
    END IF;
    
    SELECT convert_from(
        decrypt(
            decode(encrypted_token, 'base64'), 
            'google_oauth_key_2024_secure'::bytea, 
            'aes'
        ), 
        'UTF8'
    ) INTO decrypted_token;
    
    RETURN decrypted_token;
END;
$$;