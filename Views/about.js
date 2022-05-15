//confirmation after submitting feedback
const feedback = document.getElementById('feedback-confirmation');
const closeButton = document.getElementById('closeFeedback');
const openButton = document.getElementById('feedbackButton');

//feedback.style.display = 'none';

function open_feedback(){
    feedback.style.display = 'block';
}

function close_feedback(){
    feedback.style.display = 'none';
}

openButton.addEventListener('click', open_feedback());
closeButton.addEventListener('click', close_feedback());