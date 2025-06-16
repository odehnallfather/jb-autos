/*
  # Enhanced Car Dealership Schema

  1. New Tables
    - `sales` - Track completed car sales transactions
    - `test_drives` - Manage test drive appointments and records
    - `car_images` - Store multiple images per car with metadata
    - `financing_applications` - Handle car financing requests
    - `service_appointments` - Manage after-sales service bookings
    - `inventory_movements` - Track car inventory changes and history
    - `customer_preferences` - Store customer car preferences for better matching
    - `staff_assignments` - Manage staff assignments to leads and customers

  2. Enhanced Features
    - Better inventory tracking with movement history
    - Comprehensive sales pipeline management
    - Test drive scheduling and management
    - Financing application workflow
    - Customer preference tracking for AI recommendations
    - Staff performance tracking

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for different user roles
    - Ensure data privacy and access control
*/

-- Sales table to track completed transactions
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
  customer_id uuid REFERENCES profiles(id),
  salesperson_id uuid REFERENCES profiles(id),
  sale_price numeric(12,2) NOT NULL,
  down_payment numeric(12,2) DEFAULT 0,
  financing_amount numeric(12,2) DEFAULT 0,
  payment_method text DEFAULT 'cash',
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_date date,
  warranty_months integer DEFAULT 0,
  trade_in_car_details jsonb,
  trade_in_value numeric(12,2) DEFAULT 0,
  commission_rate numeric(5,2) DEFAULT 0,
  commission_amount numeric(12,2) DEFAULT 0,
  notes text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test drives table for scheduling and tracking
CREATE TABLE IF NOT EXISTS test_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  customer_id uuid REFERENCES profiles(id),
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  driver_license_number text,
  driver_license_expiry date,
  emergency_contact_name text,
  emergency_contact_phone text,
  staff_assigned uuid REFERENCES profiles(id),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  feedback text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  interested_in_purchase boolean DEFAULT false,
  follow_up_required boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Car images table for better image management
CREATE TABLE IF NOT EXISTS car_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type text DEFAULT 'exterior' CHECK (image_type IN ('exterior', 'interior', 'engine', 'dashboard', 'wheels', 'other')),
  is_primary boolean DEFAULT false,
  caption text,
  sort_order integer DEFAULT 0,
  uploaded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Financing applications table
CREATE TABLE IF NOT EXISTS financing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
  customer_id uuid REFERENCES profiles(id),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  monthly_income numeric(12,2) NOT NULL,
  employment_status text NOT NULL,
  employer_name text,
  employment_duration_months integer,
  requested_amount numeric(12,2) NOT NULL,
  down_payment numeric(12,2) DEFAULT 0,
  preferred_term_months integer DEFAULT 36,
  credit_score integer,
  existing_loans_amount numeric(12,2) DEFAULT 0,
  bank_statements_provided boolean DEFAULT false,
  id_document_provided boolean DEFAULT false,
  proof_of_income_provided boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'withdrawn')),
  approved_amount numeric(12,2),
  approved_rate numeric(5,2),
  approved_term_months integer,
  rejection_reason text,
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service appointments for after-sales support
CREATE TABLE IF NOT EXISTS service_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id),
  car_id uuid REFERENCES cars(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('maintenance', 'repair', 'inspection', 'warranty', 'recall')),
  description text NOT NULL,
  preferred_date timestamptz NOT NULL,
  estimated_duration_hours numeric(3,1) DEFAULT 2.0,
  estimated_cost numeric(10,2),
  mechanic_assigned uuid REFERENCES profiles(id),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled')),
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  actual_cost numeric(10,2),
  parts_used jsonb,
  work_performed text,
  customer_satisfaction_rating integer CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
  follow_up_required boolean DEFAULT false,
  next_service_due date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory movements for tracking car history
