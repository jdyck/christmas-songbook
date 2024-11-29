import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type LoggedOutProps = {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setLoadingAction: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loadingAction: boolean;
  error: string | null;
};

const LoggedOut: React.FC<LoggedOutProps> = ({
  setUser,
  setLoadingAction,
  setError,
  loadingAction,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login with email and password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user); // Update user state on success
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Login with Google
  const handleGoogleLogin = async () => {
    setLoadingAction(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/admin" },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Error logging in with Google:", err);
      setError("Google login failed. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loadingAction}>
          {loadingAction ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={handleGoogleLogin}
          disabled={loadingAction}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loadingAction ? "Logging in..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default LoggedOut;
