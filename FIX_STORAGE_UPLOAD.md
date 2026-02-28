# Fix Storage Upload Issue

## Problem
Payment screenshots are not uploading to the `payment-proofs` bucket.

## Root Cause
The storage bucket policy is checking `auth.uid()` but might have permission issues.

## Solution: Update Storage Policies

### Step 1: Delete Existing Policies
Go to Supabase Dashboard → Storage → payment-proofs → Policies

Delete these policies:
- "Users can upload own payment proofs"
- "Users can upload payment proofs"

### Step 2: Create New Policies

Run these SQL commands in Supabase SQL Editor:

```sql
-- 1. Allow authenticated users to INSERT (upload) files
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
);

-- 2. Allow authenticated users to UPDATE their files
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs');

-- 3. Allow public to SELECT (view) files
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- 4. Allow authenticated users to DELETE their files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');
```

### Step 3: Verify Bucket is Public
1. Go to Storage → payment-proofs
2. Click the settings icon
3. Make sure "Public bucket" is checked
4. Save

### Step 4: Test Upload
1. Go to your pre-book page
2. Fill in the form
3. Upload a payment screenshot
4. Check browser console (F12) for logs:
   - "Uploading file: [user-id]/[order-id].jpg"
   - "Upload successful: ..."
   - "Public URL: ..."
   - "Payment record created: ..."

### Step 5: Check for Errors

If you see errors in console:

**"new row violates row-level security policy"**
- The INSERT policy is too restrictive
- Use the simpler policy above

**"Bucket not found"**
- Bucket name must be exactly `payment-proofs`
- Check spelling

**"Permission denied"**
- User is not authenticated
- Check if user is logged in

**"File size too large"**
- File must be under 5MB
- Try a smaller image

## Alternative: Simplify Policy (If Above Doesn't Work)

If the above policies don't work, try this super-permissive policy for testing:

```sql
-- Delete all existing policies first
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Create one simple policy for everything
CREATE POLICY "Allow all operations"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'payment-proofs')
WITH CHECK (bucket_id = 'payment-proofs');
```

⚠️ **Warning**: This policy allows anyone to upload/delete files. Only use for testing!

## Debugging Steps

1. **Check if user is authenticated:**
   ```javascript
   console.log('User:', user);
   console.log('User ID:', user?.id);
   ```

2. **Test upload manually in Supabase:**
   - Go to Storage → payment-proofs
   - Try uploading a file manually
   - If this works, the issue is in the code
   - If this fails, the issue is with policies

3. **Check browser console:**
   - Look for red error messages
   - Check Network tab for failed requests
   - Look for 403 (permission) or 404 (not found) errors

4. **Verify bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'payment-proofs';
   ```

## After Fixing

Once uploads work:
1. Test the complete flow
2. Check if images appear in admin dashboard
3. Verify the public URL is accessible
4. Test on both local and production

## Production Considerations

For production, use more restrictive policies:

```sql
-- Only allow users to upload to their own folder
CREATE POLICY "Users upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

This ensures users can only upload to folders matching their user ID.
