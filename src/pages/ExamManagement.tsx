import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Navigation/Sidebar";
import { Plus, FileText, Calendar, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Exam, listExams } from "@/lib/api";

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await listExams();
        setExams(data);
      } catch (e) {
        // keep UI usable even if fetch fails
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusBadge = (active: boolean) => {
    const config = active ? { variant: 'default' as const, text: 'Active' } : { variant: 'outline' as const, text: 'Inactive' };
    return <Badge variant={config.variant} className="text-xs">{config.text}</Badge>;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border shadow-soft">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Exam Management</h1>
                <p className="text-muted-foreground">Create and manage examinations</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Exam
              </Button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Exam List */}
            <Card className="shadow-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Examinations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-sm text-muted-foreground">Loading exams...</div>
                ) : (
                  <div className="space-y-4">
                    {exams.map((exam) => (
                      <div key={exam.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm text-primary">#{exam.id}</span>
                              {getStatusBadge(exam.is_active)}
                            </div>
                            <h3 className="font-semibold text-foreground">{exam.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{exam.duration_minutes} minutes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{exam.total_marks} marks</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>— candidates</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{exam.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {exams.length === 0 && (
                      <div className="text-sm text-muted-foreground">No exams yet.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamManagement;
