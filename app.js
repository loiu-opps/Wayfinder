// ═══════════════════════════════════════════════
// STI WAYFINDER — app.js
// Prototype navigation logic
// ═══════════════════════════════════════════════

let activeRoom = 'REG';
let navHistory = [];
let isTransitioning = false;

// ── Screen transitions ──────────────────────────

function go(screenId) {
  if (isTransitioning) return;
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(screenId);
  if (!next || current === next) return;

  isTransitioning = true;

  if (current) {
    navHistory.push(current.id);
    current.classList.add('exit');
    current.classList.remove('active');
    setTimeout(() => current.classList.remove('exit'), 350);
  }

  next.style.transition = 'none';
  next.style.transform = 'translateX(100%)';
  next.style.opacity = '0';
  next.style.pointerEvents = 'none';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.style.transition = 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease';
      next.style.transform = 'translateX(0)';
      next.style.opacity = '1';
      next.style.pointerEvents = 'all';
      next.classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 340);
    });
  });
}

function goBack() {
  if (isTransitioning || navHistory.length === 0) return;
  const prevId = navHistory.pop();
  const current = document.querySelector('.screen.active');
  const prev = document.getElementById(prevId);
  if (!prev || current === prev) return;

  isTransitioning = true;

  if (current) {
    current.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease';
    current.style.transform = 'translateX(100%)';
    current.style.opacity = '0';
    current.classList.remove('active');
    setTimeout(() => {
      current.style.transform = '';
      current.style.opacity = '';
      current.style.transition = '';
      current.style.pointerEvents = '';
    }, 300);
  }

  prev.style.transition = 'none';
  prev.style.transform = 'translateX(-30%)';
  prev.style.opacity = '0';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      prev.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease';
      prev.style.transform = 'translateX(0)';
      prev.style.opacity = '1';
      prev.style.pointerEvents = 'all';
      prev.classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 300);
    });
  });
}

// ── Tab navigation (no slide, just fade) ────────

function tabTo(fromId, toId) {
  if (isTransitioning) return;
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  if (!to || from === to) return;

  isTransitioning = true;
  navHistory = []; // clear stack on tab switch

  if (from) {
    from.classList.remove('active');
    from.style.opacity = '0';
    from.style.pointerEvents = 'none';
    setTimeout(() => {
      from.style.opacity = '';
      from.style.pointerEvents = '';
    }, 220);
  }

  to.style.transition = 'none';
  to.style.opacity = '0';
  to.style.transform = 'none';
  to.style.pointerEvents = 'none';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      to.style.transition = 'opacity 0.2s ease';
      to.style.opacity = '1';
      to.style.pointerEvents = 'all';
      to.classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 220);
    });
  });
}

// ── Room detail ──────────────────────────────────

const roomData = {
  RM101: { name: 'Room 101', sub: 'Lecture Hall',       loc: 'Building A · 1st Floor', bldg: 'Building A', floor: '1st Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM102','REG','GDN'] },
  RM102: { name: 'Room 102', sub: 'Lecture Hall',       loc: 'Building A · 1st Floor', bldg: 'Building A', floor: '1st Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM101','GDN','PNC'] },
  RM201: { name: 'Room 201', sub: 'Science Lab',        loc: 'Building A · 2nd Floor', bldg: 'Building A', floor: '2nd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM203','LAB1','RM204'] },
  RM203: { name: 'Room 203', sub: 'Classroom',          loc: 'Building A · 2nd Floor', bldg: 'Building A', floor: '2nd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM201','RM204','LAB1'] },
  RM204: { name: 'Room 204', sub: 'Classroom',          loc: 'Building A · 2nd Floor', bldg: 'Building A', floor: '2nd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM203','RM201','LAB1'] },
  RM301: { name: 'Room 301', sub: 'Classroom',          loc: 'Building A · 3rd Floor', bldg: 'Building A', floor: '3rd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM302','LAB1','RM203'] },
  RM302: { name: 'Room 302', sub: 'ICT Lab',            loc: 'Building A · 3rd Floor', bldg: 'Building A', floor: '3rd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM301','LAB1','RM203'] },
  LAB1:  { name: 'ComLab 1', sub: 'Computer Laboratory',loc: 'Building A · 2nd Floor', bldg: 'Building A', floor: '2nd Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['RM201','RM203','RM301'] },
  REG:   { name: "Registrar's Office", sub: 'Administrative Services', loc: 'Building B · Ground Floor', bldg: 'Building B', floor: 'Ground Floor', hours: '8:00 AM — 5:00 PM', days: 'Mon — Fri', nearby: ['CSH','PNC','GDN'] },
  CSH:   { name: "Cashier's Office",   sub: 'Finance Services',        loc: 'Building B · Ground Floor', bldg: 'Building B', floor: 'Ground Floor', hours: '8:00 AM — 5:00 PM', days: 'Mon — Fri', nearby: ['REG','PNC','GDN'] },
  LIB:   { name: 'Library',            sub: 'Learning Resource Center', loc: 'Building B · 1st Floor',   bldg: 'Building B', floor: '1st Floor',   hours: '7:30 AM — 5:30 PM', days: 'Mon — Fri', nearby: ['REG','GDN','CSH'] },
  GDN:   { name: 'Guidance Office',    sub: 'Student Services',         loc: 'Building A · 1st Floor',   bldg: 'Building A', floor: '1st Floor',   hours: '8:00 AM — 5:00 PM', days: 'Mon — Fri', nearby: ['PNC','REG','LIB'] },
  PNC:   { name: "Principal's Office", sub: 'Administration',           loc: 'Building A · Ground Floor', bldg: 'Building A', floor: 'Ground Floor', hours: '8:00 AM — 5:00 PM', days: 'Mon — Fri', nearby: ['GDN','REG','CSH'] },
  GYM:   { name: 'Gymnasium',          sub: 'Sports & PE Facility',     loc: 'Building C · Ground Floor', bldg: 'Building C', floor: 'Ground Floor', hours: '7:00 AM — 6:00 PM', days: 'Mon — Sat', nearby: ['GDN','LIB','REG'] },
};

