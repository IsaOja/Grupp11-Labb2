import { useEffect, useState } from "react";

export default function MyPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Data from /me:", data);
      setUser(data.user);
    }
    loadUser();
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      {user ? (
        <div>
          <p>
            {user.firstname} {user.lastname}
          </p>
          <p> {user.email} </p>
        </div>
      ) : (
        <h3 style={{ color: "red" }}>You need to log in </h3>
      )}
    </div>
  );
}
