import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MagazineLibrary from './pages/MagazineLibrary';
import DigitalReader from './pages/DigitalReader';
import Events from './pages/Events';
import AboutUs from './pages/AboutUs';
import AdminConsole from './pages/AdminConsole';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  // Hide shared chrome on the digital reader page for immersive reading
  const isReaderPage = location.pathname.startsWith('/reader/');

  return (
    <>
      <ScrollToTop />
      {!isReaderPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/magazines" element={<MagazineLibrary />} />
        <Route path="/reader/:id" element={<DigitalReader />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={<AdminConsole />} />
      </Routes>
      {!isReaderPage && <Footer />}
    </>
  );
}
