/* ===================================================================
   JEWELLERY STORE — Purchases Page Logic
   ================================================================= */

let purchases = [];
let purchaseSuppliers = [];
let purchaseItemsArr = [];

async function loadPurchaseDropdowns() {
  const [sups, itms] = await Promise.all([
    fetchData('/api/suppliers'),
    fetchData('/api/items')
  ]);
  if (sups) {
    purchaseSuppliers = sups;
    document.getElementById('purSupplier').innerHTML = '<option value="">Select Supplier</option>' + sups.map(s => `<option value="${s.SUPPLIERID}">${s.SUPPLIERNAME}</option>`).join('');
  }
  if (itms) {
    purchaseItemsArr = itms;
    document.getElementById('purItem').innerHTML = '<option value="">Select Item</option>' + itms.map(i => `<option value="${i.ITEMID}">${i.ITEMNAME} (Stock: ${i.CURRENTSTOCK})</option>`).join('');
  }
}

async function loadPurchases() {
  const data = await fetchData('/api/purchases');
  if (data) {
    purchases = data.map(p => ({
      id: p.PURCHASEID,
      supplier: p.SUPPLIERNAME,
      item: p.ITEMS ? p.ITEMS.split(',').length > 1 ? p.ITEMS.split(',')[0] + ' + more' : p.ITEMS : 'Unknown',
      qty: p.TOTALITEMS,
      costPrice: p.TOTALITEMS > 0 ? (p.TOTALAMOUNT / p.TOTALITEMS) : p.TOTALAMOUNT,
      totalValue: p.TOTALAMOUNT,
      date: p.PURCHASEDATE
    }));
    searchPurchases();
    renderRecentPurchases();
    renderTopSuppliers();
  }
}

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
          <button class="action-btn view" title="View" onclick="showToast('info','Purchase Details','${p.item} from ${p.supplier} — ${p.qty} units at ₹${p.totalValue.toLocaleString("en-IN")} total.')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn delete" title="Cannot Delete" onclick="showToast('warning', 'Restricted', 'Purchases cannot be deleted for accounting integrity.')"><i class="fa-solid fa-lock"></i></button>
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

async function savePurchase() {
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

  const payload = {
    supplierId: supplier.value,
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    items: [
      {
        itemId: item.value,
        quantity: parseInt(qty.value),
        unitCost: parseFloat(cost.value)
      }
    ]
  };

  const res = await fetchData('/api/purchases', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res) {
    showToast('success', 'Purchase Recorded', `Purchase verified and inventory incremented.`);
    closeModal('addPurchaseModal');
    document.getElementById('purchaseForm').reset();
    await loadPurchases();
  }
}

function deletePurchase(id) {
  showToast('warning', 'Restricted Action', 'Transactions are permanent and cannot be deleted.');
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

document.addEventListener('DOMContentLoaded', async () => {
  await loadPurchaseDropdowns();
  await loadPurchases();

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
