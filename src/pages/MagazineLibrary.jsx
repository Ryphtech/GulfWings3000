import { useEffect, useState } from 'react';
import { getLatestMagazines } from '../data/store';
import MagazineCard from '../components/MagazineCard';
import './MagazineLibrary.css';

export default function MagazineLibrary() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const data = await getLatestMagazines(3);
        setMagazines(data);
      } catch (err) {
        console.error('Error fetching magazines:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  return (
    <div className="page-wrapper" id="page-magazines">
      {/* Page Header */}
      <section className="page-hero" id="magazines-hero">
        <div className="container">
          <span className="badge badge-gold animate-fade-in-up delay-1">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>library_books</span>
            Publications
          </span>
          <h1 className="page-hero__title animate-fade-in-up delay-2">Magazine Library</h1>
          <p className="page-hero__subtitle animate-fade-in-up delay-3">
            Browse our curated collection of monthly finance editions. Each publication
            is crafted with expert insights on investments, wealth management, and
            personal finance strategies.
          </p>
        </div>
      </section>

      {/* Magazine Grid */}
      <section className="section" id="magazines-grid">
        <div className="container">
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
            <>
              <div className="mag-library-info">
                <span className="material-symbols-outlined">info</span>
                Showing the latest {magazines.length} edition{magazines.length !== 1 ? 's' : ''}.
              </div>
              <div className="magazine-grid">
                {magazines.map((mag, i) => (
                  <MagazineCard key={mag.id} magazine={mag} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="mag-library-empty">
              <span className="material-symbols-outlined mag-library-empty__icon">menu_book</span>
              <h3>No Editions Yet</h3>
              <p>
                Our editorial team is preparing the first edition. Check back soon
                for premium finance content!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
