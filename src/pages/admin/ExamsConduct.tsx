import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";

const AdminExamsConduct = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">Conduct Exam</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="p-4 bg-card rounded-md border border-border">Placeholder — conduct operations.</div>
      </main>
    </div>
  </div>
);

export default AdminExamsConduct;


