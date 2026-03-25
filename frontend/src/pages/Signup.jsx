import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await API.post("/signup", {
        username,
        password
      });

      alert("Signup successful! Please login.");

      // redirect to login
      window.location.href = "/login";
      
    } catch (err) {
      alert("Signup failed (user may already exist)");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
            
          Signup
        </button>
      </div>
    </div>
  );
}