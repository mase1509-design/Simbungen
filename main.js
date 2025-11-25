const STORAGE_KEY = 'simbungen-tracker';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Monatslabel aktualisieren
function renderMonthLabel() {
    const monthNames = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    document.getElementById('month-label').textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Kalender rendern
function renderCalendar() {
    renderMonthLabel();
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayStr = new Date().toISOString().slice(0,10);

    for (let day=1; day<=daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        // Wochenende hervorheben
        const weekday = new Date(currentYear, currentMonth, day-1).getDay(); // 0=Sonntag
        if (weekday === 0 || weekday === 6) dayDiv.classList.add('weekend');

        // Statusfarben
        if (data[dateStr]) {
            if (data[dateStr].every(done => done)) dayDiv.classList.add('complete');
            else dayDiv.classList.add('incomplete');
        }

        // Ausgewählter Tag
        if (dateStr === selectedDate) dayDiv.classList.add('selected');

        dayDiv.addEventListener('click', () => {
            selectedDate = dateStr;
            renderExercises(dateStr);
            renderCalendar();
        });

        calendar.appendChild(dayDiv);
    }

    // Automatisch heute auswählen, falls noch kein Tag
    if (!selectedDate) {
        selectedDate = todayStr;
        renderExercises(todayStr);
        renderCalendar();
    }
}

// Übungen für gewählten Tag rendern
function renderExercises(dateStr) {
    const exercisesContainer = document.getElementById('exercises');
    exercisesContainer.innerHTML = '';

    document.getElementById('selected-date-title').textContent = `Übungen für ${dateStr}`;

    if (!data[dateStr]) data[dateStr] = [false,false,false];

    for (let i=0; i<3; i++) {
        const exDiv = document.createElement('div');
        exDiv.classList.add('exercise');
        if (data[dateStr][i]) exDiv.classList.add('done');

        const span = document.createElement('span');
        span.textContent = `Übung ${i+1}`;

        const btn = document.createElement('button');
        btn.classList.add('exercise-btn');
        btn.textContent = data[dateStr][i] ? 'Erledigt' : 'Erledigen';
        btn.addEventListener('click', () => {
            data[dateStr][i] = !data[dateStr][i];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            renderExercises(dateStr);
            renderCalendar();
        });

        exDiv.appendChild(span);
        exDiv.appendChild(btn);
        exercisesContainer.appendChild(exDiv);
    }
}

// Monatsnavigation
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Initial render
renderCalendar();
