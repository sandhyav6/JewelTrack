/* ===================================================================
   JEWELLERY STORE — Suppliers Page Logic
   ================================================================= */

let suppliers = [
  { id: 'SUP-101', name: 'Kalyan Suppliers', phone: '+91 98001 23456', email: 'orders@kalyan-supply.com', category: 'Gold', lastSupply: '2026-03-20', totalOrders: 145, totalValue: 12500000, status: 'Active', reliability: 'Excellent', address: '45 Zaveri Bazaar, Mumbai' },
  { id: 'SUP-102', name: 'Tanishq Wholesale', phone: '+91 87001 23456', email: 'bulk@tanishq-ws.com', category: 'Diamond', lastSupply: '2026-03-18', totalOrders: 98, totalValue: 24800000, status: 'Active', reliability: 'Excellent', address: '12 Jewellers Street, Surat' },
  { id: 'SUP-103', name: 'Malabar Traders', phone: '+91 76001 23456', email: 'supply@malabar-tr.com', category: 'Gold', lastSupply: '2026-03-15', totalOrders: 87, totalValue: 8900000, status: 'Active', reliability: 'Good', address: '78 MG Road, Thrissur' },
  { id: 'SUP-104', name: 'Senco Gold Supply', phone: '+91 65001 23456', email: 'orders@senco-supply.com', category: 'Silver', lastSupply: '2026-03-10', totalOrders: 56, totalValue: 3200000, status: 'Active', reliability: 'Good', address: '34 Park Street, Kolkata' },
  { id: 'SUP-105', name: 'PC Jeweller Dist.', phone: '+91 54001 23456', email: 'dist@pcjeweller.com', category: 'Platinum', lastSupply: '2026-03-05', totalOrders: 34, totalValue: 6700000, status: 'Active', reliability: 'Average', address: '23 Connaught Place, Delhi' },
  { id: 'SUP-106', name: 'Joyalukkas Gems', phone: '+91 43001 23456', email: 'gems@joyalukkas.com', category: 'Gemstone', lastSupply: '2026-02-28', totalOrders: 42, totalValue: 5400000, status: 'Active', reliability: 'Excellent', address: '56 Anna Nagar, Chennai' },
  { id: 'SUP-107', name: 'Bhima Gold House', phone: '+91 32001 23456', email: 'supply@bhima.com', category: 'Gold', lastSupply: '2026-01-20', totalOrders: 23, totalValue: 4100000, status: 'Inactive', reliability: 'Good', address: '89 Mahatma Gandhi Rd, Kochi' },
  { id: 'SUP-108', name: 'GRT Diamonds', phone: '+91 21001 23456', email: 'grt@diamonds.com', category: 'Diamond', lastSupply: '2026-03-22', totalOrders: 67, totalValue: 18900000, status: 'Active', reliability: 'Excellent', address: '11 T Nagar, Chennai' },
];

