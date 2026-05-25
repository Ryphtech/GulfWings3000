import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { getMagazineById } from '../data/store';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './DigitalReader.css';

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function getGoogleDriveEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return null;
}

export default function DigitalReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [magazine, setMagazine] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  useEffect(() => {
    async function loadMagazine() {
      try {
        const data = await getMagazineById(id);
        setMagazine(data);
      } catch (err) {
        console.error('Error fetching magazine:', err);
      } finally {
        setFetching(false);
      }
    }
    loadMagazine();
  }, [id]);

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error('react-pdf load error:', err);
    setUseIframeFallback(true);
    setLoading(false);
  }, []);

  const goToPage = (p) => {
    if (p >= 1 && p <= numPages) setPageNumber(p);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

  if (fetching) {
    return (
      <div className="page-wrapper reader-loading" id="page-reader" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gw-bg-dark)' }}>
        <div className="reader-loading__spinner" />
        <p style={{ marginTop: '15px', color: 'var(--gw-text-muted)', fontFamily: 'var(--gw-font-body)' }}>Loading magazine data...</p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="page-wrapper reader-not-found" id="page-reader">
        <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + var(--space-4xl))' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '72px', color: 'var(--gw-text-muted)' }}>
            error_outline
          </span>
          <h2 style={{ margin: 'var(--space-lg) 0' }}>Magazine Not Found</h2>
          <p style={{ color: 'var(--gw-text-muted)', marginBottom: 'var(--space-xl)' }}>
            The magazine you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/magazines" className="btn btn-primary">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const driveEmbedUrl = getGoogleDriveEmbedUrl(magazine?.pdfUrl);
  const isGoogleDrive = !!driveEmbedUrl;
  const isIframeMode = isGoogleDrive || useIframeFallback;

  return (
    <div className={`page-wrapper reader ${isFullscreen ? 'reader--fullscreen' : ''}`} id="page-reader">
      {/* Reader Toolbar */}
      <div className="reader-toolbar" id="reader-toolbar">
        <div className="reader-toolbar__left">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} id="reader-back-btn">
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <div className="reader-toolbar__divider" />
          <h3 className="reader-toolbar__title">{magazine.title}</h3>
        </div>
        {!isIframeMode && (
          <div className="reader-toolbar__center">
            <button
              className="reader-toolbar__btn"
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              title="Previous page"
              id="reader-prev-btn"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="reader-toolbar__page-info">
              <input
                type="number"
                className="reader-toolbar__page-input"
                value={pageNumber}
                min={1}
                max={numPages || 1}
                onChange={(e) => goToPage(parseInt(e.target.value, 10))}
                id="reader-page-input"
              />
              <span>/ {numPages || '–'}</span>
            </span>
            <button
              className="reader-toolbar__btn"
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= numPages}
              title="Next page"
              id="reader-next-btn"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
        <div className="reader-toolbar__right">
          {!isIframeMode && (
            <>
              <button className="reader-toolbar__btn" onClick={zoomOut} title="Zoom out" id="reader-zoom-out">
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
              <span className="reader-toolbar__zoom-level">{Math.round(scale * 100)}%</span>
              <button className="reader-toolbar__btn" onClick={zoomIn} title="Zoom in" id="reader-zoom-in">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <div className="reader-toolbar__divider" />
            </>
          )}
          <button className="reader-toolbar__btn" onClick={toggleFullscreen} title="Fullscreen" id="reader-fullscreen">
            <span className="material-symbols-outlined">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
          <a
            href={magazine.pdfUrl}
            download
            className="btn btn-primary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
            id="reader-download-btn"
          >
            <span className="material-symbols-outlined">download</span>
            Download
          </a>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className={`reader-viewport ${isIframeMode ? 'reader-viewport--iframe' : ''}`} id="reader-viewport">
        {isIframeMode ? (
          <iframe
            src={isGoogleDrive ? driveEmbedUrl : magazine.pdfUrl}
            title={magazine.title}
            className="reader-iframe"
            allow="autoplay; fullscreen"
          />
        ) : (
          <>
            {loading && !error && (
              <div className="reader-loading">
                <div className="reader-loading__spinner" />
                <p>Loading magazine…</p>
              </div>
            )}
            {error && (
              <div className="reader-error">
                <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>warning</span>
                <h3>Failed to load PDF</h3>
                <p>The magazine PDF could not be loaded. Please try again or download directly.</p>
                <a href={magazine.pdfUrl} download className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  <span className="material-symbols-outlined">download</span>
                  Download PDF
                </a>
              </div>
            )}
            <Document
              file={magazine.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              className="reader-document"
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="reader-page"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </>
        )}
      </div>
    </div>
  );
}
