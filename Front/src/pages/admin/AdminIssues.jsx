import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const LIMIT = 20;

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const params = { skip: page * LIMIT, limit: LIMIT };
            if (statusFilter) params.status = statusFilter;
            if (typeFilter) params.issue_type = typeFilter;
            if (search) params.search = search;

            const res = await api.get("/admin/issues", { params });
            setIssues(res.data.issues || res.data);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error("Failed to load issues", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [page, statusFilter, typeFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchIssues();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this issue permanently?")) return;
        try {
            await api.delete(`/admin/issues/${id}`);
            fetchIssues();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.post(`/issues/${id}/resolve`);
            fetchIssues();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to resolve");
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Issue Management</h1>
                <p className="text-gray-400">Review, moderate, and resolve city issues reported by users.</p>
            </div>

            {/* Filters & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search descriptions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                    />
                </form>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Verified">Verified</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
                    className="bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                    <option value="">All Types</option>
                    <option value="Pothole">Pothole</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Streetlight">Streetlight</option>
                    <option value="Water">Water</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {loading ? (
                <div className="text-gray-400 text-center py-12">Loading issues...</div>
            ) : (
                <>
                    <div className="bg-dark-800 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="text-xs text-gray-400 uppercase bg-dark-900 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Issue Type & Description</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Reporter ID</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Validations</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {issues.map(issue => (
                                        <tr key={issue._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{issue.issue_type}</div>
                                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{issue.description || "No description"}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {issue.user_id?.slice(-6) || "Unknown"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${issue.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        issue.status === 'Verified' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' :
                                                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-dark-900 px-2 py-1 rounded-md border border-white/10 text-gray-300 font-mono">
                                                    {issue.validations || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {issue.status === 'Verified' && (
                                                    <button
                                                        onClick={() => handleResolve(issue._id)}
                                                        className="px-3 py-1.5 text-xs font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
                                                    >
                                                        Mark Resolved
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(issue._id)}
                                                    className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {issues.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No issues found matching your criteria.</td>
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
