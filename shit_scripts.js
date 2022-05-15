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

//wip
window.addEventListener("load", createChart);
window.addEventListener("resize", createChart);

function createChart(e) {
  // 1
  const days = document.querySelectorAll(".chart-values li");
  const tasks = document.querySelectorAll(".chart-bars li");
  // 2
  const daysArray = [...days];
  // 3
  tasks.forEach(el => {
    // 1
    const duration = el.dataset.duration.split("-");
    // 2
    const startDay = duration[0];
    const endDay = duration[1];
    let left = 0,
      width = 0;
 
    // 3
    if (startDay.endsWith("½")) {
      const filteredArray = daysArray.filter(day => day.textContent == startDay.slice(0, -1));
      left = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2;
    } else {
      const filteredArray = daysArray.filter(day => day.textContent == startDay);
      left = filteredArray[0].offsetLeft;
    }
     
    // 4
    if (endDay.endsWith("½")) {
      const filteredArray = daysArray.filter(day => day.textContent == endDay.slice(0, -1));
      width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth / 2 - left;
    } else {
      const filteredArray = daysArray.filter(day => day.textContent == endDay);
      width = filteredArray[0].offsetLeft + filteredArray[0].offsetWidth - left;
    }
    tasks.forEach(el => {

      
      // 1
      el.style.left = `${left}px`;
      el.style.width = `${width}px`;
      // 4
      if (e.type == "load") {
        // 2
        el.style.backgroundColor = el.dataset.color;
        // 3
        el.style.opacity = 1;
      }
     });
  });
}