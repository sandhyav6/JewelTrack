/* ===================================================================
   JEWELLERY STORE — Billing Page Logic
   ================================================================= */

let availableItems = [];
let billItems = [];
let currentBillTotals = { discount: 0, tax: 0, total: 0 };

// ===== Initialize Billing Page =====
async function initBilling() {
  const [items, customers, employees, nextNumber] = await Promise.all([
    fetchData('/api/items'),
    fetchData('/api/customers'),
    fetchData('/api/employees'),
    fetchData('/api/billing/next-number')
  ]);

  if (items) availableItems = items;
  
  if (nextNumber && nextNumber.nextBillNo) {
    document.getElementById('billNumber').value = nextNumber.nextBillNo;
  }

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('billDate').value = today;

  if (items) {
    document.getElementById('billItem').innerHTML = '<option value="">Choose an item</option>' +
      items.filter(i => i.CURRENTSTOCK > 0).map(i => `<option value="${i.ITEMID}">${i.ITEMNAME} (Stock: ${i.CURRENTSTOCK}) — ₹${(i.BASEPRICE || 0).toLocaleString('en-IN')}</option>`).join('');
  }

  if (customers) {
    document.getElementById('billCustomer').innerHTML = '<option value="">Select Customer</option>' +
      customers.map(c => `<option value="${c.CUSTOMERID}">${c.CUSTOMERNAME} (${c.PHONE})</option>`).join('');
  }

  if (employees) {
    document.getElementById('billEmployee').innerHTML = '<option value="">Select Billed By</option>' +
      employees.map(e => `<option value="${e.EMPLOYEEID}">${e.FIRSTNAME}${e.LASTNAME ? ' ' + e.LASTNAME : ''}</option>`).join('');
  }

  document.getElementById('billCustomer').addEventListener('change', updatePreview);
  document.getElementById('billEmployee').addEventListener('change', updatePreview);
  document.getElementById('billDate').addEventListener('change', updatePreview);
  document.getElementById('billPayment').addEventListener('change', updatePreview);

  updatePreview();
}

// ===== Add Item to Bill =====
function addBillItem() {
  const itemId = document.getElementById('billItem').value;
  const qty = parseInt(document.getElementById('billQty').value) || 1;

  if (!itemId) {
    showToast('warning', 'Select Item', 'Please select an item to add to the bill.');
    return;
  }

  const item = availableItems.find(i => i.ITEMID === itemId);
  if (!item) return;

  if (qty > item.CURRENTSTOCK) {
    return showToast('error', 'Insufficient Stock', `Only ${item.CURRENTSTOCK} units available.`);
  }

  // Check if item already in bill
  const existing = billItems.find(b => b.id === itemId);
  if (existing) {
    if (existing.qty + qty > item.CURRENTSTOCK) {
      return showToast('error', 'Insufficient Stock', `Cannot exceed available stock of ${item.CURRENTSTOCK}.`);
    }
    existing.qty += qty;
  } else {
    billItems.push({ id: item.ITEMID, name: item.ITEMNAME, price: item.BASEPRICE || 0, qty: qty, maxStock: item.CURRENTSTOCK });
  }

  document.getElementById('billItem').value = '';
  document.getElementById('billQty').value = 1;

  renderBillItems();
  updateTotals();
  updatePreview();
}

// ===== Render Bill Items =====
function renderBillItems() {
  const tbody = document.getElementById('billItemsBody');

  if (billItems.length === 0) {
    tbody.innerHTML = `<tr id="emptyBillRow"><td colspan="5"><div class="empty-state" style="padding:24px;"><i class="fa-solid fa-cart-shopping" style="font-size:24px;color:var(--text-muted);margin-bottom:8px;"></i><p style="margin:0;">No items added yet.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = billItems.map((item, idx) => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td>
        <input type="number" value="${item.qty}" min="1" style="width:60px;height:34px;text-align:center;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;padding:0 4px;" onchange="updateItemQty(${idx}, this.value)">
      </td>
      <td>₹${item.price.toLocaleString('en-IN')}</td>
      <td><strong>₹${(item.price * item.qty).toLocaleString('en-IN')}</strong></td>
      <td><button class="action-btn delete" onclick="removeBillItem(${idx})"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
  `).join('');
}

// ===== Update Item Quantity =====
function updateItemQty(index, qty) {
  qty = parseInt(qty);
  if (qty < 1) qty = 1;
  const item = billItems[index];
  if (qty > item.maxStock) {
    qty = item.maxStock;
    showToast('warning', 'Stock Limit', `Maximum available stock is ${qty}.`);
  }
  billItems[index].qty = qty;
  renderBillItems();
  updateTotals();
  updatePreview();
}

