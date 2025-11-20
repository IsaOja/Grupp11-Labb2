import { Routes, Route } from "react-router-dom";
import { lazyWithPreload } from "react-lazy-with-preload";
// import HomeView from "../views/HomeView";
// import MyPage from "../views/MyPageView";
// import PrivacyPolicyView from "../views/PrivacyPolicyView";

export const HomeScreen = lazyWithPreload(() => import("../views/HomeView"));
export const MyPageScreen = lazyWithPreload(() =>
  import("../views/MyPageView")
);
export const PrivacyPolicyScreen = lazyWithPreload(() =>
  import("../views/PrivacyPolicyView")
);

// HomeScreen.preload();
// MyPageScreen.preload();
// PrivacyPolicyScreen.preload();

export default function Router({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <HomeScreen user={user} onLogin={onLogin} onLogout={onLogout} />
        }
      />
      <Route
        path='/me'
        element={
          <MyPageScreen user={user} onLogin={onLogin} onLogout={onLogout} />
        }
      />
      <Route path='/policy' element={<PrivacyPolicyScreen />} />
    </Routes>
  );
}
