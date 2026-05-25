import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="site-footer">
      <div className="footer__gold-line" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand">
              <span className="material-symbols-outlined footer__brand-icon">diamond</span>
              <span className="footer__brand-text">
                Gulf<span className="gold">Wings</span>3000
              </span>
            </Link>
            <p className="footer__tagline">
              Your premium guide to finance investments, personal wealth, and money opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/magazines">Magazines</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer__col">
            <h4 className="footer__heading">Resources</h4>
            <ul className="footer__list">
              <li><Link to="/magazines">Latest Edition</Link></li>
              <li><Link to="/events">Upcoming Events</Link></li>
              <li><Link to="/admin">Admin Console</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__list">
              <li>
                <a
                  href="https://wa.me/971500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__whatsapp"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@gulfwings3000.com">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                  info@gulfwings3000.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p>&copy; {year} GulfWings3000. All rights reserved.</p>
          <p className="footer__credit">Premium Finance Magazine Platform</p>
        </div>
      </div>
    </footer>
  );
}
