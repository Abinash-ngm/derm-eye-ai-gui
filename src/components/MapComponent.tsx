import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Nearby Clinics</CardTitle>
          <CardDescription>Locate healthcare facilities in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for Google Maps */}
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Google Maps integration placeholder
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect Google Maps API to display interactive map
              </p>
            </div>
          </div>
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
