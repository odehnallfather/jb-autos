import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'car-media';
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  /**
   * Upload a single file to Supabase storage
   */
  static async uploadFile(file: File, folder: string = 'cars'): Promise<UploadResult> {
    try {
      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        return { url: '', path: '', error: 'File size exceeds 50MB limit' };
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return { url: '', path: '', error: 'File type not supported' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { url: '', path: '', error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { url: '', path: '', error: 'Upload failed' };
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadFiles(files: File[], folder: string = 'cars'): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(filePath: string): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Delete error:', error);
      return { error: 'Delete failed' };
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  static getOptimizedImageUrl(
    filePath: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    } = {}
  ): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);

    // Add transformation parameters if needed
    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);

    const queryString = params.toString();
    return queryString ? `${publicUrl}?${queryString}` : publicUrl;
  }

  /**
   * Check if storage bucket exists and is accessible
   */
  static async checkBucketAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Bucket access error:', error);
        return false;
      }
      
      return data.some(bucket => bucket.name === this.BUCKET_NAME);
    } catch (error) {
      console.error('Bucket check error:', error);
      return false;
    }
  }
}