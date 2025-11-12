// Google Maps API configuration
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Load Google Maps script dynamically
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key not configured');
      reject(new Error('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.'));
      return;
    }

    // Check if script already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));

    document.head.appendChild(script);
  });
};

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}
