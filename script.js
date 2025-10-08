let currentAudio = null;
const volumeControl = document.getElementById("volume"); // Now this will find the element
const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const soundName = e.target.textContent;
    playSound(soundName);
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

const stopButton = document.querySelector(".stop");
stopButton.addEventListener("click", () => {
  stopSound();
  buttons.forEach((btn) => btn.classList.remove("active"));
});

function playSound(soundName) {
  stopSound();
  currentAudio = new Audio(`sounds/${soundName}.mp3`);
  // The path of sound is './sounds/applause.mp3'
  currentAudio.volume = volumeControl.value;
  currentAudio.play();
  currentAudio.addEventListener("ended", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
  });
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

volumeControl.addEventListener("input", () => {
  if (currentAudio) {
    currentAudio.volume = volumeControl.value;
  }
});
