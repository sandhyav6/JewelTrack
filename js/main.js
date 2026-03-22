/* ===================================================================
   JEWELLERY STORE — Main JavaScript (Shared)
   ================================================================= */

// ===== Sidebar Toggle (Mobile) =====
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtns = document.querySelectorAll('.sidebar-close-btn');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (overlay) overlay.addEventListener('click', closeSidebar);
  closeBtns.forEach(btn => btn.addEventListener('click', closeSidebar));
}

// ===== Active Navigation Highlight =====
function initActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPage.includes(href.replace('./', ''))) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ===== Profile Dropdown =====
function initProfileDropdown() {
  const profileBtn = document.querySelector('.navbar-profile');
  const dropdown = document.querySelector('.profile-dropdown');

  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  }
}

// ===== Date/Time Display =====
function initDateTime() {
  const dateEl = document.querySelector('.navbar-date');
  if (!dateEl) return;

  function updateDateTime() {
    const now = new Date();
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    dateEl.textContent = now.toLocaleDateString('en-IN', options);
  }

  updateDateTime();
  setInterval(updateDateTime, 60000);
}

// ===== Theme Toggle =====
function initTheme() {
  const savedTheme = localStorage.getItem('jms-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('jms-theme', next);
}

// ===== Toast Notifications =====
function showToast(type, title, message, duration = 4000) {
  const container = document.querySelector('.toast-container') || createToastContainer();

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="dismissToast(this)">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => dismissToast(toast.querySelector('.toast-close')), duration);
}

function dismissToast(closeBtn) {
  const toast = closeBtn.closest('.toast');
  if (!toast || toast.classList.contains('removing')) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ===== Modal System =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(m => {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// ===== Confirmation Dialog =====
function showConfirmDialog(title, message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay confirm-dialog active';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-body" style="padding: 32px 28px 8px;">
        <div class="confirm-icon danger">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
      <div class="modal-footer" style="justify-content: center; border-top: none; padding-top: 0;">
        <button class="btn btn-ghost cancel-btn">Cancel</button>
        <button class="btn btn-danger confirm-btn">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.querySelector('.cancel-btn').addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
  });

  overlay.querySelector('.confirm-btn').addEventListener('click', () => {
    onConfirm();
    overlay.remove();
    document.body.style.overflow = '';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.style.overflow = '';
    }
  });
}

// ===== Count-Up Animation =====
function animateCountUp(el, target, duration = 1200) {
  const start = 0;
  const startTime = performance.now();
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(start + (target - start) * eased);

    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Search Filter Utility =====
function filterTable(inputEl, tableEl) {
  const query = inputEl.value.toLowerCase();
  const rows = tableEl.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// ===== Form Validation Helpers =====
function validateRequired(input) {
  const group = input.closest('.form-group');
  if (!input.value.trim()) {
    group.classList.add('has-error');
    return false;
  }
  group.classList.remove('has-error');
  return true;
}

function validateEmail(input) {
  const group = input.closest('.form-group');
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(input.value.trim())) {
    group.classList.add('has-error');
    return false;
  }
  group.classList.remove('has-error');
  return true;
}

// ===== Utility: Format Currency (INR) =====
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ===== Utility: Format Date =====
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== Utility: Generate unique ID =====
function generateId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase();
}

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initActiveNav();
  initProfileDropdown();
  initDateTime();
});
