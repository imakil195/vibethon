import React, { useState } from 'react';
import { uploadPdf } from '../api/api';

/**
 * Props:
 *  - onResult(data) -> receives backend response JSON
 *  - onError(errMsg)
 */
export default function PdfUploader({ onResult, onError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function onUpload() {
    if (!file) return alert('Please choose a PDF file first.');
    setLoading(true);
    try {
      const data = await uploadPdf(file);
      onResult && onResult(data);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || 'Upload failed';
      onError && onError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="uploader">
      <input type="file" accept="application/pdf" onChange={onChange} />
      <div className="upload-actions">
        <button className="btn" onClick={onUpload} disabled={loading}>
          {loading ? 'Uploading…' : 'Upload & Parse'}
        </button>
        <button className="btn muted" onClick={() => setFile(null)}>Clear</button>
        <div className="hint">Tip: Text-based PDFs parse best. Scanned PDFs need OCR backend.</div>
      </div>
    </div>
  );
}
