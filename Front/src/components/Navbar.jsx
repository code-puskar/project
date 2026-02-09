import { useState } from "react";

export default function Navbar({
  onSearchLocation,
  onIssueFilter,
  mapStyleId,
  onStyleChange,
  show3D,
  onToggle3D,
}) {
  const [query, setQuery] = useState("");

  const mapboxToken = "pk.eyJ1IjoidGhlZXF1aW5veGRldiIsImEiOiJjbWs1NXJpbG0wYXRkM2dxc2M4MWhoaDR2In0.aN-rLyueziuW3wJhQB2suw";

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
          <span className="text-lg font-bold tracking-tight text-white">SmartCity</span>
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
        </div>
      </div>
    </header>
  );
}
