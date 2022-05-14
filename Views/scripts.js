var deads_url = './student-deadlines.json';

async function getapi(url1) {
  // Storing response
  const response1 = await fetch(url1);
  // Storing data in form of JSON
  var deadlinesJson = await response1.json();
  //console.log(data);
  uploadRedirect(deadlinesJson);
}

function uploadRedirect(deadlinesJson){
  if(deadlinesJson.length > 1){
    document.getElementById('modulesButton').href = '/uploadPage';
  }else{
    document.getElementById('modulesButton').href = 'fileupload';
  }
}

getapi(deads_url)


mybutton = document.getElementById("scrollBtn");
window.onscroll = function() {scroll()};

window.onload = function hideElements() {
    document.getElementById("module-1").style.display = "none";
    document.getElementById("module-2").style.display = "none";
    document.getElementById("module-3").style.display = "none";
}
function showModule1() {
    document.getElementById("module-1").style.display = "block";
    document.getElementById("module-2").style.display = "none";
    document.getElementById("module-3").style.display = "none";
    document.getElementById("module-1").scrollIntoView({behavior: "smooth"});
}
function showModule2() {
  document.getElementById("module-2").style.display = "block";
  document.getElementById("module-1").style.display = "none";
  document.getElementById("module-3").style.display = "none";
  document.getElementById("module-2").scrollIntoView({behavior: "smooth"});
}
function showModule3() {
  document.getElementById("module-3").style.display = "block";
  document.getElementById("module-2").style.display = "none";
  document.getElementById("module-1").style.display = "none";
  document.getElementById("module-3").scrollIntoView({behavior: "smooth"});
}


function scroll() {
  if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // safari
  document.documentElement.scrollTop = 0; // chrome, firefox, ie and opera
}

function colourFunction() {
  var element = document.body;
  element.classList.toggle("darkMode");
  var footer = document.querySelector('footer')
  footer.classList.toggle("darkFooter")
}

