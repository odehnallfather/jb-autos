/*
  # Add Direct Messaging Tables

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references users)
      - `dealer_id` (uuid, references users, nullable)
      - `subject` (text, nullable)
      - `status` (text, default 'active')
      - `last_message_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `direct_messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `sender_id` (uuid, references users)
      - `recipient_id` (uuid, references users)
      - `message` (text)
      - `message_type` (text, default 'text')
      - `media_url` (text, nullable)
      - `is_read` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `message` (text)
      - `type` (text, default 'info')
      - `is_read` (boolean, default false)
      - `related_id` (uuid, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES auth.users(id),
  dealer_id uuid REFERENCES auth.users(id),
  subject text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create direct_messages table
CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  recipient_id uuid NOT NULL REFERENCES auth.users(id),
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'file')),
  media_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'inquiry')),
  is_read boolean DEFAULT false,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations"
  ON conversations
  FOR SELECT
  TO public
  USING (auth.uid() = customer_id OR auth.uid() = dealer_id);

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = customer_id);

-- RLS Policies for direct_messages
CREATE POLICY "Users can view their own messages"
  ON direct_messages
  FOR SELECT
  TO public
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON direct_messages
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Add notification preferences to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb;
  END IF;
END $$;