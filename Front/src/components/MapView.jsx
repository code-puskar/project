import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../services/api";
import { defaultIcon } from "../utils/leafletIcon";

export default function MapView() {
  const [issues, setIssues] = useState([]);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        const res = await api.get(
          `/issues/nearby?lat=${latitude}&lng=${longitude}`
        );

        setIssues(res.data);
      },
      err => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!position) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={position}
      zoom={14}
      className="w-full h-screen"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User marker */}
      <Marker position={position} icon={defaultIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Issue markers */}
      {issues.map((issue, i) => (
        <Marker
          key={i}
          position={[
            issue.location.coordinates[1],
            issue.location.coordinates[0]
          ]}
          icon={defaultIcon}
        >
          <Popup>
            <b>{issue.issue_type}</b>
            <p>{issue.description}</p>
            <p>Status: {issue.status}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
