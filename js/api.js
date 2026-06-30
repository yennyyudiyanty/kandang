const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('jjrolu_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${CONFIG.API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
      const data = await res.json();
      if (res.status === 401) { Auth.logout(); return null; }
      return data;
    } catch {
      showToast('Koneksi server bermasalah. Coba lagi.', 'error');
      return null;
    }
  },
  get: (endpoint) => API.request(endpoint),
  post: (endpoint, body) => API.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => API.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => API.request(endpoint, { method: 'DELETE' })
};

const Auth = {
  getUser() { try { return JSON.parse(localStorage.getItem('jjrolu_user')); } catch { return null; } },
  getToken() { return localStorage.getItem('jjrolu_token'); },
  isLoggedIn() { return !!this.getToken(); },
  isOwner() { return this.getUser()?.role === 'owner'; },
  isAdmin() { return ['owner', 'admin'].includes(this.getUser()?.role); },
  canAccessBiaya() { const u = this.getUser(); return u?.role === 'owner' || u?.biaya_access === 1; },
  save(token, user) {
    localStorage.setItem('jjrolu_token', token);
    localStorage.setItem('jjrolu_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('jjrolu_token');
    localStorage.removeItem('jjrolu_user');
    localStorage.removeItem('jjrolu_farm');
    window.location.href = '/kandang/';
  }
};

function showToast(message, type = 'info') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatRupiah(num) {
  if (!num) return 'Rp 0';
  return 'Rp ' + parseInt(num).toLocaleString('id-ID');
}

function keepAlive() {
  setInterval(() => {
    fetch(`${CONFIG.API_URL}/ping`).catch(() => {});
  }, 4 * 60 * 1000);
}
