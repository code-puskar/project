export default function IssueImageUpload({ issueId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/issues/${issueId}/upload-image`, formData);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" capture="environment" accept="image/*" onChange={e => setFile(e.target.files[0])} />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">
          ✅ Image uploaded successfully
        </p>
      )}
    </div>
  );
}
