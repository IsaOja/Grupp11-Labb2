import React, { useState, useEffect } from "react";

export default function ListDetails({ list, isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      if (!list || !isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:3000/api/wishlist-items/wishlist/${list.id}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                }
              : { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.error("Failed to load list items", err);
        setError("Kunde inte ladda föremål");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [list, isOpen]);

  if (!isOpen || !list) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "var(--surface)",
          borderRadius: 12,
          padding: "1.5rem",
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--text-light)",
          }}
        >
          ×
        </button>

        <h2 style={{ color: "var(--primary)", marginTop: 0 }}>
          {list.list_title || "Namnlös lista"}
        </h2>

        <div
          style={{
            fontSize: "0.9rem",
            color: "var(--text-light)",
            marginBottom: "1.5rem",
          }}
        >
          <div>Ägare: {list.username || `user_id: ${list.user_id}`}</div>
          <div>Typ: {list.is_private ? "Privat" : "Offentlig"}</div>
          <div>
            Skapad:{" "}
            {list.created_at ? new Date(list.created_at).toLocaleString() : "—"}
          </div>
        </div>

        <h3 style={{ color: "var(--primary)" }}>Föremål</h3>

        {loading ? (
          <p>Laddar föremål...</p>
        ) : error ? (
          <p style={{ color: "var(--error, #c00)" }}>{error}</p>
        ) : items.length === 0 ? (
          <p style={{ color: "var(--text-light)" }}>
            Inga föremål i listan än.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "1rem",
                  background: "var(--background)",
                  borderRadius: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 0.25rem",
                      color: "var(--text)",
                      textAlign: "left",
                    }}
                  >
                    {item.item_title}
                  </h4>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-light)",
                      textAlign: "left",
                    }}
                  >
                    {item.price && <span>Pris: {item.price} kr</span>}
                  </div>
                </div>

                {item.product_link && (
                  <a
                    href={item.product_link}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      color: "var(--primary)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      padding: "0.4rem 0.75rem",
                      borderRadius: 6,
                      border: "1px solid var(--primary)",
                    }}
                  >
                    Visa produkt →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
