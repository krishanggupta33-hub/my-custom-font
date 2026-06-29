const wordDisplay = document.getElementById('word-display');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const restartBtn = document.getElementById('restart-btn');
const mobileInput = document.getElementById('mobile-input');
const gameContainer = document.querySelector('.game-container');

const resultsModal = document.getElementById('results-modal');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const highScoreDisplay = document.getElementById('high-score');
const playAgainBtn = document.getElementById('play-again-btn');

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
let totalKeystrokes = 0;

gameContainer.addEventListener('click', () => {
    mobileInput.focus();
});

function initGame() {
    wordDisplay.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        let randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        let wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        randomWord.split('').forEach(char => {
            let charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.classList.add('letter');
            wordDiv.appendChild(charSpan);
        });

        let spaceSpan = document.createElement('span');
        spaceSpan.innerText = ' ';
        spaceSpan.classList.add('letter');
        wordDiv.appendChild(spaceSpan);

        wordDisplay.appendChild(wordDiv);
    }

    wordDisplay.querySelectorAll('.letter')[0].classList.add('active');
    timeLeft = 60;
    charIndex = 0;
    correctChars = 0;
    totalKeystrokes = 0;
    isPlaying = false;
    timeDisplay.innerText = timeLeft;
    wpmDisplay.innerText = 0;
    clearInterval(timer);
    
    resultsModal.classList.add('hidden');

    mobileInput.value = '';
    mobileInput.focus();
}

mobileInput.addEventListener('input', (e) => {
    const characters = wordDisplay.querySelectorAll('.letter');

    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timeDisplay.innerText = timeLeft;

                let timeElapsed = 60 - timeLeft;
                let wpm = Math.round(((correctChars / 5) / timeElapsed) * 60);
                wpmDisplay.innerText = wpm > 0 ? wpm : 0;
            } else {
                clearInterval(timer);
                mobileInput.blur(); 
                
                let finalWpmValue = wpmDisplay.innerText;
                let accuracy = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 0;
                
                let savedHighScore = localStorage.getItem('typefaceHighScore') || 0;
                if (parseInt(finalWpmValue) > parseInt(savedHighScore)) {
                    localStorage.setItem('typefaceHighScore', finalWpmValue);
                    savedHighScore = finalWpmValue;
                }

                finalWpm.innerText = finalWpmValue;
                finalAccuracy.innerText = accuracy + '%';
                highScoreDisplay.innerText = savedHighScore;
                
                resultsModal.classList.remove('hidden');
            }
        }, 1000);
    }

    if (e.inputType === 'deleteContentBackward' && charIndex > 0) {
        charIndex--;
        characters[charIndex].classList.remove('correct', 'incorrect');
        characters.forEach(span => span.classList.remove('active'));
        characters[charIndex].classList.add('active');
        return;
    }

    const typedChar = e.data;

    if (charIndex >= characters.length || typedChar === null || timeLeft === 0) return;

    totalKeystrokes++; 

    if (typedChar === characters[charIndex].innerText) {
        characters[charIndex].classList.add('correct');
        correctChars++;
    } else {
        characters[charIndex].classList.add('incorrect');
    }

    characters[charIndex].classList.remove('active');
    charIndex++;
    if (charIndex < characters.length) {
        characters[charIndex].classList.add('active');
    }
});

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

initGame();