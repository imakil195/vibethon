import React, { useState } from 'react';
import PdfUploader from '../components/PdfUploader';
import TransactionList from '../components/TransactionList';

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleResult(data) {
    setError(null);
    setResult(data);
  }

  function handleError(errMsg) {
    setError(errMsg);
  }

  return (
    <section className="page">
      <h3>Upload Bank Statement (PDF)</h3>
      <p className="lead">Upload a bank or card statement PDF. The backend should parse it and return transactions (date, description, amount).</p>

      <PdfUploader onResult={handleResult} onError={handleError} />

      {error && <div className="alert">{error}</div>}

      {result && (
        <div className="mt-6">
          <h4>Parsed Transactions</h4>
          <TransactionList parsed={result.parsedTransactions} grouped={result.groupedByMerchant} />
        </div>
      )}
    </section>
  );
}
