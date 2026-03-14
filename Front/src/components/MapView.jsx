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
  setIssueFilter,
  mapStyleId,
  onStyleChange,
  show3D,
  onToggle3D,
  onIssueSelect,
}) {
  const [position, setPosition] = useState(null);
  const watchIdRef = useRef(null);
  const [showIssues, setShowIssues] = useState(true);
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
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

  useEffect(() => {
    // Poll issues periodically to keep in sync across accounts
    const id = setInterval(() => {
      fetchAllIssues();
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Auto-fetch route when both locations are set
  useEffect(() => {
    if (startLocation && destLocation) {
      handleCalculateRoute();
    }
  }, [startLocation, destLocation]);

  const handleCalculateRoute = async () => {
    if (!startLocation || !destLocation) return;
    const routeInfo = await fetchRoute(startLocation, destLocation);
    if (routeInfo) {
      setRoutePath(routeInfo.path);
      setRouteSummary({
        distance: routeInfo.distance,
        duration: routeInfo.duration,
      });
      // Try to zoom to fit the route
      if (routeInfo.path.length > 0) {
        setCenterRequest({
          lat: startLocation.lat,
          lng: startLocation.lng,
          zoom: 12
        });
      }
    } else {
      addNotification("Could not find a valid driving route.");
      setRoutePath(null);
      setRouteSummary(null);
    }
  };

  const handleSwapLocations = () => {
    const tempQuery = startQuery;
    const tempLocation = startLocation;

    setStartQuery(destQuery);
    setStartLocation(destLocation);

    setDestQuery(tempQuery);
    setDestLocation(tempLocation);
  };

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

    // Broaden search query to allow maximum results across all location types
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&limit=8&access_token=${mapboxToken}&fuzzyMatch=true&country=in`;
    if (position) {
      url += `&proximity=${position[1]},${position[0]}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      const items =
        data.features?.map((f) => {
          // Split the text into main name and sub-address for better UI
          const parts = f.place_name.split(", ");
          const mainText = parts[0];
          const subText = parts.slice(1).join(", ") || "Known Location";

          return {
            label: f.place_name,
            mainText,
            subText,
            lat: f.center[1],
            lng: f.center[0],
            types: f.place_type || []
          };
        }) || [];
      setter(items);
    } catch (e) {
      console.error("Failed to fetch suggestions", e);
      setter([]);
    }
  };

  const getCurrentLocationName = async () => {
    if (!position) return null;
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position[1]},${position[0]}.json?access_token=${mapboxToken}&types=address,poi&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.features?.length > 0) {
        return data.features[0].place_name;
      }
      return "Current Location";
    } catch (e) {
      return "Current Location";
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
    <div className="relative z-0 h-screen w-full overflow-hidden bg-gray-100">
      {notifications.length > 0 && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map((n) => (
            <div key={n.id} className="bg-[#FFF9E6] border border-[#FFE499] text-[#805B00] px-4 py-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center gap-3 backdrop-blur-md font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
              <div className="bg-[#FFEDAE] p-1.5 rounded-lg text-[#996D00]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
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



            if (Object.hasOwn(latlng, "isRoad") && !latlng.isRoad) {
              addNotification("You can only report issues on a road.");
              return;
            }

            if (!token) {
              if (onRequireLogin) onRequireLogin();
              return;
            }
            if (!onMapClick) return;
            onMapClick(latlng);
          }}
          onIssueClick={(issue) => {
            if (typeof onIssueSelect === "function") {
              onIssueSelect(issue);
            }
          }}
        />
      </div>

      {/* 🧭 Vertical Right Control Stack */}
      <div className="absolute bottom-[100px] md:bottom-8 right-4 md:left-4 md:right-auto z-[45] flex flex-col md:flex-row items-center gap-3 w-12 md:w-auto">
        {/* Map Style / Directions Toggle */}
        <button
          onClick={() => setRouteOpen((v) => !v)}
          className={`h-12 w-12 flex items-center justify-center rounded-full md:rounded-2xl shadow-lg border backdrop-blur-md transition-all active:scale-95 ${routeOpen
            ? "bg-dark-900 border-white/20 text-brand-400 shadow-xl"
            : "bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:text-dark-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            }`}
          title="Map Options"
        >
          <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </button>

        {/* Refresh Issues */}
        <button
          onClick={fetchAllIssues}
          disabled={isLoadingIssues}
          className={`h-12 w-12 flex items-center justify-center rounded-full md:rounded-2xl shadow-xl border backdrop-blur-md transition-all active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:text-dark-900 ${isLoadingIssues ? "animate-pulse" : ""}`}
          title="Refresh Issues"
        >
          <svg className={`w-5 h-5 ${isLoadingIssues ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Locate Me (Primary Action Style) */}
        <button
          onClick={() => setFollowUser((v) => !v)}
          className={`h-12 w-12 flex items-center justify-center rounded-full md:rounded-2xl shadow-xl border backdrop-blur-md transition-all active:scale-95 ${followUser
            ? "bg-brand-500 border-brand-400 text-white shadow-brand-500/40"
            : "bg-white/90 border-gray-200 text-brand-600 hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            }`}
          title="Locate Me"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* ⚪ Mobile Bottom Sheet (Filters) */}
      <div className="absolute md:hidden bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px] pt-3 pb-8 md:pb-6 px-2 flex flex-col z-[48] transition-transform duration-300">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

        {/* Horizontal scroll area for issue filters */}
        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-2 px-2 min-w-max">
            {[
              { label: "All Issues", value: "" },
              { label: "Streets", value: "Pothole" },
              { label: "Sanitation", value: "Garbage" },
              { label: "Lighting", value: "Streetlight" },
              { label: "Traffic", value: "Traffic" }
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => {
                  if (typeof setIssueFilter === "function") {
                    setIssueFilter(filter.value);
                  }
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${(issueFilter === filter.value || (issueFilter === "" && filter.value === ""))
                  ? "bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {geoError && (
        <div className="absolute bottom-24 left-4 z-50 bg-red-600/90 backdrop-blur text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-red-500/50">
          {geoError}
        </div>
      )}




      {/* 🗺️ Sliding Route Planner Drawer */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-full md:w-[400px] bg-dark-900/95 backdrop-blur-2xl text-white border-r border-white/10 shadow-2xl z-[60] pt-20 md:pt-24 flex flex-col transition-transform duration-500 cubic-bezier-[0.32,0.72,0,1]
            ${routeOpen ? "translate-x-0" : "-translate-x-full"}
         `}
      >
        {/* Header Options */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRouteOpen(false)}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Close Navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h2 className="text-xl font-bold tracking-tight">Plan Route</h2>
          </div>

          <button
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
            title="Clear All"
          >
            Clear
          </button>
        </div>

        <div className="px-6 py-4 flex gap-4 relative">
          {/* Left Timeline Guide */}
          <div className="flex flex-col items-center mt-3 pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"></div>
            <div className="w-[1.5px] flex-1 border-l-[1.5px] border-dashed border-gray-600 my-1"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10"></div>
          </div>

          {/* Inputs Area */}
          <div className="flex-1 space-y-3 relative">

            {/* Swap Button inside center right */}
            <button
              onClick={handleSwapLocations}
              className="absolute right-2 top-11 z-[50] w-8 h-8 flex items-center justify-center bg-dark-800 border border-white/10 rounded-full text-gray-400 hover:text-brand-400 hover:bg-white/10 shadow-lg transition-colors group"
              title="Swap Locations"
            >
              <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>

            {/* Start Input */}
            <div className="relative group">
              <input
                className="w-full pr-10 pl-4 py-3.5 rounded-2xl bg-dark-800 border border-transparent text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-dark-700 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-medium"
                placeholder="Choose start location..."
                value={startQuery}
                onChange={(e) => {
                  setStartQuery(e.target.value);
                  fetchSuggestions(e.target.value, setStartSuggestions);
                }}
              />
              {/* Suggestions List */}
              {startSuggestions.length > 0 && (
                <div className="absolute z-[100] left-0 right-0 top-full mt-2 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar">
                  {position && (
                    <button
                      className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 flex items-center gap-3"
                      onClick={async () => {
                        const posName = await getCurrentLocationName();
                        setStartQuery(posName);
                        setStartLocation({ lat: position[0], lng: position[1], label: posName });
                        setStartSuggestions([]);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                      </div>
                      <div>
                        <div className="text-brand-400 font-semibold text-sm">Your Current Location</div>
                        <div className="text-gray-500 text-xs mt-0.5">Use GPS</div>
                      </div>
                    </button>
                  )}
                  {startSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3"
                      onClick={() => {
                        setStartQuery(s.mainText);
                        setStartLocation({ lat: s.lat, lng: s.lng, label: s.label });
                        setStartSuggestions([]);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex shrink-0 items-center justify-center text-gray-400">
                        {s.types?.includes("poi") ? "📍" : "🗺️"}
                      </div>
                      <div className="truncate">
                        <div className="text-gray-200 font-semibold text-sm truncate">{s.mainText}</div>
                        <div className="text-gray-500 text-xs truncate mt-0.5">{s.subText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="relative group">
              <input
                className="w-full pr-10 pl-4 py-3.5 rounded-2xl bg-dark-800 border border-transparent text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-dark-700 focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/50 transition-all font-medium"
                placeholder="Choose destination..."
                value={destQuery}
                onChange={(e) => {
                  setDestQuery(e.target.value);
                  fetchSuggestions(e.target.value, setDestSuggestions);
                }}
              />
              {/* Suggestions List */}
              {destSuggestions.length > 0 && (
                <div className="absolute z-[100] left-0 right-0 top-full mt-2 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar">
                  {destSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-center gap-3"
                      onClick={() => {
                        setDestQuery(s.mainText);
                        setDestLocation({ lat: s.lat, lng: s.lng, label: s.label });
                        setDestSuggestions([]);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex shrink-0 items-center justify-center text-gray-400">
                        {s.types?.includes("poi") ? "📍" : "🗺️"}
                      </div>
                      <div className="truncate">
                        <div className="text-gray-200 font-semibold text-sm truncate">{s.mainText}</div>
                        <div className="text-gray-500 text-xs truncate mt-0.5">{s.subText}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route Summary Area */}
        {routePath && routeSummary ? (
          <div className="px-6 flex-1 flex flex-col pt-4">
            <div className="bg-gradient-to-br from-brand-900/30 to-accent-900/30 border border-brand-500/20 rounded-3xl p-6 mb-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-gray-400 text-sm font-medium mb-1">Fastest Route</div>
                  <div className="text-4xl font-black text-white">
                    {Math.round(routeSummary.duration / 60)} <span className="text-xl text-gray-400 font-semibold">min</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-brand-400 text-xl font-bold">
                    {(routeSummary.distance / 1000).toFixed(1)} <span className="text-sm">km</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${startLocation.lat},${startLocation.lng}&destination=${destLocation.lat},${destLocation.lng}`, '_blank')}
                className="w-full py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Start Navigation
              </button>
            </div>

            {/* Optional placeholder for step-by-step directions if enabled later */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Steps would go here */}
            </div>
          </div>
        ) : (
          <div className="px-6 flex-1 flex flex-col justify-center items-center opacity-30 pointer-events-none pb-20">
            <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-lg font-bold text-gray-300">Enter locations</p>
            <p className="text-sm text-gray-400 text-center mt-1">Search for a starting point and destination to see your route options.</p>
          </div>
        )}
      </div>
    </div>
  );
}


