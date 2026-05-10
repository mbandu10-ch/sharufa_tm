export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser uses relative URLs
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ''); // Remove trailing slash
  }
  
  // Default for production o2switch if Not set
  if (process.env.NODE_ENV === 'production') {
    return 'https://sharufa.com';
  }

  // Local development
  return `http://localhost:${process.env.PORT || 3000}`;
};
