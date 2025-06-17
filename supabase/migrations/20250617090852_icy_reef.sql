/*
  # Storage Configuration for Car Media

  1. Storage Setup
    - Create storage bucket for car media files
    - Configure file size limits and allowed MIME types
    - Set up public access for viewing

  2. Storage Policies
    - Public read access for car media
    - Authenticated upload permissions
    - Admin-only delete permissions

  3. Storage Configuration Table
    - Track storage settings and limits
    - Store allowed file types and size limits
*/

-- Create storage configuration table to track settings
CREATE TABLE IF NOT EXISTS storage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT true,
  file_size_limit BIGINT DEFAULT 52428800, -- 50MB
  allowed_mime_types TEXT[] DEFAULT ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration for car media bucket
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
) ON CONFLICT (bucket_name) DO NOTHING;

-- Enable RLS on storage config
ALTER TABLE storage_config ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to storage config
CREATE POLICY "Public read access to storage config"
ON storage_config
FOR SELECT
TO public
USING (true);

-- Policy for admin management of storage config
CREATE POLICY "Admins can manage storage config"
ON storage_config
FOR ALL
TO authenticated
USING (has_admin_access(auth.uid()))
WITH CHECK (has_admin_access(auth.uid()));

-- Create car_images table to track uploaded media
CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT DEFAULT 'exterior' CHECK (image_type IN ('exterior', 'interior', 'engine', 'dashboard', 'wheels', 'other')),
  is_primary BOOLEAN DEFAULT false,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  storage_path TEXT,
  file_size BIGINT,
  mime_type TEXT
);

-- Create indexes for car_images
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_car_images_is_primary ON car_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_car_images_storage_path ON car_images(storage_path);

-- Enable RLS on car_images
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to car images
CREATE POLICY "Anyone can view car images"
ON car_images
FOR SELECT
TO public
USING (true);

-- Policy for admin management of car images
CREATE POLICY "Admins can manage car images"
ON car_images
FOR ALL
TO public
USING (has_admin_access(auth.uid()));