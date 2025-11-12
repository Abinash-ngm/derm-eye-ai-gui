import { Link } from 'react-router-dom';
import { Activity, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <span className="font-bold">AI Health Scanner</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced AI-powered skin and eye disease detection system for early diagnosis and better health outcomes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/appointments" className="text-muted-foreground hover:text-foreground transition-colors">Appointments</Link></li>
              <li><Link to="/clinics" className="text-muted-foreground hover:text-foreground transition-colors">Find Clinics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/scan/skin" className="text-muted-foreground hover:text-foreground transition-colors">Skin Scanner</Link></li>
              <li><Link to="/scan/eye" className="text-muted-foreground hover:text-foreground transition-colors">Eye Scanner</Link></li>
              <li><Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">AI Chatbot</Link></li>
              <li><Link to="/history" className="text-muted-foreground hover:text-foreground transition-colors">Scan History</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Health Scanner. All rights reserved.</p>
          <p className="mt-2">This is a medical assistance tool. Please consult healthcare professionals for accurate diagnosis.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
