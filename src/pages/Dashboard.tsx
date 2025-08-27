import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Clock,
  UserCheck
} from "lucide-react";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { ExamStatus } from "@/components/Dashboard/ExamStatus";
import { Sidebar } from "@/components/Navigation/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Examination Management Dashboard"
          subtitle="Offline Examination System for Multi-Center Operations"
          userRole="System Administrator"
          centerName="Central Command Center"
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Candidates"
              value="3,247"
              change={{ value: "+12% from last month", type: "increase" }}
              icon={Users}
              gradient="primary"
            />
            <StatsCard
              title="Active Exams"
              value="7"
              change={{ value: "3 ongoing", type: "neutral" }}
              icon={ClipboardList}
              gradient="warning"
            />
            <StatsCard
              title="Completed Exams"
              value="24"
              change={{ value: "+8% completion rate", type: "increase" }}
              icon={CheckCircle}
              gradient="success"
            />
            <StatsCard
              title="Pending Evaluations"
              value="156"
              change={{ value: "Awaiting review", type: "neutral" }}
              icon={AlertCircle}
              gradient="secondary"
            />
          </div>

          {/* Center Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Centers"
              value="58"
              change={{ value: "Out of 60 centers", type: "neutral" }}
              icon={TrendingUp}
              gradient="primary"
            />
            <StatsCard
              title="Today's Sessions"
              value="12"
              change={{ value: "6 completed, 6 scheduled", type: "neutral" }}
              icon={Calendar}
              gradient="success"
            />
            <StatsCard
              title="Average Session Time"
              value="2.5 hrs"
              change={{ value: "Within normal range", type: "neutral" }}
              icon={Clock}
              gradient="secondary"
            />
            <StatsCard
              title="Attendance Rate"
              value="94.2%"
              change={{ value: "+2% from last week", type: "increase" }}
              icon={UserCheck}
              gradient="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ExamStatus />
            </div>
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>

          {/* System Status */}
          <div className="bg-card rounded-lg p-6 shadow-soft border-0">
            <h3 className="font-semibold text-lg mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium text-success">Database Online</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">All systems operational</p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium text-success">Sync Status</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Last sync: 2 minutes ago</p>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="font-medium text-warning">Pending Actions</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">3 centers need attention</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;