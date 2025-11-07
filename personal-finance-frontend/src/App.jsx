import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FixedCosts from './pages/FixedCosts';
import UploadPage from './pages/UploadPage';

export default function App() {
  const [route, setRoute] = useState('fixed-costs'); // 'fixed-costs' | 'upload'

  return (
    <div className="app-root">
      <Sidebar route={route} onNavigate={setRoute} />
      <main className="main-content">
        {route === 'fixed-costs' && <FixedCosts />}
        {route === 'upload' && <UploadPage />}
      </main>
    </div>
  );
}
