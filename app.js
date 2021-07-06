document.getElementById("task-form").addEventListener("submit", submitEvent);
document.querySelector(".submit-btn").addEventListener("click", submitEvent);
const taskList = document.querySelector(".task-list"),
  pageContainer = document.querySelector(".page-container"),
  taskContainer = document.querySelector(".tasks-container"),
  taskInp = document.getElementById("new-task"),
  tasksLeft = document.querySelector(".incomplete-counter");


document.addEventListener("DOMContentLoaded", getTasks);



let notif;
function uncheckedCounter() {
  let checkedCounter = 0;
  const taskListArr = Array.from(taskList.children);
  taskListArr.forEach(each => {
    if (each.classList.contains("checked")) {
      checkedCounter += 1;
    }
  })
  const tasksLeft = taskList.childElementCount - checkedCounter;
  let notif;
  if (tasksLeft === 0) {
    if (taskListArr.length === 0) {
      notif = ""
    } else {
      notif = "All tasks Completed"
    }
  } else if (checkedCounter === 0) {
    notif = "No task Completed"
  } else if (tasksLeft === 1) {
     notif = "1 task left"
  } else {
    notif = `${tasksLeft} tasks left`
  }
  
  return notif
}



function submitEvent(e) {
  let newTask = taskInp.value;
  if (newTask === "") {
    const alert = document.querySelector(".alert");
      let alerted = true;
      if (alerted === true) {
        alert.style.transform = "translateY(0px)";
        alerted = false
      }
      setTimeout(function () {
        alert.style.transform = "translateY(-140px)";
        alerted = true
      },3000)
  }
  else {
    const listItem = document.createElement("li"),
      divOne = document.createElement("div"),
      divChecker = document.createElement("div"),
      divOneImg = document.createElement("img"),
      divTask = document.createElement("div"),
      divTasksTxt = document.createElement("div"),
      divSlash = document.createElement("div"),
      divTwo = document.createElement("div"),
      divTwoImg = document.createElement("img");

    divChecker.classList = "task-checker checker";
    divOneImg.setAttribute("src", "./images/icon-check.svg");
    divOneImg.className = "checkmark"
    divTask.className = "task";
    divTasksTxt.className = "task-txt";
    divTasksTxt.innerText = newTask;
    divSlash.className = "slash";
    divTask.appendChild(divTasksTxt);
    divTask.appendChild(divSlash);
    divChecker.appendChild(divOneImg);
    divOne.appendChild(divChecker)
    divOne.appendChild(divTask);
    divTwo.className = "remove-task";
    divTwoImg.setAttribute("src", "./images/icon-cross.svg");
    divTwoImg.className = "delete"
    divTwo.appendChild(divTwoImg);
    listItem.className = "list-item";
    listItem.appendChild(divOne);
    listItem.appendChild(divTwo);
    taskList.appendChild(listItem);

    addToLocalStorage(newTask)
    taskInp.value = ""
  }

  notif = uncheckedCounter();
  tasksLeft.innerText = `${notif}`;

  if (pageContainer.style.background === "rgb(236, 233, 233)") {
    document.querySelectorAll(".checker").forEach(each => {
      each.style.borderColor = "hsla(237, 14%, 16%, .4)"
    })
  }

  dynamicHeight();
  getTaskLenght()

  e.preventDefault()
}
      

