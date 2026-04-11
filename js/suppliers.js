/* ===================================================================
   JEWELLERY STORE — Suppliers Page Logic
   ================================================================= */

let suppliers = [];

async function loadSuppliers() {
  const raw = await fetchData('/api/suppliers');
  if (raw) {
    suppliers = raw.map(s => ({
      id: s.SUPPLIERID,
      name: s.SUPPLIERNAME,
      phone: s.SUPPLIERPHONE,
      lastSupply: s.LASTSUPPLY,
      totalOrders: s.TOTALORDERS,
      totalValue: s.TOTALVALUE,
      status: s.STATUS,
      category: s.SUPPLYCATEGORY || 'General',
      email: '',
      reliability: 95, 
      address: ''
    }));
    searchSuppliers();
  }
}

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

async function saveSupplier() {
  const name = document.getElementById('supName');
  const phone = document.getElementById('supPhone');
  let valid = true;
  if (!name.value.trim()) { name.closest('.form-group').classList.add('has-error'); valid = false; } else name.closest('.form-group').classList.remove('has-error');
  if (!phone.value.trim()) { phone.closest('.form-group').classList.add('has-error'); valid = false; } else phone.closest('.form-group').classList.remove('has-error');
  if (!valid) return;

  const editId = document.getElementById('editSupplierId').value;
  const payload = {
    name: name.value.trim(), 
    phone: phone.value.trim()
  };

  if (editId) {
    const data = await fetchData('/api/suppliers/' + editId, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Supplier Updated', `${payload.name} updated.`);
      closeModal('addSupplierModal');
      document.getElementById('supplierForm').reset();
      document.getElementById('editSupplierId').value = '';
      await loadSuppliers();
    }
  } else {
    const data = await fetchData('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Supplier Added', `${payload.name} added successfully.`);
      closeModal('addSupplierModal');
      document.getElementById('supplierForm').reset();
      document.getElementById('editSupplierId').value = '';
      await loadSuppliers();
    }
  }
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
  showConfirmDialog('Delete Supplier', `Remove <strong>${s.name}</strong>? This cannot be undone.`, async () => {
    const data = await fetchData('/api/suppliers/' + id, { method: 'DELETE' });
    if (data) {
      showToast('success', 'Supplier Deleted', `${s.name} removed.`);
      await loadSuppliers();
    }
  });
}

function openAddSupplier() {
  document.getElementById('supplierForm').reset();
  document.getElementById('editSupplierId').value = '';
  document.getElementById('supplierModalTitle').textContent = 'Add New Supplier';
  document.querySelectorAll('#supplierForm .form-group').forEach(g => g.classList.remove('has-error'));
  openModal('addSupplierModal');
}

document.addEventListener('DOMContentLoaded', () => {
  initInternalPage();
  loadSuppliers();
});
