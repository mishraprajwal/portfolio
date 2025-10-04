import React, { useEffect, useRef } from 'react';
import '../index.css';

const CaseStudyModal = ({ open, onClose, data }) => {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // focus the modal
    setTimeout(() => { if (innerRef.current) innerRef.current.focus(); }, 50);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open || !data) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="modal" role="document" onMouseDown={(e) => e.stopPropagation()} tabIndex={-1} ref={innerRef}>
        <button className="modal-close" aria-label="Close case study" onClick={onClose}>×</button>
        <header className="modal-header">
          <h3 className="modal-title">{data.company}</h3>
          <div className="modal-sub">{data.role} • <span className="period">{data.period}</span></div>
        </header>

        <div className="modal-body">
          <p className="muted">{data.location}</p>
          {data.details && data.details.length > 0 && (
            <ul className="modal-bullets">
              {data.details.map((d, i) => (<li key={i}>{d}</li>))}
            </ul>
          )}

          {data.tags && data.tags.length > 0 && (
            <div className="modal-tags">
              {data.tags.map((t, i) => (<span className="tag-chip" key={i}>{t}</span>))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;