document.body.addEventListener("click", function (e) {
  let checked = false;

  if (e.target.classList.contains("task-checker")) {
    if (checked === false) {
      e.target.firstElementChild.style.display = "block";
      e.target.style.backgroundImage = "linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%) )"
      const divSlash = e.target.nextElementSibling.firstElementChild.nextElementSibling;
      const task = e.target.nextElementSibling.firstElementChild;
      task.style.opacity = ".3"
      divSlash.style.width = "100%";
      checked = true;
      e.target.parentElement.parentElement.classList.add("checked");
      notif = uncheckedCounter();
      tasksLeft.innerText = `${notif}`;

      //Local Storage
    saveCheckedToLocalStorage()

      
    } else if(checked = true){
      e.target.firstElementChild.style.display = "none";
      e.target.style.backgroundImage = "none";
      const divSlash = e.target.nextElementSibling.firstElementChild.nextElementSibling;
      const task = e.target.nextElementSibling.firstElementChild;
      task.style.opacity = "1"
      divSlash.style.width = "0%";
      checked = false;
      e.target.parentElement.parentElement.classList.remove("checked");
      notif = uncheckedCounter();
      tasksLeft.innerText = `${notif}`;
      saveCheckedToLocalStorage()
    }
  }

  if (e.target.classList.contains("checkmark")) {
    e.target.style.display = "none";
    e.target.parentElement.style.backgroundImage = "none";
    const divSlash = e.target.parentElement.nextElementSibling.firstElementChild.nextElementSibling;
    const task = e.target.parentElement.nextElementSibling.firstElementChild;
    task.style.opacity = "1";
    divSlash.style.width = "0%";
    checked = false;
    e.target.parentElement.parentElement.parentElement.classList.remove("checked");
    notif = uncheckedCounter();
    tasksLeft.innerText = `${notif}`;
    saveCheckedToLocalStorage()
  }

  if (e.target.classList.contains("delete")) {
    removeFromLocalStorage(e.target)
    e.target.parentElement.parentElement.remove();
    const taskListArr = Array.from(taskList.children);
    if (taskListArr.length === 0) {
      tasksLeft.innerText = "";
    };
    notif = uncheckedCounter();
    tasksLeft.innerText = `${notif}`;
    saveCheckedToLocalStorage();
    dynamicHeight()
  }

  if (e.target.classList.contains("toggle-all")) {
    const taskListArr = Array.from(taskList.children);
    taskListArr.forEach(each => {
      each.style.display = "flex"
    })
    e.target.nextElementSibling.style.opacity = .5;
    e.target.nextElementSibling.classList.remove("active");
    e.target.nextElementSibling.nextElementSibling.style.opacity = .5;
    e.target.nextElementSibling.nextElementSibling.classList.remove("active");
    dynamicHeight()
  }

  if (e.target.classList.contains("toggle-active")) {
    const taskListArr = Array.from(taskList.children);
    taskListArr.forEach(each => {
      if (each.classList.contains("checked") !== true) {
        each.style.display = "flex"
      } else {
        each.style.display = "none"
     }
    })
    e.target.style.opacity = 1;
    e.target.classList.add("active");
    e.target.nextElementSibling.classList.remove("active");
    if (e.target.nextElementSibling.classList.contains("active") != true) {
      e.target.nextElementSibling.style.opacity = .5;

      dynamicHeight()
    }
  }
  if (e.target.classList.contains("toggle-completed")) {
    const taskListArr = Array.from(taskList.children);
    taskListArr.forEach(each => {
      if (each.classList.contains("checked") === true) {
        each.style.display = "flex"
      } else {
        each.style.display = "none"
     }
    })
    e.target.style.opacity = 1;
    e.target.classList.add("active");
    e.target.previousElementSibling.classList.remove("active");
    if (e.target.previousElementSibling.classList.contains("active") != true) {
      e.target.previousElementSibling.style.opacity = .5;

      dynamicHeight()
    }
  }

  if (e.target.id === "clr-tasks") {
    const taskListArr = Array.from(taskList.children);
    taskListArr.forEach(each => {
      if (each.classList.contains("checked")) {
        taskList.removeChild(each)
      }
    })
    if (taskListArr.length === 0) {
      tasksLeft.innerText = ""
    }
    removeCompletedFromStorage();
    saveCheckedToLocalStorage();
    dynamicHeight()
   }

  if (e.target.classList.contains("light-mode")) {
    lightModeFunc(e.target)
    let theme = "lightmode";
    localStorage.setItem("theme", JSON.stringify(theme))
  } else if (e.target.classList.contains("dark-mode")) {
    darkModeFunc(e.target)
    let theme = "darkmode";
    localStorage.setItem("theme", JSON.stringify(theme))
  }

})



document.querySelector(".toggle-active").addEventListener("mouseover", function (e) {
    e.target.style.opacity = 1

})
document.querySelector(".toggle-active").addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("active")) {
  e.target.style.opacity = 1
  } else {
    e.target.style.opacity = .5
}
})

document.querySelector(".toggle-completed").addEventListener("mouseover", function (e) {
  e.target.style.opacity = 1

})
document.querySelector(".toggle-completed").addEventListener("mouseout", function (e) {
if (e.target.classList.contains("active")) {
e.target.style.opacity = 1
} else {
  e.target.style.opacity = .5
}
})

function saveCheckedToLocalStorage() {
  const taskListArr = Array.from(taskList.children);
  const taskIndexArr = [];
  taskListArr.forEach((each, index) => {
     if (each.classList.contains("checked")) {
        taskIndexArr.push(index)
    }
  })
  
  localStorage.setItem("checkedTasks", JSON.stringify(taskIndexArr))
}

function addToLocalStorage(newTask) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
     tasks = [];
  } else {
     tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  tasks.push(newTask)
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function removeFromLocalStorage(target) {
  const taskListArr = Array.from(taskList.children);
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks !== null) {
    taskListArr.forEach((each, taskIndex) => {
      if (target.parentElement.parentElement === each) {
        tasks.forEach((each, jsonIndex) => {
          if (taskIndex === jsonIndex) {
            tasks.splice(taskIndex, 1)
          }
        })
      }
    })
    localStorage.setItem("tasks", JSON.stringify(tasks))
  } 
  
}

