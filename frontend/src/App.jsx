import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [_authToken, _setAuthToken] = useState(null);

  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("authToken");
          _setAuthToken(null);
          setUser(null);
          return;
        }

        if (!res.ok) {
          console.warn("Failed to restore session from server", res.status);
          return;
        }

        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
          _setAuthToken(token);
        }
      } catch (err) {
        console.warn("Failed to restore session from token", err);
      }
    }

    restore();
  }, []);

  function handleLogin(u, token) {
    setUser(u);
    if (token) {
      try {
        localStorage.setItem("authToken", token);
        _setAuthToken(token);
      } catch (err) {
        console.warn("Could not persist auth token", err);
      }
    }
  }

  function handleLogout() {
    setUser(null);
    _setAuthToken(null);
    try {
      localStorage.removeItem("authToken");
    } catch (err) {
      console.warn("Could not remove auth token from localStorage", err);
    }
  }

  return (
    <BrowserRouter>
      <Router user={user} onLogout={handleLogout} onLogin={handleLogin} />
    </BrowserRouter>
  );
}

export default App;
