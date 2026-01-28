import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function App() {
  const token = localStorage.getItem("access_token");

  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("access_token");
    }
  }

  return (
    <Routes>
      <Route path="/" element={token ? <Dashboard /> : <Login />} />

      <Route
        path="/admin"
        element={
          role === "admin" ? <Admin /> : <Navigate to="/" />
        }
      />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
