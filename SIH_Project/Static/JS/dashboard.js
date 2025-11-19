// ====== Data (matches your React example) ======
const activityData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 400 },
  { month: "Mar", users: 350 },
  { month: "Apr", users: 500 },
  { month: "May", users: 800 },
  { month: "Jun", users: 650 },
];

const pieData = [
  { name: "CSE", value: 45, color: getCSS('--cyan') },
  { name: "ECE", value: 25, color: getCSS('--violet') },
  { name: "IT",  value: 15, color: '#14b8a6' },
  { name: "MECH",value: 15, color: getCSS('--amber') },
];

// ====== Hamburger Menu ======
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// ====== Helpers ======
function getCSS(varName){
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// ====== Line Chart (SVG, pure JS) ======
const svg = document.getElementById('lineChart');
const xLabelsEl = document.getElementById('xLabels');

function drawLineChart() {
  // Clear SVG + labels
  svg.innerHTML = '';
  xLabelsEl.innerHTML = '';

  const box = svg.getBoundingClientRect();
  const width = Math.max(300, box.width);
  const height = Math.max(180, box.height);

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Padding
  const pad = { top: 16, right: 16, bottom: 28, left: 28 };

  // Axes ranges
  const xCount = activityData.length;
  const xStep = (width - pad.left - pad.right) / (xCount - 1);
  const maxY = Math.max(...activityData.map(d => d.users));
  const yMaxNice = Math.ceil(maxY / 100) * 100; // nice round
  const yTicks = 4;

  // Grid lines + Y axis
  for (let i = 0; i <= yTicks; i++) {
    const yVal = (yMaxNice / yTicks) * i;
    const y = height - pad.bottom - (yVal / yMaxNice) * (height - pad.top - pad.bottom);

    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', pad.left);
    line.setAttribute('x2', width - pad.right);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('class','grid-line');
    svg.appendChild(line);
  }

  // X labels
  activityData.forEach((d) => {
    const span = document.createElement('span');
    span.textContent = d.month;
    xLabelsEl.appendChild(span);
  });

  // Points -> polyline
  const points = activityData.map((d, i) => {
    const x = pad.left + i * xStep;
    const y = height - pad.bottom - (d.users / yMaxNice) * (height - pad.top - pad.bottom);
    return [x, y];
  });

  const poly = document.createElementNS('http://www.w3.org/2000/svg','polyline');
  poly.setAttribute('points', points.map(p => p.join(',')).join(' '));
  poly.setAttribute('class', 'polyline');
  svg.appendChild(poly);

  // Dots
  points.forEach(([x,y]) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 4);
    c.setAttribute('class', 'circle');
    svg.appendChild(c);
  });
}

window.addEventListener('resize', drawLineChart);
drawLineChart();

// ====== Pie Chart (CSS conic-gradient) ======
const pieEl = document.getElementById('pieChart');
const legendEl = document.getElementById('pieLegend');

function drawPie() {
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  let start = 0;
  const segments = [];

  pieData.forEach((d) => {
    const angle = (d.value / total) * 360;
    const from = start;
    const to = start + angle;
    segments.push(`${d.color} ${from}deg ${to}deg`);
    start = to;
  });

  pieEl.style.background = `conic-gradient(${segments.join(', ')})`;

  // Legend
  legendEl.innerHTML = '';
  pieData.forEach((d) => {
    const li = document.createElement('li');
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = d.color;
    const txt = document.createElement('span');
    txt.textContent = `${d.name} – ${d.value}%`;
    li.appendChild(sw);
    li.appendChild(txt);
    legendEl.appendChild(li);
  });
}
drawPie();

// Optional: demo clicking menu items
Array.from(document.querySelectorAll('#menu li')).forEach(li => {
  li.addEventListener('click', () => {
    Array.from(document.querySelectorAll('#menu li')).forEach(n => n.classList.remove('active'));
    li.classList.add('active');
    // In a multi-page app, navigate here:
    // window.location.href = 'your-page.html';
  });
});
