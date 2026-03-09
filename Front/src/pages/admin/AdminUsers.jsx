import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBan = async (id) => {
        if (!window.confirm("Are you sure you want to ban this user? They will no longer be able to log in or post issues.")) return;
        try {
            await api.post(`/admin/users/${id}/ban`);
            fetchUsers();
        } catch (err) {
            alert("Failed to ban user");
        }
    };

    if (loading) return <div className="text-gray-400">Loading users...</div>;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
                <p className="text-gray-400">View registered users and ban abusive accounts.</p>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-dark-900 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">User Details</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Reputation</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">{user.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${user.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-brand-400 font-bold">
                                        {user.reputation || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_banned ? (
                                            <span className="text-xs text-red-500 font-semibold px-2 py-1 bg-red-500/10 rounded-md">Banned</span>
                                        ) : (
                                            <span className="text-xs text-green-500 font-semibold px-2 py-1 bg-green-500/10 rounded-md">Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {!user.is_banned && user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleBan(user._id)}
                                                className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                            >
                                                Ban User
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
