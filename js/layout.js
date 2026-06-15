// ============================================================
// layout.js – Sidebar + Topbar compartidos
// ============================================================

function renderLayout(activePage, pageTitle) {
  const nav = [
    { page: 'dashboard', icon: '📊', label: 'Dashboard', href: 'dashboard.html' },
    { page: 'ingresos',  icon: '💵', label: 'Ingresos',  href: 'ingresos.html' },
    { page: 'gastos',    icon: '🛒', label: 'Gastos',    href: 'gastos.html' },
    { page: 'ahorros',   icon: '🏦', label: 'Ahorros',   href: 'ahorros.html' },
  ];

  const navHtml = nav.map(n => `
    <a href="${n.href}" class="nav-item${activePage === n.page ? ' active' : ''}" data-page="${n.page}">
      <span class="nav-icon">${n.icon}</span>
      <span>${n.label}</span>
    </a>
  `).join('');

  const sidebarHtml = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <div class="brand-icon">💰</div>
          <span class="brand-name">FinanzasApp</span>
        </div>
        <div class="brand-tagline">Finanzas personales</div>
      </div>
      <div class="sidebar-user">
        <div class="user-avatar js-user-avatar">U</div>
        <div class="user-info">
          <div class="user-name js-user-name">—</div>
          <div class="user-email js-user-email">—</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Módulos</div>
        ${navHtml}
        <div class="nav-section-label" style="margin-top:8px">Herramientas</div>
        <a href="categorias-ingresos.html" class="nav-item${activePage === 'cat-ingresos' ? ' active' : ''}" data-page="cat-ingresos">
          <span class="nav-icon">🏷️</span><span>Categorías Ingresos</span>
        </a>
        <a href="categorias-gastos.html" class="nav-item${activePage === 'cat-gastos' ? ' active' : ''}" data-page="cat-gastos">
          <span class="nav-icon">🗂️</span><span>Categorías Gastos</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="btn btn-ghost btn-sm w-full" onclick="toggleTheme()">
          <span class="theme-toggle-icon">🌙</span> Cambiar tema
        </button>
        <button class="btn btn-ghost btn-sm w-full" style="color:var(--danger)" onclick="confirmLogout()">
          🚪 Cerrar sesión
        </button>
        <div class="sidebar-copyright">
          ©2026 <a href="https://ronalk35.github.io/ronaldurbano.c/" target="_blank" rel="noopener">Ronald U.</a><br/>
          Todos los derechos reservados
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
  `;

  const topbarHtml = `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
        <h1 class="page-title">${pageTitle}</h1>
      </div>
      <div class="topbar-right">
        <button class="theme-toggle" onclick="toggleTheme()" title="Cambiar tema">🌙</button>
        <div class="user-avatar js-user-avatar" style="width:36px;height:36px;font-size:14px;">U</div>
      </div>
    </header>
  `;

  return { sidebarHtml, topbarHtml };
}

function injectLayout(activePage, pageTitle) {
  const { sidebarHtml, topbarHtml } = renderLayout(activePage, pageTitle);
  const wrapper = document.getElementById('app-wrapper');
  if (!wrapper) return;

  wrapper.innerHTML = `
    ${sidebarHtml}
    <div class="main-wrapper">
      ${topbarHtml}
      <div class="page-content" id="pageContent"></div>
    </div>
  `;
}

function confirmLogout() {
  if (confirm('¿Cerrar sesión?')) {
    localStorage.removeItem('session');
    window.location.href = '../index.html';
  }
}

// Sync theme toggle icon in sidebar
function syncThemeIcon() {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  document.querySelectorAll('.theme-toggle-icon').forEach(el => {
    el.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    if (!btn.classList.contains('theme-toggle-icon')) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  });
}