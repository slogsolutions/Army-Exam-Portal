import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  gradient?: 'primary' | 'success' | 'warning' | 'secondary';
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  gradient = 'primary' 
}: StatsCardProps) => {
  const gradientClasses = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-warning',
    secondary: 'bg-gradient-secondary'
  };

  const changeColorClasses = {
    increase: 'text-success',
    decrease: 'text-danger',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card className="hover:shadow-medium transition-all duration-200 border-0 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {change && (
                <p className={`text-sm font-medium ${changeColorClasses[change.type]}`}>
                  {change.value}
                </p>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${gradientClasses[gradient]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};