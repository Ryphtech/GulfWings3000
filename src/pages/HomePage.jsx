import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLatestMagazines, getUpcomingEvents } from '../data/store';
import MagazineCard from '../components/MagazineCard';
import heroBg from '../assets/hero-bg.png';
import './HomePage.css';

export default function HomePage() {
  const [magazines, setMagazines] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [magsData, evtsData] = await Promise.all([
          getLatestMagazines(3),
          getUpcomingEvents()
        ]);
        setMagazines(magsData);
        setEvents(evtsData.slice(0, 2));
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Animated counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat__number');
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.target, 10);
              const duration = 2000;
              const step = target / (duration / 16);
              let current = 0;
              const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                  counter.textContent = target + '+';
                  clearInterval(timer);
                } else {
                  counter.textContent = Math.floor(current) + '+';
                }
              }, 16);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper home" id="page-home">
      {/* ===== Hero ===== */}
      <section className="hero" id="hero-section">
        <div className="hero__bg">
          <img src={heroBg} alt="" className="hero__bg-img" />
          <div className="hero__bg-gradient" />
        </div>
        <div className="hero__content container">
          <span className="badge badge-gold animate-fade-in-up delay-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span>
            Premium Finance Publication
          </span>
          <h1 className="hero__title animate-fade-in-up delay-2">
            Your Gateway to<br />
            <span className="gold">Financial Intelligence</span>
          </h1>
          <p className="hero__subtitle animate-fade-in-up delay-3">
            Discover investment strategies, personal wealth insights, and money
            opportunities curated by industry experts. GulfWings3000 is your
            trusted guide to financial empowerment.
          </p>
          <div className="hero__cta animate-fade-in-up delay-4">
            {magazines.length > 0 && (
              <Link to={`/reader/${magazines[0].id}`} className="btn btn-primary btn-lg">
                <span className="material-symbols-outlined">auto_stories</span>
                Read Latest Edition
              </Link>
            )}
            <Link to="/magazines" className="btn btn-outline btn-lg">
              <span className="material-symbols-outlined">library_books</span>
              Explore Library
            </Link>
          </div>
        </div>
        <div className="hero__scroll-hint animate-fade-in delay-5">
          <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ===== Featured Editions ===== */}
      <section className="section" id="featured-editions">
        <div className="container">
          <div className="section-header">
            <h2>Featured Editions</h2>
            <p>
              Explore our latest monthly publications covering finance, investments,
              and wealth management.
            </p>
            <span className="gold-line" />
          </div>
          {loading ? (
            <div className="magazine-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="magazine-card glass loading-shimmer" style={{ height: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--gw-gold)', marginBottom: '10px' }}>menu_book</span>
                  <span style={{ color: 'var(--gw-text-muted)' }}>Loading edition...</span>
                </div>
              ))}
            </div>
          ) : magazines.length > 0 ? (
            <div className="magazine-grid">
              {magazines.map((mag, i) => (
                <MagazineCard key={mag.id} magazine={mag} index={i} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--gw-text-muted)' }}>
              No editions published yet. Check back soon!
            </p>
          )}
          <div className="section-cta" style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/magazines" className="btn btn-outline">
              View Full Library
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="section stats-section" ref={statsRef} id="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <span className="stat__number" data-target="50">0+</span>
              <span className="stat__label">Editions Published</span>
            </div>
            <div className="stat">
              <span className="stat__number" data-target="12000">0+</span>
              <span className="stat__label">Active Readers</span>
            </div>
            <div className="stat">
              <span className="stat__number" data-target="30">0+</span>
              <span className="stat__label">Events Hosted</span>
            </div>
            <div className="stat">
              <span className="stat__number" data-target="8">0+</span>
              <span className="stat__label">Years of Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Mission Snippet ===== */}
      <section className="section mission-section" id="mission-snippet">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <span className="badge badge-gold">Our Purpose</span>
              <h2>Empowering Financial Literacy</h2>
              <p>
                GulfWings3000 was founded with a singular vision — to democratize
                financial knowledge and empower individuals with the insights they
                need to build lasting wealth. We bridge the gap between complex
                financial markets and everyday investors.
              </p>
              <p>
                From investment analysis to personal finance strategies, our expert
                editorial team delivers curated content that helps you navigate the
                world of money with confidence.
              </p>
              <Link to="/about" className="btn btn-outline">
                Learn More About Us
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="mission-features">
              {[
                { icon: 'trending_up', title: 'Investment Analysis', desc: 'In-depth market research and trend forecasting' },
                { icon: 'account_balance_wallet', title: 'Personal Finance', desc: 'Practical strategies for saving and budgeting' },
                { icon: 'public', title: 'Global Markets', desc: 'Coverage of international financial developments' },
                { icon: 'school', title: 'Financial Education', desc: 'Expert guides for beginners and professionals' },
              ].map((f) => (
                <div className="mission-feature" key={f.icon}>
                  <span className="material-symbols-outlined mission-feature__icon">{f.icon}</span>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Upcoming Events Teaser ===== */}
      {(loading || events.length > 0) && (
        <section className="section" id="events-teaser">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <p>Join our exclusive finance events and connect with industry leaders.</p>
              <span className="gold-line" />
            </div>
            {loading ? (
              <div className="events-teaser-list">
                {[1, 2].map((n) => (
                  <div key={n} className="events-teaser-item glass loading-shimmer" style={{ display: 'flex', alignItems: 'center', padding: 'var(--space-md) var(--space-lg)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--gw-gold)', marginRight: '15px' }}>event</span>
                    <span style={{ color: 'var(--gw-text-muted)' }}>Loading event...</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="events-teaser-list">
                {events.map((evt) => (
                  <div className="events-teaser-item glass" key={evt.id}>
                    <div className="events-teaser-date">
                      <span className="events-teaser-day">{new Date(evt.eventDate).getDate()}</span>
                      <span className="events-teaser-month">
                        {new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="events-teaser-info">
                      <h4>{evt.heading}</h4>
                      <p>{evt.details?.slice(0, 120)}…</p>
                    </div>
                    <a
                      href={`https://wa.me/${evt.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'd like to enquire about "${evt.heading}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Enquire
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
              <Link to="/events" className="btn btn-outline">
                View All Events
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
