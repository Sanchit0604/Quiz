/**
 * Interactive Quiz — script.js
 * Author  : Alex Morgan
 * Date    : April 2026
 * Description:
 *   Stores all quiz questions and answers in a JavaScript array.
 *   Handles question rendering, answer selection, score tracking,
 *   result display with dynamic feedback, and quiz restart.
 */

/* =======================================================
   1. QUIZ DATA
   All questions stored as an array of objects.
   Each object has: category, question, options[], answer (index)
   ======================================================= */
const quizData = [
  {
    category: "🌍 Geography",
    question: "Which is the largest country in the world by land area?",
    options: ["Canada", "China", "Russia", "United States"],
    answer: 2   // "Russia" (0-indexed)
  },
  {
    category: "🔬 Science",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: 2   // "Au"
  },
  {
    category: "📚 History",
    question: "In which year did the First World War begin?",
    options: ["1912", "1914", "1916", "1918"],
    answer: 1   // "1914"
  },
  {
    category: "🌿 Nature",
    question: "How many hearts does an octopus have?",
    options: ["One", "Two", "Three", "Four"],
    answer: 2   // "Three"
  },
  {
    category: "💻 Technology",
    question: "What does 'HTML' stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperText and links Markup Language",
      "HyperTool Multi Language"
    ],
    answer: 0   // "HyperText Markup Language"
  },
  {
    category: "🔬 Science",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Saturn", "Mars"],
    answer: 3   // "Mars"
  },
  {
    category: "📚 History",
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    answer: 2   // "Leonardo da Vinci"
  },
  {
    category: "🌍 Geography",
    question: "What is the capital city of Japan?",
    options: ["Osaka", "Kyoto", "Hiroshima", "Tokyo"],
    answer: 3   // "Tokyo"
  },
  {
    category: "🔢 Mathematics",
    question: "What is the value of π (Pi) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.41"],
    answer: 1   // "3.14"
  },
  {
    category: "🌿 Nature",
    question: "What is the fastest land animal in the world?",
    options: ["Lion", "Cheetah", "Greyhound", "Pronghorn Antelope"],
    answer: 1   // "Cheetah"
  }
];


/* =======================================================
   2. STATE VARIABLES
   Track where the user is in the quiz.
   ======================================================= */
let currentQuestionIndex = 0;   // Which question is being shown (0–9)
let score = 0;                   // Number of correct answers
let selectedOptionIndex = null;  // Which option the user clicked
let answerLocked = false;        // Prevents re-selecting after reveal

// Letter labels for answer options
const OPTION_LETTERS = ["A", "B", "C", "D"];


/* =======================================================
   3. DOM REFERENCES
   Grabbed once and reused throughout the script.
   ======================================================= */
const introScreen   = document.getElementById("intro-screen");
const quizScreen    = document.getElementById("quiz-screen");
const resultScreen  = document.getElementById("result-screen");

const qCounter      = document.getElementById("q-counter");
const progressBar   = document.getElementById("progress-bar");
const liveScore     = document.getElementById("live-score");
const questionCat   = document.getElementById("question-category");
const questionText  = document.getElementById("question-text");
const optionsArea   = document.getElementById("options-area");
const nextBtn       = document.getElementById("next-btn");

const resultIcon    = document.getElementById("result-icon");
const resultLabel   = document.getElementById("result-label");
const resultScore   = document.getElementById("result-score");
const resultMessage = document.getElementById("result-message");
const resultBar     = document.getElementById("result-bar");
const resultPercent = document.getElementById("result-percent");


/* =======================================================
   4. SCREEN MANAGEMENT
   Shows one screen and hides all others.
   ======================================================= */

/**
 * Display a specific screen by its ID.
 * @param {string} screenId - The ID of the screen element to show.
 */
function showScreen(screenId) {
  // Remove 'active' from all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  // Add 'active' to the target screen
  document.getElementById(screenId).classList.add("active");
}


/* =======================================================
   5. START QUIZ
   Called when the user clicks "Start Quiz" on the intro screen.
   ======================================================= */

/**
 * Initialise quiz state and show the first question.
 */
function startQuiz() {
  // Reset state variables
  currentQuestionIndex = 0;
  score = 0;
  selectedOptionIndex = null;
  answerLocked = false;

  // Update live score display
  liveScore.textContent = score;

  // Show the quiz screen
  showScreen("quiz-screen");

  // Render the first question
  renderQuestion();
}


/* =======================================================
   6. RENDER QUESTION
   Populates the quiz screen with the current question data.
   ======================================================= */

/**
 * Display the current question and its answer options.
 */
function renderQuestion() {
  // Get current question object from the array
  const current = quizData[currentQuestionIndex];

  // Reset selection state
  selectedOptionIndex = null;
  answerLocked = false;

  // Update counter e.g. "Q 3 / 10"
  qCounter.textContent = `Q ${currentQuestionIndex + 1} / ${quizData.length}`;

  // Update progress bar width as a percentage
  const progressPercent = ((currentQuestionIndex) / quizData.length) * 100;
  progressBar.style.width = progressPercent + "%";

  // Update category and question text
  questionCat.textContent  = current.category;
  questionText.textContent = current.question;

  // Clear old options
  optionsArea.innerHTML = "";

  // Build option buttons dynamically
  current.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.disabled = false;
    // Stagger entry animation using CSS animation-delay
    btn.style.animationDelay = (index * 0.07) + "s";

    // Letter label (A, B, C, D)
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = OPTION_LETTERS[index];

    // Option text span
    const text = document.createElement("span");
    text.textContent = optionText;

    btn.appendChild(letter);
    btn.appendChild(text);

    // Click event — select this answer
    btn.addEventListener("click", () => selectAnswer(index));

    optionsArea.appendChild(btn);
  });

  // Update Next button label
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;
  nextBtn.textContent = isLastQuestion ? "Submit Quiz ✓" : "Next →";
  nextBtn.disabled = true; // Disabled until user selects an answer
}


