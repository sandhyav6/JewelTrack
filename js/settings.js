/* ===================================================================
   JEWELLERY STORE — Settings Page Logic
   ================================================================= */

// ===== Initialize Settings =====
document.addEventListener('DOMContentLoaded', () => {
  // Load theme state
  const theme = localStorage.getItem('jms-theme') || 'light';
  document.getElementById('darkModeToggle').checked = theme === 'dark';

  // Load saved settings from localStorage
  const saved = JSON.parse(localStorage.getItem('jms-settings') || '{}');
  if (saved.storeName) document.getElementById('storeName').value = saved.storeName;
  if (saved.storePhone) document.getElementById('storePhone').value = saved.storePhone;
  if (saved.storeAddress) document.getElementById('storeAddress').value = saved.storeAddress;
  if (saved.gstRate) document.getElementById('gstRate').value = saved.gstRate;
  if (saved.gstNumber) document.getElementById('gstNumber').value = saved.gstNumber;
  if (saved.profileName) document.getElementById('profileName').value = saved.profileName;
  if (saved.profileEmail) document.getElementById('profileEmail').value = saved.profileEmail;
});

// ===== Theme Toggle Handler =====
function handleThemeToggle(checkbox) {
  const theme = checkbox.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('jms-theme', theme);
}

// ===== Save All Settings =====
function saveSettings() {
  const settings = {
    storeName: document.getElementById('storeName').value,
    storePhone: document.getElementById('storePhone').value,
    storeAddress: document.getElementById('storeAddress').value,
    currency: document.getElementById('storeCurrency').value,
    gstRate: document.getElementById('gstRate').value,
    gstNumber: document.getElementById('gstNumber').value,
    includeGST: document.getElementById('includeGST').checked,
    taxBreakdown: document.getElementById('taxBreakdown').checked,
    profileName: document.getElementById('profileName').value,
    profileEmail: document.getElementById('profileEmail').value,
    darkMode: document.getElementById('darkModeToggle').checked,
    compact: document.getElementById('compactToggle').checked,
    animations: document.getElementById('animToggle').checked,
  };

  localStorage.setItem('jms-settings', JSON.stringify(settings));
  showToast('success', 'Settings Saved', 'Your preferences have been updated successfully.');
}

// ===== Change Password =====
function changePassword() {
  const current = document.getElementById('currentPass').value;
  const newPass = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;

  if (!current) {
    showToast('error', 'Error', 'Please enter your current password.');
    return;
  }

  if (!newPass || newPass.length < 6) {
    showToast('error', 'Error', 'New password must be at least 6 characters.');
    return;
  }

  if (newPass !== confirm) {
    showToast('error', 'Mismatch', 'New passwords do not match.');
    return;
  }

  // Simulate password change
  document.getElementById('currentPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
  showToast('success', 'Password Updated', 'Your password has been changed successfully.');
}