CREATE TABLE IF NOT EXISTS inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  movement_type text NOT NULL CHECK (movement_type IN ('received', 'sold', 'transferred', 'reserved', 'maintenance', 'damaged', 'returned')),
  from_status text,
  to_status text,
  quantity integer DEFAULT 1,
  reference_id uuid, -- Could reference sales, test_drives, etc.
  reference_type text, -- 'sale', 'test_drive', 'service', etc.
  location text,
  performed_by uuid REFERENCES profiles(id),
  cost numeric(12,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Customer preferences for AI recommendations
CREATE TABLE IF NOT EXISTS customer_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_makes text[],
  preferred_models text[],
  min_year integer,
  max_year integer,
  min_price numeric(12,2),
  max_price numeric(12,2),
  preferred_fuel_types text[],
  preferred_transmissions text[],
  preferred_colors text[],
  max_mileage integer,
  required_features text[],
  body_types text[], -- sedan, suv, hatchback, etc.
  usage_type text CHECK (usage_type IN ('personal', 'business', 'family', 'luxury')),
  financing_preferred boolean DEFAULT false,
  trade_in_available boolean DEFAULT false,
  urgency_level text DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Staff assignments for better lead management
CREATE TABLE IF NOT EXISTS staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  assignment_type text NOT NULL CHECK (assignment_type IN ('sales', 'service', 'financing', 'support')),
  assigned_date timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  expected_close_date date,
  actual_close_date date,
  outcome text CHECK (outcome IN ('sale', 'no_sale', 'follow_up', 'transferred')),
  commission_eligible boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales table
CREATE POLICY "Admins can manage all sales"
  ON sales
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

CREATE POLICY "Staff can view sales they were involved in"
  ON sales
  FOR SELECT
  TO public
  USING (
    has_admin_access(auth.uid()) OR 
    salesperson_id = auth.uid() OR 
    customer_id = auth.uid()
  );

-- RLS Policies for test_drives table
CREATE POLICY "Admins can manage all test drives"
  ON test_drives
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

CREATE POLICY "Customers can view their own test drives"
  ON test_drives
  FOR SELECT
  TO public
  USING (customer_id = auth.uid());

CREATE POLICY "Anyone can create test drive requests"
  ON test_drives
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for car_images table
CREATE POLICY "Anyone can view car images"
  ON car_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage car images"
  ON car_images
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

-- RLS Policies for financing_applications table
CREATE POLICY "Admins can manage all financing applications"
  ON financing_applications
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

CREATE POLICY "Customers can view their own financing applications"
  ON financing_applications
  FOR SELECT
  TO public
  USING (customer_id = auth.uid());

CREATE POLICY "Anyone can create financing applications"
  ON financing_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for service_appointments table
CREATE POLICY "Admins can manage all service appointments"
  ON service_appointments
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

CREATE POLICY "Customers can view their own service appointments"
  ON service_appointments
  FOR SELECT
  TO public
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create service appointments"
  ON service_appointments
  FOR INSERT
  TO public
  WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

-- RLS Policies for inventory_movements table
CREATE POLICY "Admins can manage inventory movements"
  ON inventory_movements
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

-- RLS Policies for customer_preferences table
CREATE POLICY "Customers can manage their own preferences"
  ON customer_preferences
  FOR ALL
  TO public
  USING (customer_id = auth.uid());

CREATE POLICY "Admins can view all customer preferences"
  ON customer_preferences
  FOR SELECT
  TO public
  USING (has_admin_access(auth.uid()));

-- RLS Policies for staff_assignments table
CREATE POLICY "Admins can manage staff assignments"
  ON staff_assignments
  FOR ALL
  TO public
  USING (has_admin_access(auth.uid()));

CREATE POLICY "Staff can view their own assignments"
  ON staff_assignments
  FOR SELECT
  TO public
  USING (staff_id = auth.uid() OR has_admin_access(auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_car_id ON sales(car_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(status);

CREATE INDEX IF NOT EXISTS idx_test_drives_car_id ON test_drives(car_id);
CREATE INDEX IF NOT EXISTS idx_test_drives_customer_id ON test_drives(customer_id);
CREATE INDEX IF NOT EXISTS idx_test_drives_scheduled_date ON test_drives(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_test_drives_status ON test_drives(status);

CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_car_images_is_primary ON car_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_financing_car_id ON financing_applications(car_id);
CREATE INDEX IF NOT EXISTS idx_financing_customer_id ON financing_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_financing_status ON financing_applications(status);

CREATE INDEX IF NOT EXISTS idx_service_customer_id ON service_appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_car_id ON service_appointments(car_id);
CREATE INDEX IF NOT EXISTS idx_service_date ON service_appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_service_status ON service_appointments(status);

CREATE INDEX IF NOT EXISTS idx_inventory_car_id ON inventory_movements(car_id);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_inventory_created ON inventory_movements(created_at);

CREATE INDEX IF NOT EXISTS idx_preferences_customer_id ON customer_preferences(customer_id);

CREATE INDEX IF NOT EXISTS idx_assignments_staff_id ON staff_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_assignments_lead_id ON staff_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON staff_assignments(status);