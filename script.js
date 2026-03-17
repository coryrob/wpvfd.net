const navToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calendarGrid = document.getElementById('calendar-grid');
const calendarTitle = document.getElementById('calendar-title');
const upcomingEventsEl = document.getElementById('upcoming-events');
const galleryGrid = document.getElementById('gallery-grid');

const state = {
  currentDate: new Date(),
  events: [],
  gallery: []
};

function normalizeDateInput(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatLongDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function getEventsForDate(date) {
  const key = date.toISOString().split('T')[0];
  return state.events.filter((event) => event.date === key);
}

function renderCalendar() {
  const viewDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  calendarTitle.textContent = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  calendarGrid.innerHTML = '';

  dayNames.forEach((day) => {
    const dayCell = document.createElement('div');
    dayCell.className = 'day-name';
    dayCell.textContent = day;
    calendarGrid.appendChild(dayCell);
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = firstDayIndex - 1; i >= 0; i -= 1) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    calendarGrid.appendChild(buildDayCell(date, true));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    calendarGrid.appendChild(buildDayCell(date, false));
  }

  const totalCells = calendarGrid.childElementCount - 7;
  const trailingCellsNeeded = (7 - (totalCells % 7)) % 7;
  for (let day = 1; day <= trailingCellsNeeded; day += 1) {
    const date = new Date(year, month + 1, day);
    calendarGrid.appendChild(buildDayCell(date, true));
  }
}

function buildDayCell(date, muted) {
  const wrapper = document.createElement('div');
  wrapper.className = `day-cell ${muted ? 'muted-day' : ''}`.trim();

  const num = document.createElement('div');
  num.className = 'day-number';
  num.textContent = date.getDate();
  wrapper.appendChild(num);

  const dayEvents = getEventsForDate(date);
  dayEvents.slice(0, 2).forEach((event) => {
    const pill = document.createElement('div');
    pill.className = 'event-pill';
    pill.textContent = event.title;
    wrapper.appendChild(pill);
  });

  return wrapper;
}

function renderUpcomingEvents() {
  const now = new Date();
  const upcoming = state.events
    .map((event) => ({ ...event, dateObj: normalizeDateInput(event.date) }))
    .filter((event) => event.dateObj >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 8);

  upcomingEventsEl.innerHTML = '';

  if (!upcoming.length) {
    upcomingEventsEl.textContent = 'No upcoming events posted yet. Add entries in data/events.json.';
    return;
  }

  upcoming.forEach((event) => {
    const item = document.createElement('article');
    item.className = 'upcoming-item';
    item.innerHTML = `
      <strong>${event.title}</strong><br />
      <span>${formatLongDate(event.dateObj)}${event.time ? ` • ${event.time}` : ''}</span>
      <div>${event.description || ''}</div>
    `;
    upcomingEventsEl.appendChild(item);
  });
}

function renderGallery() {
  galleryGrid.innerHTML = '';

  state.gallery.forEach((entry) => {
    const figure = document.createElement('figure');
    figure.className = 'figure-card';
    figure.innerHTML = `
      <img src="${entry.image}" alt="${entry.alt || entry.caption || 'Community fire department photo'}" loading="lazy" />
      <figcaption><strong>${entry.title || 'Community Highlight'}</strong><br />${entry.caption || ''}</figcaption>
    `;
    galleryGrid.appendChild(figure);
  });
}

function bindCalendarControls() {
  document.getElementById('prev-month').addEventListener('click', () => {
    state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    state.currentDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth() + 1, 1);
    renderCalendar();
  });
}

async function loadData() {
  const [eventsRes, galleryRes] = await Promise.all([
    fetch('data/events.json'),
    fetch('data/gallery.json')
  ]);

  state.events = await eventsRes.json();
  state.gallery = await galleryRes.json();

  renderCalendar();
  renderUpcomingEvents();
  renderGallery();
}

bindCalendarControls();
loadData().catch((error) => {
  console.error('Failed to load dynamic content:', error);
  upcomingEventsEl.textContent = 'Unable to load event data. Check data/events.json.';
  galleryGrid.textContent = 'Unable to load gallery data. Check data/gallery.json.';
});
