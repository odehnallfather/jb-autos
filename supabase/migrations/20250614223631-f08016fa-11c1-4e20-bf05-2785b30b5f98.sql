
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');

-- Create enum for car status
CREATE TYPE car_status AS ENUM ('available', 'sold', 'reserved', 'maintenance');

-- Create enum for lead status
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'interested', 'not_interested', 'converted');

-- Create profiles table for user management
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars inventory table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  color TEXT,
  description TEXT,
  features TEXT[],
  images TEXT[],
  status car_status DEFAULT 'available',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  interested_car_id UUID REFERENCES cars(id),
  message TEXT,
  status lead_status DEFAULT 'new',
  source TEXT DEFAULT 'website',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table for general customer messages
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has admin/staff role
CREATE OR REPLACE FUNCTION has_admin_access(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND role IN ('admin', 'staff')
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (has_admin_access(auth.uid()));

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for cars (public read, admin write)
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (status = 'available' OR has_admin_access(auth.uid()));

CREATE POLICY "Admins can manage cars" ON cars
  FOR ALL USING (has_admin_access(auth.uid()));

-- RLS Policies for leads (admin only)
CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL USING (has_admin_access(auth.uid()));

-- RLS Policies for inquiries (admin only)
CREATE POLICY "Admins can manage inquiries" ON inquiries
  FOR ALL USING (has_admin_access(auth.uid()));

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
