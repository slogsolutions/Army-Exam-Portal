import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Eye } from "lucide-react";

interface ExamStatusItem {
  id: string;
  examCode: string;
  title: string;
  date: string;
  time: string;
  candidates: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  center: string;
}

export const ExamStatus = () => {
  const exams: ExamStatusItem[] = [
    {
      id: '1',
      examCode: 'EX2024001',
      title: 'Technical Trade Assessment - Level 3',
      date: '2024-01-15',
      time: '09:00 AM',
      candidates: 45,
      status: 'upcoming',
      center: 'Delhi Center'
    },
    {
      id: '2',
      examCode: 'EX2024002',
      title: 'Skill Competency Evaluation - Level 2',
      date: '2024-01-14',
      time: '02:00 PM',
      candidates: 38,
      status: 'ongoing',
      center: 'Mumbai Center'
    },
    {
      id: '3',
      examCode: 'EX2024003',
      title: 'Advanced Technical Assessment',
      date: '2024-01-13',
      time: '10:00 AM',
      candidates: 52,
      status: 'completed',
      center: 'Bangalore Center'
    },
    {
      id: '4',
      examCode: 'EX2024004',
      title: 'Basic Competency Test',
      date: '2024-01-16',
      time: '11:00 AM',
      candidates: 29,
      status: 'upcoming',
      center: 'Chennai Center'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: { variant: 'secondary' as const, text: 'Upcoming' },
      ongoing: { variant: 'default' as const, text: 'Ongoing' },
      completed: { variant: 'outline' as const, text: 'Completed' },
      cancelled: { variant: 'destructive' as const, text: 'Cancelled' }
    };
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant} className="text-xs">{config.text}</Badge>;
  };

  return (
    <Card className="shadow-soft border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Examination Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-primary">{exam.examCode}</span>
                    {getStatusBadge(exam.status)}
                  </div>
                  <h3 className="font-semibold text-foreground">{exam.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{exam.candidates} candidates</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{exam.center}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};