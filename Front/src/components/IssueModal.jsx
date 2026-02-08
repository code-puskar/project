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
      user_latitude: userCoords?.lat,
      user_longitude: userCoords?.lng,
      rating,
    };

    onSubmit(issueData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">Report an Issue</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Issue type (e.g. Pothole)"
            className="w-full border p-2 rounded"
            value={issue_type}
            onChange={(e) => setIssueType(e.target.value)}
          />

          <textarea
            required
            placeholder="Describe the issue"
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            required
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={1}>Severity: Low</option>
            <option value={2}>Severity: Medium</option>
            <option value={3}>Severity: High</option>
            <option value={4}>Severity: Critical</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
