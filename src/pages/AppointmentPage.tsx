import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppointmentForm from '@/components/AppointmentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { getUserAppointments } from '@/lib/api';
import { toast } from 'sonner';

const AppointmentPage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchAppointments = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      const data = await getUserAppointments(currentUser.uid, 'Upcoming');
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentCreated = () => {
    fetchAppointments(); // Refresh the list after creating
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your healthcare appointments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AppointmentForm onSuccess={handleAppointmentCreated} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled consultations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                      <div>
                        <p className="font-semibold">{appointment.doctor_name}</p>
                        {appointment.specialty && (
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.clinic_name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {currentUser ? 'No upcoming appointments' : 'Please log in to view appointments'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentPage;
