import { Link } from 'react-router-dom';
import './MagazineCard.css';

export default function MagazineCard({ magazine, index = 0 }) {
  const { id, title, description, publishDate, coverImage } = magazine;

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
      <div className="mag-card__cover">
        {coverImage ? (
          <img src={coverImage} alt={`${title} cover`} className="mag-card__img" />
        ) : (
          <div className="mag-card__placeholder">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
        )}
        <div className="mag-card__overlay">
          <Link to={`/reader/${id}`} className="btn btn-primary btn-sm">
            <span className="material-symbols-outlined">auto_stories</span>
            Read Now
          </Link>
        </div>
      </div>
      <div className="mag-card__body">
        <span className="badge badge-gold">{formattedDate}</span>
        <h3 className="mag-card__title">{title}</h3>
        <p className="mag-card__desc">{description}</p>
        <div className="mag-card__actions">
          <Link to={`/reader/${id}`} className="btn btn-outline btn-sm">
            <span className="material-symbols-outlined">visibility</span>
            Preview
          </Link>
          <Link to={`/reader/${id}`} className="btn btn-ghost btn-sm">
            <span className="material-symbols-outlined">download</span>
            Download
          </Link>
        </div>
      </div>
    </article>
  );
}
