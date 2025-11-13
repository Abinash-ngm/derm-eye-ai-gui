import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadComponent from '@/components/UploadComponent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeSkinImage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SkinScannerPage = () => {
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
      const result = await analyzeSkinImage(selectedFile, authToken);
      
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
      navigate('/result', {
        state: {
          diseaseName: result.disease_name || 'Unknown Condition',
          confidence: result.confidence || 0,
          recommendations: result.recommendations || ['Consult a dermatologist'],
          imageUrl: URL.createObjectURL(selectedFile),
          severity: result.severity || 'medium',
          scanType: 'skin'
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
            diseaseName: 'Eczema (Dermatitis)',
            confidence: 87,
            recommendations: [
              'Consult a dermatologist for professional diagnosis',
              'Keep the affected area moisturized',
              'Avoid harsh soaps and irritants',
              'Consider using hypoallergenic skincare products',
              'Monitor for any changes in symptoms'
            ],
            imageUrl: URL.createObjectURL(selectedFile),
            severity: 'medium',
            scanType: 'skin'
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
            <h1 className="text-3xl font-bold mb-2">Skin Disease Scanner</h1>
            <p className="text-muted-foreground">
              Upload or capture an image of your skin condition for AI-powered analysis
            </p>
          </div>

          <div className="space-y-6">
            <UploadComponent onImageSelect={setSelectedFile} />

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>For best results, follow these guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensure good lighting when taking the photo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Focus clearly on the affected area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keep a distance of 15-20 cm from the skin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Avoid shadows and reflections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use a plain background if possible</span>
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
                  Analyzing Image...
                </>
              ) : (
                'Analyze Image'
              )}
            </Button>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Medical Disclaimer:</strong> This AI tool is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkinScannerPage;
