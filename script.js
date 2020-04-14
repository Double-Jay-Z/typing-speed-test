// DOM elements
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const theCounter = document.querySelector(".counter");
const laps = document.querySelector("#laps");
const modal = document.querySelector("#myModal");
const span = document.querySelector(".close");
const totalTime = document.querySelector(".total-time");
const wpmDiv = document.querySelector(".wpm");
const wpmSpan = document.querySelector("#wpm-span");

var noeUl = document.getElementById("noe");
var noeLi = noeUl.childNodes;

// Globals
const texts = [
  "Good Luck!",
  "The scale transform increases or decreases the size of an element.",
  "Using reset to undo commits.",
  "Github is the world leading software development platform.",
  "Codepen - Front End Developer playground and code editor in the Browser.",
  "Man City midfield points lottery continues as David Silva misses out.",
];

var timer = [0, 0, 0, 0];
var otherTimer = [0, 0, 0, 0];
var interval;
var otherInterval;
var timerRunning = false;
var otherTimerRunning = false;
var counter = 0;
var charactersCount = 0;

// Pick and show random sentence
function showText(texts) {
  // Generate random array index
  let randomIndex = Math.floor(Math.random() * texts.length);
  // Throwing out randomly selected sentence, that the end could be reached
  let randomSplice = texts.splice(randomIndex, 1);
  originText.innerHTML = randomSplice;
}

// Add leading zero to numbers 9 or below
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard minute/second/hundredths timer
function runTimer() {
  let currentTime =
    leadingZero(timer[0]) +
    ":" +
    leadingZero(timer[1]) +
    ":" +
    leadingZero(timer[2]);
  theTimer.innerHTML = currentTime;
  timer[3]++;

  // miliseconds divided by 100 to get seconds, and then seconds divided by 60 to get minutes
  timer[0] = Math.floor(timer[3] / 100 / 60);
  // miliseconds divided by 100 to get seconds, and then substracted minutes * 60, to get back seconds on 0 when they reach 60
  timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);
  // miliseconds - seconds * 100, to get back hundredths on 0 when they reach 100, and then substracted minutes * 6000, everytime minutes gets to 100
  timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);
}

// Run a counter, and show the score for every matching sentence
function runCounter() {
  ++counter;
  theCounter.innerHTML = "Score: " + counter;
}

// Create a "lap" for every matching sentence (like a lap on a stopwatch)
function lap() {
  laps.innerHTML +=
    "<li>" +
    leadingZero(timer[0]) +
    ":" +
    leadingZero(timer[1]) +
    ":" +
    leadingZero(timer[2]) +
    "</li>";
}

function runOtherTimer() {
  let otherCurrentTime =
    leadingZero(otherTimer[0]) +
    ":" +
    leadingZero(otherTimer[1]) +
    ":" +
    leadingZero(otherTimer[2]);
  totalTime.innerHTML = otherCurrentTime;
  otherTimer[3]++;

  otherTimer[0] = Math.floor(otherTimer[3] / 100 / 60);
  otherTimer[1] = Math.floor(otherTimer[3] / 100 - otherTimer[0] * 60);
  otherTimer[2] = Math.floor(otherTimer[3] - otherTimer[1] * 100 - otherTimer[0] * 6000);
}

// Count number of typed entries (noe)
function numberOfEntries() {
  // noe = Number Of Entries
  let noe = testArea.value.length;
  wpmDiv.innerHTML =
    "<p>" + "Number of characters including spaces: " + noe + "</p>";
}

// Putting noe into the <ul>
function noeLap() {
  let noe2 = testArea.value.length;
  noeUl.innerHTML += "<li>" + noe2 + "</li>";
}

// Count number of words (now), sum of all entries, and then finally WPM
function totalCharacters() {
  for (var i = 0; i < noeLi.length; i++) {
    charactersCount += noeLi[i].innerHTML * 1;
  }
  // now = Number of words
  let now = charactersCount / 5;
  let tTime = totalTime.innerText;
  let timeSplitted = tTime.split(":");
  let minutesParsed = parseInt(timeSplitted[0]);
  let secondsParsed = parseInt(timeSplitted[1]);
  let getSeconds = minutesParsed * 60 + secondsParsed;
  // rounding minutes to 2 decimals
  let getMinuteFromSeconds = Math.round((getSeconds / 60) * 100) / 100;
  let wpm = Math.floor(now / getMinuteFromSeconds);
  wpmSpan.innerHTML =
    "Converted minutes: " +
    getMinuteFromSeconds +
    " Number of characters: " +
    charactersCount +
    ", number of words: " +
    now +
    "<br>" +
    "Your WPM: " +
    "<b>" +
    wpm +
    "</b>";
}

// Match the text entered with the provided text on the page
function spellCheck() {
  let textEntered = testArea.value;
  // getting the parts of textEntered
  let originTextMatch = originText.innerHTML.substring(0, textEntered.length);

  if (textEntered == originText.innerHTML) {
    clearInterval(interval);
    testWrapper.style.borderColor = "#008148"; // green
    showText(texts);
    lap();
    noeLap();
    resetAllExceptCounter();
    start();
    runCounter();
    finishedAll();
  } else {
    if (textEntered == originTextMatch) {
      testWrapper.style.borderColor = "#2F6690"; // blue
    } else {
      testWrapper.style.borderColor = "#95190C"; // red
    }
  }
}

// Show modal with results when there is no longer sentences to matching
function finishedAll() {
  if (originText.innerHTML === "") {
    resetAllExceptCounter();
    modal.style.display = "block";
    testArea.disabled = true;
    stopOtherTimer();
    totalCharacters();
  }
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
function closeModalFromAnywhere(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Start the timer
function start() {
  let textEnterdLength = testArea.value.length;
  if (textEnterdLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// Start the other (invisible) timer
function startOtherTimer() {
  let textEnterdLength = testArea.value.length;
  if (textEnterdLength === 0 && !otherTimerRunning) {
    otherTimerRunning = true;
    otherInterval = setInterval(runOtherTimer, 10);
  }
}

function stopOtherTimer() {
  clearInterval(otherInterval);
  otherInterval = null;
  otherTimer = [0, 0, 0, 0];
  otherTimerRunning = false;
}

// Reset everything except counter (score)
function resetAllExceptCounter() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
  timerRunning = false;

  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "#000";
}

// Reset everything
function resetAll() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0, 0];
  timerRunning = false;
  counter = 0;

  testArea.value = "";
  theTimer.innerHTML = "00:00:00";
  testWrapper.style.borderColor = "#000";
  theCounter.innerHTML = "Score: ";
  laps.innerHTML = "";
  location.reload();
}

// Event listeners
testArea.addEventListener("keypress", start, false);
testArea.addEventListener("keypress", startOtherTimer, false);
testArea.addEventListener("keypress", numberOfEntries, false);
testArea.addEventListener("keyup", spellCheck, false);
testArea.addEventListener("keyup", numberOfEntries, false);
resetButton.addEventListener("click", resetAll, false);
span.addEventListener("click", closeModal, false);
window.addEventListener("click", closeModalFromAnywhere, false);
