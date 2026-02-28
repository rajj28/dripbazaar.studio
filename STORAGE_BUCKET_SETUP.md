# Supabase Storage Bucket Setup

## Overview
The `payment-proofs` storage bucket is used for pre-book orders where customers upload payment screenshots. Regular Razorpay payments don't need this bucket.

## When You Need This
- Only if you're using the Pre-Book feature where customers upload payment screenshots
- Regular e-commerce orders via Razorpay don't require this bucket

## Setup Instructions

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Enter bucket name: `payment-proofs`
5. Set as **Public bucket** (so images can be viewed)
6. Click **Create bucket**

### Step 2: Set Bucket Policies
After creating the bucket, set up these policies:

#### Policy 1: Allow Authenticated Users to Upload
```sql
-- Allow authenticated users to upload their own payment proofs
CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow Public Read Access
```sql
-- Allow anyone to view payment proofs (for admin verification)
CREATE POLICY "Public can view payment proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');
```

#### Policy 3: Allow Users to Update Their Own Files
```sql
-- Allow users to update their own payment proofs
CREATE POLICY "Users can update their payment proofs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'payment-proofs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Step 3: Configure Bucket Settings
1. In the bucket settings, set:
   - **File size limit**: 5 MB (enough for screenshots)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/jpg`, `image/webp`

### Step 4: Test Upload
1. Go to your pre-book page
2. Try uploading a payment screenshot
3. Check if it appears in the Storage bucket
4. Verify admin can see it in the admin dashboard

## Folder Structure
Files are organized by user ID:
```
payment-proofs/
├── user-id-1/
│   ├── order-id-1.jpg
│   └── order-id-2.png
├── user-id-2/
│   └── order-id-3.jpg
```

## Troubleshooting

### "Bucket not found" Error
- Make sure the bucket name is exactly `payment-proofs`
- Check that the bucket is created in the correct Supabase project

### "Permission denied" Error
- Verify the RLS policies are set up correctly
- Make sure the bucket is set to Public
- Check that the user is authenticated

### Images Not Loading in Admin Dashboard
- Check if the bucket is set to Public
- Verify the public URL is correct
- Check browser console for CORS errors

### Upload Fails
- Check file size (must be under 5 MB)
- Verify file type is allowed (jpg, png, webp)
- Check user authentication status

## Alternative: Skip Storage Bucket
If you don't want to use the storage bucket:

1. **For Pre-Book Orders**: You can modify the PreBookPayment component to:
   - Accept transaction ID only (no screenshot)
   - Use external payment proof links
   - Skip the upload entirely

2. **For Regular Orders**: No changes needed - Razorpay payments don't use screenshots

## Security Notes
- Files are organized by user ID to prevent unauthorized access
- Only authenticated users can upload
- Users can only upload to their own folder
- Public read access is needed for admin verification
- Consider adding file size limits to prevent abuse
- Consider adding virus scanning for production use

## Cost Considerations
- Supabase Storage: First 1 GB free, then $0.021/GB/month
- Bandwidth: First 2 GB free, then $0.09/GB
- For small-scale use, you'll likely stay within free tier
