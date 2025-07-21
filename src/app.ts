let gridSize: number = 5;
let gridElWidth: number = 80;
let expected: number = 1;
let startTime: number | null = null;
let intervalId: ReturnType<typeof setInterval>;
let soundEnabled: boolean = true;
let currentMode: "numbers" | "letters" = "numbers";


const gridEl = document.getElementById("grid")!;
const timerEl = document.getElementById("timer")!;
const restartBtn = document.getElementById("restart")!;

const defaultVolume = 0.1
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.wav");
const completeSound = new Audio("sounds/complete.wav");
const clickSound = new Audio("sounds/click.mp3");
clickSound.volume = defaultVolume
correctSound.volume = defaultVolume
wrongSound.volume = defaultVolume
completeSound.volume = defaultVolume

const toggleBtn = document.getElementById("toggle-sound") as HTMLButtonElement;
const volumeSlider = document.getElementById("volume") as HTMLInputElement;

toggleBtn.onclick = () => {
    playSound(clickSound)
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
        playSound(clickSound)

        sizeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        gridSize = parseInt(btn.dataset.size || "5");
        renderGrid();
    });
});

const modeButtons = document.querySelectorAll<HTMLButtonElement>("#mode-buttons button[data-mode]");
modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        playSound(clickSound)

        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentMode = btn.dataset.mode as "numbers" | "letters";
        renderGrid();
    });
});

function generateNumbers(size: number): number[] {
    const numbers = Array.from({ length: size * size }, (_, i) => i + 1);

    return numbers.sort(() => Math.random() - 0.5);
}

function generateLabels(size: number): string[] {
    const count = size * size;
    let labels: string[];

    if (currentMode === "numbers") {
        labels = Array.from({ length: count }, (_, i) => (i + 1).toString());
    } else {
        const letters = [];
        for (let i = 0; i < count; i++) {
            letters.push(String.fromCharCode(65 + i)); // A-Z...
        }
        labels = letters;
    }

    return labels.sort(() => Math.random() - 0.5)
}

function expectedLabel(): string {
    if (currentMode === "numbers") return expected.toString();
    return String.fromCharCode(64 + expected); // A=65
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

    gridEl.style.gridTemplateColumns = `repeat(${gridSize}, ${gridElWidth}px)`;

    const numbers = generateLabels(gridSize);
    numbers.forEach(n => {
        const btn = document.createElement("button");
        btn.textContent = n.toString();
        btn.onclick = () => {
            if (n === expectedLabel()) {
                playSound(correctSound)

                btn.style.background = "gray";
                btn.style.color = "white";
                btn.disabled = true;
                if (expected === 1) {
                    startTime = performance.now();
                    intervalId = setInterval(updateTimer, 100);
                    correctSound.currentTime = 0;
                }
                expected++;
                if (expected > gridSize * gridSize) {
                    clearInterval(intervalId);
                    playSound(completeSound)
                }
            } else {
                playSound(wrongSound)
                btn.style.background = "gray";
                setTimeout(() => {
                    btn.style.background = "";
                }, 200);
            }
        };
        gridEl.appendChild(btn);
    });
}

function playSound(sound: HTMLAudioElement) {
    if (!soundEnabled) {
        return;
    }

    sound.currentTime = 0;
    sound.play();
}

restartBtn.addEventListener("click", renderGrid);
renderGrid();