// Word sets for different modes
const wordSets = {
    soft: {
        action: [
            action = [
        "Kiss softly",
        "Lick slowly",
        "Suck gently",
        "Caress tenderly",
        "Nibble lightly",
        "Massage sensually",
        "Tease with tongue",
        "Blow warm breath",
        "Stroke softly",
        "Worship with lips"
]
        ],
        where: [
            "Lips",
            "Neck",
            "Ears",
            "Breasts",
            "Nipples",
            "Chest",
            "Belly",
            "Inner thighs",
            "Lower back",
            "Feet"
        ]
    },
    extreme: {
        action: [
            "Lick hungrily",
            "Suck hard",
            "Bite firmly",
            "Finger deep",
            "Rub aggressively",
            "Spank sharply",
            "Devour with mouth",
            "Edge mercilessly"
        ],
        where: [
            "Clit",
            "Pussy",
            "Cock",
            "Balls",
            "Asshole",
            "Nipples",
            "Inner thighs",
            "Butt cheeks"
        ]
    },
    rough: {
        action: [
                "Slap hard",
                "Choke lightly",
                "Pound with fingers",
                "Bite aggressively",
                "Face fuck"
        ],
        where: [
            "Face",
            "Throat",
            "Pussy",
            "Ass",
            "Tits"
        ]
    }
};

// State management
let currentMode = 'soft';
let isSpinning = false;
let spinHistory = [];
const MAX_HISTORY = 4; // Prevent same combination for 4 turns

// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const spinBtn = document.getElementById('spinBtn');
const actionResult = document.getElementById('actionResult');
const whereResult = document.getElementById('whereResult');
const actionSpinner = document.getElementById('actionSpinner');
const whereSpinner = document.getElementById('whereSpinner');
const historyText = document.getElementById('historyText');

// Event Listeners
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
    });
});

spinBtn.addEventListener('click', spin);

// Main Spin Function
function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    // Remove previous animation classes
    actionSpinner.classList.remove('spinning');
    whereSpinner.classList.remove('spinning');

    // Trigger reflow to restart animation
    void actionSpinner.offsetWidth;
    void whereSpinner.offsetWidth;

    // Add spinning animation
    actionSpinner.classList.add('spinning');
    whereSpinner.classList.add('spinning');

    // Get results after animation completes
    setTimeout(() => {
        const result = getRandomCombination();
        
        // Animate result appearance
        actionResult.style.opacity = '0.5';
        whereResult.style.opacity = '0.5';

        setTimeout(() => {
            actionResult.textContent = result.action;
            whereResult.textContent = result.where;
            
            actionResult.style.transition = 'opacity 0.3s ease';
            whereResult.style.transition = 'opacity 0.3s ease';
            actionResult.style.opacity = '1';
            whereResult.style.opacity = '1';

            // Add to history
            spinHistory.unshift(result.combination);
            if (spinHistory.length > MAX_HISTORY) {
                spinHistory.pop();
            }
            updateHistoryDisplay();

            isSpinning = false;
            spinBtn.disabled = false;

            // Remove animation class
            actionSpinner.classList.remove('spinning');
            whereSpinner.classList.remove('spinning');
        }, 300);
    }, 2000); // Match animation duration
}

// Get Random Combination
function getRandomCombination() {
    const actions = wordSets[currentMode].action;
    const wheres = wordSets[currentMode].where;

    let newCombination;
    let attempts = 0;
    const maxAttempts = 20;

    // Try to find a combination that hasn't been used recently
    do {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const randomWhere = wheres[Math.floor(Math.random() * wheres.length)];
        newCombination = `${randomAction} ${randomWhere}`;
        attempts++;
    } while (spinHistory.includes(newCombination) && attempts < maxAttempts);

    return {
        action: newCombination.split(' ')[0],
        where: newCombination.split(' ').slice(1).join(' '),
        combination: newCombination
    };
}

// Update History Display
function updateHistoryDisplay() {
    if (spinHistory.length > 0) {
        const recentCombinations = spinHistory.slice(0, 3).map((combo, index) => `${index + 1}. ${combo}`).join(' | ');
        historyText.textContent = `Recent: ${recentCombinations}`;
    }
}

// Initialize with default message
actionResult.style.transition = 'opacity 0.3s ease';
whereResult.style.transition = 'opacity 0.3s ease';