function removeCompletedFromStorage() {
  const checkedIndex = JSON.parse(localStorage.getItem("checkedTasks"));
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (checkedIndex !== null && tasks !== null) {
    checkedIndex.forEach((indexTwo, index) => {
      tasks.splice((indexTwo - index), 1)
  
  })
  localStorage.setItem("tasks",JSON.stringify(tasks))
   }
}


function getTasks() {
  const checked = JSON.parse(localStorage.getItem("checkedTasks"))
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach((each, index) => {
      const listItem = document.createElement("li"),
      divOne = document.createElement("div"),
      divChecker = document.createElement("div"),
      divOneImg = document.createElement("img"),
      divTask = document.createElement("div"),
      divTasksTxt = document.createElement("div"),
      divSlash = document.createElement("div"),
      divTwo = document.createElement("div"),
      divTwoImg = document.createElement("img");

    divChecker.classList = "task-checker checker";
    divOneImg.setAttribute("src", "./images/icon-check.svg");
    divOneImg.className = "checkmark"
    divTask.className = "task";
    divTasksTxt.className = "task-txt";
    divTasksTxt.innerText = each;
    divSlash.className = "slash";
    divTask.appendChild(divTasksTxt);
    divTask.appendChild(divSlash);
    divChecker.appendChild(divOneImg);
    divOne.appendChild(divChecker)
    divOne.appendChild(divTask);
    divTwo.className = "remove-task";
    divTwoImg.setAttribute("src", "./images/icon-cross.svg");
    divTwoImg.className = "delete"
      divTwo.appendChild(divTwoImg);
      listItem.className = "list-item";
      if (checked !== null) {
        checked.forEach(checked => {
          if (index === checked) {
           listItem.classList.add("checked")
          }
        })
      }
    listItem.appendChild(divOne);
    listItem.appendChild(divTwo);
    taskList.appendChild(listItem);
    })
  }
  const taskListArr = Array.from(taskList.children);
taskListArr.forEach(each => {
  if (each.classList.contains("checked")) {
    const eachFirstChildDivOne = each.firstElementChild.firstElementChild;
    const eachFirstChildDivTwo = each.firstElementChild.firstElementChild.nextElementSibling
    eachFirstChildDivOne.firstElementChild.style.display = "block";
    eachFirstChildDivOne.style.backgroundImage = "linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%) )";
    eachFirstChildDivTwo.firstElementChild.style.opacity = .3;
    eachFirstChildDivTwo.lastElementChild.style.width = "100%"
  }
})
  const setTheme = JSON.parse(localStorage.getItem("theme"));
  const lightMode = document.querySelector(".light-mode");
  const darkMode =document.querySelector(".dark-mode");
  if (setTheme === "lightmode") {
    lightModeFunc(lightMode)
  } else {
    darkModeFunc(darkMode)
  }
  
  const setFont = JSON.parse(localStorage.getItem("font"));
  if (setFont !== null) {
    pageContainer.style.fontFamily = setFont
  }
notif = uncheckedCounter();
  tasksLeft.innerText = `${notif}`;
  getTaskLenght()
  dynamicHeight()
}
//431
function dynamicHeight() {
  if (taskContainer.offsetHeight >= 231) {
    windowHeight = window.innerHeight;
    taskContainerHeight = taskContainer.offsetHeight;
    pageContainer.style.height = `${((windowHeight) + taskContainerHeight )}px`
  } else {
    pageContainer.style.height = "105vh"
 }
}

const fontMenu = document.querySelector(".font-change");
let clicked = false
document.querySelector(".fas").addEventListener("click", function (e) {
  if (clicked === false) {
    e.target.style.transform = "rotate(180deg)";
    fontMenu.style.height = "20vh"
    fontMenu.style.overflowY = "scroll"
    clicked = true
  } else {
    e.target.style.transform = "rotate(0deg)";
    fontMenu.style.height = "50px"
    fontMenu.style.overflowY = "hidden"
    clicked = false
  }

  

})

