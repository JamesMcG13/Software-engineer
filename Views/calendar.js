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

//read json file into javascript file - i assume data is now the json? dont actually know
fetch('./student-events.json')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

//when click on a date
function openModal() {
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
    console.log(paddingDays)
    const monthDisplay = document.getElementById('monthDisplay')
    monthDisplay.innerText = `${dt.toLocaleDateString('en-uk', { month: 'long' })} ${year}`;
    monthDisplay.classList = month;


    var calendarChildren = calendar.children;

    var calendarDay = 1;
    //go through all calendar day divs
    for (let i = 1; i <= calendarChildren.length; i++) {
        var daySquare = document.getElementById(i);
        daySquare.classList = '';
        daySquare.innerText = '';
        daySquare.style = '';

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;
        //if the day is in that month 
        if (i > paddingDays && i < daysInMonth + paddingDays + 1) {
            daySquare.classList.add(i - paddingDays + '-' + (month + 1) + '-' + year);
            daySquare.innerText = calendarDay;
            calendarDay++;

            if (i - paddingDays == day && nav == 0) {
                daySquare.classList.add('currentDay');
                daySquare.style.backgroundColor = '#e8faed';
            }

        } else {
            daySquare.classList.add('padding');
            daySquare.innerText = '';
        }
    }

    //console.log(paddingDays);
}

function closeModal() {
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventStartInput.value = '';
    eventEndInput.value = '';
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
    newEvent.addEventListener('click', () => openModal());
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