import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import "./App.css";
import { useAuth } from "./context/useAuth.jsx";

function App() {
  const { user, login, logout } = useAuth();

  return (
    <BrowserRouter>
      <Router user={user} onLogout={logout} onLogin={login} />
    </BrowserRouter>
  );
}

export default App;
