/* ===================================================================
   JEWELLERY STORE — Dashboard Logic
   ================================================================= */

async function loadDashboardData() {
  const [summary, recentSalesData, lowStockData, topCustomersData, activityData] = await Promise.all([
    fetchData('/api/dashboard/summary'),
    fetchData('/api/dashboard/recent-sales'),
    fetchData('/api/dashboard/low-stock'),
    fetchData('/api/dashboard/top-customers'),
    fetchData('/api/dashboard/recent-activity')
  ]);

  if (summary) {
    const stats = document.querySelectorAll('.stat-value[data-target]');
    if (stats.length >= 4) {
      stats[0].dataset.target = summary.TOTALREVENUE || 0;
      stats[1].dataset.target = summary.TOTALORDERS || 0;
      stats[2].dataset.target = summary.NEWCUSTOMERS || 0;
      stats[3].dataset.target = summary.LOWSTOCKITEMS || 0;
    }
    animateStats();
  }

  if (recentSalesData) {
    const tbody = document.querySelector('#recentSalesTable tbody');
    tbody.innerHTML = recentSalesData.map(s => `
      <tr>
        <td><span class="item-id">${s.REFERENCENO}</span></td>
        <td class="item-name">${s.CUSTOMERNAME}</td>
        <td>${s.ITEMS ? s.ITEMS.split(',').length > 1 ? s.ITEMS.split(',')[0] + ' + more' : s.ITEMS : 'Items'}</td>
        <td><strong>₹${(s.TOTALAMOUNT || 0).toLocaleString('en-IN')}</strong></td>
        <td><span class="badge ${s.STATUS === 'Paid' ? 'badge-success' : 'badge-warning'}">${s.STATUS || 'Completed'}</span></td>
      </tr>
    `).join('');
  } else {
    document.querySelector('#recentSalesTable tbody').innerHTML = '<tr><td colspan="5">No recent sales</td></tr>';
  }

  if (lowStockData) {
    const container = document.getElementById('lowStockList');
    container.innerHTML = lowStockData.map(item => {
      const statusBadge = item.CURRENTSTOCK === 0 ? 'badge-danger' : 'badge-warning';
      return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${item.ITEMNAME}</div>
          <div style="font-size:12px;color:var(--text-muted);">Threshold: ${item.REORDERLEVEL || 5} units</div>
        </div>
        <div style="text-align:right;">
          <span class="badge ${statusBadge}">${item.CURRENTSTOCK} left</span>
        </div>
      </div>
    `}).join('');
  }

  if (topCustomersData) {
    const container = document.getElementById('topCustomersList');
    container.innerHTML = topCustomersData.map((c, i) => `
      <div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border);">
        <div style="width:36px;height:36px;border-radius:50%;background:${i < 2 ? 'var(--gold-light)' : 'var(--highlight)'};display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:${i < 2 ? 'var(--gold)' : 'var(--text-muted)'};">${i + 1}</div>
        <div style="flex:1;">
          <div style="font-weight:500;color:var(--text-dark);font-size:14px;">${c.CUSTOMERNAME}</div>
          <div style="font-size:12px;color:var(--text-muted);">${c.TOTALBILLS} purchases</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:600;color:var(--text-dark);font-size:14px;">₹${(c.TOTALSPENT / 100000).toFixed(1)}L</div>
          <span class="badge ${i < 2 ? 'badge-gold' : 'badge-muted'}" style="font-size:11px;">MEMBER</span>
        </div>
      </div>
    `).join('');
  }

  if (activityData) {
    const container = document.getElementById('activityTimeline');
    container.innerHTML = activityData.map(a => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content"><strong>${a.ACTIVITYTYPE}</strong> — ${a.REFERENCEID} | ₹${(a.AMOUNT || 0).toLocaleString('en-IN')} by ${a.PERSONNAME}</div>
        <div class="timeline-time">${a.ACTIVITYDATE ? formatDate(a.ACTIVITYDATE) : 'Recently'}</div>
      </div>
    `).join('');
  }
}

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
async function initSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const trend = (await fetchData('/api/reports/sales-trend?days=7')) || [];
  const labels = trend.length ? trend.map(t => formatDate(t.BILLDATE).substring(0, 5)) : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const data = trend.length ? trend.map(t => t.DAILYTOTAL) : [0,0,0,0,0,0,0];

  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sales (₹)',
        data: data,
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
async function initCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const catData = (await fetchData('/api/reports/category-distribution')) || [];
  const labels = catData.length ? catData.map(c => c.CATEGORYNAME) : ['Gold', 'Diamond', 'Silver', 'Platinum', 'Gemstone'];
  const data = catData.length ? catData.map(c => c.TOTALREVENUE) : [35, 25, 20, 12, 8];
  const bgColors = [chartColors.gold, chartColors.burgundy, chartColors.info, chartColors.muted, chartColors.warning].slice(0, data.length);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColors,
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
async function initRevenueChart() {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  const trend = (await fetchData('/api/reports/sales-trend?days=12')) || [];
  const labels = trend.length ? trend.map(t => formatDate(t.BILLDATE).substring(0, 5)) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = trend.length ? trend.map(t => t.DAILYTOTAL) : [3200000, 3500000, 3100000, 3800000, 4100000, 3900000, 4250000, 4500000, 4200000, 4800000, 5100000, 4900000];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: data,
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
async function initInventoryChart() {
  const ctx = document.getElementById('inventoryChart').getContext('2d');
  const inv = (await fetchData('/api/reports/inventory-status')) || { IN_STOCK: 72, LOW_STOCK: 20, OUT_OF_STOCK: 8 };

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['In Stock', 'Low Stock', 'Out of Stock'],
      datasets: [{
        data: [inv.IN_STOCK || 0, inv.LOW_STOCK || 0, inv.OUT_OF_STOCK || 0],
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
        tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8, callbacks: { label: (c) => c.label + ': ' + c.parsed + ' items' } }
      }
    }
  });
}

// Render blocks removed as they are integrated into loadDashboardData

// ===== Stat Count-Up Animation =====
function animateStats() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    animateCountUp(el, target);
  });
}

// ===== Initialize Dashboard =====
document.addEventListener('DOMContentLoaded', async () => {
  initInternalPage();

  // Update greeting with logged-in user's name
  const user = getCurrentUser();
  const greetingEl = document.getElementById('dashGreeting');
  if (greetingEl && user) {
    const firstName = user.name.split(' ')[0];
    const h = new Date().getHours();
    const tod = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
    greetingEl.textContent = `Good ${tod}, ${firstName} ✨`;
  }

  // Hide admin-only quick actions for Staff
  if (user && user.role === 'Staff') {
    document.querySelectorAll('[data-admin-only]').forEach(el => {
      el.style.display = 'none';
    });
  }

  loadDashboardData();
  initSalesChart();
  initCategoryChart();
  initRevenueChart();
  initInventoryChart();
});
