import MapView from "../components/MapView";

export default function Dashboard({ onMapClick, issues, setIssues, onRequireLogin, searchLocation,
  issueFilter, }) {
  return (
    <MapView
      onMapClick={onMapClick}
      issues={issues}
      setIssues={setIssues}
      onRequireLogin={onRequireLogin}
      searchLocation={searchLocation}
      issueFilter={issueFilter}
    />
  );
}
