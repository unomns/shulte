const GRID_SIZE = 5;
let expected = 1;
let startTime: number | null = null;
// let intervalId: number;
let intervalId: ReturnType<typeof setInterval>;


const gridEl = document.getElementById("grid")!;
const timerEl = document.getElementById("timer")!;
const restartBtn = document.getElementById("restart")!;

function generateNumbers(size: number): number[] {
    const numbers = Array.from({ length: size*size }, (_,i) => i+1);

    return numbers.sort(()=> Math.random() - 0.5);
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

    const numbers = generateNumbers(GRID_SIZE);
    numbers.forEach(n => {
        const btn = document.createElement("button");
        btn.textContent = n.toString();
        btn.onclick = () => {
            if (n === expected) {
                btn.style.background = "green";
                btn.disabled = true;
                if (expected === 1) {
                    startTime = performance.now();
                    intervalId = setInterval(updateTimer, 100);
                }
                expected++;
                if (expected > GRID_SIZE * GRID_SIZE) {
                    clearInterval(intervalId);
                }
            } else {
                btn.style.background = "red";
                setTimeout(() => btn.style.background = "", 200);
            }
        };
        gridEl.appendChild(btn);
    });
}

restartBtn.addEventListener("click", renderGrid);
renderGrid();