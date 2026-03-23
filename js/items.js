/* ===================================================================
   JEWELLERY STORE — Jewellery Items Page Logic
   ================================================================= */

let items = [];
let categoriesList = [];
let suppliersList = [];

async function loadDropdowns() {
  const [cats, sups] = await Promise.all([
    fetchData('/api/categories'),
    fetchData('/api/suppliers')
  ]);
  
  if (cats) {
    categoriesList = cats;
    const catSelect = document.getElementById('itemCategory');
    const filterCat = document.getElementById('filterCategory');
    if (catSelect) {
      catSelect.innerHTML = '<option value="">Select Category</option>' + cats.map(c => `<option value="${c.CATEGORYID}">${c.CATEGORYNAME}</option>`).join('');
    }
    if (filterCat) {
      filterCat.innerHTML = '<option value="all">All Categories</option>' + cats.map(c => `<option value="${c.CATEGORYNAME}">${c.CATEGORYNAME}</option>`).join('');
    }
  }
  
  if (sups) {
    suppliersList = sups;
    const supSelect = document.getElementById('itemSupplier');
    if (supSelect) {
      supSelect.innerHTML = '<option value="">Select Supplier</option>' + sups.map(s => `<option value="${s.SUPPLIERID}">${s.SUPPLIERNAME}</option>`).join('');
    }
  }
}

async function loadItems() {
  const raw = await fetchData('/api/items');
  if (raw) {
    items = raw.map(i => ({
      id: i.ITEMID,
      name: i.ITEMNAME,
      categoryId: i.CATEGORYID,
      category: i.CATEGORYNAME || 'Unknown',
      material: i.MATERIAL || '',
      weight: i.WEIGHT || 0,
      price: i.BASEPRICE || 0,
      stock: i.CURRENTSTOCK || 0,
      supplierId: i.SUPPLIERID,
      supplier: i.SUPPLIERNAME || 'N/A',
      description: i.DESCRIPTION || '',
      status: getStockStatus(i.CURRENTSTOCK || 0)
    }));
    filterItems();
  }
}

let currentView = 'card';

// ===== Get stock status =====
function getStockStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
}

function getStockBadge(status) {
  const classes = { 'In Stock': 'badge-success', 'Low Stock': 'badge-warning', 'Out of Stock': 'badge-danger' };
  return `<span class="badge ${classes[status] || 'badge-muted'}">${status}</span>`;
}

// ===== Get item icon =====
function getItemIcon(category) {
  const icons = {
    'Necklace': 'fa-necklace', 'Ring': 'fa-ring', 'Bangle': 'fa-circle',
    'Earring': 'fa-star', 'Pendant': 'fa-diamond', 'Chain': 'fa-link',
    'Bridal Set': 'fa-crown', 'Anklet': 'fa-circle-dot'
  };
  return icons[category] || 'fa-gem';
}

