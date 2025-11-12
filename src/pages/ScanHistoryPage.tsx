import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scan, Eye, Download, Share2, Loader2 } from 'lucide-react';

const ScanHistoryPage = () => {
  const { currentUser } = useAuth();
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // TODO: Fetch scan history from backend
      // const data = await fetch(`${API_ENDPOINTS.baseUrl}/detect/history/${currentUser.uid}`);
      setScanHistory([]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const severityColors = {
    low: 'bg-accent/20 text-accent',
    medium: 'bg-yellow-500/20 text-yellow-600',
    high: 'bg-destructive/20 text-destructive'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            View all your past scans and results
          </p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
            <Card key={scan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={scan.imageUrl}
                    alt="Scan"
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {scan.type === 'skin' ? (
                            <Scan className="h-5 w-5 text-primary" />
                          ) : (
                            <Eye className="h-5 w-5 text-accent" />
                          )}
                          <h3 className="font-semibold text-lg">{scan.diagnosis}</h3>
                          <Badge className={severityColors[scan.severity as keyof typeof severityColors]}>
                            {scan.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scan.date} at {scan.time}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                        <p className="text-2xl font-bold text-primary">{scan.confidence}%</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link to="/result" state={{ 
                        diseaseName: scan.diagnosis,
                        confidence: scan.confidence,
                        severity: scan.severity,
                        imageUrl: scan.imageUrl,
                        scanType: scan.type,
                        recommendations: [
                          'Consult a healthcare professional',
                          'Monitor symptoms regularly',
                          'Follow recommended treatment plans'
                        ]
                      }}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Scan className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Scan History</h3>
                <p className="text-muted-foreground mb-4">
                  {currentUser 
                    ? 'Start by scanning your skin or eyes to build your health history'
                    : 'Please log in to view your scan history'
                  }
                </p>
                {currentUser && (
                  <div className="flex gap-3 justify-center">
                    <Link to="/scan/skin">
                      <Button>
                        <Scan className="h-4 w-4 mr-2" />
                        Scan Skin
                      </Button>
                    </Link>
                    <Link to="/scan/eye">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Scan Eye
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScanHistoryPage;