function openRoom(roomKey) {
  const r = roomData[roomKey];
  if (!r) { showToast('Room info coming soon'); return; }

  activeRoom = roomKey;

  // Build tags
  const tags = [r.floor, r.bldg].map(t => `<div class="rdtag">${t}</div>`).join('');

  // Build nearby list
  const nearbyHtml = (r.nearby || []).slice(0, 3).map((k, i) => {
    const n = roomData[k];
    if (!n) return '';
    const dist = ['~5m', '~8m', '~15m'][i];
    return `
      <div class="nli" onclick="openRoom('${k}')">
        <div class="nnum">${k}</div>
        <div class="ninf"><h4>${n.name}</h4><p>${n.loc}</p></div>
        <div class="ndist">${dist}</div>
      </div>`;
  }).join('');

  const detail = document.getElementById('s-room-detail');
  detail.querySelector('.rd-eye').textContent = r.loc;
  detail.querySelector('.rd-name').textContent = r.name;
  detail.querySelector('.rd-sub').textContent = r.sub;
  detail.querySelector('.rd-tags').innerHTML = tags;

  const infoRows = detail.querySelectorAll('.ir span');
  if (infoRows[0]) infoRows[0].textContent = r.bldg;
  if (infoRows[1]) infoRows[1].textContent = r.floor;
  if (infoRows[2]) infoRows[2].textContent = r.hours;
  if (infoRows[3]) infoRows[3].textContent = r.days;

  detail.querySelector('.nlist').innerHTML = nearbyHtml;

  go('s-room-detail');
}

// ── Navigation start ─────────────────────────────

let targetRoom = 'RM302';

function startNav(roomKey) {
  const r = roomData[roomKey] || { name: roomKey, floor: '—', loc: roomKey };
  targetRoom = roomKey;

  const mapScreen = document.getElementById('s-map');

  const searchSpan = mapScreen.querySelector('.msb-inner span');
  if (searchSpan) searchSpan.textContent = r.name;

  const floorCode = { '1st Floor': '1F', '2nd Floor': '2F', '3rd Floor': '3F', 'Ground Floor': 'GF' };
  const floorBadge = mapScreen.querySelector('.fbadge');
  if (floorBadge) floorBadge.textContent = floorCode[r.floor] || '—';

  const diH3 = mapScreen.querySelector('.di-txt h3');
  const diP  = mapScreen.querySelector('.di-txt p');
  if (diH3) diH3.textContent = r.name;
  if (diP)  diP.textContent  = r.loc;

  go('s-map');
}

function beginNavigation(roomKey) {
  if (roomKey) targetRoom = roomKey;
  const key = targetRoom;
  const r = roomData[key] || { name: key, floor: '—' };

  const navScreen = document.getElementById('s-navigate');
  navScreen.querySelector('.nh-inst').innerHTML =
    key === 'REG' || key === 'CSH' || key === 'PNC'
      ? 'Head to the main entrance'
      : 'Turn right at the<br>main stairwell';

  navScreen.querySelector('.nh-sub').textContent =
    `Heading to ${r.name} · ${r.floor || r.loc || ''}`;

  const steps = navScreen.querySelectorAll('.sd');
  steps.forEach((s, i) => {
    s.classList.remove('done', 'cur');
    if (i === 0) s.classList.add('done');
    if (i === 1) s.classList.add('cur');
  });

  go('s-navigate');
  showToast(`Navigating to ${r.name}`);
}

