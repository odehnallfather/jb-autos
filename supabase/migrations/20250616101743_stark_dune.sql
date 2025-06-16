/*
  # Add Direct Messaging and Notifications System

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
    - Add policies for secure access
    - Users can only access their own conversations and messages

  3. Changes
    - Add notification_preferences column to profiles table
*/

-- Create conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id),
  dealer_id uuid REFERENCES users(id),
  subject text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create direct_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES users(id),
  recipient_id uuid NOT NULL REFERENCES users(id),
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'file')),
  media_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'inquiry')),
  is_read boolean DEFAULT false,
  related_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add foreign key constraint for conversation_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'direct_messages_conversation_id_fkey'
  ) THEN
    ALTER TABLE direct_messages 
    ADD CONSTRAINT direct_messages_conversation_id_fkey 
    FOREIGN KEY (conversation_id) REFERENCES conversations(id);
  END IF;
END $$;

-- Enable RLS on tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop and recreate conversations policies
  DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
  
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

  -- Drop and recreate direct_messages policies
  DROP POLICY IF EXISTS "Users can view their own messages" ON direct_messages;
  DROP POLICY IF EXISTS "Users can send messages" ON direct_messages;
  
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

  -- Drop and recreate notifications policies
  DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
  
  CREATE POLICY "Users can view their notifications"
    ON notifications
    FOR SELECT
    TO public
    USING (auth.uid() = user_id);
END $$;

-- Add notification preferences to profiles table if column doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN notification_preferences jsonb DEFAULT '{"sms": false, "push": true, "email": true}'::jsonb;
  END IF;
END $$;