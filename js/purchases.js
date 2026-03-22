/* ===================================================================
   JEWELLERY STORE — Purchases Page Logic
   ================================================================= */

let purchases = [
  { id: 'PO-1201', supplier: 'Kalyan Suppliers', item: 'Gold Chain 22K', qty: 15, costPrice: 48000, date: '2026-03-22', notes: 'Bulk order for festive season' },
  { id: 'PO-1202', supplier: 'Tanishq Wholesale', item: 'Diamond Studs 0.5ct', qty: 10, costPrice: 52000, date: '2026-03-20', notes: '' },
  { id: 'PO-1203', supplier: 'Malabar Traders', item: 'Ruby Pendant 18K', qty: 8, costPrice: 28000, date: '2026-03-18', notes: 'Natural Burmese rubies' },
  { id: 'PO-1204', supplier: 'Senco Gold Supply', item: 'Silver Bangle 925', qty: 25, costPrice: 2800, date: '2026-03-15', notes: 'Sterling silver, various designs' },
  { id: 'PO-1205', supplier: 'GRT Diamonds', item: 'Solitaire Ring 1ct', qty: 5, costPrice: 185000, date: '2026-03-12', notes: 'GIA certified' },
  { id: 'PO-1206', supplier: 'PC Jeweller Dist.', item: 'Platinum Chain 20"', qty: 12, costPrice: 78000, date: '2026-03-10', notes: '' },
  { id: 'PO-1207', supplier: 'Joyalukkas Gems', item: 'Emerald Gemstone Lot', qty: 20, costPrice: 15000, date: '2026-03-08', notes: 'Zambian emeralds, mixed sizes' },
  { id: 'PO-1208', supplier: 'Kalyan Suppliers', item: 'Gold Necklace 22K', qty: 6, costPrice: 125000, date: '2026-03-05', notes: 'Temple jewellery design' },
  { id: 'PO-1209', supplier: 'Tanishq Wholesale', item: 'Diamond Tennis Bracelet', qty: 4, costPrice: 280000, date: '2026-03-02', notes: '18K white gold setting' },
  { id: 'PO-1210', supplier: 'Malabar Traders', item: 'Pearl Necklace Set', qty: 10, costPrice: 42000, date: '2026-02-28', notes: 'Freshwater pearls' },
];

let purchaseCounter = 1211;

function renderPurchases(data) {
  if (!data) data = purchases;
  const tbody = document.getElementById('purchaseTableBody');
  document.getElementById('purchaseInfo').textContent = `Showing ${data.length} of ${purchases.length} purchases`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon"><i class="fa-solid fa-cart-shopping"></i></div><h3>No Purchases Found</h3></div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(p => `
    <tr>
      <td><span class="item-id">${p.id}</span></td>
      <td class="item-name">${p.supplier}</td>
      <td>${p.item}</td>
      <td>${p.qty}</td>
      <td>₹${p.costPrice.toLocaleString('en-IN')}</td>
      <td><strong>₹${(p.costPrice * p.qty).toLocaleString('en-IN')}</strong></td>
      <td>${formatDate(p.date)}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn view" title="View" onclick="showToast('info','Purchase Details','${p.item} from ${p.supplier} — ${p.qty} units at ₹${p.costPrice.toLocaleString("en-IN")} each.')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn delete" title="Delete" onclick="deletePurchase('${p.id}')"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function searchPurchases() {
  const q = document.getElementById('purchaseSearch').value.toLowerCase();
  const filtered = purchases.filter(p =>
    p.supplier.toLowerCase().includes(q) || p.item.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
  );
  renderPurchases(filtered);
}

function savePurchase() {
  const supplier = document.getElementById('purSupplier');
  const item = document.getElementById('purItem');
  const qty = document.getElementById('purQty');
  const cost = document.getElementById('purCost');
  let valid = true;

  [supplier, item, qty, cost].forEach(el => {
    if (!el.value.toString().trim()) { el.closest('.form-group').classList.add('has-error'); valid = false; }
    else el.closest('.form-group').classList.remove('has-error');
  });

  if (!valid) return;

  const newPurchase = {
    id: 'PO-' + purchaseCounter++,
    supplier: supplier.value,
    item: item.value.trim(),
    qty: parseInt(qty.value),
    costPrice: parseFloat(cost.value),
    date: document.getElementById('purDate').value || new Date().toISOString().split('T')[0],
    notes: document.getElementById('purNotes').value.trim(),
  };

  purchases.unshift(newPurchase);
  closeModal('addPurchaseModal');
  document.getElementById('purchaseForm').reset();
  renderPurchases();
  renderRecentPurchases();
  showToast('success', 'Purchase Recorded', `${newPurchase.item} from ${newPurchase.supplier} added.`);
}

function deletePurchase(id) {
  const p = purchases.find(x => x.id === id);
  if (!p) return;
  showConfirmDialog('Delete Purchase', `Remove purchase <strong>${p.id}</strong>?`, () => {
    purchases = purchases.filter(x => x.id !== id);
    renderPurchases();
    renderRecentPurchases();
    showToast('success', 'Deleted', `Purchase ${p.id} removed.`);
  });
}

function openAddPurchase() {
  document.getElementById('purchaseForm').reset();
  document.getElementById('purDate').value = new Date().toISOString().split('T')[0];
  document.querySelectorAll('#purchaseForm .form-group').forEach(g => g.classList.remove('has-error'));
  openModal('addPurchaseModal');
}

function renderRecentPurchases() {
  const container = document.getElementById('recentPurchasesTimeline');
  const recent = purchases.slice(0, 5);
  container.innerHTML = recent.map(p => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content"><strong>${p.item}</strong> from ${p.supplier} — ${p.qty} units</div>
      <div class="timeline-time">${formatDate(p.date)}</div>
    </div>
  `).join('');
}

function renderTopSuppliers() {
  const supplierMap = {};
  purchases.forEach(p => {
    if (!supplierMap[p.supplier]) supplierMap[p.supplier] = { orders: 0, value: 0 };
    supplierMap[p.supplier].orders++;
    supplierMap[p.supplier].value += p.costPrice * p.qty;
  });

  const sorted = Object.entries(supplierMap).sort((a, b) => b[1].value - a[1].value);
  const container = document.getElementById('topSuppliersPanel');
  container.innerHTML = sorted.map(([name, data], i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:32px;height:32px;border-radius:50%;background:${i < 3 ? 'var(--gold-light)' : 'var(--highlight)'};display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;color:${i < 3 ? 'var(--gold)' : 'var(--text-muted)'};">${i + 1}</div>
        <div>
          <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${name}</div>
          <div style="font-size:12px;color:var(--text-muted);">${data.orders} orders</div>
        </div>
      </div>
      <div style="font-weight:600;color:var(--text-dark);">₹${(data.value / 100000).toFixed(1)}L</div>
    </div>
  `).join('');
}

// Auto-calculate total
document.addEventListener('DOMContentLoaded', () => {
  renderPurchases();
  renderRecentPurchases();
  renderTopSuppliers();

  const qtyEl = document.getElementById('purQty');
  const costEl = document.getElementById('purCost');
  const totalEl = document.getElementById('purTotal');

  function calcTotal() {
    const q = parseFloat(qtyEl.value) || 0;
    const c = parseFloat(costEl.value) || 0;
    totalEl.value = q * c > 0 ? '₹' + (q * c).toLocaleString('en-IN') : '';
  }

  qtyEl.addEventListener('input', calcTotal);
  costEl.addEventListener('input', calcTotal);
});
