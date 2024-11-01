const quotes = [
  "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  "There is nothing more deceptive than an obvious fact.",
  "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
  "I never make exceptions. An exception disproves the rule.",
  "What one man can invent another can discover.",
  "Nothing clears up a case so much as stating it to another person.",
  "Education never ends, Watson. It is a series of lessons, with the greatest for the last.",
];

let quoteIndex = 0;
let words = [];
let wordIndex = 0;
let startTime = Date.now();

const resultModalElement = document.getElementById("result-modal");
const quoteElement = document.getElementById("quote");
const startGameMessageElement = document.getElementById("game-message");
const messageElement = document.getElementById("message");
const typedValueElement = document.getElementById("typed-value");
const gameStartButtonElement = document.getElementById("start-button");
const resultModalCloseButtonElement = document.getElementById("close-button");
const rankElement = document.getElementById("rank");

function closeResultModal() {
  resultModalElement.style.display = "none";
}

function openResultModal() {
  resultModalElement.style.display = "flex";
}

resultModalCloseButtonElement.addEventListener("click", closeResultModal);

function saveHighScore(newScore) {
  let highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

  highScores.push(newScore);

  // 내림차순 정렬 후 상위 3개만 남김
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 3);

  localStorage.setItem("HighScores", JSON.stringify(highScores));

  displayRank();
}

function displayRank() {
  const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

  rankElement.innerHTML = highScores
    .map(
      (score, index) => `
      <figure class="score-bar">
        <p>${index + 1}.</p>
        <p>${score}</p>
      </figure>
    `
    )
    .join("");
}

// 페이지 로드 시 최고 점수 표시
window.onload = displayRank;

gameStartButtonElement.addEventListener("click", () => {
  startGameMessageElement.style.display = "none";
  quoteElement.style.display = "block";
  typedValueElement.disabled = false;
  typedValueElement.className = "input-no-error";

  gameStartButtonElement.disabled = true;
  gameStartButtonElement.className = "button-disable";

  quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  words = quote.split(" ");
  wordIndex = 0;
  const spanWords = words.map(function (word) {
    return `<span>${word} </span>`;
  });
  quoteElement.innerHTML = spanWords.join("");
  quoteElement.childNodes[0].className = "highlight";
  messageElement.innerText = "";
  typedValueElement.value = "";
  typedValueElement.focus();
  startTime = new Date().getTime();
});

let animationTimeout = null;
typedValueElement.addEventListener("input", () => {
  if (animationTimeout !== null) {
    clearTimeout(animationTimeout);
    typedValueElement.classList.remove("animated");
    animationTimeout = null;

    setTimeout(() => {
      typedValueElement.classList.add("animated");
    }, 10);
  } else {
    typedValueElement.classList.add("animated");
  }

  animationTimeout = setTimeout(() => {
    typedValueElement.classList.remove("animated");
    animationTimeout = null;
  }, 500);

  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;
  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime;

    // 문장 길이에 비례하여 점수 계산
    const score = ((quotes[quoteIndex].length / elapsedTime) * 1000).toFixed(4);

    const message = `You finished in ${
      elapsedTime / 1000
    } seconds\nYour Score is ${score}`;
    messageElement.innerText = message;

    saveHighScore(score);

    typedValueElement.disabled = true;
    typedValueElement.className = "input-no-error";

    gameStartButtonElement.disabled = false;
    gameStartButtonElement.className = "button-enable";

    typedValueElement.value = "";

    openResultModal();
  } else if (typedValue.endsWith(" ") && typedValue.trim() === currentWord) {
    typedValueElement.value = "";
    wordIndex++;
    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = "";
    }
    quoteElement.childNodes[wordIndex].className = "highlight";
  } else if (currentWord.startsWith(typedValue)) {
    typedValueElement.classList.add("input-no-error");
    typedValueElement.classList.remove("input-error");
  } else {
    typedValueElement.classList.remove("input-no-error");
    typedValueElement.classList.add("input-error");
  }
});
