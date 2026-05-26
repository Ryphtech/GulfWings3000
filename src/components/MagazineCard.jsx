import { Link } from 'react-router-dom';
import './MagazineCard.css';

export default function MagazineCard({ magazine, index = 0 }) {
  const { id, title, description, publishDate, pdfUrl } = magazine;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article
      className={`mag-card card animate-fade-in-up delay-${index + 1}`}
      id={`magazine-card-${id}`}
    >
      <div className="mag-card__body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-gold">{formattedDate}</span>
          <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)', fontSize: '20px' }}>menu_book</span>
        </div>
        <h3 className="mag-card__title" style={{ marginTop: 'var(--space-sm)' }}>{title}</h3>
        <p className="mag-card__desc">{description}</p>
        <div className="mag-card__actions" style={{ marginTop: 'var(--space-md)' }}>
          <Link to={`/reader/${id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
            <span className="material-symbols-outlined">auto_stories</span>
            Read Now
          </Link>
          <a
            href={pdfUrl}
            download
            className="btn btn-ghost btn-sm"
            target="_blank"
            rel="noopener noreferrer"
            title="Download PDF"
            style={{ width: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span className="material-symbols-outlined" style={{ margin: '0' }}>download</span>
          </a>
        </div>
      </div>
    </article>
  );
}
