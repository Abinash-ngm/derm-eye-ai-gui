import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { searchNearbyClinics } from '@/lib/api';
import { toast } from 'sonner';

// Load Google Maps script with Map ID support
const loadGoogleMapsScript = (apiKey: string, mapId?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    // Include mapId in the script URL if provided
    const mapIdParam = mapId ? `&map_ids=${mapId}` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker${mapIdParam}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

interface Clinic {
  name: string;
  address?: string;
  phone?: string;
  rating?: number;
  total_ratings?: number;
  place_id?: string;
  type?: string;
  hours?: string;
  open_now?: boolean;
  website?: string;
  map_url?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// Update the marker refs to handle both Marker and AdvancedMarkerElement
const MapComponent = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<(google.maps.Marker | google.maps.marker.AdvancedMarkerElement)[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (googleMapRef.current) {
        google.maps.event.trigger(googleMapRef.current, 'resize');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Google Maps on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID; // Optional Map ID for advanced features
    
    if (!apiKey) {
      setError('Google Maps API key not configured');
      toast.error('Map configuration missing');
      return;
    }

    loadGoogleMapsScript(apiKey, mapId)
      .then(() => {
        setMapLoaded(true);
        getUserLocation();
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps: ' + (err.message || 'Unknown error'));
        toast.error('Failed to load map: ' + (err.message || 'Unknown error'));
        
        // Check if it's a billing error
        if (err.message && err.message.includes('BillingNotEnabled')) {
          toast.error('Google Maps API billing is not enabled. Please check your Google Cloud Console and enable billing for your project.');
        }
      });
  }, []);

  // Initialize map when loaded and user location is available
  useEffect(() => {
    if (mapLoaded && mapRef.current && userLocation && !googleMapRef.current) {
      initializeMap();
    }
  }, [mapLoaded, userLocation]);

  // Update markers when clinics change
  useEffect(() => {
    if (googleMapRef.current && clinics.length > 0) {
      updateMarkers();
    }
  }, [clinics]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          fetchClinics(location.lat, location.lng);
          toast.success('Location obtained successfully');
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to New York if geolocation fails
          const defaultLocation = { lat: 40.7128, lng: -74.0060 };
          setUserLocation(defaultLocation);
          fetchClinics(defaultLocation.lat, defaultLocation.lng);
          toast.warning('Using default location (New York)');
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
      const defaultLocation = { lat: 40.7128, lng: -74.0060 };
      setUserLocation(defaultLocation);
      fetchClinics(defaultLocation.lat, defaultLocation.lng);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !userLocation) return;

    try {
      // Ensure the map container has dimensions
      if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
        console.warn('Map container has zero dimensions');
        // Force a reflow
        mapRef.current.style.height = '100%';
        mapRef.current.style.width = '100%';
      }

      // Get Map ID from environment variables (optional)
      const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

      // Initialize map with options
      const mapOptions: google.maps.MapOptions = {
        center: userLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        // Use Map ID if available for advanced features
        ...(mapId && { mapId })
      };

      // Try to create map with fallback for billing issues
      const map = new google.maps.Map(mapRef.current, mapOptions);

      googleMapRef.current = map;
      addUserMarker(userLocation);
      
      // Trigger resize event to ensure proper rendering
      setTimeout(() => {
        if (googleMapRef.current) {
          google.maps.event.trigger(googleMapRef.current, 'resize');
          googleMapRef.current.setCenter(userLocation);
        }
      }, 100);
    } catch (error: any) {
      console.error('Error initializing Google Map:', error);
      setError('Failed to initialize map: ' + (error.message || 'Unknown error'));
      toast.error('Failed to initialize map: ' + (error.message || 'Unknown error'));
      
      // Check if it's a billing error
      if (error.message && error.message.includes('BillingNotEnabled')) {
        setError('Google Maps API billing is not enabled. Please check your Google Cloud Console.');
        toast.error('Google Maps API billing is not enabled. Please check your Google Cloud Console and enable billing for your project.');
      }
    }
  };

  // Reinitialize map when user location changes
  useEffect(() => {
    if (mapLoaded && mapRef.current && userLocation && googleMapRef.current) {
      googleMapRef.current.setCenter(userLocation);
      addUserMarker(userLocation);
    }
  }, [userLocation, mapLoaded]);

  const addUserMarker = (location: { lat: number; lng: number }) => {
    if (!googleMapRef.current) return;

    // Remove old user marker
    if (userMarkerRef.current) {
      if ('setMap' in userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      } else {
        userMarkerRef.current.map = null;
      }
    }

    let marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement;

    try {
      // Try to create AdvancedMarkerElement first
      // Check if we have a mapId which is required for AdvancedMarkerElement
      const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
      
      if (mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: googleMapRef.current,
          title: 'Your Location',
        });
      } else {
        // Fallback to regular Marker if no Map ID or AdvancedMarkerElement not available
        throw new Error('AdvancedMarkerElement not available or Map ID not configured');
      }
    } catch (error) {
      // Fallback to regular Marker if AdvancedMarkerElement fails
      console.warn('AdvancedMarkerElement not available, falling back to regular Marker:', error);
      marker = new google.maps.Marker({
        position: location,
        map: googleMapRef.current,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });
    }

    // Add info window for user location
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">📍 Your Location</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">
            Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}
          </p>
        </div>
      `,
    });

    marker.addListener('click', () => {
      infoWindow.open(googleMapRef.current!, marker);
    });

    userMarkerRef.current = marker;
  };

  const updateMarkers = () => {
    if (!googleMapRef.current) return;

    // Clear existing clinic markers
    markersRef.current.forEach(marker => {
      if ('setMap' in marker) {
        marker.setMap(null);
      } else {
        marker.map = null;
      }
    });
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    
    // Add user location to bounds
    if (userLocation) {
      bounds.extend(userLocation);
    }

    // Add clinic markers
    clinics.forEach((clinic) => {
      if (!clinic.location || !googleMapRef.current) return;

      let marker: google.maps.Marker | google.maps.marker.AdvancedMarkerElement;

      try {
        // Try to create AdvancedMarkerElement first
        // Check if we have a mapId which is required for AdvancedMarkerElement
        const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
        
        if (mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: clinic.location.lat, lng: clinic.location.lng },
            map: googleMapRef.current,
            title: clinic.name,
          });
        } else {
          // Fallback to regular Marker if no Map ID or AdvancedMarkerElement not available
          throw new Error('AdvancedMarkerElement not available or Map ID not configured');
        }
      } catch (error) {
        // Fallback to regular Marker if AdvancedMarkerElement fails
        console.warn('AdvancedMarkerElement not available, falling back to regular Marker:', error);
        marker = new google.maps.Marker({
          position: { lat: clinic.location.lat, lng: clinic.location.lng },
          map: googleMapRef.current,
          title: clinic.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
      }

      // Create info window content
      const infoWindowContent = `
        <div style="padding: 12px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600;">${clinic.name}</h3>
          ${clinic.rating ? `<div style="margin-bottom: 4px; font-size: 13px;">⭐ ${clinic.rating.toFixed(1)} ${clinic.total_ratings ? `(${clinic.total_ratings} reviews)` : ''}</div>` : ''}
          ${clinic.address ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${clinic.address}</p>` : ''}
          ${clinic.phone ? `<p style="margin: 4px 0; font-size: 12px;">📞 <a href="tel:${clinic.phone}" style="color: #1a73e8;">${clinic.phone}</a></p>` : ''}
          ${clinic.open_now !== undefined ? `<p style="margin: 4px 0; font-size: 12px; color: ${clinic.open_now ? '#0f9d58' : '#d93025'}; font-weight: 500;">${clinic.open_now ? '🟢 Open Now' : '🔴 Closed'}</p>` : ''}
          ${clinic.website ? `<p style="margin: 4px 0; font-size: 12px;">🌐 <a href="${clinic.website}" target="_blank" style="color: #1a73e8;">Visit Website</a></p>` : ''}
          <div style="margin-top: 8px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${clinic.location.lat},${clinic.location.lng}" 
               target="_blank" 
               style="display: inline-block; padding: 6px 12px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
              Get Directions
            </a>
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      marker.addListener('click', () => {
        // Close all other info windows
        markersRef.current.forEach(m => {
          const iw = (m as any).infoWindow;
          if (iw) iw.close();
        });
        infoWindow.open(googleMapRef.current!, marker);
      });

      // Store info window reference
      (marker as any).infoWindow = infoWindow;

      markersRef.current.push(marker);
      bounds.extend({ lat: clinic.location.lat, lng: clinic.location.lng });
    });

    // Fit map to show all markers
    if (clinics.length > 0 && userLocation) {
      // If we have clinics, fit bounds to show all of them
      googleMapRef.current.fitBounds(bounds);
    } else if (userLocation) {
      // If we only have user location, center on it with appropriate zoom
      googleMapRef.current.setCenter(userLocation);
      googleMapRef.current.setZoom(13);
    }
  };

  const fetchClinics = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchLat = lat || userLocation?.lat || 40.7128;
      const searchLng = lng || userLocation?.lng || -74.0060;
      
      const data = await searchNearbyClinics(searchLat, searchLng, 5000);
      
      if (data.clinics && data.clinics.length > 0) {
        setClinics(data.clinics);
        toast.success(`Found ${data.clinics.length} clinics nearby`);
      } else {
        setClinics([]);
        setError('No clinics found in this area.');
        toast.warning('No clinics found nearby');
      }
    } catch (err: any) {
      console.error('Error fetching clinics:', err);
      
      // Handle specific error cases
      if (err.message?.includes('500')) {
        setError('Unable to fetch nearby clinics. Server error occurred.');
        toast.error('Server error - please try again later');
      } else if (err.message?.includes('network')) {
        setError('Network error. Please check your connection.');
        toast.error('Network error - check your connection');
      } else {
        setError('Unable to fetch nearby clinics. Please try again.');
        toast.error('Failed to load clinics');
      }
      
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (userLocation) {
      fetchClinics(userLocation.lat, userLocation.lng);
    } else {
      getUserLocation();
    }
  };

  return (
    <div className="relative h-screen w-full flex">
      {/* Full-screen Google Map - Left Side (70%) */}
      <div ref={mapRef} className="w-[70%] h-full" />

      {/* Clinic List Panel - Right Side (30%) */}
      <div className="w-[30%] h-full bg-background border-l overflow-y-auto">
        {/* Header with Controls */}
        <div className="sticky top-0 z-10 bg-background border-b p-4 space-y-3">
          <div>
            <h2 className="text-xl font-bold">Nearby Clinics</h2>
            {userLocation && (
              <p className="text-sm text-muted-foreground mt-1">
                📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="flex-1"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            
            <Button
              onClick={getUserLocation}
              variant="secondary"
              size="sm"
            >
              <Navigation className="h-4 w-4 mr-2" />
              My Location
            </Button>
          </div>
          
          {/* Results Count */}
          {!loading && clinics.length > 0 && (
            <div className="text-sm font-medium text-primary">
              Found {clinics.length} healthcare facilities
            </div>
          )}
        </div>

        {/* Clinic List */}
        <div className="p-4 space-y-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 mb-4 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Searching for clinics...</p>
            </div>
          )}

          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-destructive" />
                  <p className="font-semibold mb-2">Unable to fetch clinics</p>
                  <p className="text-sm text-muted-foreground mb-4">{error}</p>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && clinics.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No clinics found in this area
              </p>
            </div>
          )}

          {!loading && clinics.length > 0 && clinics.map((clinic, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
              // Center map on clinic and open info window
              if (clinic.location && googleMapRef.current) {
                googleMapRef.current.setCenter(clinic.location);
                googleMapRef.current.setZoom(16);
                // Trigger marker click
                const marker = markersRef.current[index];
                if (marker) {
                  google.maps.event.trigger(marker, 'click');
                }
              }
            }}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base leading-tight">{clinic.name}</CardTitle>
                    {clinic.rating && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{clinic.rating.toFixed(1)}</span>
                        </div>
                        {clinic.total_ratings && (
                          <span className="text-xs text-muted-foreground">
                            ({clinic.total_ratings} reviews)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {clinic.open_now !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                      clinic.open_now 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {clinic.open_now ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {clinic.type && (
                  <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded inline-block">
                    {clinic.type}
                  </div>
                )}
                
                {clinic.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{clinic.address}</span>
                  </div>
                )}
                
                {clinic.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${clinic.phone}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {clinic.phone}
                    </a>
                  </div>
                )}
                
                {clinic.hours && (
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">{clinic.hours}</span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  {clinic.website && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          clinic.website!.startsWith('http') ? clinic.website : `https://${clinic.website}`,
                          '_blank'
                        );
                      }}
                    >
                      🌐 Website
                    </Button>
                  )}
                  {clinic.location && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          clinic.map_url || `https://www.google.com/maps/search/?api=1&query=${clinic.location?.lat},${clinic.location?.lng}`,
                          '_blank'
                        );
                      }}
                    >
                      🗺️ Directions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Loading State Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30">
          <div className="text-center">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-lg font-semibold">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
