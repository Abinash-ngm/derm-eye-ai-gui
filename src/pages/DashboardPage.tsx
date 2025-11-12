import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Eye, Calendar, History, TrendingUp, Activity } from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  const quickActions = [
    {
      icon: <Scan className="h-6 w-6" />,
      title: 'Scan Skin',
      description: 'Detect skin conditions',
      link: '/scan/skin',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: 'Scan Eye',
      description: 'Check eye health',
      link: '/scan/eye',
      color: 'bg-accent/10 text-accent'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Book Appointment',
      description: 'Schedule with doctor',
      link: '/appointments',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: <History className="h-6 w-6" />,
      title: 'View History',
      description: 'Past scans & results',
      link: '/history',
      color: 'bg-accent/10 text-accent'
    }
  ];

  const recentScans = [
    { id: 1, type: 'Skin', date: '2024-01-15', result: 'No issues detected', confidence: 92 },
    { id: 2, type: 'Eye', date: '2024-01-10', result: 'Mild condition', confidence: 85 },
    { id: 3, type: 'Skin', date: '2024-01-05', result: 'Dermatitis detected', confidence: 78 }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser?.displayName || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your health monitoring dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 upcoming this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Good overall health</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your latest health screenings</CardDescription>
              </div>
              <Link to="/history">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${scan.type === 'Skin' ? 'bg-primary/10' : 'bg-accent/10'} flex items-center justify-center`}>
                      {scan.type === 'Skin' ? <Scan className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-accent" />}
                    </div>
                    <div>
                      <p className="font-medium">{scan.type} Scan</p>
                      <p className="text-sm text-muted-foreground">{scan.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{scan.result}</p>
                    <p className="text-xs text-muted-foreground">{scan.confidence}% confidence</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default DashboardPage;
