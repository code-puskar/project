import MapView from "../components/MapView";

export default function Dashboard({
  onMapClick,
  issues,
  setIssues,
  onRequireLogin,
  searchLocation,
  issueFilter,
  setIssueFilter,
  mapStyleId,
  show3D,
  onStyleChange,
  onToggle3D,
  onIssueSelect,
}) {
  return (
    <MapView
      onMapClick={onMapClick}
      issues={issues}
      setIssues={setIssues}
      onRequireLogin={onRequireLogin}
      searchLocation={searchLocation}
      issueFilter={issueFilter}
      setIssueFilter={setIssueFilter}
      mapStyleId={mapStyleId}
      show3D={show3D}
      onStyleChange={onStyleChange}
      onToggle3D={onToggle3D}
      onIssueSelect={onIssueSelect}
    />
  );
}
