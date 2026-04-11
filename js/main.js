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

const API_BASE = 'http://localhost:3000';

async function fetchData(url, options = {}) {
  try {
    const response = await fetch(API_BASE + url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || result.message || `Request failed: ${response.status}`);
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    showToast('error', 'Request Failed', error.message || 'Failed to connect to server.');
    return null;
  }
}

// ===== Utility: Format Currency (INR) =====
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ===== Utility: Format Date =====
function formatDate(dateStr) {
  if (!dateStr || dateStr === null) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== Utility: Generate unique ID =====
function generateId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase();
}

/* ===================================================================
   AUTH & ROLE-BASED ACCESS CONTROL
   ================================================================= */

// Demo credentials — no backend required
const JMS_CREDENTIALS = [
  {
    email: 'admin@jeweltrack.com',
    password: 'admin123',
    role: 'Admin',
    name: 'Sandhya V.',
    avatar: 'SV'
  },
  {
    email: 'staff@jeweltrack.com',
    password: 'staff123',
    role: 'Staff',
    name: 'Rahul M.',
    avatar: 'RM'
  },
  {
    email: 'preethi@jeweltrack.com',
    password: 'staff123',
    role: 'Staff',
    name: 'Preethi K.',
    avatar: 'PK'
  },
  {
    email: 'arun@jeweltrack.com',
    password: 'staff123',
    role: 'Staff',
    name: 'Arun S.',
    avatar: 'AS'
  }
];

/**
 * Returns parsed current-user object from localStorage, or null.
 */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem('jms-current-user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Returns true if the user is properly authenticated.
 */
function isAuthenticated() {
  return localStorage.getItem('jms-authenticated') === 'true' && getCurrentUser() !== null;
}

/**
 * Clears session and redirects to login page.
 */
function logoutUser() {
  localStorage.removeItem('jms-current-user');
  localStorage.removeItem('jms-authenticated');
  window.location.href = 'index.html';
}

/**
 * Enforces authentication — redirects to login if not authenticated.
 * Call on every internal page.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

/**
 * Returns the list of allowed pages for a given role.
 */
function getRolePermissions(role) {
  const permissions = {
    Admin: [
      'dashboard.html',
      'customers.html',
      'items.html',
      'suppliers.html',
      'billing.html',
      'purchases.html',
      'inventory.html',
      'reports.html',
      'settings.html'
    ],
    Staff: [
      'dashboard.html',
      'customers.html',
      'items.html',
      'billing.html',
      'inventory.html',
      'settings.html'
    ]
  };
  return permissions[role] || [];
}

/**
 * Enforces page-level access based on role.
 * Redirects non-permitted users to dashboard.html with a toast.
 */
function enforcePageAccess() {
  const user = getCurrentUser();
  if (!user) return;

  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  const allowed = getRolePermissions(user.role);

  if (!allowed.includes(currentPage)) {
    // Show toast then redirect
    setTimeout(() => {
      showToast('error', 'Access Denied', 'You do not have access to this page.');
    }, 100);
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  }
}

/**
 * Updates the navbar profile avatar, name, and role from the current user.
 */
function applyUserProfileToUI() {
  const user = getCurrentUser();
  if (!user) return;

  // Navbar avatar
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl) avatarEl.textContent = user.avatar;

  // Navbar name
  const nameEl = document.getElementById('profileName');
  if (nameEl) nameEl.textContent = user.name;

  // Navbar role badge
  const roleEl = document.getElementById('profileRole');
  if (roleEl) roleEl.textContent = user.role;

  // Update the welcome greeting on dashboard if present
  const greetingEl = document.querySelector('.page-header h1[data-greeting]');
  if (greetingEl) {
    const firstName = user.name.split(' ')[0];
    greetingEl.textContent = `Good ${getTimeOfDay()}, ${firstName} ✨`;
  }
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

/**
 * Hides sidebar nav items that the current user's role shouldn't see.
 * Also hides admin-only items in the profile dropdown.
 */
function applyRoleBasedNavigation() {
  const user = getCurrentUser();
  if (!user || user.role === 'Admin') return; // Admin sees everything

  // Pages to hide from staff in sidebar
  const staffHiddenPages = ['suppliers.html', 'purchases.html', 'reports.html', 'settings.html'];

  // Hide sidebar nav items
  document.querySelectorAll('.sidebar-nav .nav-item, .sidebar-footer .nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && staffHiddenPages.some(p => href.includes(p))) {
      item.style.display = 'none';
    }
  });

  // Hide nav-section-labels that become orphaned for staff:
  // "Operations" label is above inventory & reports — reports is hidden but inventory stays, so keep label.
  // However we should hide Reports nav-section if needed. The labels don't need hiding here since
  // at least one item remains under each visible section.

  // Hide Settings & Reports links in profile dropdown
  document.querySelectorAll('.profile-dropdown a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.includes('settings.html'))) {
      link.style.display = 'none';
    }
  });
}

