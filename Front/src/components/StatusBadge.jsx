export default function StatusBadge({ status }) {
  const colors = {
    OPEN: "bg-red-500",
    IN_PROGRESS: "bg-yellow-500",
    RESOLVED: "bg-green-500",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${colors[status] || "bg-gray-500"}`}
    >
      {status}
    </span>
  );
}
