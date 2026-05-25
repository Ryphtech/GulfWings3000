import { useEffect, useState } from 'react';
import { getEvents } from '../data/store';
import EventCard from '../components/EventCard';
import './Events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = events.filter((e) => e.eventDate >= today);
  const past = events.filter((e) => e.eventDate < today);

  return (
    <div className="page-wrapper" id="page-events">
      {/* Page Header */}
      <section className="page-hero" id="events-hero">
        <div className="container">
          <span className="badge badge-gold animate-fade-in-up delay-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event</span>
            Finance Events
          </span>
          <h1 className="page-hero__title animate-fade-in-up delay-2">Investment Events</h1>
          <p className="page-hero__subtitle animate-fade-in-up delay-3">
            Connect with industry leaders at our exclusive finance events. From
            investment summits to personal finance workshops, expand your financial
            knowledge network.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section" id="upcoming-events">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left' }}>
            <h2>
              <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)', verticalAlign: 'middle', marginRight: '8px' }}>
                upcoming
              </span>
              Upcoming Events
            </h2>
            <span className="gold-line" style={{ margin: 'var(--space-md) 0 0' }} />
          </div>

          {loading ? (
            <div className="events-list">
              {[1, 2].map((n) => (
                <div key={n} className="events-empty glass loading-shimmer" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 'var(--space-lg) var(--space-xl)', height: '140px', gap: '30px', border: '1px solid rgba(201, 168, 76, 0.1)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--gw-gold)' }}>event</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '20px', width: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                    <div style={{ height: '14px', width: '80%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="events-list">
              {upcoming.map((evt, i) => (
                <EventCard key={evt.id} event={evt} index={i} />
              ))}
            </div>
          ) : (
            <div className="events-empty glass">
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--gw-text-muted)' }}>
                event_busy
              </span>
              <h3>No Upcoming Events</h3>
              <p>Stay tuned — we're planning exciting finance events. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="section" id="past-events">
          <div className="container">
            <div className="section-header" style={{ textAlign: 'left' }}>
              <h2 style={{ color: 'var(--gw-text-muted)' }}>
                <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  history
                </span>
                Past Events
              </h2>
              <span className="gold-line" style={{ margin: 'var(--space-md) 0 0' }} />
            </div>
            <div className="events-list events-list--past">
              {past.map((evt, i) => (
                <EventCard key={evt.id} event={evt} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
