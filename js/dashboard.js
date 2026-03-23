/* ===================================================================
   JEWELLERY STORE — Dashboard Logic
   ================================================================= */

// ===== Dummy Data =====
const recentSales = [
  { bill: 'BL-2847', customer: 'Priya Sharma', items: 'Gold Necklace, Earrings', amount: 87500, status: 'Paid' },
  { bill: 'BL-2846', customer: 'Rajesh Patel', items: 'Diamond Ring', amount: 145000, status: 'Paid' },
  { bill: 'BL-2845', customer: 'Anjali Gupta', items: 'Silver Bangle Set', amount: 12800, status: 'Pending' },
  { bill: 'BL-2844', customer: 'Vikram Singh', items: 'Bridal Set', amount: 325000, status: 'Paid' },
  { bill: 'BL-2843', customer: 'Meera Iyer', items: 'Gemstone Pendant', amount: 34200, status: 'Paid' },
  { bill: 'BL-2842', customer: 'Arjun Reddy', items: 'Platinum Chain', amount: 67800, status: 'Pending' },
];

const lowStockItems = [
  { name: 'Ruby Pendant (18K)', stock: 2, threshold: 10, status: 'critical' },
  { name: 'Diamond Stud Earrings', stock: 3, threshold: 8, status: 'critical' },
  { name: 'Gold Bangles (22K)', stock: 5, threshold: 15, status: 'low' },
  { name: 'Pearl Necklace Set', stock: 4, threshold: 10, status: 'low' },
  { name: 'Silver Anklet Pair', stock: 6, threshold: 12, status: 'low' },
];

const topCustomers = [
  { name: 'Priya Sharma', purchases: 24, spent: 1245000, badge: 'Preferred' },
  { name: 'Vikram Singh', purchases: 18, spent: 980000, badge: 'Preferred' },
  { name: 'Anjali Gupta', purchases: 15, spent: 567000, badge: 'Regular' },
  { name: 'Rajesh Patel', purchases: 12, spent: 432000, badge: 'Regular' },
];

const recentActivity = [
  { text: '<strong>New sale</strong> — BL-2847 to Priya Sharma', time: '15 min ago' },
  { text: '<strong>Stock updated</strong> — Gold Chain 22K (+20 units)', time: '42 min ago' },
  { text: '<strong>New customer</strong> — Neha Kapoor registered', time: '1 hr ago' },
  { text: '<strong>Purchase order</strong> — PO-1204 from Kalyan Suppliers', time: '2 hrs ago' },
  { text: '<strong>Low stock alert</strong> — Ruby Pendant below threshold', time: '3 hrs ago' },
  { text: '<strong>Bill generated</strong> — BL-2846 for ₹1,45,000', time: '4 hrs ago' },
];

// ===== Chart.js Color Config =====
const chartColors = {
  gold: '#C9A227',
  goldTransparent: 'rgba(201, 162, 39, 0.15)',
  burgundy: '#6D1F3C',
  burgundyTransparent: 'rgba(109, 31, 60, 0.15)',
  success: '#2E7D32',
  warning: '#D4A017',
  danger: '#B23A48',
  info: '#355C7D',
  muted: '#8B857D',
  border: '#E8DFD1',
};

Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#8B857D';

// ===== Sales Overview Chart =====
let salesChart;
function initSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Sales (₹)',
        data: [185000, 240000, 198000, 285000, 320000, 290000, 285400],
        borderColor: chartColors.gold,
        backgroundColor: chartColors.goldTransparent,
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.gold,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#2E2A27',
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (ctx) => '₹' + ctx.parsed.y.toLocaleString('en-IN')
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(232, 223, 209, 0.5)', drawBorder: false },
          ticks: { callback: v => '₹' + (v / 1000) + 'K' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function updateSalesChart(period) {
  document.querySelectorAll('.card .tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const datasets = {
    week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [185000, 240000, 198000, 285000, 320000, 290000, 285400] },
    month: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [1850000, 2100000, 1920000, 2500000] },
    year: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], data: [3200000, 3500000, 3100000, 3800000, 4100000, 3900000, 4250000, 4500000, 4200000, 4800000, 5100000, 4900000] },
  };

  salesChart.data.labels = datasets[period].labels;
  salesChart.data.datasets[0].data = datasets[period].data;
  salesChart.update('active');
}

// ===== Category Chart =====
function initCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Gold', 'Diamond', 'Silver', 'Platinum', 'Gemstone'],
      datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: [chartColors.gold, chartColors.burgundy, chartColors.info, chartColors.muted, chartColors.warning],
        borderWidth: 3,
        borderColor: '#FFFFFF',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } }
        },
        tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8 }
      }
    }
  });
}

