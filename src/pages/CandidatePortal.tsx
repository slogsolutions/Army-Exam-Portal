import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const Timer = ({ minutes = 60 }: { minutes?: number }) => {
  const [remaining, setRemaining] = useState<number>(minutes * 60);
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => {
    ref.current = window.setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(ref.current);
  }, []);
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  return <div className="font-mono text-sm">Time: {mm}:{ss}</div>;
};

const CandidatePortal = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [current, setCurrent] = useState<number>(1);

  const save = (qid: number, ans: string) => {
    const next = { ...answers, [qid]: ans };
    setAnswers(next);
    localStorage.setItem('examAnswers', JSON.stringify(next));
  };

  const toggleMark = (qid: number) => setMarked(m => ({ ...m, [qid]: !m[qid] }));

  const questions = Array.from({ length: 10 }).map((_, i) => ({ id: i + 1, text: `Question ${i + 1} text...` }));

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <h1 className="text-xl font-bold">Candidate Portal</h1>
          <div className="flex items-center gap-4">
            <Timer minutes={60} />
            <OfflineBadge />
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <h3 className="font-semibold mb-2">{questions[current - 1].text}</h3>
              <textarea
                className="w-full h-32 bg-background border border-border rounded-md p-2 text-sm"
                value={answers[current] || ''}
                onChange={(e) => save(current, e.target.value)}
                placeholder="Type your answer..."
              />
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => toggleMark(current)}>
                  {marked[current] ? 'Unmark' : 'Mark for Review'}
                </Button>
                <Button size="sm" onClick={() => setCurrent(Math.max(1, current - 1))}>Prev</Button>
                <Button size="sm" onClick={() => setCurrent(Math.min(questions.length, current + 1))}>Next</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-4 bg-card rounded-lg border border-border">
                <h4 className="font-semibold mb-2 text-sm">Admit Card</h4>
                <Button size="sm" variant="outline">Download</Button>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h4 className="font-semibold mb-2 text-sm">Instructions</h4>
                <Button size="sm" variant="outline">View</Button>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h4 className="font-semibold mb-2 text-sm">Results</h4>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-card rounded-lg border border-border">
              <h4 className="font-semibold mb-2 text-sm">Questions</h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map(q => (
                  <button
                    key={q.id}
                    className={
                      'h-8 text-xs rounded border ' +
                      (current === q.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border') +
                      (marked[q.id] ? ' ring-2 ring-yellow-400' : '')
                    }
                    onClick={() => setCurrent(q.id)}
                  >
                    {q.id}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border text-sm text-muted-foreground">
              Answers autosave locally every change.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidatePortal;


