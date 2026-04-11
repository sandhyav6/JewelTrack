/* ===================================================================
   JEWELLERY STORE — Customers Page Logic
   ================================================================= */

// ===== Customer Data =====
let customers = [];

async function loadCustomers() {
  const raw = await fetchData('/api/customers');
  if (raw) {
    customers = raw.map(c => ({
      id: c.CUSTOMERID,
      name: c.CUSTOMERNAME,
      phone: c.PHONE,
      totalPurchases: c.TOTALPURCHASES,
      totalSpent: c.TOTALSPENT,
      lastVisit: c.LASTVISIT,
      status: c.STATUS,
      category: c.FAVORITECATEGORY,
      email: '', 
      address: ''
    }));
    searchCustomers();
  }
}

// ===== Render Customer Table =====
function renderCustomers(data) {
  const tbody = document.getElementById('customerTableBody');
  const count = document.getElementById('customerCount');
  const info = document.getElementById('tableInfo');

  if (!data) data = customers;
  count.textContent = data.length;
  info.textContent = `Showing ${data.length} of ${customers.length} customers`;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-users"></i></div>
          <h3>No Customers Found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(c => `
    <tr>
      <td><span class="item-id">${c.id}</span></td>
      <td class="item-name">${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td><strong>₹${(c.totalSpent / 1000).toFixed(0)}K</strong> <span class="text-muted">(${c.totalPurchases})</span></td>
      <td>${formatDate(c.lastVisit)}</td>
      <td><span class="badge ${c.status === 'Preferred' ? 'badge-gold' : c.status === 'Regular' ? 'badge-success' : 'badge-muted'}">${c.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" title="View" onclick="viewCustomer('${c.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn edit" title="Edit" onclick="editCustomer('${c.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn delete" title="Delete" onclick="deleteCustomer('${c.id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== Search Customers =====
function searchCustomers() {
  const query = document.getElementById('customerSearch').value.toLowerCase();
  const filter = document.getElementById('customerFilter').value;
  let filtered = customers.filter(c =>
    (c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query) || c.phone.includes(query) || c.email.toLowerCase().includes(query))
  );
  if (filter !== 'all') filtered = filtered.filter(c => c.status === filter);
  renderCustomers(filtered);
}

// ===== Filter Customers =====
function filterCustomers() {
  searchCustomers(); // Reuse search logic with filter
}

// ===== Save Customer (Add/Edit) =====
async function saveCustomer() {
  const name = document.getElementById('custName');
  const phone = document.getElementById('custPhone');
  let valid = true;

  if (!name.value.trim()) { name.closest('.form-group').classList.add('has-error'); valid = false; }
  else name.closest('.form-group').classList.remove('has-error');

  if (!phone.value.trim()) { phone.closest('.form-group').classList.add('has-error'); valid = false; }
  else phone.closest('.form-group').classList.remove('has-error');

  if (!valid) return;

  const editId = document.getElementById('editCustomerId').value;
  const payload = {
    name: name.value.trim(),
    phone: phone.value.trim()
  };

  if (editId) {
    const data = await fetchData('/api/customers/' + editId, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Customer Updated', `${payload.name} has been updated successfully.`);
      closeModal('addCustomerModal');
      resetCustomerForm();
      await loadCustomers();
    }
  } else {
    const data = await fetchData('/api/customers', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Customer Added', `${payload.name} has been added successfully.`);
      closeModal('addCustomerModal');
      resetCustomerForm();
      await loadCustomers();
    }
  }
}

// ===== Edit Customer =====
function editCustomer(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;

  document.getElementById('customerModalTitle').textContent = 'Edit Customer';
  document.getElementById('editCustomerId').value = c.id;
  document.getElementById('custName').value = c.name;
  document.getElementById('custPhone').value = c.phone;
  document.getElementById('custEmail').value = c.email;
  document.getElementById('custAddress').value = c.address;
  document.getElementById('custStatus').value = c.status;
  document.getElementById('custCategory').value = c.category || '';
  openModal('addCustomerModal');
}

// ===== View Customer =====
function viewCustomer(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;

  document.getElementById('viewCustomerBody').innerHTML = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--gold-light);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px;color:var(--gold);font-weight:600;">${c.name.charAt(0)}</div>
      <h3 style="margin-bottom:4px;">${c.name}</h3>
      <span class="badge ${c.status === 'Preferred' ? 'badge-gold' : c.status === 'Regular' ? 'badge-success' : 'badge-muted'}">${c.status}</span>
    </div>
    <div class="form-row" style="gap:20px;">
      <div><label class="text-muted" style="font-size:12px;">CUSTOMER ID</label><div style="font-weight:500;color:var(--text-dark);">${c.id}</div></div>
      <div><label class="text-muted" style="font-size:12px;">PHONE</label><div style="font-weight:500;color:var(--text-dark);">${c.phone}</div></div>
    </div>
    <div class="form-row" style="gap:20px;margin-top:16px;">
      <div><label class="text-muted" style="font-size:12px;">EMAIL</label><div style="font-weight:500;color:var(--text-dark);">${c.email}</div></div>
      <div><label class="text-muted" style="font-size:12px;">PREFERRED CATEGORY</label><div style="font-weight:500;color:var(--text-dark);">${c.category || 'Not set'}</div></div>
    </div>
    <div style="margin-top:16px;"><label class="text-muted" style="font-size:12px;">ADDRESS</label><div style="font-weight:500;color:var(--text-dark);">${c.address || 'Not provided'}</div></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
      <div class="card" style="text-align:center;padding:16px;">
        <div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">${c.totalPurchases}</div>
        <div style="font-size:12px;color:var(--text-muted);">Total Purchases</div>
      </div>
      <div class="card" style="text-align:center;padding:16px;">
        <div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">₹${(c.totalSpent / 100000).toFixed(1)}L</div>
        <div style="font-size:12px;color:var(--text-muted);">Total Spent</div>
      </div>
      <div class="card" style="text-align:center;padding:16px;">
        <div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">${formatDate(c.lastVisit)}</div>
        <div style="font-size:12px;color:var(--text-muted);">Last Visit</div>
      </div>
    </div>
  `;
  openModal('viewCustomerModal');
}

// ===== Delete Customer =====
async function deleteCustomer(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  showConfirmDialog('Delete Customer', `Are you sure you want to remove <strong>${c.name}</strong>? This action cannot be undone.`, async () => {
    const data = await fetchData('/api/customers/' + id, { method: 'DELETE' });
    if (data) {
      showToast('success', 'Customer Deleted', `${c.name} has been removed.`);
      await loadCustomers();
    }
  });
}

// ===== Reset Form =====
function resetCustomerForm() {
  document.getElementById('customerForm').reset();
  document.getElementById('editCustomerId').value = '';
  document.getElementById('customerModalTitle').textContent = 'Add New Customer';
  document.querySelectorAll('#customerForm .form-group').forEach(g => g.classList.remove('has-error'));
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initInternalPage();
  loadCustomers();

  // Reset form when opening Add modal
  document.querySelector('[onclick="openModal(\'addCustomerModal\')"]').addEventListener('click', () => {
    resetCustomerForm();
  });
});
