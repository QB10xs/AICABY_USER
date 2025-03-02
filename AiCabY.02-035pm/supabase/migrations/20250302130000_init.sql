-- Drop existing tables if they exist
DROP TABLE IF EXISTS training_examples CASCADE;
DROP TABLE IF EXISTS training_metadata CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    first_name text,
    phone_number text,
    email text,
    avatar_url text,
    payment_preferences jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE user_roles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('ai_admin', 'user')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create training_examples table
CREATE TABLE training_examples (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    input text NOT NULL,
    output text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create training_metadata table
CREATE TABLE training_metadata (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    version text NOT NULL,
    last_updated timestamptz DEFAULT now(),
    total_examples integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_examples_updated_at
    BEFORE UPDATE ON training_examples
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_metadata_updated_at
    BEFORE UPDATE ON training_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger for auto-creating profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = $1
        AND role = 'ai_admin'
    );
END;
$$ language plpgsql security definer;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_metadata ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view their own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Only ai_admin can insert roles"
    ON user_roles FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'ai_admin'
    ));

CREATE POLICY "Only ai_admin can update roles"
    ON user_roles FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'ai_admin'
    ));

-- Training examples policies
CREATE POLICY "Admin read access to training examples"
    ON training_examples FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'ai_admin'
    ));

CREATE POLICY "Admin write access to training examples"
    ON training_examples FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'ai_admin'
    ));

-- Training metadata policies
CREATE POLICY "Admin access to training metadata"
    ON training_metadata FOR ALL
    USING (EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'ai_admin'
    ));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON user_roles TO authenticated;
GRANT ALL ON training_examples TO authenticated;
GRANT ALL ON training_metadata TO authenticated;

-- Create initial admin user
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM user_roles WHERE role = 'ai_admin'
    ) THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (
            (SELECT id FROM auth.users WHERE email = 'p2ptaxinl@gmail.com'),
            'ai_admin'
        );
    END IF;
END $$; 