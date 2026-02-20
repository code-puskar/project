import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "../services/api";

export default function IssueDrawer({ issue, onClose, onValidationSuccess, currentUserId }) {
    const [loading, setLoading] = useState(false);

    if (!issue) return null;

    const handleValidate = async () => {
        try {
            setLoading(true);
            await api.post(`/issues/${issue._id}/validate`);
            alert("Issue validated successfully!");
            onValidationSuccess(); // Refresh data
            onClose();
        } catch (err) {
            alert(err.response?.data?.detail || "Validation failed");
        } finally {
            setLoading(false);
        }
    };

    const isOwner = issue.user_id === currentUserId;
    const hasValidated = issue.validated_by?.includes(currentUserId);
    const canValidate = !isOwner && !hasValidated && issue.status === "Active";

    return (
        <AnimatePresence>
            {issue && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark-900 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
                    ${issue.issue_type === 'Pothole' ? 'bg-red-500/20 text-red-500' :
                                            issue.issue_type === 'Garbage' ? 'bg-orange-500/20 text-orange-500' :
                                                issue.issue_type === 'Streetlight' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    issue.issue_type === 'Water' ? 'bg-blue-500/20 text-blue-500' :
                                                        'bg-gray-500/20 text-gray-500'}
                  `}>
                                        {/* Icon based on type could go here */}
                                        <span className="font-bold text-lg">{issue.issue_type[0]}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{issue.issue_type}</h2>
                                        <p className="text-xs text-gray-400 font-mono">
                                            {new Date(issue.created_at).toLocaleDateString()} • {new Date(issue.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold border
                  ${issue.status === 'Verified' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                        issue.status === 'Resolved' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                            'bg-brand-500/10 border-brand-500/20 text-brand-400'}
                `}>
                                    {issue.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {issue.validations || 0} validations
                                </span>
                            </div>

                            {/* Map/Location Preview (Optional, or just text) */}
                            <div className="p-3 rounded-xl bg-dark-800/50 border border-white/5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                                <p className="text-sm text-gray-300 font-mono mt-1">
                                    {issue.location?.coordinates?.[1].toFixed(5)}, {issue.location?.coordinates?.[0].toFixed(5)}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <p className="mt-2 text-gray-300 leading-relaxed bg-dark-800/30 p-4 rounded-xl border border-white/5">
                                    {issue.description}
                                </p>
                            </div>

                            {/* Images */}
                            {issue.images && issue.images.length > 0 && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Photos</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {issue.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={`http://localhost:8000/uploads/issues/${img}`}
                                                className="rounded-xl border border-white/10 w-full h-32 object-cover hover:opacity-90 transition-opacity cursor-zoom-in"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-white/10">
                                {canValidate ? (
                                    <button
                                        onClick={handleValidate}
                                        disabled={loading}
                                        className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Validating..." : "Validate Issue (+1 Rep)"}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-3.5 px-4 bg-dark-800 border border-white/10 text-gray-500 font-medium rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isOwner ? "You reported this" : hasValidated ? "Already Validated" : "Validation Unavailable"}
                                    </button>
                                )}

                                {/* Helper text */}
                                {!isOwner && !hasValidated && (
                                    <p className="text-xs text-center text-gray-500 mt-3">
                                        Validating real issues verifies them and earns you reputation.
                                    </p>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
