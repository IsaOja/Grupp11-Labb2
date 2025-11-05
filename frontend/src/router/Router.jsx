import { Routes, Route } from 'react-router-dom';
import HomeView from '../views/HomeView';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<HomeView />} />
    </Routes>
  );
}
