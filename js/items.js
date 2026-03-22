/* ===================================================================
   JEWELLERY STORE — Jewellery Items Page Logic
   ================================================================= */

// ===== Items Data =====
let items = [
  { id: 'JW-1001', name: 'Gold Necklace (22K)', category: 'Necklace', material: 'Gold', weight: 24.5, price: 147000, stock: 8, supplier: 'Kalyan Suppliers', description: 'Elegant 22K gold necklace with traditional design', status: 'In Stock' },
  { id: 'JW-1002', name: 'Diamond Solitaire Ring', category: 'Ring', material: 'Diamond', weight: 4.2, price: 285000, stock: 5, supplier: 'Tanishq Wholesale', description: '1.5 carat solitaire diamond ring in platinum setting', status: 'In Stock' },
  { id: 'JW-1003', name: 'Silver Bangle Set (925)', category: 'Bangle', material: 'Silver', weight: 45.0, price: 12800, stock: 15, supplier: 'Senco Gold Supply', description: 'Set of 4 sterling silver bangles', status: 'In Stock' },
  { id: 'JW-1004', name: 'Ruby Pendant (18K)', category: 'Pendant', material: 'Gold', weight: 6.8, price: 34200, stock: 2, supplier: 'Malabar Traders', description: '18K gold pendant with natural Burmese ruby', status: 'Low Stock' },
  { id: 'JW-1005', name: 'Bridal Kundan Set', category: 'Bridal Set', material: 'Gold', weight: 85.0, price: 425000, stock: 3, supplier: 'Kalyan Suppliers', description: 'Complete bridal set with necklace, earrings, maang tikka, and bangles', status: 'Low Stock' },
  { id: 'JW-1006', name: 'Diamond Stud Earrings', category: 'Earring', material: 'Diamond', weight: 3.5, price: 67800, stock: 0, supplier: 'Tanishq Wholesale', description: 'Classic diamond stud earrings, 0.5 carat each', status: 'Out of Stock' },
  { id: 'JW-1007', name: 'Platinum Chain 20"', category: 'Chain', material: 'Platinum', weight: 12.0, price: 98500, stock: 7, supplier: 'PC Jeweller Dist.', description: '20 inch platinum chain with secure clasp', status: 'In Stock' },
  { id: 'JW-1008', name: 'Gold Bangles (22K, Set)', category: 'Bangle', material: 'Gold', weight: 32.0, price: 192000, stock: 4, supplier: 'Kalyan Suppliers', description: 'Set of 2 hand-carved 22K gold bangles', status: 'Low Stock' },
  { id: 'JW-1009', name: 'Pearl Necklace Set', category: 'Necklace', material: 'Gold', weight: 18.5, price: 56000, stock: 6, supplier: 'Malabar Traders', description: 'Freshwater pearl necklace with 18K gold clasp', status: 'In Stock' },
  { id: 'JW-1010', name: 'Silver Anklet Pair', category: 'Anklet', material: 'Silver', weight: 20.0, price: 4500, stock: 12, supplier: 'Senco Gold Supply', description: 'Traditional silver anklets with ghungroo', status: 'In Stock' },
  { id: 'JW-1011', name: 'Gemstone Cocktail Ring', category: 'Ring', material: 'Gold', weight: 8.5, price: 42000, stock: 0, supplier: 'Malabar Traders', description: 'Multi-gemstone ring with emerald, sapphire, and rubies', status: 'Out of Stock' },
  { id: 'JW-1012', name: 'Diamond Tennis Bracelet', category: 'Bangle', material: 'Diamond', weight: 14.0, price: 345000, stock: 2, supplier: 'Tanishq Wholesale', description: '3 carat total weight diamond tennis bracelet in 18K white gold', status: 'Low Stock' },
];

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
function saveItem() {
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
  const itemData = {
    name: name.value.trim(),
    category: category.value,
    material: material.value,
    weight: parseFloat(document.getElementById('itemWeight').value) || 0,
    price: parseFloat(price.value),
    stock: parseInt(stock.value),
    supplier: document.getElementById('itemSupplier').value,
    description: document.getElementById('itemDesc').value.trim(),
  };
  itemData.status = getStockStatus(itemData.stock);

  if (editId) {
    const idx = items.findIndex(i => i.id === editId);
    if (idx > -1) { items[idx] = { ...items[idx], ...itemData }; showToast('success', 'Item Updated', `${itemData.name} updated successfully.`); }
  } else {
    items.unshift({ id: 'JW-' + (1000 + items.length + 1), ...itemData });
    showToast('success', 'Item Added', `${itemData.name} has been added to inventory.`);
  }

  closeModal('addItemModal');
  resetItemForm();
  renderItems();
}

// ===== Edit Item =====
function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  document.getElementById('itemModalTitle').textContent = 'Edit Item';
  document.getElementById('editItemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category;
  document.getElementById('itemMaterial').value = item.material;
  document.getElementById('itemWeight').value = item.weight;
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('itemStock').value = item.stock;
  document.getElementById('itemSupplier').value = item.supplier;
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
function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  showConfirmDialog('Delete Item', `Are you sure you want to remove <strong>${item.name}</strong>? This action cannot be undone.`, () => {
    items = items.filter(i => i.id !== id);
    renderItems();
    showToast('success', 'Item Deleted', `${item.name} has been removed.`);
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
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
});
