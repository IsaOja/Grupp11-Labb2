import { useState } from 'react';
import HomeView from './views/HomeView.jsx';
import { BrowserRouter } from 'react-router-dom';
import Router from './router/Router.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(u) {
    setUser(u);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <BrowserRouter>
      {user ? (
        <HomeView user={user} onLogout={handleLogout} />
      ) : (
        <HomeView onLogin={handleLogin} />
      )}
      <Router />
    </BrowserRouter>
  );
}

export default App;
