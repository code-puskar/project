import { useEffect, useState } from "react";
import api from "../services/api";

export default function Admin() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/admin/issues")
      .then(res => setIssues(res.data));
  }, []);

  const deleteIssue = async (id) => {
    await api.delete(`/admin/issues/${id}`);
    setIssues(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Moderation</h1>

      {issues.map(issue => (
        <div key={issue._id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{issue.issue_type}</h2>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>

          <button
            className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
            onClick={() => deleteIssue(issue._id)}
          >
            Remove Issue
          </button>
        </div>
      ))}
    </div>
  );
}
