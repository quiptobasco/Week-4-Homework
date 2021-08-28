// All the variables for DOM manipulation
var startDisplay = document.querySelector(".start");
var quizDisplay = document.querySelector(".quiz");
var gameOverDisplay = document.querySelector(".game-over");
var highScoreDisplay = document.querySelector(".high-scores");

var timerEl = document.querySelector(".timer");
var resultEl = document.querySelector(".result-text");
var questionsEl = document.querySelector(".questions-text");
var finalScoreEl = document.querySelector(".final-score");
var initials = document.getElementById("final-score-initials");
var highScoreInitials = document.querySelector(".high-score-initials");
var highScoreEl = document.querySelector(".high-score-score");
var errorText = document.querySelector(".error-text");

var startBtn = document.querySelector(".start-button");
var scoreSubmitBtn = document.querySelector(".initials-submit-button");
var showHighScoresBtn = document.querySelector(".show-high-score-button");
var btn1 = document.querySelector(".answer-1-button");
var btn2 = document.querySelector(".answer-2-button");
var btn3 = document.querySelector(".answer-3-button");
var btn4 = document.querySelector(".answer-4-button");
var clearScoresBtn = document.querySelector(".clear-high-scores-button");
var playAgainBtn = document.querySelector(".play-again-button");

// Questions object
var questions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        option1: "&lt;script&gt;",
        option2: "&lt;js&gt;",
        option3: "&lt;javascript&gt;",
        option4: "&lt;scripting&gt;",
        correctOption: "1"},
    {
        question: "How do you write 'Hello World' in an alert box?",
        option1: "msg('Hello World');",
        option2: "msgBox('Hello World');",
        option3: "alert('Hello World');",
        option4: "alertBox('Hello World');",
        correctOption: "3"},
    {
        question: "What does DOM stand for?",
        option1: "Display Object Management",
        option2: "Document Object Model",
        option3: "Desktop Oriented Mode",
        option4: "Digital Ordinance Model",
        correctOption: "2"},
    {
        question: "How does a FOR loop start?",
        option1: "for (i = 0; i <= 5)",
        option2: "for (i <= 5; i++)",
        option3: "for i = 1 to 5",
        option4: "for (i = 0; i <= 5; i++)",
        correctOption: "4"},
    {
        question: "Which of the following type of variable is visible everywhere in your JavaScript code?",
        option1: "global variable",
        option2: "local variable",
        option3: "both of the above",
        option4: "none of the above",
        correctOption: "1"},
    {
        question: "Which of the following function of Number object returns the number's value?",
        option1: "toString()",
        option2: "valueOf()",
        option3: "toLocaleString()",
        option4: "toPrecision()",
        correctOption: "2"},
    {
        question: "Which of the following function of Array object returns a new array comprised of this array joined with other array(s) and/or value(s)?",
        option1: "pop()",
        option2: "push()",
        option3: "some()",
        option4: "concat()",
        correctOption: "4"}
]

// Global variables
var timer;
var timerCount;
var currentQuestion;
var score;
var finalQuestion = questions.length;

function startQuiz() {
    //start timer, hide start card and show quiz card, get first question
    quizDisplay.style.display = "block";
    startDisplay.style.display = "none";

    timerCount = 120;
    currentQuestion = 0;
    score = 0;
    timerEl.textContent = "Time remaining: " + timerCount + " seconds.";
    getQuestion();
    startTimer();
}

function startTimer() {
    timer = setInterval(function() {
        timerCount--;
        timerEl.textContent = "Time remaining: " + timerCount + " seconds.";

        if (timerCount === 0) {
            clearInterval(timer);
            showScore();
        }

    }, 1000);
}

// get question, display it on the card
function getQuestion() {    
    // no more questions, show the score
    if (currentQuestion === finalQuestion || timerCount <= 0) {
        return showScore();
    }

    var question = questions[currentQuestion];
    questionsEl.textContent = question.question;
    btn1.innerHTML = question.option1;
    btn2.innerHTML = question.option2;
    btn3.innerHTML = question.option3;
    btn4.innerHTML = question.option4;
}

