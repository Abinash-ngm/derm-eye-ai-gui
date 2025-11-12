import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scan, Eye, Download, Share2 } from 'lucide-react';

const ScanHistoryPage = () => {
  const scanHistory = [
    {
      id: 1,
      type: 'skin',
      date: '2024-01-15',
      time: '14:30',
      diagnosis: 'Eczema (Dermatitis)',
      confidence: 87,
      severity: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200'
    },
    {
      id: 2,
      type: 'eye',
      date: '2024-01-12',
      time: '10:15',
      diagnosis: 'Cataracts (Early Stage)',
      confidence: 82,
      severity: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=200'
    },
    {
      id: 3,
      type: 'skin',
      date: '2024-01-08',
      time: '16:45',
      diagnosis: 'Psoriasis',
      confidence: 91,
      severity: 'high',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200'
    },
    {
      id: 4,
      type: 'skin',
      date: '2024-01-05',
      time: '11:20',
      diagnosis: 'No issues detected',
      confidence: 95,
      severity: 'low',
      imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200'
    },
    {
      id: 5,
      type: 'eye',
      date: '2024-01-02',
      time: '09:30',
      diagnosis: 'Conjunctivitis',
      confidence: 88,
      severity: 'medium',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200'
    }
  ];

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
          {scanHistory.map((scan) => (
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
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScanHistoryPage;
