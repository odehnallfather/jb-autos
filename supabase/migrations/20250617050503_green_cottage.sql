/*
  # Setup Storage Bucket for Car Media

  1. Storage Setup
    - Create car-media bucket for storing car images and videos
    - Configure bucket settings for public access
    - Set file size and type restrictions

  2. Security
    - Enable public read access for car media
    - Allow authenticated users to upload
    - Restrict delete operations to admins only

  Note: Storage bucket creation and RLS policies need to be set up manually
  in the Supabase dashboard as they require special permissions.
*/

-- Create a function to check if storage bucket exists
CREATE OR REPLACE FUNCTION check_storage_bucket_exists(bucket_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = bucket_name
  );
END;
$$;

-- Create a function to get storage bucket info
CREATE OR REPLACE FUNCTION get_storage_bucket_info(bucket_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bucket_info json;
BEGIN
  SELECT to_json(b) INTO bucket_info
  FROM storage.buckets b
  WHERE b.id = bucket_name;
  
  RETURN bucket_info;
END;
$$;

-- Add a table to track storage configuration
CREATE TABLE IF NOT EXISTS storage_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name text UNIQUE NOT NULL,
  is_public boolean DEFAULT true,
  file_size_limit bigint DEFAULT 52428800, -- 50MB
  allowed_mime_types text[] DEFAULT ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert configuration for car-media bucket
INSERT INTO storage_config (bucket_name, is_public, file_size_limit, allowed_mime_types)
VALUES (
  'car-media',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
) ON CONFLICT (bucket_name) DO UPDATE SET
  is_public = EXCLUDED.is_public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = now();

-- Enable RLS on storage_config
ALTER TABLE storage_config ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to storage config
CREATE POLICY "Public read access to storage config"
ON storage_config
FOR SELECT
TO public
USING (true);

-- Policy to allow admins to manage storage config
CREATE POLICY "Admins can manage storage config"
ON storage_config
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

-- Update the car_images table to use storage URLs
ALTER TABLE car_images 
ADD COLUMN IF NOT EXISTS storage_path text,
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS mime_type text;

-- Create index on storage_path for better performance
CREATE INDEX IF NOT EXISTS idx_car_images_storage_path ON car_images(storage_path);

-- Add a function to generate storage URLs
CREATE OR REPLACE FUNCTION get_car_image_url(storage_path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF storage_path IS NULL OR storage_path = '' THEN
    RETURN NULL;
  END IF;
  
  -- Return the full storage URL
  RETURN 'https://kepvtlgmtwhjsryfqexg.supabase.co/storage/v1/object/public/car-media/' || storage_path;
END;
$$;

-- Create a function to validate file uploads
CREATE OR REPLACE FUNCTION validate_file_upload(
  file_name text,
  file_size bigint,
  mime_type text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  config storage_config%ROWTYPE;
BEGIN
  -- Get the storage configuration
  SELECT * INTO config
  FROM storage_config
  WHERE bucket_name = 'car-media';
  
  -- Check if config exists
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check file size
  IF file_size > config.file_size_limit THEN
    RETURN false;
  END IF;
  
  -- Check mime type
  IF NOT (mime_type = ANY(config.allowed_mime_types)) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;