// ── Schedule day filter ──────────────────────────

function showDay(dayId, el) {
  document.querySelectorAll('.sched-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.dc').forEach(d => d.classList.remove('on'));
  const panel = document.getElementById('day-' + dayId);
  if (panel) panel.style.display = 'block';
  if (el) el.classList.add('on');
}

// ── Dashboard day selector ───────────────────────

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function setDashDay(val) {
  const countEl = document.getElementById('dash-day-count');
  const dateEl  = document.getElementById('dash-day-date');
  const titleEl = document.getElementById('dash-sch-title');
  const today   = new Date();

  if (val === 'all') {
    if (titleEl) titleEl.textContent = 'All Classes';
    if (dateEl)  dateEl.textContent  = 'Entire Week';
    if (countEl) countEl.textContent = '11 subjects';
  } else {
    const dayNames = { 1:'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday' };
    if (titleEl) titleEl.textContent = `Classes for ${dayNames[val] || 'Today'}`;

    // Find next occurrence of that weekday
    const target = parseInt(val);
    const diff = (target - today.getDay() + 7) % 7;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    if (dateEl) dateEl.textContent = `${DAYS[d.getDay()].slice(0,3)}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;

    const classCounts = { 1:2, 2:2, 3:0, 4:4, 5:3, 6:2 };
    const n = classCounts[val] || 0;
    if (countEl) countEl.textContent = n === 0 ? 'No classes' : `${n} ${n === 1 ? 'class' : 'classes'}`;
  }
}

function initDashDay() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun ... 6=Sat
  const sel = document.getElementById('dash-day-sel');
  const dateEl = document.getElementById('dash-day-date');

  if (dateEl) {
    dateEl.textContent = `${DAYS[dow]}, ${MONTHS[today.getMonth()]} ${today.getDate()}`;
  }

  // Pre-select today if within Mon–Sat, otherwise Monday
  const mapDay = [null, '1', '2', '3', '4', '5', '6'];
  const dayVal = mapDay[dow] || '1';
  if (sel) {
    sel.value = dayVal;
    setDashDay(dayVal);
  }
}

// ── Search / filter chips ────────────────────────

function filterChip(el) {
  const siblings = el.parentElement.querySelectorAll('.chip');
  siblings.forEach(c => c.classList.add('off'));
  el.classList.remove('off');
  showToast(`Filtered: ${el.textContent}`);
}

// ── Guest type selector ──────────────────────────

function selectGuest(el) {
  document.querySelectorAll('.gtype').forEach(g => g.classList.remove('sel'));
  el.classList.add('sel');
}

// ── Map floor switcher ───────────────────────────

function switchFloor(el) {
  el.closest('.floor-sw').querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
  el.classList.add('on');
  showToast(`Floor: ${el.textContent}`);
}

// ── Subscription plan selector ───────────────────

function selectPlan(el) {
  document.querySelectorAll('.pc').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');

  const isMonthly = el.querySelector('.pc-name').textContent.includes('Monthly');
  const priceVal = document.getElementById('sh-price-val');
  const pricePer = document.getElementById('sh-price-per');
  const btnLabel = document.getElementById('sub-btn-label');

  if (isMonthly) {
    if (priceVal) priceVal.textContent = '₱49';
    if (pricePer) pricePer.textContent = '/ month';
    if (btnLabel) btnLabel.textContent = 'Subscribe — ₱49 / month';
  } else {
    if (priceVal) priceVal.textContent = '₱149';
    if (pricePer) pricePer.textContent = '/ semester';
    if (btnLabel) btnLabel.textContent = 'Subscribe — ₱149 / semester';
  }
}

function subscribePlan() {
  showToast('Subscription activated! ✓');
  setTimeout(() => tabTo('s-subscription', 's-profile'), 800);
}

function restorePurchase() {
  showToast('No previous purchase found.');
}

// ── Toast ────────────────────────────────────────

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Init ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initDashDay();

  // Make sure splash is the first active screen
  const splash = document.getElementById('s-splash');
  if (splash) {
    splash.style.transform = 'none';
    splash.style.opacity = '1';
    splash.style.pointerEvents = 'all';
  }

  // Search input live filter (basic)
  document.querySelectorAll('.srch-bar input').forEach(input => {
    input.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      const list = this.closest('.screen').querySelectorAll('.ri');
      list.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });
  });
});