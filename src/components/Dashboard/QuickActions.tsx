import { Plus, FileText, Users, BarChart3, Upload, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: 'primary' | 'secondary' | 'success' | 'warning';
  onClick: () => void;
}

export const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions: QuickAction[] = [
    {
      title: "Create Exam",
      description: "Set up a new examination",
      icon: Plus,
      variant: 'primary',
      onClick: () => navigate('/exams/create')
    },
    {
      title: "Register Candidates",
      description: "Add new candidates to the system",
      icon: Users,
      variant: 'success',
      onClick: () => navigate('/candidates/register')
    },
    {
      title: "Question Bank",
      description: "Manage examination questions",
      icon: FileText,
      variant: 'secondary',
      onClick: () => navigate('/questions')
    },
    {
      title: "View Reports",
      description: "Generate and view exam reports",
      icon: BarChart3,
      variant: 'warning',
      onClick: () => navigate('/reports')
    },
    {
      title: "Import Data",
      description: "Import questions or candidates",
      icon: Upload,
      variant: 'secondary',
      onClick: () => navigate('/import')
    },
    {
      title: "Export Results",
      description: "Export examination results",
      icon: Download,
      variant: 'primary',
      onClick: () => navigate('/export')
    }
  ];

  const getButtonVariant = (variant: string) => {
    switch (variant) {
      case 'primary': return 'default';
      case 'success': return 'secondary';
      case 'warning': return 'outline';
      default: return 'ghost';
    }
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={getButtonVariant(action.variant)}
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-medium transition-all"
              onClick={action.onClick}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};