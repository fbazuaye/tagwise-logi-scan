-- Create assets table for tracking physical assets
CREATE TABLE public.assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id text NOT NULL UNIQUE,
  description text,
  location text,
  status text NOT NULL DEFAULT 'active',
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create tags table for NFC tag data
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_uid text NOT NULL UNIQUE,
  asset_id text,
  shipment_id text,
  container_id text,
  written_data jsonb NOT NULL,
  last_scanned timestamp with time zone,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create logs table for tracking all NFC operations
CREATE TABLE public.nfc_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_uid text,
  action_type text NOT NULL CHECK (action_type IN ('write', 'read')),
  data jsonb,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for assets
CREATE POLICY "Users can view their own assets"
ON public.assets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets"
ON public.assets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
ON public.assets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
ON public.assets FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for tags
CREATE POLICY "Users can view their own tags"
ON public.tags FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tags"
ON public.tags FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
ON public.tags FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
ON public.tags FOR DELETE
USING (auth.uid() = user_id);

-- Create RLS policies for nfc_logs
CREATE POLICY "Users can view their own NFC logs"
ON public.nfc_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NFC logs"
ON public.nfc_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_assets_asset_id ON public.assets(asset_id);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_tags_tag_uid ON public.tags(tag_uid);
CREATE INDEX idx_tags_user_id ON public.tags(user_id);
CREATE INDEX idx_nfc_logs_user_id ON public.nfc_logs(user_id);
CREATE INDEX idx_nfc_logs_created_at ON public.nfc_logs(created_at DESC);