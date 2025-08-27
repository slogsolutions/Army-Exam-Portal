import { Sidebar } from "@/components/Navigation/Sidebar";

const AdminHome = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 p-6">Admin Home</div>
  </div>
);

export default AdminHome;
