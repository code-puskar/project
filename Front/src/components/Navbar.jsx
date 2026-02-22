import { useState, useEffect, useRef } from "react";
import api from "../services/api";

export default function Navbar({
  onSearchLocation,
  onIssueFilter,
  mapStyleId,
  onStyleChange,
  show3D,
  onToggle3D,
}) {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
 

  useEffect(() => {
    fetchProfile();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1`
      );
      const data = await res.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        onSearchLocation({ lat, lng });
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-md border-b border-white/10 shadow-lg supports-[backdrop-filter]:bg-dark-900/60"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">SafeXcity</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-dark-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-dark-800 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all duration-200"
              placeholder="Search location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={handleSearch}
                className="mr-1 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!navigator.geolocation) {
                alert("Geolocation not supported");
                return;
              }
              navigator.geolocation.getCurrentPosition(
                (pos) =>
                  onSearchLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  }),
                () => alert("Unable to access your location")
              );
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="My Location"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          <select
            onChange={(e) => onIssueFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-300 hover:text-white focus:outline-none cursor-pointer"
          >
            <option value="" className="bg-dark-800 text-gray-300">All Issues</option>
            <option value="Pothole" className="bg-dark-800 text-gray-300">Pothole</option>
            <option value="Garbage" className="bg-dark-800 text-gray-300">Garbage</option>
            <option value="Streetlight" className="bg-dark-800 text-gray-300">Streetlight</option>
          </select>

          <select
            value={mapStyleId}
            onChange={(e) => onStyleChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-300 hover:text-white focus:outline-none cursor-pointer max-w-[100px]"
          >
            <option value="streets-v12" className="bg-dark-800 text-gray-300">Streets</option>
            <option value="outdoors-v12" className="bg-dark-800 text-gray-300">Outdoors</option>
            <option value="light-v11" className="bg-dark-800 text-gray-300">Light</option>
            <option value="dark-v11" className="bg-dark-800 text-gray-300">Dark</option>
            <option value="satellite-streets-v12" className="bg-dark-800 text-gray-300">Satellite</option>
          </select>

          <button
            onClick={onToggle3D}
            className={`
              relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-brand-500
              ${show3D ? "bg-brand-600" : "bg-white/10"}
            `}
          >
            <span className="sr-only">Enable 3D</span>
            <span
              className={`
                inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                ${show3D ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>

          <div className="h-6 w-px bg-white/10 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 p-[1px]">
                <div className="w-full h-full rounded-lg bg-dark-900 flex items-center justify-center text-xs font-bold text-white">
                  {user?.name?.[0] || "U"}
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-white leading-none">{user?.name || "User"}</p>
                <p className="text-[10px] text-brand-400 mt-0.5 font-medium">{user?.reputation || 0} Rep</p>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-dark-900 border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="p-4 bg-dark-800/50 border-b border-white/5">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>

                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 rounded-lg bg-white/5 mx-2 my-1">
                    <div className="flex justify-between items-center text-sm text-gray-300">
                      <span>Reputation</span>
                      <span className="font-bold text-brand-400">{user?.reputation || 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 px-2 pb-2">
                    <div className="bg-dark-800 rounded-lg p-2 text-center border border-white/5">
                      <span className="block text-xs text-gray-500 uppercase tracking-tighter">Reported</span>
                      <span className="block text-lg font-bold text-white">{user?.stats?.reported || 0}</span>
                    </div>
                    <div className="bg-dark-800 rounded-lg p-2 text-center border border-white/5">
                      <span className="block text-xs text-gray-500 uppercase tracking-tighter">Validated</span>
                      <span className="block text-lg font-bold text-white">{user?.stats?.validated || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="p-1 border-t border-white/5">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
