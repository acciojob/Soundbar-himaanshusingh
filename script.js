// Sound configuration
const sounds = [
  { name: "Applause", file: "applause.mp3" },
  { name: "Boo", file: "boo.mp3" },
  { name: "Gasp", file: "gasp.mp3" },
  { name: "Tada", file: "tada.mp3" },
  { name: "Victory", file: "victory.mp3" },
  { name: "Wrong", file: "wrong.mp3" },
  { name: "Drum", file: "drum.mp3" },
  { name: "Guitar", file: "guitar.mp3" },
];

// Create buttons for each sound
const buttonsContainer = document.getElementById("buttons");

sounds.forEach((sound) => {
  const button = document.createElement("button");
  button.className = "btn";
  button.textContent = sound.name;
  button.addEventListener("click", () => playSound(sound));
  buttonsContainer.appendChild(button);
});

// Create visualizer bars
const visualizerBars = document.getElementById("visualizer-bars");
for (let i = 0; i < 20; i++) {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = "10%";
  visualizerBars.appendChild(bar);
}

// Audio context for visualization
let audioContext;
let analyser;
let source;
let currentAudio = null;
const nowPlayingElement = document.getElementById("now-playing");

// Function to play a sound
function playSound(sound) {
  // Stop any currently playing sound
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // Update now playing text
  nowPlayingElement.textContent = `Now playing: ${sound.name}`;

  // Create new audio element
  currentAudio = new Audio(`sounds/${sound.file}`);

  // Set up audio context for visualization if not already set up
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
  }

  // Connect audio to analyser for visualization
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  source = audioContext.createMediaElementSource(currentAudio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Start visualization
  visualize();

  // Play the sound
  currentAudio.play();
}

// Function to visualize audio
function visualize() {
  if (!analyser) return;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  const bars = document.querySelectorAll(".bar");

  function updateVisualizer() {
    if (!currentAudio || currentAudio.paused) return;

    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bars.length; i++) {
      // Map the frequency data to bar heights
      const value = dataArray[i % bufferLength];
      const percentage = Math.min(100, (value / 255) * 100);
      bars[i].style.height = `${percentage}%`;

      // Add color variation based on frequency
      const hue = (value / 255) * 120 + 200; // Blue to purple range
      bars[
        i
      ].style.background = `linear-gradient(to top, hsl(${hue}, 70%, 50%), hsl(${
        hue + 30
      }, 70%, 70%))`;
    }

    requestAnimationFrame(updateVisualizer);
  }

  updateVisualizer();
}

// Stop button functionality
document.querySelector(".stop").addEventListener("click", () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    nowPlayingElement.textContent = "No sound playing";

    // Reset visualizer bars
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
      bar.style.height = "10%";
      bar.style.background = "linear-gradient(to top, #4776E6, #8E54E9)";
    });
  }
});
