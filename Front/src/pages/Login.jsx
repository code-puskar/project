import axios from "axios";
import { useState } from "react";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password
      });

      localStorage.setItem("access_token", res.data.access_token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="p-6 border rounded">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block mb-3 border p-2"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mb-3 border p-2"
        />
        <button onClick={handleLogin} className="bg-black text-white px-4 py-2">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
