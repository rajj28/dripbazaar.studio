# Scroll to Top Fix - Mobile Pages

## Problem
When navigating to PreBook, Payment, Checkout, or PreBookPayment pages on mobile, the page would load showing the middle section instead of the top. Users had to manually scroll up to see the page header and form fields.

## Root Cause
React Router sometimes preserves scroll position when navigating between pages, causing the new page to render at the previous scroll position.

## Solution
Added `window.scrollTo(0, 0)` in a useEffect hook that runs on component mount for all affected pages.

## Implementation

### Code Added to Each Page:
```typescript
import { useState, useEffect } from 'react';

export default function PageName() {
  // ... other state and hooks

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ... rest of component
}
```

### Files Modified:
1. `db/src/pages/PreBook.tsx`
2. `db/src/pages/Payment.tsx`
3. `db/src/pages/PreBookPayment.tsx`
4. `db/src/pages/Checkout.tsx`

## Testing

### Before Fix:
1. Navigate from home to PreBook page
2. Page loads showing middle section
3. User must scroll up to see form header

### After Fix:
1. Navigate from home to PreBook page
2. Page loads at the very top
3. User sees page header and can start filling form immediately

## Browser Compatibility
Works on all modern browsers:
- ✅ iOS Safari
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ✅ Samsung Internet
- ✅ Edge Mobile

## Performance Impact
- Minimal: `window.scrollTo()` is a native browser API
- Executes instantly on page load
- No noticeable delay or performance hit

## Alternative Solutions Considered

### 1. ScrollRestoration Component
```typescript
// Could use React Router's ScrollRestoration
import { ScrollRestoration } from 'react-router-dom';

// In App.tsx
<ScrollRestoration />
```
**Why not used**: Requires changes to routing setup, our solution is simpler

### 2. Global useEffect in App.tsx
```typescript
// Could add to App.tsx
useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]);
```
**Why not used**: Would affect ALL pages, some pages might want to preserve scroll

### 3. CSS scroll-behavior
```css
html {
  scroll-behavior: smooth;
}
```
**Why not used**: Only affects scroll animation, doesn't fix initial position

## Our Solution is Best Because:
- ✅ Simple and explicit
- ✅ Works immediately
- ✅ No dependencies on routing config
- ✅ Easy to understand and maintain
- ✅ Can be applied selectively to pages that need it
- ✅ No side effects on other pages

## Future Improvements
If more pages need this behavior, consider:
1. Creating a custom hook `useScrollToTop()`
2. Adding to a layout component
3. Using React Router's ScrollRestoration

## Related Issues
- Mobile UX improvements
- Page navigation behavior
- Form accessibility on mobile
