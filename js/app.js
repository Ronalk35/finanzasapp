// ============================================================
// app.js – Núcleo: API, Autenticación, Utilidades
// ============================================================

const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzRTN_licLBriEk-66ToueDxpXn24p7icEmwAXJ1PsH79bFQaEGttYUOWH2tDDvVGq_HQ/exec',
  APP_NAME: 'ValoraGo',
};

const State = {
  user: null, theme: 'light',
  ingresos: [], gastos: [], ahorros: [],
  categoriasIngresos: [], categoriasGastos: [],
};

// ─── INICIALIZACIÓN ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Solo llamar initAuth en páginas internas, NO en el login
  if (!document.getElementById('loginPage')) {
    initAuth();
  }
});

// ─── TEMA ────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);
}
function setTheme(theme) {
  State.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Tema claro' : 'Tema oscuro';
  });
}
function toggleTheme() {
  setTheme(State.theme === 'dark' ? 'light' : 'dark');
}

// ─── AUTENTICACIÓN ───────────────────────────────────────────
function initAuth() {
  const saved = localStorage.getItem('session');
  if (saved) {
    try {
      State.user = JSON.parse(saved);
      onUserLoaded();
    } catch {
      localStorage.removeItem('session');
      window.location.href = '/finanzasapp/index.html';
    }
  } else {
    window.location.href = '/finanzasapp/index.html';
  }
}

function saveSession(user) {
  State.user = user;
  localStorage.setItem('session', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('session');
  State.user = null;
  window.location.href = '/finanzasapp/index.html';
}

function requireAuth() {
  const saved = localStorage.getItem('session');
  if (!saved) {
    window.location.href = '/finanzasapp/index.html';
    return false;
  }
  State.user = JSON.parse(saved);
  updateUserDisplay();
  return true;
}

function updateUserDisplay() {
  if (!State.user) return;
  document.querySelectorAll('.js-user-name').forEach(el => el.textContent = State.user.nombre);
  document.querySelectorAll('.js-user-email').forEach(el => el.textContent = State.user.correo);
  document.querySelectorAll('.js-user-avatar').forEach(el => {
    el.textContent = State.user.nombre.charAt(0).toUpperCase();
  });
}

function onUserLoaded() {
  updateUserDisplay();
  if (typeof onPageReady === 'function') onPageReady();
}

// ─── API ─────────────────────────────────────────────────────
async function apiCall(params) {
  const url = new URL(CONFIG.API_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString(), { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// ─── FORMATO ─────────────────────────────────────────────────
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function formatMoney(amount, currency = 'S/') {
  const n = parseFloat(amount) || 0;
  return `${currency} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const gsMatch = s.match(/^Date\((\d{4}),(\d+),(\d+)\)/);
  if (gsMatch) return new Date(+gsMatch[1], +gsMatch[2], +gsMatch[3]);
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return new Date(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]);
  const dmyMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmyMatch) return new Date(+dmyMatch[3], +dmyMatch[2] - 1, +dmyMatch[1]);
  const fallback = new Date(raw);
  return isNaN(fallback) ? null : fallback;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = parseDate(dateStr);
  if (!d || isNaN(d)) return String(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function normalizeDateStr(raw) {
  if (!raw) return '';
  const d = parseDate(raw);
  if (!d || isNaN(d)) return String(raw);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getMonthName(m) { return MONTHS[parseInt(m) - 1] || m; }

function nowPeru() {
  const now = new Date();
  const peruOffset = -5 * 60;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + peruOffset * 60000);
}

function getCurrentYear()  { return nowPeru().getFullYear(); }
function getCurrentMonth() { return nowPeru().getMonth() + 1; }

function todayPeru() {
  const d = nowPeru();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function dateToFields(dateStr) {
  const parts = dateStr.split('-');
  const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  return { Fecha: dateStr, Anio: d.getFullYear(), Mes: d.getMonth() + 1, Dia: d.getDate() };
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── MODAL ───────────────────────────────────────────────────
function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }
function closeAllModals() { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

// ─── SIDEBAR MOBILE ──────────────────────────────────────────
function toggleSidebar() {
  const sb = document.querySelector('.sidebar');
  const ov = document.querySelector('.sidebar-overlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('active');
}

// ─── CARGA DE DATOS ──────────────────────────────────────────
async function loadCategorias() {
  const userId = State.user.id;
  try {
    const [ri, rg] = await Promise.all([
      apiCall({ action: 'getCategoriasIngresos', userId }),
      apiCall({ action: 'getCategoriasGastos', userId }),
    ]);
    if (ri.success) State.categoriasIngresos = ri.data;
    if (rg.success) State.categoriasGastos = rg.data;
  } catch { showToast('Error al cargar categorías', 'error'); }
}

function normalizeRows(rows) {
  return rows.map(r => ({ ...r, Fecha: normalizeDateStr(r.Fecha) }));
}

async function loadAllData() {
  if (!State.user) return;
  const userId = State.user.id;
  try {
    const [ri, rg, ra] = await Promise.all([
      apiCall({ action: 'getIngresos', userId }),
      apiCall({ action: 'getGastos',   userId }),
      apiCall({ action: 'getAhorros',  userId }),
    ]);
    if (ri.success) State.ingresos = normalizeRows(ri.data);
    if (rg.success) State.gastos   = normalizeRows(rg.data);
    if (ra.success) State.ahorros  = normalizeRows(ra.data);
  } catch { showToast('Error al cargar datos', 'error'); }
}

function genId(prefix = 'X') { return prefix + Date.now() + Math.random().toString(36).slice(2, 6); }

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}