// ===== Render Card View =====
function renderCardView(data) {
  const container = document.getElementById('cardView');
  if (data.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state-icon"><i class="fa-solid fa-gem"></i></div><h3>No Items Found</h3><p>Try adjusting your filters or add a new item.</p></div>`;
    return;
  }
  container.innerHTML = data.map(item => `
    <div class="item-card animate-in">
      <div class="item-card-image">
        <i class="fa-solid ${getItemIcon(item.category)}"></i>
        <div class="stock-badge">${getStockBadge(item.status)}</div>
      </div>
      <div class="item-card-body">
        <h4>${item.name}</h4>
        <div class="item-id">${item.id}</div>
        <div class="item-card-meta">
          <div class="meta-item"><label>Category</label><span>${item.category}</span></div>
          <div class="meta-item"><label>Material</label><span>${item.material}</span></div>
          <div class="meta-item"><label>Weight</label><span>${item.weight}g</span></div>
          <div class="meta-item"><label>Stock</label><span>${item.stock} pcs</span></div>
        </div>
        <div class="item-card-footer">
          <span class="item-card-price">₹${item.price.toLocaleString('en-IN')}</span>
          <div class="action-btns">
            <button class="action-btn view" onclick="viewItem('${item.id}')"><i class="fa-solid fa-eye"></i></button>
            <button class="action-btn edit" onclick="editItem('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn delete" onclick="deleteItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Render Table View =====
function renderTableView(data) {
  const tbody = document.getElementById('itemsTableBody');
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-gem"></i></div><h3>No Items Found</h3><p>Try adjusting your filters.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(item => `
    <tr>
      <td><span class="item-id">${item.id}</span></td>
      <td class="item-name">${item.name}</td>
      <td>${item.category}</td>
      <td>${item.material}</td>
      <td>${item.weight}g</td>
      <td><strong>₹${item.price.toLocaleString('en-IN')}</strong></td>
      <td>${item.stock}</td>
      <td>${item.supplier}</td>
      <td>${getStockBadge(item.status)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" onclick="viewItem('${item.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn edit" onclick="editItem('${item.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn delete" onclick="deleteItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== Render items based on current view =====
function renderItems(data) {
  if (!data) data = items;
  data.forEach(i => i.status = getStockStatus(i.stock));
  renderCardView(data);
  renderTableView(data);
}

// ===== View Toggle =====
function setView(view) {
  currentView = view;
  const btns = document.querySelectorAll('#viewToggle button');
  btns.forEach(b => b.classList.remove('active'));
  btns[view === 'card' ? 0 : 1].classList.add('active');

  document.getElementById('cardView').style.display = view === 'card' ? 'grid' : 'none';
  document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
}

// ===== Filter Items =====
function filterItems() {
  const search = document.getElementById('itemSearch').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const material = document.getElementById('filterMaterial').value;
  const stock = document.getElementById('filterStock').value;

  let filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search) || i.id.toLowerCase().includes(search);
    const matchCategory = category === 'all' || i.category === category;
    const matchMaterial = material === 'all' || i.material === material;
    const matchStock = stock === 'all' || getStockStatus(i.stock) === stock;
    return matchSearch && matchCategory && matchMaterial && matchStock;
  });

  renderItems(filtered);
}

// ===== Save Item =====
async function saveItem() {
  const name = document.getElementById('itemName');
  const category = document.getElementById('itemCategory');
  const material = document.getElementById('itemMaterial');
  const price = document.getElementById('itemPrice');
  const stock = document.getElementById('itemStock');
  let valid = true;

  [name, category, material, price, stock].forEach(el => {
    if (!el.value.toString().trim()) { el.closest('.form-group').classList.add('has-error'); valid = false; }
    else el.closest('.form-group').classList.remove('has-error');
  });

  if (!valid) return;

  const editId = document.getElementById('editItemId').value;
  const payload = {
    name: name.value.trim(),
    categoryId: category.value,
    material: material.value,
    weight: parseFloat(document.getElementById('itemWeight').value) || null,
    basePrice: parseFloat(price.value),
    stock: parseInt(stock.value),
    supplierId: document.getElementById('itemSupplier').value || null,
    description: document.getElementById('itemDesc').value.trim() || null,
  };

  if (editId) {
    const data = await fetchData('/api/items/' + editId, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Item Updated', `${payload.name} updated successfully.`);
      closeModal('addItemModal');
      resetItemForm();
      await loadItems();
    }
  } else {
    const data = await fetchData('/api/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data) {
      showToast('success', 'Item Added', `${payload.name} has been added to inventory.`);
      closeModal('addItemModal');
      resetItemForm();
      await loadItems();
    }
  }
}

// ===== Edit Item =====
function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  document.getElementById('itemModalTitle').textContent = 'Edit Item';
  document.getElementById('editItemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.categoryId;
  document.getElementById('itemMaterial').value = item.material;
  document.getElementById('itemWeight').value = item.weight || '';
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('itemStock').value = item.stock;
  document.getElementById('itemSupplier').value = item.supplierId || '';
  document.getElementById('itemDesc').value = item.description || '';
  openModal('addItemModal');
}

// ===== View Item =====
function viewItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  document.getElementById('viewItemBody').innerHTML = `
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div style="flex:0 0 200px;height:200px;background:var(--bg-secondary);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);">
        <i class="fa-solid ${getItemIcon(item.category)}" style="font-size:56px;color:var(--border);"></i>
      </div>
      <div style="flex:1;min-width:250px;">
        <h2 style="margin-bottom:4px;">${item.name}</h2>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px;">
          <span class="item-id" style="font-size:13px;">${item.id}</span>
          ${getStockBadge(item.status)}
        </div>
        <p style="margin-bottom:16px;">${item.description || 'No description available.'}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Category</span><div style="font-weight:500;color:var(--text-dark);">${item.category}</div></div>
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Material</span><div style="font-weight:500;color:var(--text-dark);">${item.material}</div></div>
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Weight</span><div style="font-weight:500;color:var(--text-dark);">${item.weight}g</div></div>
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Price</span><div style="font-weight:600;color:var(--text-dark);font-size:18px;">₹${item.price.toLocaleString('en-IN')}</div></div>
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Stock</span><div style="font-weight:500;color:var(--text-dark);">${item.stock} units</div></div>
          <div><span class="text-muted" style="font-size:11px;text-transform:uppercase;">Supplier</span><div style="font-weight:500;color:var(--text-dark);">${item.supplier || 'Not assigned'}</div></div>
        </div>
      </div>
    </div>
  `;
  openModal('viewItemModal');
}

// ===== Delete Item =====
async function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  showConfirmDialog('Delete Item', `Are you sure you want to remove <strong>${item.name}</strong>? This action cannot be undone.`, async () => {
    const data = await fetchData('/api/items/' + id, { method: 'DELETE' });
    if (data) {
      showToast('success', 'Item Deleted', `${item.name} has been removed.`);
      await loadItems();
    }
  });
}

// ===== Helpers =====
function openAddItem() {
  resetItemForm();
  openModal('addItemModal');
}

function resetItemForm() {
  document.getElementById('itemForm').reset();
  document.getElementById('editItemId').value = '';
  document.getElementById('itemModalTitle').textContent = 'Add New Item';
  document.querySelectorAll('#itemForm .form-group').forEach(g => g.classList.remove('has-error'));
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadDropdowns();
  await loadItems();
});