/* =======================================================
   7. SELECT ANSWER
   Called when user clicks an option button.
   ======================================================= */

/**
 * Handle option selection — highlight chosen option and enable Next.
 * @param {number} selectedIndex - Index of the clicked option (0–3).
 */
function selectAnswer(selectedIndex) {
  // Ignore clicks after answer has been locked
  if (answerLocked) return;

  selectedOptionIndex = selectedIndex;

  // Get all option buttons
  const optionBtns = optionsArea.querySelectorAll(".option-btn");

  // Remove 'selected' from all, then add to clicked one
  optionBtns.forEach(btn => btn.classList.remove("selected"));
  optionBtns[selectedIndex].classList.add("selected");

  // Enable the Next button
  nextBtn.disabled = false;
}


/* =======================================================
   8. NEXT QUESTION / SUBMIT
   Called when user clicks "Next →" or "Submit Quiz ✓".
   ======================================================= */

/**
 * Lock in the selected answer, reveal correct/wrong feedback,
 * then advance to next question (or show results if quiz is done).
 */
function nextQuestion() {
  // Guard: do nothing if no answer selected (button should be disabled, but safety check)
  if (selectedOptionIndex === null) return;

  answerLocked = true;

  const current     = quizData[currentQuestionIndex];
  const correctIndex = current.answer;
  const optionBtns   = optionsArea.querySelectorAll(".option-btn");

  // Disable all option buttons
  optionBtns.forEach(btn => { btn.disabled = true; });

  // Check if the selected answer is correct
  if (selectedOptionIndex === correctIndex) {
    // Mark selected button as correct
    optionBtns[selectedOptionIndex].classList.add("correct");
    score++;                             // Increment score
    liveScore.textContent = score;       // Update live score display
  } else {
    // Mark selected button as wrong
    optionBtns[selectedOptionIndex].classList.add("wrong");
    optionBtns[selectedOptionIndex].classList.add("shake");  // Shake animation
    // Reveal the correct answer
    optionBtns[correctIndex].classList.add("correct");
  }

  // Disable Next button briefly, then auto-advance after 900ms
  nextBtn.disabled = true;

  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
      // More questions remain — render next
      renderQuestion();
    } else {
      // Quiz complete — show result screen
      showResults();
    }
  }, 900);  // Short pause so user can see the feedback colour
}


/* =======================================================
   9. SHOW RESULTS
   Displays the final score with dynamic feedback.
   ======================================================= */

/**
 * Calculate percentage, determine result tier, and show result screen.
 */
function showResults() {
  const total      = quizData.length;              // 10
  const percentage = Math.round((score / total) * 100);

  // Update score display
  resultScore.textContent = score;

  // Animate result bar to correct percentage
  setTimeout(() => {
    resultBar.style.width = percentage + "%";
  }, 100);
  resultPercent.textContent = percentage + "%";

  /* ---- Determine result tier ---- */
  let icon, label, message;

  if (score === total) {
    // Perfect score
    icon    = "🏆";
    label   = "Perfect Score!";
    message = "Incredible! You got every single question right. You are a true genius!";
  } else if (score >= 8) {
    // Excellent
    icon    = "🎉";
    label   = "Excellent!";
    message = "Outstanding performance! You clearly have a broad and impressive knowledge base.";
  } else if (score >= 6) {
    // Good
    icon    = "👍";
    label   = "Good Job!";
    message = "Solid effort! You know your stuff. A little more practice and you'll ace it next time.";
  } else if (score >= 4) {
    // Average
    icon    = "📖";
    label   = "Keep Learning!";
    message = "Not bad, but there's room to grow. Review the topics you missed and try again!";
  } else {
    // Try again
    icon    = "💪";
    label   = "Try Again!";
    message = "Don't be discouraged — every expert was once a beginner. Give it another shot!";
  }

  // Inject result content into the DOM
  resultIcon.textContent    = icon;
  resultLabel.textContent   = label;
  resultMessage.textContent = message;

  // Set result label colour based on tier
  if (score >= 8) {
    resultLabel.style.color = "var(--accent)";
  } else if (score >= 6) {
    resultLabel.style.color = "#42d392";
  } else {
    resultLabel.style.color = "#ff9f45";
  }

  // Update progress bar to full at end of quiz
  progressBar.style.width = "100%";

  // Show result screen
  showScreen("result-screen");
}


/* =======================================================
   10. RESTART QUIZ — Bonus Task 6
   Resets all state and returns to the intro screen.
   ======================================================= */

/**
 * Reset everything and take the user back to the welcome screen.
 */
function restartQuiz() {
  // Reset all state variables
  currentQuestionIndex = 0;
  score = 0;
  selectedOptionIndex = null;
  answerLocked = false;

  // Reset the result bar width for next time
  resultBar.style.width = "0";

  // Reset progress bar
  progressBar.style.width = "10%";

  // Show intro screen
  showScreen("intro-screen");
}


/* =======================================================
   11. KEYBOARD SUPPORT
   Let users press Enter to confirm / advance.
   ======================================================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !nextBtn.disabled) {
    nextQuestion();
  }
});


/* =======================================================
   12. INIT
   Log greeting to console; quiz starts when user clicks Start.
   ======================================================= */
console.log("%c🧠 BrainBurst Quiz loaded!", "color:#c8f060; font-size:16px; font-weight:bold;");
console.log("%c10 questions · General Knowledge", "color:#8890bb; font-size:12px;");
