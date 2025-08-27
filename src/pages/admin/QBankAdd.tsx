import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";
import { useEffect, useState } from "react";
import { listQuestions, Question, createQuestion } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AdminQBankAdd = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Add Questions</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="p-4 bg-card rounded-md border border-border space-y-4">
          <NewQuestionForm onCreated={() => window.location.reload()} />
          <QuestionsList />
        </div>
      </main>
    </div>
  </div>
);

export default AdminQBankAdd;

const NewQuestionForm = ({ onCreated }: { onCreated: () => void }) => {
  const [question_text, setText] = useState("");
  const [question_type, setType] = useState("multiple_choice");
  const [marks, setMarks] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    try {
      setSaving(true);
      await createQuestion({ question_text, question_type, marks });
      setText("");
      setType("multiple_choice");
      setMarks(1);
      onCreated();
    } catch (e: any) {
      alert(e.message || 'Failed to create question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 bg-muted/40 rounded-md grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
      <div>
        <label className="text-xs">Question Text</label>
        <Input value={question_text} onChange={e => setText(e.target.value)} placeholder="Type question..." />
      </div>
      <div>
        <label className="text-xs">Type</label>
        <Input value={question_type} onChange={e => setType(e.target.value)} placeholder="multiple_choice/true_false/essay" />
      </div>
      <div>
        <label className="text-xs">Marks</label>
        <Input type="number" value={marks} onChange={e => setMarks(parseInt(e.target.value || '0', 10))} />
      </div>
      <div>
        <Button onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Add Question'}</Button>
      </div>
    </div>
  );
};

const QuestionsList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listQuestions();
        setQuestions(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading questions...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Question Bank</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2">Text</th>
              <th className="py-2">Type</th>
              <th className="py-2">Marks</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id} className="border-t border-border">
                <td className="py-2">{q.question_text}</td>
                <td className="py-2">{q.question_type}</td>
                <td className="py-2">{q.marks ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


