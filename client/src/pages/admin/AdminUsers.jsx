import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import { fetchAllUsers, updateUserAdmin, deleteUserAdmin } from '../../services/adminService';
import { CardRowSkeleton } from '../../components/Skeletons';
import { formatDate } from '../../utils/formatters';
import useDebounce from '../../hooks/useDebounce';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const load = () => {
    setLoading(true);
    fetchAllUsers({ search: debouncedSearch })
      .then(({ data }) => setUsers(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const toggleActive = async (user) => {
    try {
      await updateUserAdmin(user._id, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const changeRole = async (user, role) => {
    try {
      await updateUserAdmin(user._id, { role });
      toast.success('Role updated');
      load();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUserAdmin(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold">User Management</h3>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-9 !py-2 text-sm" />
        </div>
      </div>

      {loading ? (
        <CardRowSkeleton count={5} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs uppercase text-slate-400">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3">
                    <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-xs">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(u._id)} className="text-slate-400 hover:text-red-500">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
