import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  Shield, 
  Database,
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  active?: boolean;
  children?: SidebarItem[];
}

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['candidates', 'exams']);

  const menuItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      id: 'candidates',
      label: 'Candidate Management',
      icon: Users,
      children: [
        { id: 'register', label: 'Register Candidates', icon: Users, href: '/candidates/register' },
        { id: 'candidate-list', label: 'View Candidates', icon: Users, href: '/candidates' },
        { id: 'bulk-upload', label: 'Bulk Upload', icon: Database, href: '/candidates/upload' }
      ]
    },
    {
      id: 'exams',
      label: 'Examination',
      icon: ClipboardList,
      children: [
        { id: 'create-exam', label: 'Create Exam', icon: ClipboardList, href: '/exams/create' },
        { id: 'exam-list', label: 'Manage Exams', icon: ClipboardList, href: '/exams' },
        { id: 'conduct-exam', label: 'Conduct Exam', icon: ClipboardList, href: '/exams/conduct' }
      ]
    },
    {
      id: 'questions',
      label: 'Question Bank',
      icon: FileText,
      children: [
        { id: 'add-questions', label: 'Add Questions', icon: FileText, href: '/qbank/add' },
        { id: 'question-categories', label: 'Categories', icon: FileText, href: '/qbank/categories' },
        { id: 'import-questions', label: 'Import Questions', icon: Database, href: '/qbank/import' }
      ]
    },
    {
      id: 'evaluation',
      label: 'Evaluation',
      icon: BarChart3,
      children: [
        { id: 'evaluate', label: 'Evaluate Papers', icon: BarChart3, href: '/evaluation/papers' },
        { id: 'results', label: 'Results', icon: BarChart3, href: '/evaluation/results' },
        { id: 'reports', label: 'Reports', icon: BarChart3, href: '/evaluation/reports' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      children: [
        { id: 'users', label: 'User Management', icon: Users, href: '/admin/users' },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield, href: '/admin/roles' },
        { id: 'audit', label: 'Audit Logs', icon: Database, href: '/admin/audit' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings'
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const paddingLeft = level === 0 ? 'pl-4' : 'pl-8';

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal h-auto py-3",
            paddingLeft,
            item.active && "bg-accent text-accent-foreground font-medium",
            "hover:bg-accent/50 transition-colors"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              navigate(item.href);
            }
          }}
        >
          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <div key={child.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal h-auto py-2",
                    "pl-8",
                    location.pathname === child.href && "bg-accent text-accent-foreground font-medium",
                    "hover:bg-accent/50 transition-colors"
                  )}
                  onClick={() => child.href && navigate(child.href)}
                >
                  <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{child.label}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-card border-r border-border shadow-soft flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">OE</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Exam System</h2>
            <p className="text-xs text-muted-foreground">Offline Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      <div className="p-2 border-t border-border">
        <Button variant="ghost" className="w-full justify-start text-left font-normal h-auto py-3 pl-4 hover:bg-accent/50" onClick={signOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
};