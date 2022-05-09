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

const api_url = './student-events.json';
// Defining async function
//Call load with data as a parameter
//Data then went through in load function
//getapi called each time load would be 

async function getapi(url) {

    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var eventsJson = await response.json();
    //console.log(data);
    load(eventsJson);
}

//when click on a date
function openModal() {
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function load(eventsJson) {
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

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-uk', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    calendarDay = 1;

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.id = 'day';

        if (i > paddingDays) {

            if (i > paddingDays && i < daysInMonth + paddingDays + 1) {
                if (i - paddingDays < 10){
                     var dd = '0' + (i - paddingDays);
                } else{
                    dd = i- paddingDays;
                }
                if ((month + 1) < 10){
                    var mm = '0' + (month + 1);
                } else{
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
                        console.log("Day string entering : " + dayString);
                        if (dayString === eventsJson[j].eventDate) {
                            console.log("Got through" + dayString + "  " + j);
                            createEvent(daySquare, eventsJson[j]);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

            if (i - paddingDays == day && nav == 0) {
                daySquare.id = 'currentDay';
            }
        }

        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }

    //console.log(paddingDays);
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

    eventDiv.addEventListener('click',() => {
        deleteEventModal.style.display = 'block';
    });
}


function closeModal() {
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    eventStartInput.value = '';
    eventEndInput.value = '';
    load();
}


function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        getapi(api_url);
    });
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        getapi(api_url);
    });
    newEvent.addEventListener('click', () => openModal());
    document.getElementById('cancelButton').addEventListener('click', closeModal);
}
initButtons();
getapi(api_url);