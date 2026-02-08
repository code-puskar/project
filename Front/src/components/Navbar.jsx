import { useState } from "react";

export default function Navbar({ onSearchLocation, onIssueFilter }) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();

    if (data.length > 0) {
      onSearchLocation({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      });
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white p-2 rounded shadow">
      <input
        className="border px-2 py-1 rounded"
        placeholder="Search location"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-3 rounded"
      >
        Search
      </button>

     
    </div>
  );
}
