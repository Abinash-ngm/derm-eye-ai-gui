import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchNearbyClinics } from '@/lib/api';
import { toast } from 'sonner';

interface Clinic {
  name: string;
  address?: string;
  phone?: string;
  rating?: number;
  place_id?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const MapComponent = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(40.7128); // Default: New York
  const [longitude, setLongitude] = useState(-74.0060);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          fetchClinics(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Error getting location:', error);
          fetchClinics(); // Use default location
        }
      );
    } else {
      fetchClinics(); // Use default location
    }
  }, []);

  const fetchClinics = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchLat = lat || latitude;
      const searchLng = lng || longitude;
      
      const data = await searchNearbyClinics(searchLat, searchLng, 5000);
      
      if (data.clinics && data.clinics.length > 0) {
        setClinics(data.clinics);
        toast.success(`Found ${data.clinics.length} clinics nearby`);
      } else {
        setError('No clinics found in this area');
        toast.warning('No clinics found. Try a different location.');
      }
    } catch (err) {
      console.error('Error fetching clinics:', err);
      setError('Failed to load clinic data from backend.');
      toast.error('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchClinics();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Clinics</CardTitle>
          <CardDescription>Search for healthcare facilities near you</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Map Placeholder - Showing location info */}
          {!loading && !error && clinics.length > 0 && (
            <div className="w-full h-96 bg-muted rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold mb-2">📍 {clinics.length} Clinics Found</p>
                <p className="text-sm text-muted-foreground">Powered by Google Maps API</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="w-full h-96 bg-muted rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                <p className="text-muted-foreground">Searching for clinics...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="w-full h-96 bg-muted rounded-lg mb-6 flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-destructive" />
                <p className="text-muted-foreground mb-2">{error}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Make sure backend is running and GOOGLE_MAPS_API_KEY is configured
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinic List */}
      {!loading && clinics.length > 0 && (
        <div className="grid gap-4">
          {clinics.map((clinic, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{clinic.name}</h3>
                    {clinic.rating && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-yellow-500">⭐ {clinic.rating}</span>
                      </div>
                    )}
                  </div>
                  {clinic.geometry && (
                    <Button 
                      size="sm" 
                      onClick={() => window.open(
                        `https://www.google.com/maps/search/?api=1&query=${clinic.geometry?.location.lat},${clinic.geometry?.location.lng}`,
                        '_blank'
                      )}
                    >
                      Get Directions
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  {clinic.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${clinic.phone}`} className="hover:underline">
                        {clinic.phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
