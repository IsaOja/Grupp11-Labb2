import React from "react";
import { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import "../App.css";
import "../styles/themes.css";

export default function HomeView({ user, onLogout }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  function handleLogin() {
    setIsLoginOpen(false);
  }

  function handleLogout() {
    if (onLogout) onLogout();
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      className="theme-transition"
      style={{
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "var(--text)",
      }}
    >
      <header
        style={{
          backgroundColor: "var(--primary)",
          padding: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.8rem",
            }}
          >
            Önskelistan
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            {user ? (
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <span style={{ color: "#fff" }}>
                  Välkommen, {user.username}!
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "var(--primary-dark)",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Logga ut
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                style={{
                  backgroundColor: "var(--primary-dark)",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Logga in
              </button>
            )}
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "2rem auto",
          padding: "0 1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            flex: 1,
          }}
        >
          {user ? (
            <div>
              <h2
                style={{
                  color: "var(--primary)",
                  marginTop: 0,
                }}
              >
                Dina Önskelistor
              </h2>
              <p style={{ color: "var(--text-light)" }}>
                Här kommer du kunna se och hantera dina önskelistor.
              </p>
              {/* Add wishlist content here */}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  color: "var(--primary)",
                  marginTop: 0,
                }}
              >
                Välkommen till Önskelistan
              </h2>
              <p style={{ color: "var(--text-light)" }}>
                Logga in för att skapa och hantera dina önskelistor.
              </p>
              <button
                onClick={() => setIsLoginOpen(true)}
                style={{
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  marginTop: "1rem",
                }}
              >
                Kom igång
              </button>
            </div>
          )}
        </div>
      </main>

      <LoginForm
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
