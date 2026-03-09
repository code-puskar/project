import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIssues = async () => {
        try {
            const res = await api.get("/admin/issues");
            setIssues(res.data);
        } catch (err) {
            console.error("Failed to load issues", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

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
            fetchIssues(); // Refresh list to get updated status
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to resolve");
        }
    };


    if (loading) return <div className="text-gray-400">Loading issues...</div>;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Issue Management</h1>
                <p className="text-gray-400">Review, moderate, and resolve city issues reported by users.</p>
            </div>

            <div className="bg-dark-800 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-dark-900 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Issue Type & Title</th>
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
                                        <div className="font-semibold text-white">{issue.title || "No Title"}</div>
                                        <div className="text-xs text-gray-500 mt-1">{issue.issue_type}</div>
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No issues found in the database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
