import { Sidebar } from "@/components/Navigation/Sidebar";
import { OfflineBadge } from "@/components/Status/OfflineBadge";
import { useEffect, useState } from "react";
import { listUsers, AdminUser, createUser, updateUser, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminUsers = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="text-xl font-bold">User Management</h1>
        <OfflineBadge />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="p-4 bg-card rounded-md border border-border">
          <UsersTable />
        </div>
      </main>
    </div>
  </div>
);

export default AdminUsers;

const UsersTable = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<{username: string; password: string; user_type: string}>({ username: '', password: '', user_type: 'evaluator' });

  useEffect(() => {
    (async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try { setUsers(await listUsers()); } finally { setLoading(false); }
  };

  const onCreate = async () => {
    try {
      await createUser({ username: creating.username, user_type: creating.user_type, is_active: true, password: creating.password });
      setCreating({ username: '', password: '', user_type: 'evaluator' });
      await refresh();
    } catch (e: any) { alert(e.message || 'Create failed'); }
  };

  const onToggleActive = async (u: AdminUser) => {
    try { await updateUser(u.id, { is_active: !u.is_active }); await refresh(); } catch (e: any) { alert(e.message || 'Update failed'); }
  };

  const onDelete = async (u: AdminUser) => {
    if (!confirm('Delete this user?')) return;
    try { await deleteUser(u.id); await refresh(); } catch (e: any) { alert(e.message || 'Delete failed'); }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading users...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/40 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div>
            <label className="text-xs">Username</label>
            <Input value={creating.username} onChange={e => setCreating({ ...creating, username: e.target.value })} placeholder="new username" />
          </div>
          <div>
            <label className="text-xs">Password</label>
            <Input type="password" value={creating.password} onChange={e => setCreating({ ...creating, password: e.target.value })} placeholder="password" />
          </div>
          <div>
            <label className="text-xs">User Type</label>
            <Input value={creating.user_type} onChange={e => setCreating({ ...creating, user_type: e.target.value })} placeholder="admin/evaluator/candidate" />
          </div>
          <div>
            <Button onClick={onCreate}>Create</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2">Username</th>
              <th className="py-2">Name</th>
              <th className="py-2">Type</th>
              <th className="py-2">Active</th>
              <th className="py-2"/>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-border">
                <td className="py-2">{u.username}</td>
                <td className="py-2">{[u.first_name, u.last_name].filter(Boolean).join(' ')}</td>
                <td className="py-2">{u.user_type || '-'}</td>
                <td className="py-2">{u.is_active ? 'Yes' : 'No'}</td>
                <td className="py-2 text-right">
                  <Button variant="ghost" size="sm" onClick={() => onToggleActive(u)}>{u.is_active ? 'Deactivate' : 'Activate'}</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(u)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


