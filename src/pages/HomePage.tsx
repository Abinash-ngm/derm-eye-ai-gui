import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Eye, Calendar, MapPin, MessageCircle, History } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HomePage = () => {
  const features = [
    {
      icon: <Scan className="h-8 w-8" />,
      title: 'Skin Scanner',
      description: 'AI-powered skin disease detection from images',
      link: '/scan/skin',
      color: 'text-primary'
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Eye Scanner',
      description: 'Advanced eye disease screening technology',
      link: '/scan/eye',
      color: 'text-accent'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Appointments',
      description: 'Book consultations with healthcare professionals',
      link: '/appointments',
      color: 'text-primary'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Find Clinics',
      description: 'Locate nearby healthcare facilities',
      link: '/clinics',
      color: 'text-accent'
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'AI Chatbot',
      description: 'Get instant health advice from our AI assistant',
      link: '/chat',
      color: 'text-primary'
    },
    {
      icon: <History className="h-8 w-8" />,
      title: 'Scan History',
      description: 'View all your past scans and results',
      link: '/history',
      color: 'text-accent'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-medical-blue to-background">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Health Scanner
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced AI-powered skin and eye disease detection system for early diagnosis and better health outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Link key={index} to={feature.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className={`${feature.color} mb-4`}>
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full">
                        Learn More →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Upload or Capture Image</h3>
                  <p className="text-muted-foreground">
                    Take a photo using your device camera or upload an existing image of the affected area.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI model analyzes the image and detects potential diseases with high accuracy.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Get Results & Recommendations</h3>
                  <p className="text-muted-foreground">
                    Receive instant results with confidence levels and personalized recommendations for next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who trust AI Health Scanner for early disease detection
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
