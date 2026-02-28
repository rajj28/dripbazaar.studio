export const handleError = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  
  // Auth errors
  if (error.message?.includes('JWT') || error.message?.includes('token')) {
    return 'Session expired. Please log in again.';
  }
  
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password.';
  }
  
  if (error.message?.includes('User already registered')) {
    return 'This email is already registered. Please sign in.';
  }
  
  // Network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Database errors
  if (error.message?.includes('violates foreign key constraint')) {
    return 'Invalid reference. Please try again.';
  }
  
  if (error.message?.includes('duplicate key')) {
    return 'This record already exists.';
  }
  
  // Storage errors
  if (error.message?.includes('storage')) {
    return 'Failed to upload file. Please try again.';
  }
  
  // Validation errors
  if (error.message?.includes('invalid') || error.message?.includes('required')) {
    return error.message;
  }
  
  // Default error
  return error.message || 'An unexpected error occurred. Please try again.';
};

export const validateTransactionId = (transactionId: string): { valid: boolean; error?: string } => {
  if (!transactionId || transactionId.trim().length === 0) {
    return { valid: false, error: 'Transaction ID is required' };
  }
  
  if (transactionId.length < 10) {
    return { valid: false, error: 'Transaction ID must be at least 10 characters' };
  }
  
  return { valid: true };
};

export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Please enter a valid 10-digit Indian phone number' };
  }
  
  return { valid: true };
};

export const validatePincode = (pincode: string): { valid: boolean; error?: string } => {
  const pincodeRegex = /^\d{6}$/;
  
  if (!pincodeRegex.test(pincode)) {
    return { valid: false, error: 'Please enter a valid 6-digit pincode' };
  }
  
  return { valid: true };
};
