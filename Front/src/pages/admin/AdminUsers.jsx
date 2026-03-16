import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const LIMIT = 20;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { skip: page * LIMIT, limit: LIMIT };
            if (search) params.search = search;

            const res = await api.get("/admin/users", { params });
            setUsers(res.data.users || res.data);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchUsers();
    };

    const handleBan = async (id) => {
        if (!window.confirm("Are you sure you want to ban this user? They will no longer be able to log in or post issues.")) return;
        try {
            await api.post(`/admin/users/${id}/ban`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to ban user");
        }
    };

    const handleUnban = async (id) => {
        if (!window.confirm("Are you sure you want to unban this user?")) return;
        try {
            await api.post(`/admin/users/${id}/unban`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to unban user");
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
                <p className="text-gray-400">View registered users, ban or unban accounts.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                />
            </form>

            {loading ? (
                <div className="text-gray-400 text-center py-12">Loading users...</div>
            ) : (
                <>
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
                                                {user.is_banned && user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleUnban(user._id)}
                                                        className="px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
                                                    >
                                                        Unban
                                                    </button>
                                                )}
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
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-gray-500">
                                Showing {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} of {total}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-dark-800 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← Prev
                                </button>
                                <span className="px-3 py-1.5 text-xs font-mono text-gray-400">
                                    {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-dark-800 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
