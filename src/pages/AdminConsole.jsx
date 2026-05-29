import { useState, useEffect, useCallback } from 'react';
import {
  isAdminLoggedIn,
  adminLogin,
  adminLogout,
  getMagazines,
  addMagazine,
  editMagazine,
  deleteMagazine,
  getEvents,
  addEvent,
  editEvent,
  deleteEvent,
} from '../data/store';
import './AdminConsole.css';

/* ===== Toast System ===== */
function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}

/* ===== Admin Console ===== */
export default function AdminConsole() {
  const [authenticated, setAuthenticated] = useState(isAdminLoggedIn());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('magazines');
  const { showToast, ToastContainer } = useToast();

  // Loading states
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Magazine state
  const [magazines, setMagazinesState] = useState([]);
  const [magForm, setMagForm] = useState({
    title: '', description: '', publishDate: '', pdfUrl: '',
  });
  const [editingMagazine, setEditingMagazine] = useState(null);

  // Event state
  const [events, setEventsState] = useState([]);
  const [evtForm, setEvtForm] = useState({
    heading: '', details: '', eventDate: '', eventTime: '', whatsappNumber: '+971500000000',
  });
  const [editingEvent, setEditingEvent] = useState(null);

  const refreshData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [magsData, evtsData] = await Promise.all([
        getMagazines(),
        getEvents()
      ]);
      setMagazinesState(magsData);
      setEventsState(evtsData);
    } catch (err) {
      console.error('Error refreshing dashboard data:', err);
      showToast('Error loading data from database.', 'error');
    } finally {
      setLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (authenticated) refreshData();
  }, [authenticated, refreshData]);

  /* --- Login --- */
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setAuthenticated(false);
  };

  /* --- Magazine Handlers --- */
  const handleAddMagazine = async (e) => {
    e.preventDefault();
    if (!magForm.title || !magForm.publishDate || !magForm.pdfUrl) {
      showToast('Please fill in title, publish date, and PDF URL.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addMagazine(magForm);
      setMagForm({ title: '', description: '', publishDate: '', pdfUrl: '' });
      await refreshData();
      showToast('Magazine added successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to add magazine. Please check your inputs.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMagazine = (mag) => {
    setEditingMagazine(mag.id);
    setMagForm({
      title: mag.title,
      description: mag.description,
      publishDate: mag.publishDate,
      pdfUrl: mag.pdfUrl,
    });
  };

  const handleUpdateMagazine = async (e) => {
    e.preventDefault();
    if (!magForm.title || !magForm.publishDate || !magForm.pdfUrl) {
      showToast('Please fill in title, publish date, and PDF URL.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await editMagazine(editingMagazine, magForm);
      setEditingMagazine(null);
      setMagForm({ title: '', description: '', publishDate: '', pdfUrl: '' });
      await refreshData();
      showToast('Magazine updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update magazine.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEditMagazine = () => {
    setEditingMagazine(null);
    setMagForm({ title: '', description: '', publishDate: '', pdfUrl: '' });
  };

  const handleDeleteMagazine = async (id, title) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      setSubmitting(true);
      try {
        await deleteMagazine(id);
        await refreshData();
        showToast('Magazine deleted.', 'info');
      } catch (err) {
        console.error(err);
        showToast('Failed to delete magazine.', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  };

  /* --- Event Handlers --- */
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!evtForm.heading || !evtForm.eventDate) {
      showToast('Please fill in event heading and date.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addEvent(evtForm);
      setEvtForm({ heading: '', details: '', eventDate: '', eventTime: '', whatsappNumber: '+971500000000' });
      await refreshData();
      showToast('Event published successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to publish event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (evt) => {
    setEditingEvent(evt.id);
    setEvtForm({
      heading: evt.heading,
      details: evt.details,
      eventDate: evt.eventDate,
      eventTime: evt.eventTime,
      whatsappNumber: evt.whatsappNumber,
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!evtForm.heading || !evtForm.eventDate) {
      showToast('Please fill in event heading and date.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await editEvent(editingEvent, evtForm);
      setEditingEvent(null);
      setEvtForm({ heading: '', details: '', eventDate: '', eventTime: '', whatsappNumber: '+971500000000' });
      await refreshData();
      showToast('Event updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEvtForm({ heading: '', details: '', eventDate: '', eventTime: '', whatsappNumber: '+971500000000' });
  };

  const handleDeleteEvent = async (id, heading) => {
    if (confirm(`Delete event "${heading}"?`)) {
      setSubmitting(true);
      try {
        await deleteEvent(id);
        await refreshData();
        showToast('Event deleted.', 'info');
      } catch (err) {
        console.error(err);
        showToast('Failed to delete event.', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  };

  /* ===== Login Gate ===== */
  if (!authenticated) {
    return (
      <div className="page-wrapper admin-login-page" id="page-admin-login">
        <div className="admin-login-card glass animate-fade-in-up">
          <div className="admin-login-card__header">
            <span className="material-symbols-outlined admin-login-icon">admin_panel_settings</span>
            <h2>Admin Console</h2>
            <p>Enter the admin password to access the dashboard.</p>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                type="password"
                id="admin-password"
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {loginError && (
              <p className="admin-login-error">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                {loginError}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="admin-login-btn">
              <span className="material-symbols-outlined">lock_open</span>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ===== Dashboard ===== */
  return (
    <div className="page-wrapper admin" id="page-admin">
      <ToastContainer />

      {/* Header */}
      <section className="admin-header" id="admin-header">
        <div className="container">
          <div className="admin-header__inner">
            <div>
              <h1 className="admin-header__title">
                <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)', fontSize: '36px' }}>
                  dashboard
                </span>
                Admin Console
              </h1>
              <p className="admin-header__subtitle">Manage your magazine editions and events</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} id="admin-logout-btn">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container">
        <div className="admin-tabs" id="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'magazines' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('magazines')}
            id="admin-tab-magazines"
          >
            <span className="material-symbols-outlined">menu_book</span>
            Manage Magazines
            <span className="admin-tab__count">{magazines.length}</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'events' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('events')}
            id="admin-tab-events"
          >
            <span className="material-symbols-outlined">event</span>
            Manage Events
            <span className="admin-tab__count">{events.length}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container admin-content">
        {/* ===== Magazines Tab ===== */}
        {activeTab === 'magazines' && (
          <div className="admin-panel animate-fade-in" id="admin-magazines-panel">
            <div className="admin-panel-grid">
              {/* Add Magazine Form */}
              <div className="admin-form-card glass" id="admin-add-magazine">
                <h3>
                  <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)' }}>
                    {editingMagazine ? 'edit' : 'add_circle'}
                  </span>
                  {editingMagazine ? 'Edit Magazine' : 'Add New Magazine'}
                </h3>
                <form onSubmit={editingMagazine ? handleUpdateMagazine : handleAddMagazine}>
                  <div className="form-group">
                    <label htmlFor="mag-title">Title *</label>
                    <input
                      type="text"
                      id="mag-title"
                      className="form-input"
                      placeholder="e.g. The Future of Wealth"
                      value={magForm.title}
                      onChange={(e) => setMagForm({ ...magForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mag-desc">Description</label>
                    <textarea
                      id="mag-desc"
                      className="form-textarea"
                      placeholder="Brief description of this edition…"
                      value={magForm.description}
                      onChange={(e) => setMagForm({ ...magForm, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mag-date">Publish Date *</label>
                    <input
                      type="date"
                      id="mag-date"
                      className="form-input"
                      value={magForm.publishDate}
                      onChange={(e) => setMagForm({ ...magForm, publishDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mag-pdf">PDF URL *</label>
                    <input
                      type="url"
                      id="mag-pdf"
                      className="form-input"
                      placeholder="https://drive.google.com/file/..."
                      value={magForm.pdfUrl}
                      onChange={(e) => setMagForm({ ...magForm, pdfUrl: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn btn-primary" id="admin-mag-submit" disabled={submitting}>
                      <span className="material-symbols-outlined">
                        {submitting ? 'hourglass_empty' : (editingMagazine ? 'save' : 'publish')}
                      </span>
                      {submitting ? 'Saving...' : (editingMagazine ? 'Update Magazine' : 'Publish Magazine')}
                    </button>
                    {editingMagazine && (
                      <button type="button" className="btn btn-ghost" onClick={handleCancelEditMagazine} disabled={submitting}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Magazine List */}
              <div className="admin-list" id="admin-magazine-list">
                <h3>
                  <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)' }}>library_books</span>
                  Published Editions ({magazines.length})
                </h3>
                {loadingData ? (
                  <p className="admin-list-empty">Loading magazines from database...</p>
                ) : magazines.length === 0 ? (
                  <p className="admin-list-empty">No magazines published yet.</p>
                ) : (
                  <div className="admin-list-items">
                    {magazines.map((mag) => (
                      <div className="admin-list-item" key={mag.id}>
                        <div className="admin-list-item__thumb">
                          {mag.coverImage ? (
                            <img src={mag.coverImage} alt={mag.title} />
                          ) : (
                            <span className="material-symbols-outlined">menu_book</span>
                          )}
                        </div>
                        <div className="admin-list-item__info">
                          <h4>{mag.title}</h4>
                          <span className="admin-list-item__meta">
                            {new Date(mag.publishDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="admin-list-item__actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleEditMagazine(mag)}
                            title="Edit"
                            disabled={submitting}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMagazine(mag.id, mag.title)}
                            disabled={submitting}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Events Tab ===== */}
        {activeTab === 'events' && (
          <div className="admin-panel animate-fade-in" id="admin-events-panel">
            <div className="admin-panel-grid">
              {/* Add/Edit Event Form */}
              <div className="admin-form-card glass" id="admin-add-event">
                <h3>
                  <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)' }}>
                    {editingEvent ? 'edit' : 'add_circle'}
                  </span>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}>
                  <div className="form-group">
                    <label htmlFor="evt-heading">Event Heading *</label>
                    <input
                      type="text"
                      id="evt-heading"
                      className="form-input"
                      placeholder="e.g. Global Investment Summit 2026"
                      value={evtForm.heading}
                      onChange={(e) => setEvtForm({ ...evtForm, heading: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="evt-details">Event Details</label>
                    <textarea
                      id="evt-details"
                      className="form-textarea"
                      placeholder="Describe the event…"
                      value={evtForm.details}
                      onChange={(e) => setEvtForm({ ...evtForm, details: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-row">
                    <div className="form-group">
                      <label htmlFor="evt-date">Event Date *</label>
                      <input
                        type="date"
                        id="evt-date"
                        className="form-input"
                        value={evtForm.eventDate}
                        onChange={(e) => setEvtForm({ ...evtForm, eventDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="evt-time">Event Time</label>
                      <input
                        type="time"
                        id="evt-time"
                        className="form-input"
                        value={evtForm.eventTime}
                        onChange={(e) => setEvtForm({ ...evtForm, eventTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="evt-whatsapp">WhatsApp Number</label>
                    <input
                      type="text"
                      id="evt-whatsapp"
                      className="form-input"
                      placeholder="+971500000000"
                      value={evtForm.whatsappNumber}
                      onChange={(e) => setEvtForm({ ...evtForm, whatsappNumber: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn btn-primary" id="admin-evt-submit" disabled={submitting}>
                      <span className="material-symbols-outlined">
                        {submitting ? 'hourglass_empty' : (editingEvent ? 'save' : 'publish')}
                      </span>
                      {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Publish Event')}
                    </button>
                    {editingEvent && (
                      <button type="button" className="btn btn-ghost" onClick={handleCancelEdit} disabled={submitting}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Event List */}
              <div className="admin-list" id="admin-event-list">
                <h3>
                  <span className="material-symbols-outlined" style={{ color: 'var(--gw-gold)' }}>event_note</span>
                  Published Events ({events.length})
                </h3>
                {loadingData ? (
                  <p className="admin-list-empty">Loading events from database...</p>
                ) : events.length === 0 ? (
                  <p className="admin-list-empty">No events published yet.</p>
                ) : (
                  <div className="admin-list-items">
                    {events.map((evt) => (
                      <div className="admin-list-item" key={evt.id}>
                        <div className="admin-list-item__date-badge">
                          <span>{new Date(evt.eventDate).getDate()}</span>
                          <span>{new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                        <div className="admin-list-item__info">
                          <h4>{evt.heading}</h4>
                          <span className="admin-list-item__meta">
                            {new Date(evt.eventDate).toLocaleDateString()} · {evt.eventTime || 'TBA'}
                          </span>
                        </div>
                        <div className="admin-list-item__actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleEditEvent(evt)}
                            title="Edit"
                            disabled={submitting}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteEvent(evt.id, evt.heading)}
                            title="Delete"
                            disabled={submitting}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
