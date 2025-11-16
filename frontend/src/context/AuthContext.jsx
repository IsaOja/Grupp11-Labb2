import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const res = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("authToken");
          setAuthToken(null);
          setUser(null);
          return;
        }
        if (!res.ok) {
          console.warn("Failed to restore session from server", res.status);
          return;
        }
        const data = await res.json();
        const usr = data && data.user ? data.user : data;
        if (usr) {
          setUser(usr);
          setAuthToken(token);
        }
      } catch (err) {
        console.warn("Failed to restore session from token", err);
      }
    }

    restore();
  }, []);

  function login(u, token) {
    setUser(u || null);
    if (token) {
      try {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
      } catch (err) {
        console.warn("Could not persist auth token", err);
      }
    }
  }

  function logout() {
    setUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("authToken");
    } catch (err) {
      console.warn("Could not remove auth token", err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
