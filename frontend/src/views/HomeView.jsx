import React from "react";
import { useState, useEffect, useRef } from "react";
import LoginForm from "../components/LoginForm.jsx";
import { useTheme } from "../context/ThemContext.jsx";
import ListDetails from "../components/ListDetails.jsx";
import "../App.css";
import "../styles/themes.css";

export default function HomeView({ user, onLogout, onLogin }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [wishlists, setWishlists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [listsError, setListsError] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingUserLists, setLoadingUserLists] = useState(false);
  const [userListsError, setUserListsError] = useState(null);
  const [activeTab, setActiveTab] = useState("latest");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const [localUser, setLocalUser] = useState(user);
  const [selectedList, setSelectedList] = useState(null);
  useEffect(() => setLocalUser(user), [user]);

  function handleLogin(userData, token) {
    setLocalUser(userData || null);
    if (onLogin) onLogin(userData, token);
    setIsLoginOpen(false);
  }

  function handleLogout() {
    try {
      localStorage.removeItem("authToken");
    } catch (err) {
      console.warn("Failed to remove auth token:", err);
    }
    setLocalUser(null);
    if (onLogout) onLogout();
    setIsUserMenuOpen(false);
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!isUserMenuOpen) return;
      const menuEl = userMenuRef.current;
      const btnEl = userButtonRef.current;
      if (menuEl && menuEl.contains(e.target)) return;
      if (btnEl && btnEl.contains(e.target)) return;
      setIsUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isUserMenuOpen]);

  useEffect(() => {
    async function fetchPublicWishlists() {
      setLoadingLists(true);
      setListsError(null);
      try {
        const res = await fetch("http://localhost:3000/api/wishlists/public");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setWishlists(data || []);
      } catch (err) {
        console.error("Failed to load public wishlists", err);
        setListsError("Kunde inte ladda önskelistor");
      } finally {
        setLoadingLists(false);
      }
    }

    fetchPublicWishlists();
  }, []);

  useEffect(() => {
    async function fetchUserLists(userId) {
      setLoadingUserLists(true);
      setUserListsError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:3000/api/wishlists/user/${userId}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                }
              : { "Content-Type": "application/json" },
          }
        );

        if (res.status === 401 || res.status === 403) {
          try {
            localStorage.removeItem("authToken");
          } catch {
            console.error("Could not remove invalid auth token");
          }
          if (onLogout) onLogout();
          setUserLists([]);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setUserLists(data || []);
      } catch (err) {
        console.error("Failed to load user's wishlists", err);
        setUserListsError("Kunde inte ladda dina önskelistor");
      } finally {
        setLoadingUserLists(false);
      }
    }
    if (activeTab === "mine") {
      const uid = (localUser && localUser.id) || (user && user.id);
      if (uid) fetchUserLists(uid);
    }
  }, [activeTab, localUser, user, onLogout]);

  const sortedWishlists = [...wishlists].sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
  const latestFive = sortedWishlists.slice(0, 5);
  const displayedLists =
    activeTab === "latest"
      ? latestFive
      : activeTab === "mine"
      ? userLists
      : sortedWishlists;

  const currentUser = localUser || user;

  const handleWishlistCreated = (created) => {
    const withUsername = {
      ...created,
      username:
        created.username ||
        (currentUser && currentUser.id === created.user_id
          ? currentUser.username
          : created.username),
    };
    if (activeTab === "mine") {
      setUserLists((s) => [withUsername, ...(s || [])]);
    }
    if (!withUsername.is_private) {
      setWishlists((s) => [withUsername, ...(s || [])]);
    }
    setSelectedList(withUsername);
  };

  const handleWishlistDeleted = (deletedId) => {
    setUserLists((s) => (s ? s.filter((l) => l.id !== deletedId) : []));
    setWishlists((s) => (s ? s.filter((l) => l.id !== deletedId) : []));
    if (selectedList && selectedList.id === deletedId) setSelectedList(null);
  };

  const handleWishlistUpdated = (updated) => {
    setUserLists((s) =>
      s
        ? s.map((l) =>
            l.id === updated.id
              ? { ...l, ...updated, username: updated.username || l.username }
              : l
          )
        : s
    );

    setWishlists((s) => {
      if (!s) return s;
      const exists = s.some((l) => l.id === updated.id);
      if (updated.is_private) {
        return s.filter((l) => l.id !== updated.id);
      }
      if (exists) {
        return s.map((l) =>
          l.id === updated.id
            ? { ...l, ...updated, username: updated.username || l.username }
            : l
        );
      }
      return [
        {
          ...updated,
          username:
            updated.username ||
            (currentUser && currentUser.id === updated.user_id
              ? currentUser.username
              : undefined),
        },
        ...s,
      ];
    });

    if (selectedList && selectedList.id === updated.id) {
      setSelectedList((prev) => ({
        ...prev,
        ...updated,
        username: updated.username || prev.username,
      }));
    }
  };

  return (
    <div
      className='theme-transition'
      style={{
        backgroundColor: "var(--background)",
        position: "fixed",
        inset: 0,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        color: "var(--text)",
        overflow: "hidden",
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

            {currentUser ? (
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserMenuOpen((s) => !s)}
                  aria-haspopup='true'
                  aria-expanded={isUserMenuOpen}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {currentUser &&
                    (currentUser.username || `user:${currentUser.id}`)}
                </button>

                {isUserMenuOpen && (
                  <div
                    ref={userMenuRef}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      borderRadius: 8,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                      padding: "0.5rem",
                      minWidth: 140,
                      zIndex: 50,
                    }}
                  >
                    <button
                      onClick={() => handleLogout()}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 6,
                      }}
                    >
                      Logga ut
                    </button>
                  </div>
                )}
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
          flexDirection: "column",
          flex: 1,
          overflow: "auto",
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
          {currentUser ? (
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

          <section style={{ marginTop: "2rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <button
                onClick={() => setActiveTab("latest")}
                aria-pressed={activeTab === "latest"}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 6,
                  border:
                    activeTab === "latest"
                      ? "2px solid var(--primary)"
                      : "1px solid transparent",
                  background:
                    activeTab === "latest" ? "var(--primary)" : "transparent",
                  color: activeTab === "latest" ? "#fff" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                Senaste 5
              </button>
              <button
                onClick={() => setActiveTab("all")}
                aria-pressed={activeTab === "all"}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 6,
                  border:
                    activeTab === "all"
                      ? "2px solid var(--primary)"
                      : "1px solid transparent",
                  background:
                    activeTab === "all" ? "var(--primary)" : "transparent",
                  color: activeTab === "all" ? "#fff" : "var(--text)",
                  cursor: "pointer",
                }}
              >
                Alla offentliga
              </button>

              {currentUser && (
                <button
                  onClick={() => setActiveTab("mine")}
                  aria-pressed={activeTab === "mine"}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: 6,
                    border:
                      activeTab === "mine"
                        ? "2px solid var(--primary)"
                        : "1px solid transparent",
                    background:
                      activeTab === "mine" ? "var(--primary)" : "transparent",
                    color: activeTab === "mine" ? "#fff" : "var(--text)",
                    cursor: "pointer",
                  }}
                >
                  Mina
                </button>
              )}
              {activeTab === "mine" && currentUser && (
                <button
                  onClick={() => setSelectedList(undefined)}
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  + Ny lista
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "var(--primary)", margin: 0 }}>
                {activeTab === "latest"
                  ? "Senaste önskelistor"
                  : activeTab === "mine"
                  ? "Mina önskelistor"
                  : "Alla offentliga önskelistor"}
              </h3>
            </div>
            {activeTab === "mine" ? (
              loadingUserLists ? (
                <p>Hämtar dina önskelistor…</p>
              ) : userListsError ? (
                <p style={{ color: "var(--error, #c00)" }}>{userListsError}</p>
              ) : displayedLists.length === 0 ? (
                <p style={{ color: "var(--text-light)" }}>
                  Inga önskelistor hittades.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {displayedLists.map((list) => (
                    <article
                      key={list.id}
                      onClick={() => setSelectedList(list)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "var(--background-elevated, #fff)",
                        borderRadius: 8,
                        padding: "1rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        cursor: "pointer",
                      }}
                    >
                      <h4
                        style={{ margin: "0 0 0.5rem 0", color: "var(--text)" }}
                      >
                        {list.list_title || "Namnlös lista"}
                      </h4>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-light)",
                        }}
                      >
                        <div>
                          Ägare:{" "}
                          {currentUser && currentUser.username
                            ? currentUser.username
                            : list.username
                            ? list.username
                            : "Inget användarnamn hittades"}
                        </div>
                        <div>
                          Skapad:{" "}
                          {list.created_at
                            ? new Date(list.created_at).toLocaleString()
                            : "—"}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )
            ) : loadingLists ? (
              <p>Hämtar önskelistor…</p>
            ) : listsError ? (
              <p style={{ color: "var(--error, #c00)" }}>{listsError}</p>
            ) : displayedLists.length === 0 ? (
              <p style={{ color: "var(--text-light)" }}>
                Inga offentliga önskelistor hittades.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {displayedLists.map((list) => (
                  <article
                    key={list.id}
                    onClick={() => setSelectedList(list)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "var(--background-elevated, #fff)",
                      borderRadius: 8,
                      padding: "1rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    }}
                  >
                    <h4
                      style={{ margin: "0 0 0.5rem 0", color: "var(--text)" }}
                    >
                      {list.list_title || "Namnlös lista"}
                    </h4>
                    <div
                      style={{ fontSize: "0.9rem", color: "var(--text-light)" }}
                    >
                      <div>
                        Ägare:{" "}
                        {list.username
                          ? list.username
                          : "Inget användarnamn hittades"}
                      </div>
                      <div>
                        Skapad:{" "}
                        {list.created_at
                          ? new Date(list.created_at).toLocaleString()
                          : "—"}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <LoginForm
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <ListDetails
        list={selectedList}
        isOpen={selectedList !== null}
        onClose={() => setSelectedList(null)}
        onCreated={handleWishlistCreated}
        onDeleted={handleWishlistDeleted}
        onUpdated={handleWishlistUpdated}
      />
    </div>
  );
}
