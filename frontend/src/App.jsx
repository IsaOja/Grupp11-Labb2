import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router.jsx";
import { ThemeProvider } from "./context/ThemContext.jsx";
import "./styles/themes.css";
import "./App.css";
import { useAuth } from "./context/useAuth.jsx";

function App() {
  const { user, login, logout } = useAuth();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Router user={user} onLogout={logout} onLogin={login} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
