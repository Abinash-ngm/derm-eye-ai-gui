import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadGoogleMapsScript } from '@/lib/googleMaps';
import { toast } from 'sonner';

// Mock clinic data
const clinics = [
  {
    id: 1,
    name: 'City Medical Center',
    address: '123 Healthcare Ave, Medical District',
    phone: '+1 (555) 123-4567',
    distance: '0.8 km',
    hours: 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM'
  },
  {
    id: 2,
    name: 'Downtown Health Clinic',
    address: '456 Wellness Street, Downtown',
    phone: '+1 (555) 234-5678',
    distance: '1.2 km',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-4PM'
  },
  {
    id: 3,
    name: 'Riverside Hospital',
    address: '789 Medical Plaza, Riverside',
    phone: '+1 (555) 345-6789',
    distance: '2.5 km',
    hours: '24/7 Emergency Services'
  }
];

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => {
        setMapLoaded(true);
        initializeMap();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        setMapError(error.message);
        toast.error('Failed to load Google Maps. Please check your API key.');
      });
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Initialize map centered on a default location
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 }, // New York as default
      zoom: 12,
    });

    // Add markers for clinics using AdvancedMarkerElement (recommended) or fallback to Marker
    clinics.forEach((clinic, index) => {
      const position = { lat: 40.7128 + (index * 0.01), lng: -74.0060 + (index * 0.01) };
      
      // Use the standard Marker (AdvancedMarkerElement requires additional setup)
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: clinic.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 10px;"><h3 style="margin: 0 0 8px 0; font-size: 16px;">${clinic.name}</h3><p style="margin: 0; font-size: 14px;">${clinic.address}</p></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Clinics</CardTitle>
          <CardDescription>Locate healthcare facilities in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Maps Container */}
          <div 
            ref={mapRef}
            className="w-full h-96 bg-muted rounded-lg mb-6"
            style={{ display: mapLoaded && !mapError ? 'block' : 'none' }}
          />
          
          {/* Placeholder when map is loading or errored */}
          {(!mapLoaded || mapError) && (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {mapError || 'Loading Google Maps...'}
                </p>
                {mapError && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please ensure VITE_GOOGLE_MAPS_API_KEY is set in your .env file
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{clinic.name}</h3>
                  <p className="text-sm text-muted-foreground">{clinic.distance} away</p>
                </div>
                <Button size="sm">Get Directions</Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{clinic.hours}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapComponent;
