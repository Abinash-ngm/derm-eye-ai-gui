import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';

const ClinicMapPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Nearby Clinics</h1>
          <p className="text-muted-foreground">
            Locate healthcare facilities and hospitals in your area
          </p>
        </div>

        <MapComponent />
      </main>

      <Footer />
    </div>
  );
};

export default ClinicMapPage;
