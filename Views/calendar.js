let nav = 0;
let clicked = null;

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const eventStartInput = document.getElementById('eventStartInput');
const eventEndInput = document.getElementById('eventEndInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//when click on a date
function openModal(date) {
    clicked = date;
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date;

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-uk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            if (i - paddingDays == day && nav == 0) {
                daySquare.id = 'currentDay';
            }
            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }

    //console.log(paddingDays);
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventStartInput.value = '';
    eventEndInput.value = '';
    clicked = null;
    load();
}


function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });
    document.getElementById('cancelButton').addEventListener('click', closeModal);
}
initButtons();
load(); 


/*
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

//when user clicks on an event
function openEvent(date) {
    event.stopPropagation();
    clicked = date;
    const eventForDate = events.find(e => e.date == clicked);
    if (eventForDate) {
        document.getElementById('eventText').innerText = `${eventForDate.title} ${eventForDate.startTime} ${eventForDate.endTime}`;
        deleteEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
} 

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');
        events.push({
            date: clicked,
            title: eventTitleInput.value,
            startTime: eventStartInput.value,
            endTime: eventEndInput.value
        });
        localStorage.setItem('events', JSON.stringify(events));
        console.log(events)
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date != clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

    document.getElementById('saveButton').addEventListener('click', saveEvent);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);

if (eventForDate) {
                const eventDiv = document.createElement('div');
                const eventTitle = document.createElement('div');
                const eventStart = document.createElement('div');
                const eventEnd = document.createElement('div');
                const eventDash = document.createElement('div');

                eventDiv.classList.add('event');
                eventTitle.classList.add('eventTitle');
                eventStart.classList.add('eventStart');
                eventEnd.classList.add('eventEnd');
                eventDash.classList.add('eventDash')

                eventTitle.innerText = `${eventForDate.title}`;
                eventStart.innerText = `${eventForDate.startTime}`;
                eventEnd.innerText = `${eventForDate.endTime}`;
                eventDash.innerText = " - "

                daySquare.appendChild(eventDiv);
                eventDiv.appendChild(eventTitle);
                eventDiv.appendChild(eventStart);
                eventDiv.appendChild(eventDash);
                eventDiv.appendChild(eventEnd);

                eventDiv.addEventListener('click', () => openEvent(dayString));
            }
*/