import DeckMap from "./DeckMap";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

export default function MapView({
  onMapClick,
  issues,
  setIssues,
  onRequireLogin,
  searchLocation,
  issueFilter,
  mapStyleId,
  onStyleChange,
  show3D,
  onToggle3D,
}) {
  const [position, setPosition] = useState(null);
  const watchIdRef = useRef(null);
  const [showIssues, setShowIssues] = useState(true);
  const mapboxToken = "pk.eyJ1IjoidGhlZXF1aW5veGRldiIsImEiOiJjbWs1NXJpbG0wYXRkM2dxc2M4MWhoaDR2In0.aN-rLyueziuW3wJhQB2suw";
  const [centerRequest, setCenterRequest] = useState(null);

  // Directions state
  const [routeOpen, setRouteOpen] = useState(false);
  const [startQuery, setStartQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [destLocation, setDestLocation] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);


  const alertedIssuesRef = useRef(new Set());
  const [notifications, setNotifications] = useState([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [geoError, setGeoError] = useState(null);
  const hasCenteredRef = useRef(false);

  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Geolocation and initial issues fetch
  const followUserRef = useRef(followUser);

  useEffect(() => {
    followUserRef.current = followUser;
  }, [followUser]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        if (followUserRef.current) {
          // Center without forcing a zoom; initial center applies default zoom once
          setCenterRequest({
            lat: latitude,
            lng: longitude,
            zoom: hasCenteredRef.current ? undefined : 15,
          });
          hasCenteredRef.current = true;
        }
        setGeoError(null);
      },
      (err) => {
        console.error(err);
        setGeoError(err.message || "Location unavailable");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Also load full issue list once on mount to avoid nearby-only gaps
  useEffect(() => {
    fetchAllIssues();
  }, []);

  // Poll issues periodically to keep in sync across accounts
  useEffect(() => {
    const id = setInterval(() => {
      fetchAllIssues();
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // When follow-user is re-enabled, recenter once
  useEffect(() => {
    if (followUser && position) {
      setCenterRequest({ lat: position[0], lng: position[1], zoom: hasCenteredRef.current ? undefined : 15 });
      hasCenteredRef.current = true;
    }
  }, [followUser]);

  // If follow is toggled on later, recenter once
  useEffect(() => {
    if (followUser && position) {
      setCenterRequest({ lat: position[0], lng: position[1], zoom: Math.max(15, centerRequest?.zoom || 15) });
    }
  }, [followUser]);

  const fetchAllIssues = async () => {
    try {
      setIsLoadingIssues(true);
      const res = await api.get(`/issues/`);
      setIssues(res.data || []);
      alertedIssuesRef.current = new Set();
    } catch (err) {
      console.error("Failed to fetch issues", err);
      addNotification("Could not refresh issues");
    } finally {
      setIsLoadingIssues(false);
    }
  };

  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
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

  const addNotification = (message) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Nearby issue alerts
  useEffect(() => {
    if (!position?.length || !issues?.length) return;
    const [latitude, longitude] = position;

    issues.forEach((issue) => {
      if (!issue.location?.coordinates) return;
      const [lng, lat] = issue.location.coordinates;
      const distance = getDistanceInMeters(latitude, longitude, lat, lng);
      if (distance <= 200 && !alertedIssuesRef.current.has(issue._id)) {
        alertedIssuesRef.current.add(issue._id);
        addNotification(`⚠️ Nearby Issue: ${issue.issue_type} — ${Math.round(distance)}m away`);
      }
    });
  }, [position, issues]);

  // Geocoding helpers
  const geocode = async (query) => {
    if (!query) return null;
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1&country=in`;
    if (position) {
      url += `&proximity=${position[1]},${position[0]}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (!data.features || !data.features.length) return null;
    const [lng, lat] = data.features[0].center;
    return { lat, lng, label: data.features[0].place_name };
  };

  const fetchSuggestions = async (query, setter) => {
    if (!query || query.length < 3) {
      setter([]);
      return;
    }
    // Limit increased to 20, enabled fuzzyMatch, restricted to India
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&limit=20&access_token=${mapboxToken}&fuzzyMatch=true&country=in`;
    if (position) {
      url += `&proximity=${position[1]},${position[0]}`;
    }



    try {
      const res = await fetch(url);
      const data = await res.json();



      const items =
        data.features?.map((f) => ({
          label: f.place_name,
          lat: f.center[1],
          lng: f.center[0],
        })) || [];
      setter(items);
    } catch (e) {
      console.error("Failed to fetch suggestions", e);
      setter([]);
    }
  };

  const fetchRoute = async (start, dest) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${dest.lng},${dest.lat}?geometries=geojson&overview=full&steps=false&access_token=${mapboxToken}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.routes || !data.routes.length) return null;
    const route = data.routes[0];
    return {
      path: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  };

  const handleValidate = async (issueId) => {
    if (!token) {
      if (typeof onRequireLogin === "function") onRequireLogin();
      return;
    }
    try {
      await api.post(
        `/issues/${issueId}/validate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllIssues();
    } catch (err) {
      alert(err.response?.data?.detail || "Validation failed");
    }
  };

  if (!position) return <p>Locating you...</p>;

  return (
    <div className="relative z-0 h-screen">
      {notifications.length > 0 && (
        <div className="fixed top-16 right-4 z-50 space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded shadow">
              {n.message}
            </div>
          ))}
        </div>
      )}

      <div className="absolute inset-0 z-40">
        <DeckMap
          position={position}
          issues={showIssues ? issues : []}
          mapboxToken={mapboxToken}
          mapStyleId={mapStyleId}
          show3D={show3D}
          searchLocation={searchLocation}
          issueFilter={issueFilter}
          currentUserId={user?.id}
          centerRequest={centerRequest}
          routePath={routePath}
          onUserInteract={() => setFollowUser(false)}
          onMapClick={(latlng) => {
            if (position) {
              const dist = getDistanceInMeters(position[0], position[1], latlng.lat, latlng.lng);
              if (dist > 300) {
                addNotification(`You can only report issues within 300m of your location. (Distance: ${Math.round(dist)}m)`);
                return;
              }
            }

            if (!token) {
              if (onRequireLogin) onRequireLogin();
              return;
            }
            if (!onMapClick) return;
            onMapClick(latlng);
          }}
          onIssueClick={(issueId) => {
            handleValidate(issueId);
          }}
        />
      </div>

      {/* 🧭 Unified Bottom-Left Control Dock */}
      <div className="absolute bottom-8 left-4 z-50 flex items-center gap-3">
        {/* Directions Toggle */}
        <button
          onClick={() => setRouteOpen((v) => !v)}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl shadow-lg border backdrop-blur-md transition-all active:scale-95 ${routeOpen
            ? "bg-brand-600 border-brand-400 text-white shadow-brand-500/30"
            : "bg-dark-900/80 border-white/10 text-gray-200 hover:bg-dark-800 hover:text-white"
            }`}
          title="Directions"
        >
          <svg className="w-6 h-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Locate Me */}
        <button
          onClick={() => setFollowUser((v) => !v)}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl shadow-lg border backdrop-blur-md transition-all active:scale-95 ${followUser
            ? "bg-accent-600 border-accent-400 text-white shadow-accent-500/30"
            : "bg-dark-900/80 border-white/10 text-gray-200 hover:bg-dark-800 hover:text-white"
            }`}
          title="Locate Me"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Refresh Issues */}
        <button
          onClick={fetchAllIssues}
          disabled={isLoadingIssues}
          className={`h-12 w-12 flex items-center justify-center rounded-2xl shadow-lg border backdrop-blur-md transition-all active:scale-95 bg-dark-900/80 border-white/10 text-gray-200 hover:bg-dark-800 hover:text-white ${isLoadingIssues ? "animate-pulse" : ""}`}
          title="Refresh Issues"
        >
          <svg className={`w-6 h-6 ${isLoadingIssues ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {geoError && (
        <div className="absolute bottom-24 left-4 z-50 bg-red-600/90 backdrop-blur text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-red-500/50">
          {geoError}
        </div>
      )}

      {/* 🗺️ Directions Panel */}
      {routeOpen && (
        <div className="absolute bottom-24 left-4 z-50 w-[340px] bg-dark-900/90 backdrop-blur-2xl text-white rounded-3xl border border-white/10 shadow-2xl p-5 transform transition-all animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-brand-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="font-bold tracking-wide text-white">Route Planner</span>
            </div>

            <button
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => {
                setStartLocation(null);
                setDestLocation(null);
                setRoutePath(null);
                setRouteSummary(null);
                setStartQuery("");
                setDestQuery("");
                setStartSuggestions([]);
                setDestSuggestions([]);
              }}
              title="Clear Route"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 relative">
            {/* Connecting line */}
            <div className="absolute left-[18px] top-[18px] bottom-[18px] w-0.5 bg-gradient-to-b from-brand-500 to-accent-500 opacity-30 pointer-events-none"></div>

            {/* Start Input */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 z-10 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-dark-900"></div>
              <input
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-dark-800/60 border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-dark-800 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
                placeholder="Choose start location..."
                value={startQuery}
                onChange={(e) => {
                  setStartQuery(e.target.value);
                  fetchSuggestions(e.target.value, setStartSuggestions);
                }}
              />
              {startSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-dark-800 border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {startSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-gray-200 text-sm border-b border-white/5 last:border-0 flex items-center gap-2"
                      onClick={() => {
                        setStartQuery(s.label);
                        setStartLocation({ lat: s.lat, lng: s.lng, label: s.label });
                        setStartSuggestions([]);
                      }}
                    >
                      <span className="opacity-50">📍</span> {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dest Input */}
            <div className="relative group">
              <div className="absolute left-3 top-3.5 z-10 w-2.5 h-2.5 rounded-full bg-accent-500 border-2 border-dark-900"></div>
              <input
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-dark-800/60 border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-dark-800 focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/50 transition-all"
                placeholder="Choose destination..."
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  fetchSuggestions(e.target.value, setDestSuggestions);
                }}
              />
              {destSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-dark-800 border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {destSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-gray-200 text-sm border-b border-white/5 last:border-0 flex items-center gap-2"
                      onClick={() => {
                        setDestQuery(s.label);
                        setDestLocation({ lat: s.lat, lng: s.lng, label: s.label });
                        setDestSuggestions([]);
                      }}
                    >
                      <span className="opacity-50">🏁</span> {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="px-3 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-gray-400 hover:text-brand-400 transition-all"
                title="Use current location"
                onClick={() => {
                  if (position) {
                    setStartLocation({ lat: position[0], lng: position[1], label: "Current location" });
                    setStartQuery("Current location");
                  }
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-sm font-bold shadow-lg shadow-brand-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                onClick={async () => {
                  const start = startLocation || (await geocode(startQuery));
                  const dest = destLocation || (await geocode(destQuery));
                  if (!start || !dest) {
                    addNotification("Please select valid start and destination points");
                    return;
                  }
                  const route = await fetchRoute(start, dest);
                  if (!route) {
                    addNotification("Could not find a route between these points");
                    return;
                  }
                  setRoutePath(route.path);
                  setRouteSummary({
                    distance: route.distance,
                    duration: route.duration,
                    startLabel: start.label || startQuery,
                    destLabel: dest.label || destQuery,
                  });
                }}
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {routeSummary && (
            <div className="mt-4 bg-dark-800/50 border border-white/5 rounded-xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-500 to-accent-500"></div>

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-bold text-white leading-none">
                    {(routeSummary.duration / 60).toFixed(0)} <span className="text-sm font-normal text-gray-400">min</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium mt-0.5">
                    {(routeSummary.distance / 1000).toFixed(1)} km
                  </div>
                </div>
                <div className="bg-brand-500/20 text-brand-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Fastest
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                <span className="truncate max-w-[100px]">{routeSummary.startLabel}</span>
                <span>→</span>
                <span className="truncate max-w-[100px]">{routeSummary.destLabel}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