function renderSuppliers(data) {
  if (!data) data = suppliers;
  const tbody = document.getElementById('supplierTableBody');
  document.getElementById('supplierCount').textContent = data.length;
  document.getElementById('supplierInfo').textContent = `Showing ${data.length} of ${suppliers.length} suppliers`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-truck-field"></i></div><h3>No Suppliers Found</h3><p>Try adjusting your search or filters.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(s => `
    <tr>
      <td><span class="item-id">${s.id}</span></td>
      <td class="item-name">${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.email}</td>
      <td><span class="badge badge-gold">${s.category}</span></td>
      <td>${formatDate(s.lastSupply)}</td>
      <td><strong>${s.totalOrders}</strong></td>
      <td><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-muted'}">${s.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewSupplier('${s.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn edit" onclick="editSupplier('${s.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn delete" onclick="deleteSupplier('${s.id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchSuppliers() {
  const q = document.getElementById('supplierSearch').value.toLowerCase();
  const cat = document.getElementById('supplierFilter').value;
  let filtered = suppliers.filter(s =>
    (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
  );
  if (cat !== 'all') filtered = filtered.filter(s => s.category === cat);
  renderSuppliers(filtered);
}

function saveSupplier() {
  const name = document.getElementById('supName');
  const phone = document.getElementById('supPhone');
  let valid = true;
  if (!name.value.trim()) { name.closest('.form-group').classList.add('has-error'); valid = false; } else name.closest('.form-group').classList.remove('has-error');
  if (!phone.value.trim()) { phone.closest('.form-group').classList.add('has-error'); valid = false; } else phone.closest('.form-group').classList.remove('has-error');
  if (!valid) return;

  const editId = document.getElementById('editSupplierId').value;
  const data = {
    name: name.value.trim(), phone: phone.value.trim(),
    email: document.getElementById('supEmail').value.trim(),
    category: document.getElementById('supCategory').value,
    status: document.getElementById('supStatus').value,
    reliability: document.getElementById('supReliability').value,
    address: document.getElementById('supAddress').value.trim(),
  };

  if (editId) {
    const idx = suppliers.findIndex(s => s.id === editId);
    if (idx > -1) { suppliers[idx] = { ...suppliers[idx], ...data }; showToast('success', 'Supplier Updated', `${data.name} updated.`); }
  } else {
    suppliers.unshift({ id: 'SUP-' + (100 + suppliers.length + 1), ...data, lastSupply: new Date().toISOString().split('T')[0], totalOrders: 0, totalValue: 0 });
    showToast('success', 'Supplier Added', `${data.name} added successfully.`);
  }
  closeModal('addSupplierModal');
  document.getElementById('supplierForm').reset();
  document.getElementById('editSupplierId').value = '';
  renderSuppliers();
}

function editSupplier(id) {
  const s = suppliers.find(x => x.id === id);
  if (!s) return;
  document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
  document.getElementById('editSupplierId').value = s.id;
  document.getElementById('supName').value = s.name;
  document.getElementById('supPhone').value = s.phone;
  document.getElementById('supEmail').value = s.email;
  document.getElementById('supCategory').value = s.category;
  document.getElementById('supStatus').value = s.status;
  document.getElementById('supReliability').value = s.reliability;
  document.getElementById('supAddress').value = s.address;
  openModal('addSupplierModal');
}

function viewSupplier(id) {
  const s = suppliers.find(x => x.id === id);
  if (!s) return;
  const reliabilityColor = { 'Excellent': 'badge-success', 'Good': 'badge-gold', 'Average': 'badge-warning' };
  document.getElementById('viewSupplierBody').innerHTML = `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--burgundy-light);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px;color:var(--burgundy);"><i class="fa-solid fa-truck-field"></i></div>
      <h3 style="margin-bottom:4px;">${s.name}</h3>
      <div style="display:flex;gap:8px;justify-content:center;"><span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-muted'}">${s.status}</span><span class="badge ${reliabilityColor[s.reliability]}">${s.reliability}</span></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">SUPPLIER ID</span><div style="font-weight:500;color:var(--text-dark);">${s.id}</div></div>
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">PHONE</span><div style="font-weight:500;color:var(--text-dark);">${s.phone}</div></div>
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">EMAIL</span><div style="font-weight:500;color:var(--text-dark);">${s.email}</div></div>
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">CATEGORY</span><div style="font-weight:500;color:var(--text-dark);">${s.category}</div></div>
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">LAST SUPPLY</span><div style="font-weight:500;color:var(--text-dark);">${formatDate(s.lastSupply)}</div></div>
      <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">ADDRESS</span><div style="font-weight:500;color:var(--text-dark);">${s.address}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
      <div class="card" style="text-align:center;padding:16px;"><div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">${s.totalOrders}</div><div style="font-size:12px;color:var(--text-muted);">Total Orders</div></div>
      <div class="card" style="text-align:center;padding:16px;"><div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">₹${(s.totalValue / 100000).toFixed(1)}L</div><div style="font-size:12px;color:var(--text-muted);">Total Value</div></div>
      <div class="card" style="text-align:center;padding:16px;"><div style="font-size:22px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);">${s.reliability}</div><div style="font-size:12px;color:var(--text-muted);">Reliability</div></div>
    </div>
  `;
  openModal('viewSupplierModal');
}

function deleteSupplier(id) {
  const s = suppliers.find(x => x.id === id);
  if (!s) return;
  showConfirmDialog('Delete Supplier', `Remove <strong>${s.name}</strong>? This cannot be undone.`, () => {
    suppliers = suppliers.filter(x => x.id !== id);
    renderSuppliers();
    showToast('success', 'Supplier Deleted', `${s.name} removed.`);
  });
}

function openAddSupplier() {
  document.getElementById('supplierForm').reset();
  document.getElementById('editSupplierId').value = '';
  document.getElementById('supplierModalTitle').textContent = 'Add New Supplier';
  document.querySelectorAll('#supplierForm .form-group').forEach(g => g.classList.remove('has-error'));
  openModal('addSupplierModal');
}

document.addEventListener('DOMContentLoaded', () => { renderSuppliers(); });
