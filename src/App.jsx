import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import GamePage from './pages/Gamepage';
import TwistMode from './pages/TwistMode';
import ClassicMode from './pages/ClassicMode';

const AppContent = () => {
  const location = useLocation();

  // Show Navbar only on homepage
  const showNavbar = location.pathname === '/';

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/twistmode" element={<TwistMode />} />
        <Route path="/classicmode" element={<ClassicMode />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;