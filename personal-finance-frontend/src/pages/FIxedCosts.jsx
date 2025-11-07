import React, { useEffect, useState } from 'react';

/**
 * Comprehensive fixed costs + subscription seed list.
 * Stored in localStorage under key 'pf_fixed_costs'
 */
const SEED_FIXED_COSTS = [
  // Housing & utilities
  "Rent",
  "Mortgage",
  "Property Tax",
  "HOA Fees",
  "Home Insurance",
  "Electricity",
  "Water",
  "Gas",
  "Sewer",
  "Trash",
  "Internet",
  "Landline",

  // Phones & connectivity
  "Mobile Phone",

  // Transport & vehicle
  "Car Loan",
  "Car Insurance",
  "Fuel",
  "Parking",
  "Public Transit Pass",

  // Insurance & health
  "Health Insurance",
  "Dental Insurance",
  "Life Insurance",
  "Disability Insurance",
  "Pet Insurance",

  // Loans & credit
  "Student Loan",
  "Personal Loan",
  "Credit Card Payment",
  "Mortgage Payment",

  // Subscriptions: streaming, music & media
  "Netflix",
  "Amazon Prime",
  "Prime Video",
  "Disney+",
  "Disney+ Hotstar",
  "Hulu",
  "Hotstar",
  "HBO Max",
  "YouTube Premium",
  "Apple TV+",
  "SonyLIV",
  "Zee5",
  "JioSaavn",
  "Gaana",
  "Spotify",
  "Apple Music",
  "Audible",

  // Cloud, tools & software
  "Google One",
  "iCloud",
  "Dropbox",
  "Adobe Creative Cloud",
  "Microsoft 365",
  "Domain Hosting",
  "Web Hosting",
  "Zoom Pro",
  "Notion (paid)",
  "Figma (paid)",

  // Productivity / membership
  "Gym Membership",
  "Childcare/Daycare",
  "School Tuition",
  "401k Contribution",
  "Brokerage Auto-Invest",
  "Cleaning Service",
  "Estimated Taxes",
  "Emergency Fund Transfer"
];

function readSaved() {
  try {
    const raw = localStorage.getItem('pf_fixed_costs');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAll(obj) {
  try {
    localStorage.setItem('pf_fixed_costs', JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed to save fixed costs', e);
  }
}

/** convert value object to monthly numeric amount (based on frequency) */
function toMonthly(amountStr, frequency) {
  const val = parseFloat(amountStr);
  if (!isFinite(val)) return 0;
  switch (frequency) {
    case 'monthly': return val;
    case 'quarterly': return val / 3;
    case 'yearly': return val / 12;
    default: return val;
  }
}

/** whether a value entry is "active" (non-empty and non-zero) */
function isActiveEntry(entry) {
  if (!entry) return false;
  const amount = parseFloat(entry.amount);
  if (!isFinite(amount)) return false;
  return Math.abs(amount) > 0.000001;
}

export default function FixedCosts() {
  const [values, setValues] = useState(() => readSaved()); // {name: {amount, frequency, notes}}
  const [hideZero, setHideZero] = useState(false);

  useEffect(() => {
    // ensure seed entries exist in state (with empty defaults)
    const initial = { ...values };
    SEED_FIXED_COSTS.forEach(name => {
      if (!initial[name]) initial[name] = { amount: '', frequency: 'monthly', notes: '' };
    });
    setValues(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(name, field, val) {
    // Ensure numeric inputs are stored as strings; keep freedom for empty
    const next = { ...values, [name]: { ...values[name], [field]: val } };
    setValues(next);
    saveAll(next);
  }

  function handleClear(name) {
    const next = { ...values, [name]: { amount: '', frequency: 'monthly', notes: '' } };
    setValues(next);
    saveAll(next);
  }

  function handleAddCustom() {
    const custom = prompt('Enter new fixed cost name (e.g., "Phone Insurance")');
    if (!custom) return;
    if (values[custom]) return alert('Item already exists');
    const next = { ...values, [custom]: { amount: '', frequency: 'monthly', notes: '' } };
    setValues(next);
    saveAll(next);
  }

  // compute totals (monthly)
  const activeEntries = Object.entries(values || {}).filter(([name, entry]) => isActiveEntry(entry));
  const totalMonthly = activeEntries.reduce((sum, [, entry]) => {
    return sum + toMonthly(entry.amount, entry.frequency);
  }, 0);

  // optionally hide zero entries from the grid view
  const entriesToShow = Object.entries(values || {}).filter(([name, entry]) => {
    if (!hideZero) return true;
    return isActiveEntry(entry);
  });

  return (
    <section className="page">
      <div className="monthly-summary">
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value total-value">{isFinite(totalMonthly) ? `₹${totalMonthly.toFixed(0)}` : '₹0'}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Daily Average</div>
            <div className="summary-value">{isFinite(totalMonthly) ? `₹${(totalMonthly / 30).toFixed(0)}` : '₹0'}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Active Items</div>
            <div className="summary-value">{activeEntries.length}</div>
          </div>
        </div>
        
        <div className="show-all-items">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--muted)' }}>
            <input 
              type="checkbox" 
              checked={!hideZero} 
              onChange={(e) => setHideZero(!e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            All Items
          </label>
        </div>
      </div>
      
      <div className="page-header">
        <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'var(--muted)' }}>Track your monthly expenses</h3>
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={handleAddCustom}>
          + Add custom fixed cost
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            if (!confirm('Reset all fixed costs and clear saved values?')) return;
            localStorage.removeItem('pf_fixed_costs');
            setValues({});
            // re-seed
            const initial = {};
            SEED_FIXED_COSTS.forEach(name => {
              initial[name] = { amount: '', notes: '' };
            });
            setValues(initial);
          }}
        >
          Reset all
        </button>
      </div>

      <div className="fixed-costs">
        {entriesToShow.map(([name]) => {
          const v = values[name] || { amount: '', notes: '' };
          return (
            <div key={name} className="cost-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div className="cost-title">{name}</div>
                <button 
                  className="small-muted" 
                  onClick={() => handleClear(name)}
                  style={{ padding: '4px 8px', fontSize: '13px', color: 'var(--muted)' }}
                >
                  Clear
                </button>
              </div>
              
              <div style={{ marginBottom: '16px', fontSize: '24px', fontWeight: '600' }}>
                ₹{v.amount || '0'}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  className="input"
                  type="number"
                  step="1"
                  value={v.amount}
                  onChange={(e) => handleChange(name, 'amount', e.target.value)}
                  placeholder="Monthly amount"
                  style={{ marginBottom: '4px' }}
                />
                
                <input
                  className="input"
                  type="text"
                  value={v.notes}
                  onChange={(e) => handleChange(name, 'notes', e.target.value)}
                  placeholder="Notes (optional)"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

