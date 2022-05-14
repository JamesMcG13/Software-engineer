const newMilestones = document.getElementById('milestones');
const milestonesBackDrop = document.getElementById('milestonesBackDrop');
const redirect = document.getElementById('redirect');
const deadlines_url = './student-deadlines.json';
document.getElementById('newMilestone').addEventListener('click',openMilestones);
document.getElementById('closeButton').addEventListener('click', closeMilestones);
document.getElementById('redirectCloseButton').addEventListener('click',closeMilestones);

async function getapi(url1) {
    // Storing response
    const response1 = await fetch(url1);
    // Storing data in form of JSON
    var deadlinesJson = await response1.json();
    //console.log(data);
    openRedirect(deadlinesJson);
}

function closeMilestones() {
    newMilestones.style.display = 'none';
    redirect.style.display = 'none';
}

function openMilestones(){
    newMilestones.style.display = 'block';
}

function openRedirect(deadlinesJson){
    if(deadlinesJson.length > 1){
        redirect.style.display = 'none';
    }else{
        redirect.style.display = 'block';
    }
}

getapi(deadlines_url);