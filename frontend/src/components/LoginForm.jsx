import { useState } from "react";

export default function LoginForm({
  apiBase = "http://localhost:3000/api",
  onLogin,
  isOpen = false,
  onClose,
}) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setMessage(null);
    setMode("login");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "users" : "users/login";
      const body =
        mode === "register"
          ? { username, firstname, lastname, email, password }
          : { username, password };

      const res = await fetch(`${apiBase}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error");
      } else {
        if (mode === "register") {
          setMode("login");
          setUsername("");
          setFirstname("");
          setLastname("");
          setEmail("");
          setPassword("");
        } else {
          if (onLogin) onLogin(data.user || { username });
          setUsername("");
          setPassword("");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Nätverksfel");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: "90%",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "5px",
          }}
        ></button>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: 8,
              background: mode === "login" ? "#36f" : "#eee",
              color: mode === "login" ? "#fff" : "#000",
            }}
          >
            Logga in
          </button>
          <button
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              padding: 8,
              background: mode === "register" ? "#36f" : "#eee",
              color: mode === "register" ? "#fff" : "#000",
            }}
          >
            Registrera
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            {mode === "login" ? "Användarnamn eller Email" : "Användarnamn"}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              type="text"
              autoComplete={mode === "login" ? "username email" : "username"}
              style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                marginBottom: 12,
              }}
            />
          </label>

          {mode === "register" && (
            <>
              <label>
                Förnamn
                <input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  autoComplete="given-name"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>

              <label>
                Efternamn
                <input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  autoComplete="family-name"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
            </>
          )}

          <label>
            Lösenord
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                marginBottom: 12,
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 10, justifyContent: "center" }}
          >
            {loading
              ? "Väntar..."
              : mode === "login"
              ? "Logga in"
              : "Skapa konto"}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: 12, padding: 10, background: "#f7f7f7" }}>
            {String(message)}
          </div>
        )}
      </div>
    </div>
  );
}
