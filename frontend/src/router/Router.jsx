import { Routes, Route } from "react-router-dom";
import HomeView from "../views/HomeView";

export default function Router({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeView user={user} onLogin={onLogin} onLogout={onLogout} />}
      />
    </Routes>
  );
}
