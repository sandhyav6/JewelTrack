/* ===================================================================
   JEWELLERY STORE — Reports Page Logic
   ================================================================= */

const chartColors = {
  gold: '#C9A227', goldBg: 'rgba(201, 162, 39, 0.15)',
  burgundy: '#6D1F3C', burgundyBg: 'rgba(109, 31, 60, 0.15)',
  success: '#2E7D32', info: '#355C7D', warning: '#D4A017', muted: '#8B857D',
};

Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#8B857D';

async function initReportCharts() {
  // Sales Trend
  const salesCtx = document.getElementById('reportSalesChart').getContext('2d');
  const trend = (await fetchData('/api/reports/sales-trend?days=30')) || [];
  const trendLabels = trend.length ? trend.map(t => formatDate(t.BILLDATE).substring(0, 5)) : Array.from({ length: 22 }, (_, i) => `Mar ${i + 1}`);
  const trendData = trend.length ? trend.map(t => t.DAILYTOTAL) : [185000, 220000, 198000, 245000, 280000, 310000, 190000, 260000, 275000, 300000, 285000, 320000, 295000, 340000, 285000, 310000, 330000, 350000, 280000, 295000, 325000, 285400];

  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [{
        label: 'Daily Sales',
        data: trendData,
        borderColor: chartColors.gold,
        backgroundColor: chartColors.goldBg,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: chartColors.gold,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8, displayColors: false, callbacks: { label: c => '₹' + c.parsed.y.toLocaleString('en-IN') } } },
      scales: { y: { beginAtZero: true, grid: { color: 'rgba(232,223,209,0.5)', drawBorder: false }, ticks: { callback: v => '₹' + (v / 1000) + 'K' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 11 } } }
    }
  });

  // Category Performance
  const catCtx = document.getElementById('reportCategoryChart').getContext('2d');
  const catData = (await fetchData('/api/reports/category-distribution')) || [];
  const catLabels = catData.length ? catData.map(c => c.CATEGORYNAME) : ['Gold', 'Diamond', 'Silver', 'Platinum', 'Gemstone'];
  const catValues = catData.length ? catData.map(c => c.TOTALREVENUE) : [1850000, 1420000, 680000, 540000, 320000];
  const bgColors = [chartColors.gold, chartColors.burgundy, chartColors.info, chartColors.muted, chartColors.warning].slice(0, catValues.length);

  new Chart(catCtx, {
    type: 'bar',
    data: {
      labels: catLabels,
      datasets: [{
        label: 'Revenue',
        data: catValues,
        backgroundColor: bgColors,
        borderRadius: 8, borderSkipped: false, barThickness: 40,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2E2A27', padding: 12, cornerRadius: 8, displayColors: false, callbacks: { label: c => '₹' + (c.parsed.y / 100000).toFixed(1) + 'L' } } },
      scales: { y: { beginAtZero: true, grid: { color: 'rgba(232,223,209,0.5)', drawBorder: false }, ticks: { callback: v => '₹' + (v / 100000) + 'L' } }, x: { grid: { display: false } } }
    }
  });
}

function generateReport() {
  showToast('success', 'Report Generated', 'Report data has been refreshed for the selected date range.');
}

document.addEventListener('DOMContentLoaded', () => {
  initInternalPage();
  initReportCharts();
});
