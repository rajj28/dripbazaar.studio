-- =====================================================
-- ADD AUTOMATIC PROFILE CREATION TRIGGER
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, do nothing
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Could not create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if trigger exists
SELECT 
    tgname AS trigger_name,
    tgenabled AS enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT 
    proname AS function_name,
    prosrc AS function_code
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- =====================================================
-- TEST (Optional)
-- =====================================================

-- To test, create a test user in Supabase Auth
-- Then check if profile was created:
-- SELECT * FROM profiles WHERE email = 'test@example.com';

-- =====================================================
-- NOTES
-- =====================================================
-- 1. This trigger will automatically create a profile when a user signs up
-- 2. It extracts full_name from user metadata (raw_user_meta_data)
-- 3. If profile already exists, it won't fail (handles unique_violation)
-- 4. If any error occurs, it logs a warning but doesn't fail user creation
-- 5. The AuthContext.tsx also has a fallback mechanism for extra safety
