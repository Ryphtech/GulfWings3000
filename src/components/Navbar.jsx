import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/magazines', label: 'Magazines' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
        <div className="navbar__inner container">
          {/* Brand */}
          <Link to="/" className="navbar__brand" id="nav-brand">
            <span className="navbar__logo-icon material-symbols-outlined">diamond</span>
            <span className="navbar__logo-text">
              Gulf<span className="gold">Wings</span>3000
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar__links" id="nav-links-desktop">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Admin + Hamburger */}
          <div className="navbar__actions">

            <button
              className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`navbar__overlay ${menuOpen ? 'navbar__overlay--visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`} id="nav-drawer">
        <div className="navbar__drawer-header">
          <span className="navbar__logo-text">
            Gulf<span className="gold">Wings</span>3000
          </span>
        </div>
        <ul className="navbar__drawer-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

        </ul>
      </aside>
    </>
  );
}
