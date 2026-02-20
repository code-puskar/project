import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./components/Register";
import IssueModal from "./components/IssueModal";
import api from "./services/api";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";

import IssueDrawer from "./components/IssueDrawer";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [issueFilter, setIssueFilter] = useState("");
  const [mapStyleId, setMapStyleId] = useState("streets-v12");
  const [show3D, setShow3D] = useState(false);

  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null); // Keep track of user for isOwner check

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState(null); // For Drawer

  const [pendingLocation, setPendingLocation] = useState(null);
  const [issues, setIssues] = useState([]);

  // 🔑 Auth hydration
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    // Also try to load user from local storage or decode token if possible, 
    // but better to fetch /me or relies on Dashboard to fetch. 
    // Actually we need currentUserId for IssueDrawer.
    // Let's decode or fetch. For simplicity, let's fetch profile if token exists.

    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }

    setAuthReady(true);
  }, []);

  const fetchProfile = async (t) => {
    try {
      // We can use the api service, but need to ensure it uses the token.
      // The api service likely uses localStorage token.
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (e) {
      console.error("Failed to fetch profile in App", e);
    }
  };

  if (!authReady) return null;

  // 🗺️ Map click handler
  const handleMapClick = (latlng) => {
    if (!token) {
      setPendingLocation(latlng);
      setShowLogin(true);
      return;
    }

    // Close drawer if open
    setSelectedIssue(null);

    setPendingLocation(latlng);
    setShowIssueModal(true);
  };

  // 🔐 Login success
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    fetchProfile(newToken);
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
      refreshIssues();
    } catch (err) {
      console.error("Failed to submit issue", err);
      const serverDetail = err.response?.data?.detail || err.response?.data || err.message;
      alert("Could not submit issue: " + JSON.stringify(serverDetail));
    }
  };

  const refreshIssues = async () => {
    try {
      const res = await api.get("/issues/");
      setIssues(res.data);
    } catch (e) {
      console.error("Failed to refresh issues", e);
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
          onIssueSelect={(issue) => setSelectedIssue(issue)}
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

      {/* 📂 ISSUE DRAWER */}
      <IssueDrawer
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        currentUserId={user?.id}
        onValidationSuccess={refreshIssues}
      />
    </div>
  );
}

export default App;
