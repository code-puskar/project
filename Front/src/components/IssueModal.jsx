import { useState, useEffect } from "react";

export default function IssueModal({ location, onClose, onSubmit }) {
  const [issue_type, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(3);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const issueData = {
      issue_type,
      description,
      latitude: location.lat,
      longitude: location.lng,
      // Fallback to clicked location when browser geolocation is unavailable
      user_latitude: userCoords?.lat ?? location.lat,
      user_longitude: userCoords?.lng ?? location.lng,
      rating,
    };

    onSubmit(issueData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-[500px] bg-dark-900 ring-1 ring-white/10 rounded-2xl shadow-2xl p-0 overflow-hidden scale-100 transition-transform">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-dark-800/50">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-1">New Report</p>
            <h2 className="text-xl font-semibold text-white">Report an Issue</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Issue Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Issue Type</label>
            <div className="relative">
              <select
                required
                className="w-full appearance-none rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                value={issue_type}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="" disabled>Select a type...</option>
                <option value="Pothole">Pothole</option>
                <option value="Garbage">Garbage Dump</option>
                <option value="Streetlight">Streetlight Outage</option>
                <option value="Water">Water Leakage</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              required
              placeholder="Describe the issue in detail..."
              className="w-full rounded-xl border border-white/10 bg-dark-800 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[120px] resize-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Severity Level</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRating(level)}
                  className={`
                    py-2 rounded-lg text-sm font-medium transition-all border
                    ${rating === level
                      ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20"
                      : "bg-dark-800 border-white/5 text-gray-400 hover:bg-dark-700 hover:text-gray-200"
                    }
                  `}
                >
                  {level === 1 && "Low"}
                  {level === 2 && "Med"}
                  {level === 3 && "High"}
                  {level === 4 && "Crit"}
                </button>
              ))}
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 bg-dark-800/50 border border-white/5 rounded-xl p-3">
            <div>
              <p className="text-gray-500 font-medium mb-0.5">Selected Location</p>
              <p className="font-mono text-gray-300">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-medium mb-0.5">Your Location</p>
              <p className="font-mono text-gray-300">{userCoords ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}` : "Locating..."}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all active:scale-95"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
