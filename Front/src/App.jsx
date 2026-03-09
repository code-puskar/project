import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./components/Register";
import IssueModal from "./components/IssueModal";
import api from "./services/api";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";

import IssueDrawer from "./components/IssueDrawer";
import Landing from "./pages/Landing";

import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/Admin/AdminLayout";

function MainApp({
  showLanding, setShowLanding,
  showLogin, setShowLogin,
  showRegister, setShowRegister,
  showIssueModal, setShowIssueModal,
  selectedIssue, setSelectedIssue,
  pendingLocation, setPendingLocation,
  issues, setIssues,
  searchLocation, setSearchLocation,
  issueFilter, setIssueFilter,
  mapStyleId, setMapStyleId,
  show3D, setShow3D,
  user, handleLoginSuccess, handleIssueSubmit, refreshIssues, handleMapClick
}) {
  // Render Landing Page if showLanding is true
  if (showLanding) {
    return (
      <>
        <Landing
          onOpenLogin={() => setShowLogin(true)}
          onOpenRegister={() => setShowRegister(true)}
        />

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

        {showRegister && (
          <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center pointer-events-auto">
            <Register
              onSuccess={handleLoginSuccess}
              onClose={() => setShowRegister(false)}
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          </div>
        )}
      </>
    );
  }

  // Otherwise render the main Dashboard App
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
      {!showLogin && !showRegister && (
        <Dashboard
          searchLocation={searchLocation}
          issueFilter={issueFilter}
          setIssueFilter={setIssueFilter}
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
            onSuccess={handleLoginSuccess}
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

function AppWrapper() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [issueFilter, setIssueFilter] = useState("");
  const [mapStyleId, setMapStyleId] = useState("standard");
  const [show3D, setShow3D] = useState(false);

  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState(null);

  const [pendingLocation, setPendingLocation] = useState(null);
  const [issues, setIssues] = useState([]);

  // 🔑 Auth hydration
  useEffect(() => {
    if (window.location.hash === "#dashboard") setShowLanding(false);

    const handleHashChange = () => {
      if (window.location.hash === "#dashboard") setShowLanding(false);
    };
    window.addEventListener("hashchange", handleHashChange);

    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
      setShowLogin(false);
      setShowLanding(false);
    }

    setAuthReady(true);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const fetchProfile = async (t) => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (e) {
      console.error("Failed to fetch profile in App", e);
      if (e.response && e.response.status === 401) {
        localStorage.removeItem("access_token");
        setToken(null);
        setShowLanding(true);
      }
    }
  };

  if (!authReady) return null;

  const handleMapClick = (latlng) => {
    if (!token) {
      setPendingLocation(latlng);
      setShowLogin(true);
      return;
    }
    setSelectedIssue(null);
    setPendingLocation(latlng);
    setShowIssueModal(true);
  };

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    fetchProfile(newToken);
    setShowLogin(false);
    setShowLanding(false);
    if (pendingLocation) setShowIssueModal(true);
  };

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

  // Ensure routing functions correctly
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<MainApp
        showLanding={showLanding} setShowLanding={setShowLanding}
        showLogin={showLogin} setShowLogin={setShowLogin}
        showRegister={showRegister} setShowRegister={setShowRegister}
        showIssueModal={showIssueModal} setShowIssueModal={setShowIssueModal}
        selectedIssue={selectedIssue} setSelectedIssue={setSelectedIssue}
        pendingLocation={pendingLocation} setPendingLocation={setPendingLocation}
        issues={issues} setIssues={setIssues}
        searchLocation={searchLocation} setSearchLocation={setSearchLocation}
        issueFilter={issueFilter} setIssueFilter={setIssueFilter}
        mapStyleId={mapStyleId} setMapStyleId={setMapStyleId}
        show3D={show3D} setShow3D={setShow3D}
        user={user} handleLoginSuccess={handleLoginSuccess} handleIssueSubmit={handleIssueSubmit} refreshIssues={refreshIssues} handleMapClick={handleMapClick}
      />} />
    </Routes>
  )
}

export default AppWrapper;
