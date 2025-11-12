import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Download, Share2 } from 'lucide-react';

interface ResultCardProps {
  diseaseName: string;
  confidence: number;
  recommendations: string[];
  imageUrl?: string;
  severity?: 'low' | 'medium' | 'high';
}

const ResultCard = ({
  diseaseName,
  confidence,
  recommendations,
  imageUrl,
  severity = 'medium'
}: ResultCardProps) => {
  const severityColors = {
    low: 'bg-accent/20 text-accent border-accent/30',
    medium: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    high: 'bg-destructive/20 text-destructive border-destructive/30'
  };

  const confidenceColor = confidence >= 80 ? 'text-accent' : confidence >= 60 ? 'text-yellow-600' : 'text-destructive';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{diseaseName}</CardTitle>
            <CardDescription>AI Detection Results</CardDescription>
          </div>
          <Badge className={severityColors[severity]} variant="outline">
            {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Scan" className="w-full h-48 object-cover" />
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
            <p className={`text-3xl font-bold ${confidenceColor}`}>
              {confidence}%
            </p>
          </div>
          <div className="text-right">
            {confidence >= 80 ? (
              <CheckCircle2 className="h-12 w-12 text-accent" />
            ) : (
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-primary mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Important:</strong> This is an AI-assisted diagnosis tool. Please consult a qualified healthcare professional for accurate diagnosis and treatment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
