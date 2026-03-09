import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminIssues from "./AdminIssues";
import AdminUsers from "./AdminUsers";
import api from "../../services/api";

export default function AdminLayout() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/");
                return;
            }
            try {
                const res = await api.get("/users/me");
                if (res.data.role !== "admin") {
                    navigate("/");
                } else {
                    setIsAdmin(true);
                }
            } catch (err) {
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, [navigate]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-dark-900 text-white">Loading...</div>;
    if (!isAdmin) return null;

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/";
    };

    const navItems = [
        { name: "Dashboard", path: "/admin", icon: "📊" },
        { name: "Issues", path: "/admin/issues", icon: "📝" },
        { name: "Users", path: "/admin/users", icon: "👥" }
    ];

    return (
        <div className="flex h-screen bg-dark-900 text-gray-200 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-800 border-r border-white/10 flex flex-col pt-6 shrink-0">
                <div className="px-6 pb-6 flex items-center gap-3 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">Admin Panel</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-brand-500/10 text-brand-400 font-semibold border border-brand-500/20" : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent"
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <span>🚪</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 to-transparent pointer-events-none"></div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 z-10">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/issues" element={<AdminIssues />} />
                        <Route path="/users" element={<AdminUsers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
