import React from 'react';

export default function Sidebar({ route, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2 className="brand">
          <span role="img" aria-label="logo" style={{ fontSize: '28px' }}>💰</span>
          FinSight
        </h2>
        <p className="brand-sub">Your Monthly Finance Tracker</p>
      </div>

      <nav className="nav">
        <button
          className={`nav-item ${route === 'fixed-costs' ? 'active' : ''}`}
          onClick={() => onNavigate('fixed-costs')}
        >
          <span role="img" aria-label="fixed costs">📊</span>
          Monthly Costs
        </button>
        <button
          className={`nav-item ${route === 'upload' ? 'active' : ''}`}
          onClick={() => onNavigate('upload')}
        >
          <span role="img" aria-label="upload">📄</span>
          Statement Upload
        </button>
      </nav>

      <div className="sidebar-footer">
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          <span role="img" aria-label="info" style={{ marginRight: '6px' }}>ℹ️</span>
          Your data is saved locally in your browser
        </p>
      </div>
    </aside>
  );
}