// ===== Remove Item from Bill =====
function removeBillItem(index) {
  billItems.splice(index, 1);
  renderBillItems();
  updateTotals();
  updatePreview();
}

// ===== Update Totals =====
function updateTotals() {
  const subtotal = billItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPct = parseFloat(document.getElementById('billDiscount').value) || 0;
  const discountAmt = subtotal * (discountPct / 100);
  const taxableAmt = subtotal - discountAmt;
  const tax = taxableAmt * 0.03; // 3% GST
  const grandTotal = taxableAmt + tax;

  currentBillTotals = { discount: discountAmt, tax: tax, total: grandTotal };

  document.getElementById('billSubtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  document.getElementById('billTax').textContent = '₹' + Math.round(tax).toLocaleString('en-IN');
  document.getElementById('billDiscountAmt').textContent = '-₹' + Math.round(discountAmt).toLocaleString('en-IN');
  document.getElementById('billGrandTotal').textContent = '₹' + Math.round(grandTotal).toLocaleString('en-IN');

  // Preview totals
  document.getElementById('previewSubtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  document.getElementById('previewTax').textContent = '₹' + Math.round(tax).toLocaleString('en-IN');
  document.getElementById('previewDiscount').textContent = '-₹' + Math.round(discountAmt).toLocaleString('en-IN');
  document.getElementById('previewTotal').textContent = '₹' + Math.round(grandTotal).toLocaleString('en-IN');
}

// ===== Update Live Preview =====
function updatePreview() {
  document.getElementById('previewBillNo').textContent = document.getElementById('billNumber').value;
  document.getElementById('previewDate').textContent = document.getElementById('billDate').value ? formatDate(document.getElementById('billDate').value) : '-';
  document.getElementById('previewCustomer').textContent = document.getElementById('billCustomer').value || '-';
  document.getElementById('previewEmployee').textContent = document.getElementById('billEmployee').value;
  document.getElementById('previewPayment').textContent = document.getElementById('billPayment').value;

  const previewBody = document.getElementById('previewItems');
  if (billItems.length === 0) {
    previewBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;font-size:13px;">No items</td></tr>';
  } else {
    previewBody.innerHTML = billItems.map(item => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;">${item.name}</td>
        <td style="padding:8px 12px;font-size:13px;text-align:center;">${item.qty}</td>
        <td style="padding:8px 12px;font-size:13px;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:8px 12px;font-size:13px;font-weight:600;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');
  }

  updateTotals();
}

// ===== Generate Bill =====
async function generateBill() {
  const customerId = document.getElementById('billCustomer').value;
  if (!customerId) {
    showToast('warning', 'Select Customer', 'Please select a customer for this bill.');
    return;
  }

  if (billItems.length === 0) {
    showToast('warning', 'No Items', 'Please add at least one item to the bill.');
    return;
  }

  const payload = {
    customerId: customerId,
    employeeId: document.getElementById('billEmployee').value || null,
    paymentMethod: document.getElementById('billPayment').value,
    discount: currentBillTotals.discount,
    taxAmount: currentBillTotals.tax,
    items: billItems.map(i => ({ itemId: i.id, quantity: i.qty, unitPrice: i.price }))
  };

  const res = await fetchData('/api/billing', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res) {
    const custSelect = document.getElementById('billCustomer');
    const custName = custSelect.options[custSelect.selectedIndex].text;
    const billNo = res.billId || document.getElementById('billNumber').value;
    const grandTotal = document.getElementById('billGrandTotal').textContent;

    // Show success modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal" style="max-width:420px;text-align:center;">
        <div class="modal-body" style="padding:40px 28px;">
          <div style="width:72px;height:72px;border-radius:50%;background:rgba(46,125,50,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:32px;color:var(--success);">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="margin-bottom:8px;">Bill Generated Successfully!</h3>
          <p style="color:var(--text-muted);margin-bottom:4px;">Bill No: <strong>${billNo}</strong></p>
          <p style="color:var(--text-muted);margin-bottom:4px;">Customer: <strong>${custName}</strong></p>
          <p style="font-size:24px;font-weight:700;color:var(--text-dark);font-family:var(--font-heading);margin-top:16px;">${grandTotal}</p>
        </div>
        <div style="padding:0 28px 32px;display:flex;gap:10px;justify-content:center;">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove();document.body.style.overflow='';">Close</button>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove();document.body.style.overflow='';clearBill();">New Bill</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    showToast('success', 'Bill Created', `Invoice ${billNo} generated and stock updated.`);
  }
}

// ===== Clear Bill =====
function clearBill() {
  billItems = [];
  document.getElementById('billCustomer').value = '';
  document.getElementById('billDiscount').value = 0;
  renderBillItems();
  updateTotals();
  updatePreview();
  initBilling();
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initInternalPage();
  initBilling();
});
