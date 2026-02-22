import StatusBadge from "./StatusBadge";
import IssueImageUpload from "./IssueImageUpload";

export default function IssuePopup({ issue }) {
  return (
    <div className="p-2 space-y-2">
      <h3 className="font-bold">{issue.issue_type}</h3>
      <p>{issue.description}</p>

      <StatusBadge status={issue.status} />

      {issue.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {issue.images.map((img, i) => (
            <img
              key={i}
              src={`https://safexcity.onrender.com/uploads/issues/${img}`}
              className="rounded border"
            />
          ))}
        </div>
      )}

      <IssueImageUpload issueId={issue._id} />
    </div>
  );
}
