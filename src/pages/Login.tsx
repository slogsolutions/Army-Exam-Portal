import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  User, 
  Lock, 
  Monitor, 
  Database, 
  Wifi,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import examCenterHero from "@/assets/exam-center-hero.jpg";

const Login = () => {
  const [loginType, setLoginType] = useState<'admin' | 'evaluator' | 'candidate'>('admin');

  const systemStatus = [
    { label: "Database", status: "online", icon: Database },
    { label: "Local Network", status: "connected", icon: Wifi },
    { label: "Security", status: "active", icon: Shield },
    { label: "Monitoring", status: "enabled", icon: Monitor }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${examCenterHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark/90" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Offline Examination Management System
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Secure, scalable examination system for 1800+ candidates across 60+ centers
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Multi-Center Support</h3>
                  <p className="text-sm text-white/80">Simultaneous examinations across multiple locations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Offline Operation</h3>
                  <p className="text-sm text-white/80">Fully functional without internet connectivity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* System Status */}
          <div className="bg-card rounded-lg p-4 shadow-soft border-0">
            <h3 className="font-semibold text-sm text-foreground mb-3">System Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {systemStatus.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <Card className="shadow-medium border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Access Control</CardTitle>
              <p className="text-muted-foreground">Secure login to examination system</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">User Type</Label>
                <div className="flex space-x-2">
                  {[
                    { type: 'admin', label: 'Administrator', icon: Shield },
                    { type: 'evaluator', label: 'Evaluator', icon: User },
                    { type: 'candidate', label: 'Candidate', icon: User }
                  ].map(({ type, label, icon: Icon }) => (
                    <Button
                      key={type}
                      variant={loginType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLoginType(type as any)}
                      className="flex-1"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username / ID</Label>
                  <Input 
                    id="username" 
                    placeholder={loginType === 'candidate' ? 'Enter Army Number' : 'Enter username'}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter password"
                    className="h-11"
                  />
                </div>
                
                {loginType === 'candidate' && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">Candidate Instructions</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Use your Army Number and provided password. Ensure you have your admit card ready.
                      </p>
                    </div>
                  </div>
                )}

                <Button className="w-full h-11" size="lg">
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Login
                </Button>
              </div>

              {/* Additional Options */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Having issues? Contact system administrator
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Version 1.0
                  </Badge>
                  <Badge variant="success" className="text-xs">
                    Offline Mode
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;