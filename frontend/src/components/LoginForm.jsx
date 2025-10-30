import { useState } from "react";

export default function LoginForm({
  apiBase = "http://localhost:3000/api",
  onLogin,
  isOpen = false,
  onClose,
}) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
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
      const res = await fetch(`${apiBase}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error");
      } else {
        if (mode === "register") {
          setMessage(`Konto skapat: ${data.user?.username || username}`);
          setMode("login");
        } else {
          setMessage(`Inloggad som ${data.user?.username || username}`);
          console.log("Logged in user:", data.user);
          if (onLogin) onLogin(data.user || { username });
        }
        setUsername("");
        setPassword("");
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
            Användarnamn
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                marginBottom: 12,
              }}
            />
          </label>

          <label>
            Lösenord
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
