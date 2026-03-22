/* ===================================================================
   JEWELLERY STORE — Customers Page Logic
   ================================================================= */

// ===== Customer Data =====
let customers = [
  { id: 'CUS-1001', name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya.sharma@email.com', address: '12 MG Road, Bangalore', totalPurchases: 24, totalSpent: 1245000, lastVisit: '2026-03-20', status: 'Preferred', category: 'Gold' },
  { id: 'CUS-1002', name: 'Vikram Singh', phone: '+91 87654 32109', email: 'vikram.singh@email.com', address: '45 Connaught Place, Delhi', totalPurchases: 18, totalSpent: 980000, lastVisit: '2026-03-19', status: 'Preferred', category: 'Diamond' },
  { id: 'CUS-1003', name: 'Anjali Gupta', phone: '+91 76543 21098', email: 'anjali.gupta@email.com', address: '78 Park Street, Kolkata', totalPurchases: 15, totalSpent: 567000, lastVisit: '2026-03-18', status: 'Regular', category: 'Silver' },
  { id: 'CUS-1004', name: 'Rajesh Patel', phone: '+91 65432 10987', email: 'rajesh.patel@email.com', address: '23 SG Highway, Ahmedabad', totalPurchases: 12, totalSpent: 432000, lastVisit: '2026-03-15', status: 'Regular', category: 'Gold' },
  { id: 'CUS-1005', name: 'Meera Iyer', phone: '+91 54321 09876', email: 'meera.iyer@email.com', address: '56 Anna Nagar, Chennai', totalPurchases: 8, totalSpent: 234000, lastVisit: '2026-03-12', status: 'Regular', category: 'Gemstone' },
  { id: 'CUS-1006', name: 'Arjun Reddy', phone: '+91 43210 98765', email: 'arjun.reddy@email.com', address: '89 Banjara Hills, Hyderabad', totalPurchases: 6, totalSpent: 189000, lastVisit: '2026-02-28', status: 'Inactive', category: 'Platinum' },
  { id: 'CUS-1007', name: 'Neha Kapoor', phone: '+91 32109 87654', email: 'neha.kapoor@email.com', address: '34 Juhu, Mumbai', totalPurchases: 21, totalSpent: 876000, lastVisit: '2026-03-21', status: 'Preferred', category: 'Diamond' },
  { id: 'CUS-1008', name: 'Suresh Kumar', phone: '+91 21098 76543', email: 'suresh.kumar@email.com', address: '67 Lajpat Nagar, Delhi', totalPurchases: 4, totalSpent: 145000, lastVisit: '2026-01-15', status: 'Inactive', category: 'Gold' },
  { id: 'CUS-1009', name: 'Kavitha Nair', phone: '+91 10987 65432', email: 'kavitha.nair@email.com', address: '11 MG Road, Kochi', totalPurchases: 10, totalSpent: 398000, lastVisit: '2026-03-16', status: 'Regular', category: 'Gold' },
  { id: 'CUS-1010', name: 'Deepak Joshi', phone: '+91 99887 76655', email: 'deepak.joshi@email.com', address: '44 Civil Lines, Jaipur', totalPurchases: 14, totalSpent: 654000, lastVisit: '2026-03-22', status: 'Preferred', category: 'Diamond' },
];

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
function saveCustomer() {
  const name = document.getElementById('custName');
  const phone = document.getElementById('custPhone');
  let valid = true;

  if (!name.value.trim()) { name.closest('.form-group').classList.add('has-error'); valid = false; }
  else name.closest('.form-group').classList.remove('has-error');

  if (!phone.value.trim()) { phone.closest('.form-group').classList.add('has-error'); valid = false; }
  else phone.closest('.form-group').classList.remove('has-error');

  if (!valid) return;

  const editId = document.getElementById('editCustomerId').value;
  const customerData = {
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: document.getElementById('custEmail').value.trim(),
    address: document.getElementById('custAddress').value.trim(),
    status: document.getElementById('custStatus').value,
    category: document.getElementById('custCategory').value,
  };

  if (editId) {
    const idx = customers.findIndex(c => c.id === editId);
    if (idx > -1) {
      customers[idx] = { ...customers[idx], ...customerData };
      showToast('success', 'Customer Updated', `${customerData.name} has been updated successfully.`);
    }
  } else {
    const newCustomer = {
      id: 'CUS-' + (1000 + customers.length + 1),
      ...customerData,
      totalPurchases: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    customers.unshift(newCustomer);
    showToast('success', 'Customer Added', `${customerData.name} has been added successfully.`);
  }

  closeModal('addCustomerModal');
  resetCustomerForm();
  renderCustomers();
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
function deleteCustomer(id) {
  const c = customers.find(x => x.id === id);
  if (!c) return;
  showConfirmDialog('Delete Customer', `Are you sure you want to remove <strong>${c.name}</strong>? This action cannot be undone.`, () => {
    customers = customers.filter(x => x.id !== id);
    renderCustomers();
    showToast('success', 'Customer Deleted', `${c.name} has been removed.`);
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
  renderCustomers();

  // Reset form when opening Add modal
  document.querySelector('[onclick="openModal(\'addCustomerModal\')"]').addEventListener('click', () => {
    resetCustomerForm();
  });
});
