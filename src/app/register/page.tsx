// app/register/page.tsx (or pages/register.tsx)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error before submitting
  
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      // Log the raw response text to check what's being returned
      const text = await res.text(); // Get the raw response text
      console.log("Raw Response:", text); // Log the raw response
  
      let data;
      // Try parsing it as JSON only if it's valid JSON
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        setError("Unexpected response format.");
        return;
      }
  
      // If response is ok, redirect
      if (res.ok) {
        router.push("/signin"); // Redirect to login on success
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Error in API request:", err); // Log the error
      setError("Something went wrong. Please try again.");
    }
  };
  
  
  

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
