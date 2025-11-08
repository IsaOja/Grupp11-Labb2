import { Routes, Route } from "react-router-dom";
import HomeView from "../views/HomeView";
import MyPage from "../views/MyPageView";
export default function Router({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route
        path='/'
        element={<HomeView user={user} onLogin={onLogin} onLogout={onLogout} />}
      />
      <Route
        path='/me'
        element={<MyPage user={user} onLogin={onLogin} onLogout={onLogout} />}
      />
    </Routes>
  );
}