/**
 * Hides or restricts admin-only actions on pages the Staff can access.
 * - No delete buttons
 * - No Add Customer, Add Item buttons
 * - No report export/generate controls
 * Also prefills billEmployee for billing page.
 */
function applyRoleBasedActionRestrictions() {
  const user = getCurrentUser();
  if (!user || user.role === 'Admin') {
    // For Admin, still prefill the employee field in billing
    _prefillBillingEmployee();
    return;
  }

  // --- Customers page ---
  // Hide "Add Customer" button
  const addCustomerBtns = document.querySelectorAll('[onclick*="addCustomerModal"], [onclick*="openModal(\'addCustomerModal\')"]');
  addCustomerBtns.forEach(btn => btn.style.display = 'none');

  // --- Items page ---
  // Hide "Add Item" button
  const addItemBtns = document.querySelectorAll('[onclick*="openAddItem"]');
  addItemBtns.forEach(btn => btn.style.display = 'none');

  // --- Hide all [data-admin-only] elements globally (e.g. dashboard quick actions) ---
  document.querySelectorAll('[data-admin-only]').forEach(el => {
    el.style.display = 'none';
  });

  // --- Customers page: also hide by stable ID ---
  const addCustomerBtn = document.getElementById('addCustomerBtn');
  if (addCustomerBtn) addCustomerBtn.style.display = 'none';

  // --- Items page: also hide by stable ID ---
  const addItemBtn = document.getElementById('addItemBtn');
  if (addItemBtn) addItemBtn.style.display = 'none';

  // --- Global: hide all delete buttons ---
  document.querySelectorAll('[onclick*="delete"], [onclick*="Delete"], .btn-danger:not(.confirm-btn)').forEach(btn => {
    // Only hide action delete buttons, not confirm dialog confirm button
    if (!btn.classList.contains('confirm-btn')) {
      btn.style.display = 'none';
    }
  });

  // --- Global: hide edit buttons on restricted pages (not billing) ---
  // Staff can still use view on customers/items but not edit
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'customers.html' || currentPage === 'items.html') {
    // Wire up a MutationObserver to also hide buttons added dynamically by JS
    _observeAndHideRestrictedButtons(currentPage);
  }

  // --- Billing page: prefill employee field ---
  _prefillBillingEmployee();
}

/**
 * Prefills the Sales Employee dropdown in billing.html with the logged-in user.
 */
function _prefillBillingEmployee() {
  const billEmployee = document.getElementById('billEmployee');
  if (!billEmployee) return;
  const user = getCurrentUser();
  if (!user) return;

  // Try to select the matching option; if not found, add it
  let found = false;
  for (const opt of billEmployee.options) {
    if (opt.value === user.name || opt.textContent.trim() === user.name) {
      billEmployee.value = opt.value;
      found = true;
      break;
    }
  }
  if (!found) {
    const opt = document.createElement('option');
    opt.value = user.name;
    opt.textContent = user.name;
    billEmployee.appendChild(opt);
    billEmployee.value = user.name;
  }
}

/**
 * Uses MutationObserver to hide restricted action buttons dynamically rendered by page JS.
 */
function _observeAndHideRestrictedButtons(currentPage) {
  const user = getCurrentUser();
  if (!user || user.role === 'Admin') return;

  function hideButtons(root) {
    // Hide edit and delete action buttons in tables
    root.querySelectorAll('[onclick*="edit"], [onclick*="Edit"], [onclick*="delete"], [onclick*="Delete"]').forEach(btn => {
      if (!btn.classList.contains('confirm-btn')) {
        btn.style.display = 'none';
      }
    });
    // Hide delete-related btn-danger buttons
    root.querySelectorAll('.btn-danger:not(.confirm-btn)').forEach(btn => {
      btn.style.display = 'none';
    });
  }

  // Initial pass
  hideButtons(document.body);

  // Watch for dynamic renders (table rows, cards)
  const observer = new MutationObserver(() => {
    hideButtons(document.body);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ===================================================================
   INTERNAL PAGE SHARED INITIALIZATION
   Call this from every internal page after main.js loads.
   ================================================================= */
function initInternalPage() {
  initTheme();
  requireAuth();
  enforcePageAccess();
  initSidebar();
  initActiveNav();
  initProfileDropdown();
  initDateTime();
  applyUserProfileToUI();
  applyRoleBasedNavigation();
  applyRoleBasedActionRestrictions();
}

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Internal pages call initInternalPage() from their own page script.
  // Login page (index.html) only needs initTheme.
});
