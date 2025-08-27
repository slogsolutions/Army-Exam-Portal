import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";
import { useEffect, useState } from "react";
import { listExams, Exam, deleteExam, updateExam } from "@/lib/api";
import { Button } from "@/components/ui/button";

const AdminExamsManage = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Manage Exams</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="p-4 bg-card rounded-md border border-border">
          <ExamsTable />
        </div>
      </main>
    </div>
  </div>
);

export default AdminExamsManage;

const ExamsTable = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await listExams();
      setExams(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onDelete = async (id: number) => {
    if (!confirm('Delete this exam?')) return;
    try {
      await deleteExam(id);
      await refresh();
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading exams...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Exams</h2>
        <a href="/exams/create"><Button size="sm">Create Exam</Button></a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2">Title</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Marks</th>
              <th className="py-2">Active</th>
              <th className="py-2"/>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam.id} className="border-t border-border">
                <td className="py-2">{exam.title}</td>
                <td className="py-2">{exam.duration_minutes} mins</td>
                <td className="py-2">{exam.total_marks}</td>
                <td className="py-2">{exam.is_active ? 'Yes' : 'No'}</td>
                <td className="py-2 text-right">
                  <Button variant="ghost" size="sm" onClick={async () => { await updateExam(exam.id, { is_active: !exam.is_active }); await refresh(); }}>Toggle Active</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(exam.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


