import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";

const Section = ({ title }: { title: string }) => (
  <div className="p-4 bg-card rounded-lg border border-border">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">Placeholder – connect to backend endpoints.</p>
  </div>
);

const AdminPortal = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <h1 className="text-xl font-bold">Administrator Portal</h1>
          <OfflineBadge />
        </div>
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <Section title="Dashboard & Analytics" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="User Management" />
            <Section title="Question Bank" />
            <Section title="Exam Scheduling" />
            <Section title="Center Management" />
            <Section title="Result Compilation" />
            <Section title="Export / Import" />
            <Section title="Audit Logs" />
            <Section title="System Health" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;


