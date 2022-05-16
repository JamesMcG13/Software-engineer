const newMilestones = document.getElementById('milestones');
const milestonesBackDrop = document.getElementById('milestonesBackDrop');
const redirect = document.getElementById('redirect');
const deadlines_url = './student-deadlines.json';
const newActivity = document.getElementById('newActivity');
const ganttTask = document.getElementById('ganttTasks');
const ganttTasks_url = './student-ganttTasks.json';

document.getElementById('newMilestone').addEventListener('click', openMilestones);
document.getElementById('closeButton').addEventListener('click', closeMilestones);
document.getElementById('closeButtonActivity').addEventListener('click', closeMilestones);
document.getElementById('redirectCloseButton').addEventListener('click', closeMilestones);
document.getElementById('newActivityButton').addEventListener('click', openActivity);
document.getElementById('newGanttTask').addEventListener('click', openGantt);
document.getElementById('closeTaskButton').addEventListener('click', closeMilestones);


async function getapi(url1, url2) {
  // Storing response
  const response1 = await fetch(url1);
  const response2 = await fetch(url2);
  // Storing data in form of JSON
  var deadlinesJson = await response1.json();
  var ganttTasksJson = await response2.json();
  //console.log(data);
  openRedirect(deadlinesJson);
  addList(ganttTasksJson);
}

function closeMilestones() {
  newMilestones.style.display = 'none';
  redirect.style.display = 'none';
  newActivity.style.display = 'none';
  ganttTask.style.display = 'none';
}

function openMilestones() {
  newMilestones.style.display = 'block';
}

function openRedirect(deadlinesJson) {
  if (deadlinesJson.length > 1) {
    redirect.style.display = 'none';
  } else {
    redirect.style.display = 'block';
  }
}
function openActivity() {
  newActivity.style.display = 'block';
}

function openGantt() {
  ganttTask.style.display = 'block';
}
//adding gantt tasks:



//declaring inputs
const taskName = document.querySelector('#taskName');
const taskTimeStart = document.querySelector('#taskTimeStart');
const taskTimeEnd = document.querySelector('#taskTimeEnd');

//efor evry value in the array do this: 

function addList(ganttChartArray) {
  if (ganttChartArray.length > 0) {
    for (var x = 0; x < ganttChartArray.length; x++) {
      const ul = document.getElementById('chart-bars');
      const newli = document.createElement('li');
      newli.innerHTML = ganttChartArray[x].taskName;
      console.log
      newli.setAttribute("data-duration", String(ganttChartArray[x].taskTimeStart) + "-" + String(ganttChartArray[x].taskTimeEnd));
      newli.setAttribute("data-color", "#30997a");

      let left = 0, width = 0;

      const filteredArray = daysArray.filter(day => day.textContent == startDay);
      left = filteredArray[0].offsetLeft;


      // apply css
      el.style.left = `${left}px`;
      el.style.width = `${width}px`;
      if (e.type == "load") {
        el.style.backgroundColor = el.dataset.color;
        el.style.opacity = 1;
      }
      ul.appendChild(newli);
    }
  }
  createChart();
}


getapi(deadlines_url, ganttTasks_url);
//gantt chart
function createChart() {
  const days = document.querySelectorAll(".chart-values li");
  const tasks = document.querySelectorAll("#chart-bars li");
  const daysArray = [...days];
  console.log(tasks);

  tasks.forEach(el => {
    const duration = el.dataset.duration.split("-");
    const startDay = duration[0];
    const endDay = duration[1];
    let left = 0, width = 0;

    if (startDay.endsWith("½")) {
      const filteredArray = daysArray.filter(day => day.textContent == startDay.slice(0, -1));
      left = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2;
    } else {
      const filteredArray = daysArray.filter(day => day.textContent == startDay);
      left = filteredArray[0].offsetLeft;
    }

    if (endDay.endsWith("½")) {
      const filteredArray = daysArray.filter(day => day.textContent == endDay.slice(0, -1));
      width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2 - left;
    } else {
      const filteredArray = daysArray.filter(day => day.textContent == endDay);
      width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth - left;
    }

    // apply css
    el.style.left = `${left}px`;
    el.style.width = `${width}px`;
    if (e.type == "load") {
      el.style.backgroundColor = el.dataset.color;
      el.style.opacity = 1;
    }
  });
}
window.addEventListener("resize", createChart);