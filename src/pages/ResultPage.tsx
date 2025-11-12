import { useLocation, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResultCard from '@/components/ResultCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ResultPage = () => {
  const location = useLocation();
  const { diseaseName, confidence, recommendations, imageUrl, severity, scanType } = location.state || {};

  // Fallback data if no state is passed
  const defaultData = {
    diseaseName: 'Sample Diagnosis',
    confidence: 85,
    recommendations: [
      'Consult a healthcare professional for proper diagnosis',
      'Monitor symptoms regularly',
      'Follow recommended treatment plans'
    ],
    severity: 'medium' as const,
    scanType: 'skin'
  };

  const data = location.state || defaultData;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to={scanType === 'eye' ? '/scan/eye' : '/scan/skin'}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scanner
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Scan Results</h1>
            <p className="text-muted-foreground">
              AI analysis complete - Review your results below
            </p>
          </div>

          <ResultCard
            diseaseName={data.diseaseName}
            confidence={data.confidence}
            recommendations={data.recommendations}
            imageUrl={data.imageUrl}
            severity={data.severity}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/appointments" className="block">
              <Button className="w-full" size="lg">
                Book Appointment
              </Button>
            </Link>
            <Link to="/history" className="block">
              <Button variant="outline" className="w-full" size="lg">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultPage;
