/* ===================================================================
   JEWELLERY STORE — Settings Page Logic
   ================================================================= */

// ===== Initialize Settings =====
document.addEventListener('DOMContentLoaded', () => {
  initInternalPage();

  // Load theme state
  const theme = localStorage.getItem('jms-theme') || 'light';
  document.getElementById('darkModeToggle').checked = theme === 'dark';

  // Check API health
  checkSystemStatus();
});

// ===== Theme Toggle Handler =====
function handleThemeToggle(checkbox) {
  const theme = checkbox.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('jms-theme', theme);
  showToast('success', 'Theme Updated', `Switched to ${theme} mode.`);
}

// ===== Check System Status =====
async function checkSystemStatus() {
  try {
    const response = await fetch('/api/health');
    if (response.ok) {
      document.getElementById('dbStatus').style.background = 'var(--success)';
      document.getElementById('dbStatusText').textContent = 'Connected';
    } else {
      throw new Error();
    }
  } catch (error) {
    document.getElementById('dbStatus').style.background = 'var(--danger)';
    document.getElementById('dbStatusText').textContent = 'Disconnected';
  }
}
