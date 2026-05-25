import './EventCard.css';

export default function EventCard({ event, index = 0 }) {
  const { heading, details, eventDate, eventTime, publishedDate, whatsappNumber } = event;

  const formattedEventDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(`2000-01-01T${eventTime}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedPublished = new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const whatsappLink = `https://wa.me/${whatsappNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hi, I'd like to enquire about the event: "${heading}" on ${formattedEventDate}`
  )}`;

  return (
    <article
      className={`event-card card animate-fade-in-up delay-${Math.min(index + 1, 5)}`}
      id={`event-card-${event.id}`}
    >
      <div className="event-card__date-badge">
        <span className="event-card__date-day">
          {new Date(eventDate).getDate()}
        </span>
        <span className="event-card__date-month">
          {new Date(eventDate).toLocaleDateString('en-US', { month: 'short' })}
        </span>
      </div>
      <div className="event-card__body">
        <div className="event-card__meta">
          <span className="event-card__meta-item">
            <span className="material-symbols-outlined">schedule</span>
            {formattedTime}
          </span>
          <span className="event-card__meta-item">
            <span className="material-symbols-outlined">calendar_today</span>
            {formattedEventDate}
          </span>
        </div>
        <h3 className="event-card__heading">{heading}</h3>
        <p className="event-card__details">{details}</p>
        <div className="event-card__footer">
          <span className="event-card__published">Published {formattedPublished}</span>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm event-card__enquire"
            id={`event-enquire-${event.id}`}
          >
            <span className="material-symbols-outlined">chat</span>
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
