import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Mock data for testing without backend
const MOCK_TRANSACTIONS = {
  groupedByMerchant: {
    "Amazon": [
      { date: "2025-11-01", description: "Amazon Prime Subscription", amount: -14.99, match: "subscription" },
      { date: "2025-11-03", description: "Amazon.com - Office Supplies", amount: -45.32, match: "shopping" }
    ],
    "Netflix": [
      { date: "2025-11-02", description: "Netflix Monthly", amount: -15.49, match: "subscription" }
    ],
    "Trader Joe's": [
      { date: "2025-11-04", description: "Trader Joe's Grocery", amount: -89.74, match: "groceries" },
      { date: "2025-11-07", description: "Trader Joe's", amount: -32.15, match: "groceries" }
    ]
  },
  parsedTransactions: [
    { date: "2025-11-01", description: "Amazon Prime Subscription", amount: -14.99, match: "subscription" },
    { date: "2025-11-02", description: "Netflix Monthly", amount: -15.49, match: "subscription" },
    { date: "2025-11-03", description: "Amazon.com - Office Supplies", amount: -45.32, match: "shopping" },
    { date: "2025-11-04", description: "Trader Joe's Grocery", amount: -89.74, match: "groceries" },
    { date: "2025-11-07", description: "Trader Joe's", amount: -32.15, match: "groceries" }
  ]
};

/**
 * Upload PDF and get parsed transactions
 * @param {File} file PDF file to upload
 * @returns {Promise<{ groupedByMerchant?: object, parsedTransactions: Array }>}
 */
export async function uploadPdf(file) {
  // If mock mode or no API base configured, return mock data
  if (USE_MOCK || !API_BASE) {
    console.log('Using mock data (VITE_USE_MOCK=true or no API_BASE)');
    return Promise.resolve(MOCK_TRANSACTIONS);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE}/api/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('PDF upload failed:', error);
    
    // If backend unreachable, fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
      console.log('Backend unreachable, using mock data');
      return MOCK_TRANSACTIONS;
    }

    // Re-throw other errors (like CORS) so UI can show proper message
    throw error;
  }
}

/**
 * Check if backend is reachable
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  if (USE_MOCK || !API_BASE) return false;
  
  try {
    await axios.get(`${API_BASE}/health`);
    return true;
  } catch {
    return false;
  }
}
