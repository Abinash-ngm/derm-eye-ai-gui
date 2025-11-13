import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadComponent from '@/components/UploadComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeEyeImage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const EyeScannerPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get auth token if user is logged in
      const authToken = currentUser ? await currentUser.getIdToken() : undefined;
      
      // Call the API with optional auth token
      const result = await analyzeEyeImage(selectedFile, authToken);
      
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
      navigate('/result', {
        state: {
          diseaseName: result.disease_name || 'Unknown Condition',
          confidence: result.confidence || 0,
          recommendations: result.recommendations || ['Consult an ophthalmologist'],
          imageUrl: URL.createObjectURL(selectedFile),
          severity: result.severity || 'medium',
          scanType: 'eye'
        }
      });
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to mock data if API fails
      toast.warning('Using demo data - Backend API not connected');
      
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/result', {
          state: {
            diseaseName: 'Cataracts (Early Stage)',
            confidence: 82,
            recommendations: [
              'Schedule an appointment with an ophthalmologist immediately',
              'Get a comprehensive eye examination',
              'Discuss treatment options including surgery if needed',
              'Protect eyes from UV light with sunglasses',
              'Monitor vision changes regularly',
              'Consider lifestyle modifications to slow progression'
            ],
            imageUrl: URL.createObjectURL(selectedFile),
            severity: 'medium',
            scanType: 'eye'
          }
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Eye Disease Scanner</h1>
            <p className="text-muted-foreground">
              Upload or capture an image of your eye for AI-powered disease detection
            </p>
          </div>

          <div className="space-y-6">
            <UploadComponent onImageSelect={setSelectedFile} />

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>For accurate eye analysis, please follow these steps</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Use bright, even lighting to capture the eye clearly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Keep your eye wide open and look directly at the camera</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Ensure the entire eye is in frame and in focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Avoid glare or reflections from the camera flash</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Take the photo from a distance of about 10-15 cm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Remove glasses or contact lenses before capturing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button 
              onClick={handleAnalyze} 
              className="w-full" 
              size="lg"
              disabled={!selectedFile || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Eye Image...
                </>
              ) : (
                'Analyze Eye Image'
              )}
            </Button>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Medical Disclaimer:</strong> This AI screening tool is for preliminary assessment only. Eye conditions can be serious and require professional evaluation. Please consult an ophthalmologist for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EyeScannerPage;
