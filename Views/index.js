const newMilestones = document.getElementById('milestones');
const milestonesBackDrop = document.getElementById('milestonesBackDrop');
document.getElementById('newMilestone').addEventListener('click',openMilestones);
document.getElementById('closeButton').addEventListener('click', closeMilestones);


function closeMilestones() {
    newMilestones.style.display = 'none';
}

function openMilestones(){
    console.log("open milestone is being clicked");
    newMilestones.style.display = 'block';
}