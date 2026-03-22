/* ===================================================================
   JEWELLERY STORE — Inventory Page Logic
   ================================================================= */

const inventoryItems = [
  { id: 'JW-1001', name: 'Gold Necklace (22K)', category: 'Necklace', stock: 8, threshold: 10, supplier: 'Kalyan Suppliers', lastUpdated: '2026-03-22' },
  { id: 'JW-1002', name: 'Diamond Solitaire Ring', category: 'Ring', stock: 5, threshold: 8, supplier: 'Tanishq Wholesale', lastUpdated: '2026-03-21' },
  { id: 'JW-1003', name: 'Silver Bangle Set (925)', category: 'Bangle', stock: 15, threshold: 10, supplier: 'Senco Gold Supply', lastUpdated: '2026-03-20' },
  { id: 'JW-1004', name: 'Ruby Pendant (18K)', category: 'Pendant', stock: 2, threshold: 10, supplier: 'Malabar Traders', lastUpdated: '2026-03-19' },
  { id: 'JW-1005', name: 'Bridal Kundan Set', category: 'Bridal Set', stock: 3, threshold: 5, supplier: 'Kalyan Suppliers', lastUpdated: '2026-03-18' },
  { id: 'JW-1006', name: 'Diamond Stud Earrings', category: 'Earring', stock: 0, threshold: 8, supplier: 'Tanishq Wholesale', lastUpdated: '2026-03-17' },
  { id: 'JW-1007', name: 'Platinum Chain 20"', category: 'Chain', stock: 7, threshold: 6, supplier: 'PC Jeweller Dist.', lastUpdated: '2026-03-22' },
  { id: 'JW-1008', name: 'Gold Bangles (22K, Set)', category: 'Bangle', stock: 4, threshold: 8, supplier: 'Kalyan Suppliers', lastUpdated: '2026-03-16' },
  { id: 'JW-1009', name: 'Pearl Necklace Set', category: 'Necklace', stock: 6, threshold: 5, supplier: 'Malabar Traders', lastUpdated: '2026-03-22' },
  { id: 'JW-1010', name: 'Silver Anklet Pair', category: 'Anklet', stock: 12, threshold: 8, supplier: 'Senco Gold Supply', lastUpdated: '2026-03-15' },
  { id: 'JW-1011', name: 'Gemstone Cocktail Ring', category: 'Ring', stock: 0, threshold: 5, supplier: 'Malabar Traders', lastUpdated: '2026-03-14' },
  { id: 'JW-1012', name: 'Diamond Tennis Bracelet', category: 'Bangle', stock: 2, threshold: 5, supplier: 'Tanishq Wholesale', lastUpdated: '2026-03-13' },
];

const stockMovements = [
  { text: '<strong>Gold Chain 22K</strong> — +15 units received from Kalyan Suppliers', time: '2 hours ago' },
  { text: '<strong>Diamond Studs</strong> — -2 units sold (BL-2847)', time: '4 hours ago' },
  { text: '<strong>Silver Bangle Set</strong> — +25 units replenished', time: 'Yesterday' },
  { text: '<strong>Ruby Pendant 18K</strong> — Low stock alert triggered', time: 'Yesterday' },
  { text: '<strong>Platinum Chain</strong> — +12 units received', time: '2 days ago' },
  { text: '<strong>Diamond Stud Earrings</strong> — Out of stock alert', time: '3 days ago' },
];

function getStockStatus(stock, threshold) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= threshold * 0.3) return 'Critical';
  if (stock <= threshold) return 'Low Stock';
  return 'Healthy';
}

function getStatusBadge(status) {
  const map = {
    'Healthy': 'badge-success',
    'Low Stock': 'badge-warning',
    'Critical': 'badge-danger',
    'Out of Stock': 'badge-danger',
  };
  return `<span class="badge ${map[status]}">${status}</span>`;
}

function getProgressBar(stock, threshold) {
  const max = threshold * 2;
  const pct = Math.min((stock / max) * 100, 100);
  let cls = 'success';
  if (stock === 0) cls = 'danger';
  else if (stock <= threshold * 0.3) cls = 'danger';
  else if (stock <= threshold) cls = 'warning';
  return `<div class="progress-bar" style="width:100px;"><div class="progress-fill ${cls}" style="width:${pct}%;"></div></div>`;
}

function renderInventory(data) {
  if (!data) data = inventoryItems;
  const tbody = document.getElementById('inventoryTableBody');

  tbody.innerHTML = data.map(item => {
    const status = getStockStatus(item.stock, item.threshold);
    return `
    <tr>
      <td><span class="item-id">${item.id}</span></td>
      <td class="item-name">${item.name}</td>
      <td>${item.category}</td>
      <td><strong>${item.stock}</strong></td>
      <td>${item.threshold}</td>
      <td>${getProgressBar(item.stock, item.threshold)}</td>
      <td>${item.supplier}</td>
      <td>${formatDate(item.lastUpdated)}</td>
      <td>${getStatusBadge(status)}</td>
    </tr>`;
  }).join('');
}

function updateStats() {
  const total = inventoryItems.reduce((s, i) => s + i.stock, 0);
  const low = inventoryItems.filter(i => i.stock > 0 && i.stock <= i.threshold).length;
  const out = inventoryItems.filter(i => i.stock === 0).length;
  const restock = inventoryItems.filter(i => i.stock <= i.threshold).length;

  document.getElementById('totalStockVal').textContent = total;
  document.getElementById('lowStockVal').textContent = low;
  document.getElementById('outStockVal').textContent = out;
  document.getElementById('restockVal').textContent = restock;
}

function renderLowStockAlerts() {
  const alerts = inventoryItems.filter(i => i.stock <= i.threshold).sort((a, b) => a.stock - b.stock);
  const container = document.getElementById('lowStockAlertList');
  container.innerHTML = alerts.map(item => {
    const status = getStockStatus(item.stock, item.threshold);
    return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${item.name}</div>
        <div style="font-size:12px;color:var(--text-muted);">Threshold: ${item.threshold} · Supplier: ${item.supplier}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        ${getProgressBar(item.stock, item.threshold)}
        ${getStatusBadge(status)}
      </div>
    </div>`;
  }).join('');
}

function renderStockTimeline() {
  const container = document.getElementById('stockTimeline');
  container.innerHTML = stockMovements.map(m => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">${m.text}</div>
      <div class="timeline-time">${m.time}</div>
    </div>
  `).join('');
}

function searchInventory() {
  const q = document.getElementById('invSearch').value.toLowerCase();
  const f = document.getElementById('invFilter').value;
  let filtered = inventoryItems.filter(i =>
    i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );
  if (f !== 'all') filtered = filtered.filter(i => getStockStatus(i.stock, i.threshold) === f);
  renderInventory(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
  renderInventory();
  updateStats();
  renderLowStockAlerts();
  renderStockTimeline();
});
