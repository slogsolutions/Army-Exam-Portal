import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";

const Card = ({ title }: { title: string }) => (
  <div className="p-4 bg-card rounded-lg border border-border">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">Placeholder – implement evaluation UI.</p>
  </div>
);

const EvaluatorPortal = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Evaluator Portal</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Assignment Queue" />
          <Card title="Subjective Evaluation" />
          <Card title="Practical/Viva Marks Entry" />
          <Card title="Bulk Evaluation Tools" />
          <Card title="Progress Tracking" />
          <Card title="Vetting & Review" />
        </div>
      </main>
    </div>
  </div>
);

export default EvaluatorPortal;


