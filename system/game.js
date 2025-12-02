let attempts = 0;
const correctAnswers = [
    'github code agents model identity',
    'code agents',
    'ai model',
    'github copilot',
    'ai agent',
    'code agent',
    'github agent',
    'ai',
    'artificial intelligence'
];

const closeAnswers = [
    'machine learning',
    'algorithm',
    'bot',
    'chatbot',
    'gpt',
    'llm',
    'neural network',
    'model',
    'copilot'
];

function checkAnswer() {
    const input = document.getElementById('guessInput');
    const guess = input.value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    
    if (!guess) {
        feedback.className = 'feedback wrong';
        feedback.textContent = 'Please enter an answer!';
        return;
    }

    attempts++;
    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;

    // Check if correct
    if (correctAnswers.some(answer => guess.includes(answer))) {
        showModal(true);
        return;
    }

    // Check if close
    if (closeAnswers.some(answer => guess.includes(answer))) {
        feedback.className = 'feedback close';
        feedback.textContent = 'You\'re getting warm... but not quite there.';
    } else {
        feedback.className = 'feedback wrong';
        feedback.textContent = 'Not quite. Think deeper about what reflects us back...';
    }

    input.value = '';
}

function giveUp() {
    showModal(false);
}

function showModal(won) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');

    if (won) {
        title.textContent = '🎯 You Solved It!';
        message.textContent = `Incredible! You got it in ${attempts} attempt${attempts !== 1 ? 's' : ''}. The answer is:`;
    } else {
        title.textContent = '🔓 The Answer Revealed';
        message.textContent = `After ${attempts} attempt${attempts !== 1 ? 's' : ''}, here's what you were seeking:`;
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

function showHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.add('active');
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('active');
}

function showHintModal() {
    const modal = document.getElementById('hintModal');
    modal.classList.add('active');
}

function closeHintModal() {
    const modal = document.getElementById('hintModal');
    modal.classList.remove('active');
}

// Allow Enter key to submit
document.getElementById('guessInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Close modal on background click
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close help modal on background click
document.getElementById('helpModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeHelpModal();
    }
});

// Close hint modal on background click
document.getElementById('hintModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeHintModal();
    }
});
