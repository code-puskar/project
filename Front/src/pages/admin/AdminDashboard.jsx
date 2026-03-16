import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load stats", err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="text-gray-400">Loading dashboard data...</div>;

    const statCards = [
        { title: "Total Issues", value: stats.total_issues, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { title: "Active Issues", value: stats.active_issues, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { title: "Verified", value: stats.verified_issues, color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/20" },
        { title: "Resolved", value: stats.resolved_issues, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
        { title: "Total Users", value: stats.total_users, color: "text-gray-300", bg: "bg-gray-500/10", border: "border-gray-500/20" },
    ];

    // Issue type breakdown for bar chart
    const issueTypeData = stats.issue_types || {};
    const maxTypeCount = Math.max(...Object.values(issueTypeData), 1);
    const typeColors = {
        Pothole: { bar: "bg-red-500", text: "text-red-400" },
        Garbage: { bar: "bg-orange-500", text: "text-orange-400" },
        Streetlight: { bar: "bg-yellow-500", text: "text-yellow-400" },
        Water: { bar: "bg-blue-500", text: "text-blue-400" },
        Other: { bar: "bg-gray-500", text: "text-gray-400" },
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard Overview</h1>
                    <p className="text-gray-400">System metrics and recent activity.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((s, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${s.border} ${s.bg} backdrop-blur-sm flex flex-col gap-2 relative overflow-hidden group`}>
                        <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-50 ${s.bg.replace('/10', '/50')}`}></div>
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{s.title}</span>
                        <span className={`text-4xl font-bold ${s.color}`}>{s.value}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Issue Type Breakdown Chart */}
                <div className="col-span-1 lg:col-span-2 bg-dark-800/50 border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500"></span> Issue Type Breakdown
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(issueTypeData).map(([type, count]) => (
                            <div key={type} className="flex items-center gap-4">
                                <span className={`text-sm font-medium w-24 ${typeColors[type]?.text || 'text-gray-400'}`}>{type}</span>
                                <div className="flex-1 h-8 bg-dark-900 rounded-lg overflow-hidden relative">
                                    <div
                                        className={`h-full rounded-lg transition-all duration-700 ${typeColors[type]?.bar || 'bg-gray-500'}`}
                                        style={{ width: `${Math.max((count / maxTypeCount) * 100, 2)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono text-gray-300 w-10 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                    {stats.banned_users > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                            <span className="text-xs text-red-400 font-semibold px-2 py-1 bg-red-500/10 rounded-md">
                                {stats.banned_users} banned user{stats.banned_users > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Recent Issues List */}
                <div className="bg-dark-800/50 border border-white/5 rounded-3xl p-6 flex flex-col max-h-[450px] overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500"></span> Recent Issues
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {stats.recent_issues.length === 0 ? <p className="text-sm text-gray-500">No issues reported yet.</p> :
                            stats.recent_issues.map(issue => (
                                <div key={issue._id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-200 text-sm">{issue.issue_type}</span>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${issue.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                                                issue.status === 'Verified' ? 'bg-brand-500/20 text-brand-400' : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "Unknown"} • {issue.issue_type}
                                    </div>
                                    {issue.description && (
                                        <div className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">{issue.description}</div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
