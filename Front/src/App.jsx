import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./components/Register";
import IssueModal from "./components/IssueModal";
import api from "./services/api";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [issueFilter, setIssueFilter] = useState("");
  const [mapStyleId, setMapStyleId] = useState("streets-v12");
  const [show3D, setShow3D] = useState(false);

  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [pendingLocation, setPendingLocation] = useState(null);
  const [issues, setIssues] = useState([]);

  // 🔑 Auth hydration
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      setToken(storedToken);
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }

    setAuthReady(true);
  }, []);

  if (!authReady) return null;

  // 🗺️ Map click handler
  const handleMapClick = (latlng) => {
    if (!token) {
      setPendingLocation(latlng);
      setShowLogin(true);
      return;
    }

    setPendingLocation(latlng);
    setShowIssueModal(true);
  };

  // 🔐 Login success
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setShowLogin(false);

    if (pendingLocation) {
      setShowIssueModal(true);
    }
  };

  // 📝 Issue submit
  const handleIssueSubmit = async (issue) => {
    try {
      await api.post("/issues/", issue);
      setShowIssueModal(false);
      setPendingLocation(null);
      const res = await api.get("/issues/");
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to submit issue", err);
      // surface useful validation errors to the user
      const serverDetail = err.response?.data?.detail || err.response?.data || err.message;
      alert("Could not submit issue: " + JSON.stringify(serverDetail));
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Navbar
        onSearchLocation={setSearchLocation}
        onIssueFilter={setIssueFilter}
        mapStyleId={mapStyleId}
        onStyleChange={setMapStyleId}
        show3D={show3D}
        onToggle3D={() => setShow3D((v) => !v)}
      />



      {/* 🗺️ Mount MAP ONLY when login is NOT visible */}
      {!showLogin && !showRegister && ( // Only show dashboard if neither login nor register is visible
        <Dashboard
          searchLocation={searchLocation}
          issueFilter={issueFilter}
          mapStyleId={mapStyleId}
          show3D={show3D}
          onStyleChange={setMapStyleId}
          onToggle3D={() => setShow3D((v) => !v)}
          onMapClick={handleMapClick}
          issues={issues}
          setIssues={setIssues}
          onRequireLogin={() => setShowLogin(true)}
        />
      )}



      {/* 🔐 LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center pointer-events-auto">
          <Login
            onSuccess={handleLoginSuccess}
            onClose={() => setShowLogin(false)}
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        </div>
      )}

      {/* 📝 REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center pointer-events-auto">
          <Register
            onSuccess={handleLoginSuccess} // Assuming register also logs in the user
            onClose={() => setShowRegister(false)}
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        </div>
      )}

      {/* 📝 ISSUE MODAL */}
      {showIssueModal && pendingLocation && !showLogin && (
        <IssueModal
          location={pendingLocation}
          onClose={() => setShowIssueModal(false)}
          onSubmit={handleIssueSubmit}
        />
      )}
    </div>
  );
}

export default App;
