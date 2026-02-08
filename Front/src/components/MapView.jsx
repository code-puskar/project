import { MapContainer, TileLayer,useMap,Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { redIcon, orangeIcon, greenIcon } from "../utils/leafletIcon";
import api from "../services/api";
import MapClickHandler from "./MapClickHandler";

export default function MapView({ onMapClick, issues, setIssues, onRequireLogin, searchLocation,
  issueFilter, }) {
  const [position, setPosition] = useState(null);
  const watchIdRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 14);
    }
  }, [location]);

  return null;
}
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // 🔹 Fetch issues only first time
        if (!issues.length) {
          fetchIssues(latitude, longitude);
        }
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    // 🧹 Cleanup watcher
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);


  const fetchIssues = async (lat, lng) => {
    try {
      const res = await api.get(`/issues/nearby?lat=${lat}&lng=${lng}`);
      setIssues(res.data);
      // reset alerted issues so user can be notified about new nearby issues
      alertedIssuesRef.current = new Set();
    } catch (err) {
      console.error("Failed to fetch issues", err);
    }
  };

  const getIcon = (issue) => {
    if (issue.status === "Verified") return greenIcon;
    if (issue.validations > 0) return orangeIcon;
    return redIcon;
  };
   const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // meters
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const alertedIssuesRef = useRef(new Set());
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (!position?.length || !issues?.length) return;
    const [latitude, longitude] = position;

    issues.forEach((issue) => {
      if (!issue.location?.coordinates) return;

      const [lng, lat] = issue.location.coordinates;
      const distance = getDistanceInMeters(
        latitude,
        longitude,
        lat,
        lng
      );

      // 🔔 200 meters radius
      if (distance <= 200 && !alertedIssuesRef.current.has(issue._id)) {
        alertedIssuesRef.current.add(issue._id);

        // 🔔 Non-blocking Notification
        addNotification(`⚠️ Nearby Issue: ${issue.issue_type} — ${Math.round(distance)}m away`);
      }
    });
  }, [position, issues]);

  const handleValidate = async (issueId) => {
    if (!token) {
      if (typeof onRequireLogin === "function") onRequireLogin();
      return;
    }

    try {
      await api.post(
        `/issues/${issueId}/validate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchIssues(position[0], position[1]);
    } catch (err) {
      alert(err.response?.data?.detail || "Validation failed");
    }
  };

  if (!position) return <p>Locating you...</p>;

  return (
    <div className="relative z-0">
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded shadow">
              {n.message}
            </div>
          ))}
        </div>
      )}

      <MapContainer
        center={position}
        zoom={14}
        className="w-full h-screen"
        dragging
        scrollWheelZoom
        doubleClickZoom
      >
        {searchLocation && <FlyToLocation location={searchLocation} />}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🟢 USER LIVE LOCATION */}
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
         
        {/* Click to create issue */}
        <MapClickHandler onMapClick={onMapClick} />

        {/* Existing Issues */}
        {issues
          .filter((issue) =>
            issueFilter ? issue.issue_type === issueFilter : true
          )
          .map((issue) => {
            if (!issue.location?.coordinates) return null;

            const [lng, lat] = issue.location.coordinates;
            const isOwner = issue.created_by === user?.id;

            return (
              <Marker key={issue._id} icon={getIcon(issue)} position={[lat, lng]}>
                <Popup>
                  <div className="space-y-1 text-sm">
                    <strong className="block text-base">
                      {issue.issue_type}
                    </strong>

                    <p>{issue.description}</p>

                    <p>
                      Status:{" "}
                      <b
                        className={
                          issue.status === "Verified"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {issue.status}
                      </b>
                    </p>

                    <p>Validations: {issue.validations || 0}</p>

                    {issue.status === "Active" && (
                      <button
                        disabled={isOwner}
                        onClick={() => handleValidate(issue._id)}
                        className={`mt-1 w-full py-1 rounded text-white ${
                          isOwner
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isOwner ? "Your Issue" : "Validate Issue"}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}









































































// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { defaultIcon } from "../utils/leafletIcon";
// import MapClickHandler from "./MapClickHandler";

// export default function MapView({ onMapClick, issues, setIssues }) {
//   const [position, setPosition] = useState(null);
  
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setPosition([latitude, longitude]);

//         try {
//           const res = await api.get(
//             `/issues/nearby?lat=${latitude}&lng=${longitude}`
//           );
//           setIssues(res.data);
//         } catch (err) {
//           console.error("Failed to fetch issues", err);
//         }
//       },
//       (err) => console.error(err),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   if (!position) return <p>Loading map...</p>;

//   return (
//     <div className="relative z-0">
//       <MapContainer
//         center={position}
//         zoom={14}
//         className="w-full h-screen"
//         dragging
//         scrollWheelZoom
//         doubleClickZoom
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* ✅ THIS WAS MISSING */}
//         <MapClickHandler onMapClick={onMapClick} />

//         {/* ✅ Existing Issues */}
//         {issues.map((issue) => {
//           if (!issue.location?.coordinates) return null;

//           const [lng, lat] = issue.location.coordinates;

//           return (
//             <Marker
//               key={issue._id}
//               position={[lat, lng]}
//               icon={defaultIcon}
//             >
//               <Popup>
//                 <strong>{issue.issue_type}</strong>
//                 <br />
//                 {issue.description}
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MapContainer>
//     </div>
//   );
// }
