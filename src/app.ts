let gridSize: number = 5;
let expected: number = 1;
let startTime: number | null = null;
let intervalId: ReturnType<typeof setInterval>;
let soundEnabled: boolean = true;

const gridEl = document.getElementById("grid")!;
const timerEl = document.getElementById("timer")!;
const restartBtn = document.getElementById("restart")!;

const defaultVolume = 0.1
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.wav");
const completeSound = new Audio("sounds/complete.wav");
correctSound.volume = defaultVolume
wrongSound.volume = defaultVolume
completeSound.volume = defaultVolume
const toggleBtn = document.getElementById("toggle-sound") as HTMLButtonElement;
const volumeSlider = document.getElementById("volume") as HTMLInputElement;

toggleBtn.onclick = () => {
    soundEnabled = !soundEnabled;
    toggleBtn.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
};

volumeSlider.oninput = () => {
    const vol = parseFloat(volumeSlider.value);
    correctSound.volume = vol;
    completeSound.volume = vol;
};

const sizeButtons = document.querySelectorAll<HTMLButtonElement>("#size-buttons button[data-size]");
sizeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    sizeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    gridSize = parseInt(btn.dataset.size || "5");
    renderGrid();
  });
});

function generateNumbers(size: number): number[] {
    const numbers = Array.from({ length: size * size }, (_, i) => i + 1);

    return numbers.sort(() => Math.random() - 0.5);
}

function updateTimer() {
    if (startTime) {
        const elapsed = (performance.now() - startTime) / 1000;
        timerEl.textContent = `Time: ${elapsed.toFixed(2)}s`;
    }
}

function renderGrid() {
    gridEl.innerHTML = "";
    expected = 1;
    startTime = null;
    clearInterval(intervalId);
    timerEl.textContent = "Time: 0.00s";

    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

    const numbers = generateNumbers(gridSize);
    numbers.forEach(n => {
        const btn = document.createElement("button");
        btn.textContent = n.toString();
        btn.onclick = () => {
            if (n === expected) {
                if (soundEnabled) {
                    correctSound.currentTime = 0;
                    correctSound.play();
                }

                btn.style.background = "green";
                btn.disabled = true;
                if (expected === 1) {
                    startTime = performance.now();
                    intervalId = setInterval(updateTimer, 100);
                    correctSound.currentTime = 0;
                }
                expected++;
                if (expected > gridSize * gridSize) {
                    clearInterval(intervalId);
                    if (soundEnabled) {
                        completeSound.currentTime = 0;
                        completeSound.play();
                    }
                }
            } else {
                wrongSound.currentTime = 0;
                wrongSound.play();
                btn.style.background = "red";
                setTimeout(() => {
                    btn.style.background = "";
                }, 200);
            }
        };
        gridEl.appendChild(btn);
    });
}

restartBtn.addEventListener("click", renderGrid);
renderGrid();