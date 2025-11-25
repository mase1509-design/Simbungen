const STORAGE_KEY = 'simbungen-tracker';
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let selectedDate = null;

// Funktion zum Erstellen der Monatsübersicht
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const todayStr = now.toISOString().slice(0,10);

    for (let day=1; day<=daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        // Farbe für erledigte/nicht erledigte Tage
        if (data[dateStr]) {
            if (data[dateStr].every(done => done)) {
                dayDiv.classList.add('complete');
            } else {
                dayDiv.classList.add('incomplete');
            }
        }

        // Hervorheben des ausgewählten Tages
        if (dateStr === selectedDate) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', () => {
            selectedDate = dateStr;
            renderExercises(dateStr);
            renderCalendar(); // neu rendern, damit Auswahl hervorgehoben wird
        });

        calendar.appendChild(dayDiv);
    }

    // Automatisch heute auswählen, falls noch kein Tag ausgewählt
    if (!selectedDate) {
        selectedDate = todayStr;
        renderExercises(todayStr);
        renderCalendar(); // nochmal rendern, um Hervorhebung zu setzen
    }
}

// Funktion zum Anzeigen der Übungen eines Tages
function renderExercises(dateStr) {
    const exercisesContainer = document.getElementById('exercises');
    exercisesContainer.innerHTML = '';

    document.getElementById('selected-date-title').textContent = `Übungen für ${dateStr}`;

    if (!data[dateStr]) {
        data[dateStr] = [false, false, false]; // drei Übungen initialisieren
    }

    for (let i = 0; i < 3; i++) {
        const exDiv = document.createElement('div');
        exDiv.classList.add('exercise');
        if (data[dateStr][i]) exDiv.classList.add('done');

        const span = document.createElement('span');
        span.textContent = `Übung ${i+1}`;

        const btn = document.createElement('button');
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

// Initial render
renderCalendar();
