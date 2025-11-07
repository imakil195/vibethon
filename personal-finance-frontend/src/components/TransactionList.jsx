import React from 'react';

/**
 * parsed: array of transactions (optional)
 * grouped: object mapping merchant_key -> array (optional)
 */
export default function TransactionList({ parsed, grouped }) {
  if ((!parsed || parsed.length === 0) && (!grouped || Object.keys(grouped).length === 0)) {
    return <div className="muted">No transactions to display.</div>;
  }

  return (
    <div>
      {grouped && Object.keys(grouped).length > 0 && (
        <div className="grouped">
          <h5>Grouped by merchant</h5>
          {Object.entries(grouped).map(([merchant, txs]) => (
            <div key={merchant} className="group">
              <div className="group-head">
                <strong>{merchant}</strong> <span className="muted">({txs.length} tx)</span>
              </div>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Description</th><th>Amount</th><th>Match</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((t, i) => (
                    <tr key={i}>
                      <td>{t.txn_date ?? '-'}</td>
                      <td>{t.description ?? t.raw}</td>
                      <td>{t.amount ?? '-'}</td>
                      <td>{t.match_type ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {!grouped && parsed && parsed.length > 0 && (
        <div>
          <h5>Transactions</h5>
          <table className="tx-table">
            <thead>
              <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {parsed.map((t, i) => (
                <tr key={i}>
                  <td>{t.txn_date ?? '-'}</td>
                  <td>{t.description ?? t.raw}</td>
                  <td>{t.amount ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
