mybutton = document.getElementById("scrollBtn");
window.onscroll = function() {scroll()};

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