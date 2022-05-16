let nav = 0;
let clicked = null;

const calendar = document.getElementById('calendar');
const createCalendarMilestone = document.getElementById('createCalendarMilestone');
const deleteMilestone = document.getElementById('deleteMilestone');
const backDrop = document.getElementById('modalBackDrop');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const events_url = './student-events.json';
const deadlines_url = './student-deadlines.json';
// Defining async function
//Call load with data as a parameter
//Data then went through in load function
//getapi called each time load would be 

async function getapi(url, url1) {

    // Storing response
    const response = await fetch(url);
    const response1 = await fetch(url1);
    // Storing data in form of JSON
    var eventsJson = await response.json();
    var deadlinesJson = await response1.json();
    load(eventsJson, deadlinesJson);
}

//when click on a date
function openModal() {
    createCalendarMilestone.style.display = 'block';
    backDrop.style.display = 'block';
}

function load(eventsJson, deadlinesJson) {
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

    document.getElementById('monthYear').innerText = `${dt.toLocaleDateString('en-uk', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    calendarDay = 1;

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.id = 'day';

        if (i > paddingDays) {

            if (i > paddingDays && i < daysInMonth + paddingDays + 1) {
                if (i - paddingDays < 10) {
                    var dd = '0' + (i - paddingDays);
                } else {
                    dd = i - paddingDays;
                }
                if ((month + 1) < 10) {
                    var mm = '0' + (month + 1);
                } else {
                    mm = month + 1;
                }
                //year month day
                var dayString = year + '-' + mm + '-' + dd;
                daySquare.classList.add(dayString);
                daySquare.innerText = calendarDay;
                calendarDay++;

                //Creates events for dates that have an event
                for (var j = 0; j < eventsJson.length; j++) {
                    try {
                        if (dayString === eventsJson[j].eventDate) {
                            createEvent(daySquare, eventsJson[j]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                //puts deadlines on the calendar
                for (var k = 0; k < deadlinesJson.length; k++) {
                    try {
                        if (dayString === deadlinesJson[k].end) {
                            createDeadline(daySquare, deadlinesJson[k]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (i - paddingDays == day && nav == 0) {
                    daySquare.id = 'today';
                }
            }

        } else {
            daySquare.classList.add('notDay');
        }
        calendar.appendChild(daySquare);
    }

}

function createEvent(eventDay, eventDetails) {
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

    eventTitle.innerText = `${eventDetails.Title}`;
    eventStart.innerText = `${eventDetails.Start}`;
    eventEnd.innerText = `${eventDetails.End}`;
    eventDash.innerText = " - "

    eventDay.appendChild(eventDiv);
    eventDiv.appendChild(eventTitle);
    eventDiv.appendChild(eventStart);
    eventDiv.appendChild(eventDash);
    eventDiv.appendChild(eventEnd);

    eventDiv.addEventListener('click', () => {
        openDeleteMilestone(eventDetails);
    });
}

function createDeadline(deadlineDay, deadlineDetails) {
    const deadlineDiv = document.createElement('div');
    const deadlineTitle = document.createElement('div');

    deadlineDiv.classList.add('deadline');
    deadlineTitle.classList.add('deadlineTitle');

    deadlineTitle.innerText = `${deadlineDetails.name}`;

    deadlineDay.appendChild(deadlineDiv);
    deadlineDiv.appendChild(deadlineTitle);
}


function closeModal() {
    createCalendarMilestone.style.display = 'none';
    deleteMilestone.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventStartInput.value = '';
    eventEndInput.value = '';
    getapi(events_url, deadlines_url);
}

//need to make it so they can only delete event if eventDeleteID == eventID otherwise it will cancel any event of the id they put in
function openDeleteMilestone(eventDetails) {
    var eventDeleteID = document.getElementById('eventID');
    eventDeleteID.innerText = eventDetails.eventID;

    var eventTitle = document.getElementById('removeEventTitle');
    eventTitle.innerText = `${eventDetails.Title}`;
    deleteMilestone.style.display = 'block';

}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        getapi(events_url, deadlines_url);
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        getapi(events_url, deadlines_url);
    });
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('newEvent').addEventListener('click', openModal);
}
initButtons();
getapi(events_url, deadlines_url);