import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createAppointment } from '@/lib/api';

const doctors = [
  'Dr. Sarah Johnson - Dermatologist',
  'Dr. Michael Chen - Ophthalmologist',
  'Dr. Emily Williams - General Physician',
  'Dr. James Brown - Dermatologist'
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const AppointmentForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState<Date>();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to book an appointment');
      return;
    }
    
    if (!date || !selectedDoctor || !selectedTime || !clinicName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Extract doctor name and specialty
      const [doctorName, specialty] = selectedDoctor.split(' - ');
      
      // Format time to HH:MM
      const timeParts = selectedTime.split(' ');
      const time24 = timeParts[0];
      const isPM = timeParts[1] === 'PM';
      const [hours, minutes] = time24.split(':');
      let hour24 = parseInt(hours);
      if (isPM && hour24 !== 12) hour24 += 12;
      if (!isPM && hour24 === 12) hour24 = 0;
      const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes}`;
      
      await createAppointment({
        doctor_name: doctorName.trim(),
        specialty: specialty?.trim() || '',
        clinic_name: clinicName,
        date: format(date, 'yyyy-MM-dd'),
        time: formattedTime
      });
      
      toast.success('Appointment booked successfully!');
      
      // Reset form
      setDate(undefined);
      setSelectedDoctor('');
      setSelectedTime('');
      setClinicName('');
      setNotes('');
      
      // Call success callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Schedule a consultation with our healthcare professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="doctor">Select Doctor *</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor} value={doctor}>
                    {doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic">Clinic Name *</Label>
            <Input
              id="clinic"
              placeholder="Enter clinic name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe your symptoms or concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Book Appointment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
