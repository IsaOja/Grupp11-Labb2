import { useState } from "react";
import HomeView from "./views/HomeView";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    setUser(null);
  }

  if (user) return <HomeView user={user} onLogout={handleLogout} />;

  return <HomeView onLogin={handleLogin} />;
}

export default App;