const fontChange = document.querySelector(".font-change");
const fonts = document.querySelector(".fonts");
const fontsArr = Array.from(fonts.children);
fontsArr.forEach(each => {
  each.addEventListener("click", function (e) {
    pageContainer.style.fontFamily = each.style.fontFamily;
    fontsArr.forEach(each => {
      if (fontChange.classList.contains("font-light")) {
        if (each.style.fontFamily === pageContainer.style.fontFamily) {
          each.style.background = "rgba(51, 51, 51, 0.178)"
        } else {
          each.style.background = "#fff"
        }
      } else {
        if (each.style.fontFamily === pageContainer.style.fontFamily) {
          each.style.background = "hsla(234, 40%, 27%, 0.24)"
        } else {
          each.style.background = "hsl(234, 23%, 18%)"
        }
     }
    })
    localStorage.setItem("font", JSON.stringify(pageContainer.style.fontFamily) )
  })
 
})


function lightModeFunc(target) {
  target.style.display = "none";
  target.nextElementSibling.style.display = "block";
  const ligthBg = document.querySelector(".bg-image"),
    taskInpBg = document.querySelector(".task-input"),
    toggles = document.querySelector(".toggles"),
    fontChange = document.querySelector(".font-change"),
    fonts = document.querySelector(".fonts"),
    fontsArr = Array.from(fonts.children),
    body = document.querySelector("body"),
    taskContainer = document.querySelector(".tasks-container");

  ligthBg.firstElementChild.setAttribute("src", "./images/bg-desktop-light.jpg");
  pageContainer.style.background = "rgb(236, 233, 233)";
  taskInpBg.style.background = "#fff";
  taskInp.style.color = "hsl(237, 14%, 16%)";
  taskContainer.style.background = "#fff";
  toggles.style.background = "#fff";
  taskContainer.style.color = "#000";
  fontChange.style.color = "#333";
  fontsArr.forEach(each => {
    if (each.style.fontFamily === pageContainer.style.fontFamily) {
      each.style.background = "rgba(51, 51, 51, 0.178)"
    } else {
      each.style.background = "#fff"
    }
     })

    fontChange.style.background = "#fff";
    if (fontChange.classList.contains("font-dark")) {
      fontChange.classList.remove("font-dark");
      fontChange.classList.add("font-light")
    }


    if (body.classList.contains("body-dark")) {
      body.classList.remove("body-dark");
      body.classList.add("body-light")
    }
    if (pageContainer.style.background === "rgb(236, 233, 233)") {
      document.querySelectorAll(".checker").forEach(each => {
        each.style.borderColor = "hsla(237, 14%, 16%, .4)"
      })
    }
  }
  



function darkModeFunc(target) {
  target.style.display = "none";
  target.previousElementSibling.style.display = "block";
  const darkBg = document.querySelector(".bg-image"),
    taskInpBg = document.querySelector(".task-input"),
    toggles = document.querySelector(".toggles"),
    fontChange = document.querySelector(".font-change"),
    fonts = document.querySelector(".fonts"),
    fontsArr = Array.from(fonts.children),
    body = document.querySelector("body"),
    taskContainer = document.querySelector(".tasks-container");

  darkBg.firstElementChild.setAttribute("src", "./images/bg-desktop-dark.jpg");
  pageContainer.style.background = "hsl(237, 14%, 16%)";
  taskInpBg.style.background = "hsl(234, 23%, 18%)";
  taskInp.style.color = "#fff";
  taskContainer.style.background = "hsl(234, 23%, 18%)";
  fontChange.style.background = "  hsl(234, 23%, 18%)";
  fontChange.style.color = "#fff";
  if (fontChange.classList.contains("font-light")) {
    fontChange.classList.remove("font-light");
    fontChange.classList.add("font-dark")
  }
  fontsArr.forEach(each => {
    if (each.style.fontFamily === pageContainer.style.fontFamily) {
      each.style.background = "hsla(234, 40%, 27%, 0.24)"
    } else {
      each.style.background = "hsl(234, 23%, 18%)"
    }
     })
  toggles.style.background = "hsl(234, 23%, 18%)"
  taskContainer.style.color = "#fff";
  if (body.classList.contains("body-light")) {
    body.classList.remove("body-light");
    body.classList.add("body-dark")
  }
  if (pageContainer.style.background === "rgb(35, 36, 47)") {
    document.querySelectorAll(".checker").forEach(each => {
      each.style.borderColor = "rgba(255, 255, 255, 0.514)"
    })
  }
}

function getTaskLenght() {
 const tasks = document.querySelectorAll(".task-txt").forEach(each => {
 let wordArr =  each.textContent.split(" ");
   if (wordArr.length >= 13) {
     each.parentElement.parentElement.style.display = "block";
     each.style.marginTop = ".6rem"
     each.nextElementSibling.style.bottom = "auto";
   }
   if (wordArr.length >= 6 && wordArr.length < 13) {
    each.parentElement.parentElement.style.display = "block";
    each.style.marginTop = ".6rem"
    }
  })
}


















