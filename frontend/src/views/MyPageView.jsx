import { useEffect, useState } from "react";
import CreateWishlistModal from "../components/CreateWishlistModal.jsx";
import "../styles/themes.css";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    async function getExistingUser() {
      const res = await fetch("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user);
    }

    getExistingUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function getLists() {
      const res = await fetch(
        `http://localhost:3000/api/wishlists/user/${user.id}`
      );
      const data = await res.json();
      setLists(data);
    }

    getLists();
  }, [user]);

  const privateLists = lists.filter((l) => l.is_private);
  const publicLists = lists.filter((l) => !l.is_private);

  const filteredLists =
    filter === "private"
      ? privateLists
      : filter === "public"
      ? publicLists
      : lists;

  return (
    <div>
      <h1>My Page</h1>

      {user ? (
        <>
          <p>
            {user.firstname} {user.lastname}
          </p>
          <p>{user.email}</p>

          <button onClick={() => setShowCreate(true)}>Create new list</button>
          {showCreate && (
            <CreateWishlistModal
              user={user}
              onCreated={(list) => setLists((prev) => [...prev, list])}
              onClose={() => setShowCreate(false)}
            />
          )}

          <h3>Your Lists</h3>

          <div style={{ margin: "10px 0", display: "flex", gap: "10px" }}>
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("private")}>Private</button>
            <button onClick={() => setFilter("public")}>Public</button>
          </div>

          <div className='list-grid'>
            {filteredLists.length === 0 ? (
              <p>No lists found</p>
            ) : (
              filteredLists.map((l) => (
                <div className='list-card' key={l.id}>
                  <h4>{l.list_title}</h4>
                  <span>{l.is_private ? "Private" : "Public"}</span>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <h3 style={{ color: "red" }}>You need to log in</h3>
      )}
    </div>
  );
}
