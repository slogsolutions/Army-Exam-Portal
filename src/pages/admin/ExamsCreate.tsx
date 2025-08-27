import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";
import { useState } from "react";
import { createExam } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminExamsCreate = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Create Exam</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="p-4 bg-card rounded-md border border-border">
          <CreateExamForm />
        </div>
      </main>
    </div>
  </div>
);

export default AdminExamsCreate;

const CreateExamForm = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [marks, setMarks] = useState(100);
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);
      await createExam({ title, duration_minutes: duration, total_marks: marks, is_active: true });
      window.location.href = '/exams';
    } catch (e: any) {
      alert(e.message || 'Failed to create exam');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm">Title</label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Exam title" />
      </div>
      <div>
        <label className="text-sm">Duration (minutes)</label>
        <Input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value || '0', 10))} />
      </div>
      <div>
        <label className="text-sm">Total Marks</label>
        <Input type="number" value={marks} onChange={e => setMarks(parseInt(e.target.value || '0', 10))} />
      </div>
      <Button onClick={onSubmit} disabled={saving}>{saving ? 'Saving...' : 'Create Exam'}</Button>
    </div>
  );
};


