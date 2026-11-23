/**
 * MedCore AI - Runtime Frontend Configuration
 * 
 * Deployment Instructions for GitHub Pages + Render:
 * 1. Deploy your Flask backend on Render (e.g., https://medcore-ai-backend.onrender.com).
 * 2. Set API_BASE_URL below to your Render backend URL (without a trailing slash).
 *    Example:
 *      API_BASE_URL: 'https://medcore-ai-backend.onrender.com'
 * 
 * You can also set or override the backend URL at runtime in your browser DevTools console:
 *      localStorage.setItem('medcore_api_url', 'https://your-service.onrender.com');
 *      location.reload();
 * 
 * If API_BASE_URL is left empty (''), all calls fall back to relative '/api/...' paths,
 * suitable for local monolithic development (python server.py).
 * 
 * If the backend is sleeping, starting up, or offline, MedCore AI automatically
 * falls back to client-side demo mode using in-memory mock datasets in js/data.js.
 */
const MedCoreConfig = {
    // Live Render backend URL
    API_BASE_URL: window.MEDCORE_API_URL || localStorage.getItem('medcore_api_url') || "https://eai-sem1.onrender.com"
};

/**
 * Resolves an API endpoint path against MedCoreConfig.API_BASE_URL.
 * Handles trailing/leading slashes cleanly.
 * @param {string} endpoint - API path (e.g. '/api/auth/login')
 * @returns {string} - Full URL or relative path
 */
function getApiUrl(endpoint) {
    const base = (window.MedCoreConfig && window.MedCoreConfig.API_BASE_URL)
        ? window.MedCoreConfig.API_BASE_URL.trim().replace(/\/+$/, '')
        : '';
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return base ? `${base}${path}` : path;
}

window.MedCoreConfig = MedCoreConfig;
window.getApiUrl = getApiUrl;
