/* ===================================================================
   JEWELLERY STORE — Inventory Page Logic
   ================================================================= */

let inventoryItems = [];
let stockMovements = [];

async function loadInventoryData() {
  const inv = await fetchData('/api/inventory');
  if (inv) {
    inventoryItems = inv.map(i => ({
      id: i.ITEMID,
      name: i.ITEMNAME,
      category: i.CATEGORYNAME,
      stock: i.CURRENTSTOCK || 0,
      threshold: i.REORDERLEVEL || 5, // fallback if null
      supplier: i.SUPPLIERNAME || 'N/A',
      lastUpdated: i.LASTRESTOCKEDDATE
    }));
  }

  const act = await fetchData('/api/dashboard/recent-activity');
  if (act) {
    stockMovements = act.map(a => ({
      text: `<strong>${a.ACTIVITYTYPE}</strong> — Ref: ${a.REFERENCEID} | Value: ₹${(a.AMOUNT || 0).toLocaleString('en-IN')} | Party: ${a.PERSONNAME}`,
      time: a.ACTIVITYDATE ? formatDate(a.ACTIVITYDATE) : 'Recently'
    }));
  }

  searchInventory();
  updateStats();
  renderLowStockAlerts();
  renderStockTimeline();
}

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
  loadInventoryData();
});
