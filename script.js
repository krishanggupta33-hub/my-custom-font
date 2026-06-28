const wordDisplay = document.getElementById('word-display');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const restartBtn = document.getElementById('restart-btn');
const mobileInput = document.getElementById('mobile-input');
const gameContainer = document.querySelector('.game-container');

// Expanded word bank for a better typing experience
const wordBank = [
    "the", "quick", "brown", "fox", "hack", "club", "code", "ship", "font",
    "type", "speed", "hacker", "build", "create", "javascript", "developer",
    "keyboard", "screen", "variable", "function", "array", "object", "string",
    "mobile", "desktop", "server", "database", "query", "style", "markup",
    "algorithm", "logic", "syntax", "debug", "compile", "deploy", "hosting"
];

let timeLeft = 60;
let timer = null;
let isPlaying = false;
let charIndex = 0;
let correctChars = 0;

// Force focus on the hidden input when clicking anywhere in the game
gameContainer.addEventListener('click', () => {
    mobileInput.focus();
});

// Initialize or restart the game
function initGame() {
    wordDisplay.innerHTML = '';

    // Generate random words
    for (let i = 0; i < 50; i++) {
        let randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        let wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        // Split words into individual span letters
        randomWord.split('').forEach(char => {
            let charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.classList.add('letter');
            wordDiv.appendChild(charSpan);
        });

        // Add a space after each word
        let spaceSpan = document.createElement('span');
        spaceSpan.innerText = ' ';
        spaceSpan.classList.add('letter');
        wordDiv.appendChild(spaceSpan);

        wordDisplay.appendChild(wordDiv);
    }

    // Reset variables and UI
    wordDisplay.querySelectorAll('.letter')[0].classList.add('active');
    timeLeft = 60;
    charIndex = 0;
    correctChars = 0;
    isPlaying = false;
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    clearInterval(timer);

    // Clear the invisible input and force keyboard focus
    mobileInput.value = '';
    mobileInput.focus();
}

// Handle typing logic (Works seamlessly for Desktop & Mobile via the hidden input)
mobileInput.addEventListener('input', (e) => {
    const characters = wordDisplay.querySelectorAll('.letter');

    // Start timer on the first keystroke
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.innerText = timeLeft;

                // WPM Calculation Formula
                let timeElapsed = 60 - timeLeft;
                let wpm = Math.round(((correctChars / 5) / timeElapsed) * 60);
                wpmDisplay.innerText = wpm > 0 ? wpm : 0;
            } else {
                // Game Over State
                clearInterval(timer);
                mobileInput.blur(); // Hides the mobile keyboard
            }
        }, 1000);
    }

    // Handle Backspace (Works for both physical 'Backspace' and mobile 'deleteContentBackward')
    if (e.inputType === 'deleteContentBackward' && charIndex > 0) {
        charIndex--;
        characters[charIndex].classList.remove('correct', 'incorrect');
        characters.forEach(span => span.classList.remove('active'));
        characters[charIndex].classList.add('active');
        return;
    }

    const typedChar = e.data;

    // Stop if the game is over, out of letters, or character is null
    if (charIndex >= characters.length || typedChar === null || timeLeft === 0) return;

    // Check if correct or incorrect
    if (typedChar === characters[charIndex].innerText) {
        characters[charIndex].classList.add('correct');
        correctChars++;
    } else {
        characters[charIndex].classList.add('incorrect');
    }

    // Move cursor forward
    characters[charIndex].classList.remove('active');
    charIndex++;
    if (charIndex < characters.length) {
        characters[charIndex].classList.add('active');
    }
});

// Restart button event listener
restartBtn.addEventListener('click', initGame);

// Load the game immediately when the page opens
initGame();