// ===== Revenue Trend Chart =====
function initRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue',
        data: [3200000, 3500000, 3100000, 3800000, 4100000, 3900000, 4250000, 4500000, 4200000, 4800000, 5100000, 4900000],
        backgroundColor: chartColors.goldTransparent,
        borderColor: chartColors.gold,
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(201, 162, 39, 0.35)',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8, displayColors: false, callbacks: { label: (c) => '₹' + (c.parsed.y / 100000).toFixed(1) + 'L' } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(232, 223, 209, 0.5)', drawBorder: false }, ticks: { callback: v => '₹' + (v / 100000) + 'L' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ===== Inventory Status Chart =====
function initInventoryChart() {
  const ctx = document.getElementById('inventoryChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['In Stock', 'Low Stock', 'Out of Stock'],
      datasets: [{
        data: [72, 20, 8],
        backgroundColor: [chartColors.success, chartColors.warning, chartColors.danger],
        borderWidth: 3,
        borderColor: '#FFFFFF',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } },
        tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8, callbacks: { label: (c) => c.label + ': ' + c.parsed + '%' } }
      }
    }
  });
}

// ===== Populate Recent Sales Table =====
function renderRecentSales() {
  const tbody = document.querySelector('#recentSalesTable tbody');
  tbody.innerHTML = recentSales.map(s => `
    <tr>
      <td><span class="item-id">${s.bill}</span></td>
      <td class="item-name">${s.customer}</td>
      <td>${s.items}</td>
      <td><strong>₹${s.amount.toLocaleString('en-IN')}</strong></td>
      <td><span class="badge ${s.status === 'Paid' ? 'badge-success' : 'badge-warning'}">${s.status}</span></td>
    </tr>
  `).join('');
}

// ===== Populate Low Stock Items =====
function renderLowStock() {
  const container = document.getElementById('lowStockList');
  container.innerHTML = lowStockItems.map(item => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
      <div>
        <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${item.name}</div>
        <div style="font-size:12px;color:var(--text-muted);">Threshold: ${item.threshold} units</div>
      </div>
      <div style="text-align:right;">
        <span class="badge ${item.status === 'critical' ? 'badge-danger' : 'badge-warning'}">${item.stock} left</span>
      </div>
    </div>
  `).join('');
}

// ===== Populate Top Customers =====
function renderTopCustomers() {
  const container = document.getElementById('topCustomersList');
  container.innerHTML = topCustomers.map((c, i) => `
    <div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border);">
      <div style="width:36px;height:36px;border-radius:50%;background:${i < 2 ? 'var(--gold-light)' : 'var(--highlight)'};display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:${i < 2 ? 'var(--gold)' : 'var(--text-muted)'};">${i + 1}</div>
      <div style="flex:1;">
        <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${c.name}</div>
        <div style="font-size:12px;color:var(--text-muted);">${c.purchases} purchases</div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:600;color:var(--text-dark);font-size:14px;">₹${(c.spent / 100000).toFixed(1)}L</div>
        <span class="badge ${c.badge === 'Preferred' ? 'badge-gold' : 'badge-muted'}" style="font-size:11px;">${c.badge}</span>
      </div>
    </div>
  `).join('');
}

// ===== Populate Activity Timeline =====
function renderActivity() {
  const container = document.getElementById('activityTimeline');
  container.innerHTML = recentActivity.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">${a.text}</div>
      <div class="timeline-time">${a.time}</div>
    </div>
  `).join('');
}

// ===== Stat Count-Up Animation =====
function animateStats() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCountUp(el, target);
  });
}

// ===== Initialize Dashboard =====
document.addEventListener('DOMContentLoaded', () => {
  // Update greeting with logged-in user's name
  const user = getCurrentUser();
  const greetingEl = document.getElementById('dashGreeting');
  if (greetingEl && user) {
    const firstName = user.name.split(' ')[0];
    const h = new Date().getHours();
    const tod = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
    greetingEl.textContent = `Good ${tod}, ${firstName} \u2728`;
  }

  // Hide admin-only quick actions for Staff
  if (user && user.role === 'Staff') {
    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.style.display = 'none';
    });
  }

  animateStats();
  initSalesChart();
  initCategoryChart();
  initRevenueChart();
  initInventoryChart();
  renderRecentSales();
  renderLowStock();
  renderTopCustomers();
  renderActivity();
});
