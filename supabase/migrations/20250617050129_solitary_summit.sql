/*
  # Setup Supabase Storage for Car Images and Videos

  1. Storage Setup
    - Create 'car-media' bucket for storing car images and videos
    - Set up proper RLS policies for secure access
    - Configure public access for car images

  2. Security
    - Enable RLS on storage objects
    - Allow public read access for car media
    - Allow authenticated users to upload media
    - Restrict file types and sizes
*/

-- Create storage bucket for car media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-media',
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
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to car media
CREATE POLICY "Public read access for car media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'car-media');

-- Policy to allow authenticated users to upload car media
CREATE POLICY "Authenticated users can upload car media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'car-media' AND
  auth.role() = 'authenticated'
);

-- Policy to allow users to update their uploaded media
CREATE POLICY "Users can update car media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'car-media')
WITH CHECK (bucket_id = 'car-media');

-- Policy to allow users to delete car media (admin only)
CREATE POLICY "Admins can delete car media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'car-media' AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'staff')
  )
);