function checkAnswer(choice) {
    // set correctAnswer to the correctOption from the question array
    correctAnswer = questions[currentQuestion].correctOption;
    // check to see if the answer is correct, and that it's not the final question
    // if it's correct, display correct in green on screen, add to score, and get next question
    if (choice === correctAnswer && currentQuestion !== finalQuestion) {
        score++;
        resultEl.style.color = "green";
        resultEl.textContent = "Correct!";
        currentQuestion++;
        getQuestion();
    // if the answer is wrong and it's also not the last question display incorrect in red on screen
    // subtract 15 seconds from time, and get next question    
    } else if (choice !== correctAnswer && currentQuestion !== finalQuestion) {
        resultEl.style.color = "red";
        resultEl.textContent = "Incorrect!";
        currentQuestion++;
        timerCount -= 15;
        timerEl.textContent = "Time remaining: " + timerCount + " seconds.";
        getQuestion();
    } else {
    // must have been last question, quiz is done - show the score    
        showScore();
    }
}

function showScore() {
    // hide the quiz card and show the game over card
    quizDisplay.style.display = "none";
    gameOverDisplay.style.display = "block";
    // clear the timer
    clearInterval(timer);
    initials.value = "";
    // show final score
    finalScoreEl.innerHTML = "Your score was " + score + " out of " + questions.length + ".";
}

function highScore() {
        errorText.textContent = "";
        // check to make sure initials entered, otherwise display error in red on screen
        if (initials.value === "") {
            errorText.style.color = "red";
            errorText.textContent = "You must enter your initials.";
            return false;
        } else {
        // get savedScores from local storage, or create new array if null    
            var savedScores = JSON.parse(localStorage.getItem("savedScores")) || [];
        // set var player to the initials submitted and trim white space before and after value    
            var player = initials.value.trim();
        // set currHighScore object
            var currHighScore = {
                playerName : player, 
                score : score
            };
        // Hide all cards, show the high score card    
            gameOverDisplay.style.display = "none";
            quizDisplay.style.display = "none";
            startDisplay.style.display = "none";
            highScoreDisplay.style.display = "block";
        // add currHighScore to savedScores array
            savedScores.push(currHighScore);
        // save high scores to local storage as JSON
            localStorage.setItem("savedScores", JSON.stringify(savedScores));
            generateScores();
        }
}

function generateScores() {
    // clear scores so no repeating
    highScoreInitials.innerHTML = "";
    highScoreEl.innerHTML = "";

    var scores = JSON.parse(localStorage.getItem("savedScores")) || [];

    // iterate through scores array and add to list item on high score card
    for (i = 0; i < scores.length; i++) {        
        var newName = document.createElement("li");
        var newScore = document.createElement("li");

        newName.className += "list-group-item";
        newScore.className += "list-group-item";

        newName.textContent = scores[i].playerName;
        newScore.textContent = scores[i].score;

        highScoreInitials.appendChild(newName);
        highScoreEl.appendChild(newScore);
    }
}

function clearHighScores() {
    // clear local storage and clear what's showing on screen
    window.localStorage.clear();
    highScoreInitials.textContent = "";
    highScoreEl.textContent = "";
}

function showHighScores() {
    // hide all cards except the high score card
    gameOverDisplay.style.display = "none";
    quizDisplay.style.display = "none";
    highScoreDisplay.style.display = "block";
    startDisplay.style.display = "none";
    generateScores();
}

function init() {
    // hide all cards except the starting card
    gameOverDisplay.style.display = "none";
    quizDisplay.style.display = "none";
    highScoreDisplay.style.display = "none";
    startDisplay.style.display = "block";

    // initialize some variables
    resultEl.textContent = "";
    initials.value = "";
    
    //add click events to buttons
    scoreSubmitBtn.addEventListener("click", highScore); 
    playAgainBtn.addEventListener("click", init);
    startBtn.addEventListener("click", startQuiz);
    clearScoresBtn.addEventListener("click", clearHighScores);
    showHighScoresBtn.addEventListener("click", showHighScores);
}

// initialize the script
init();