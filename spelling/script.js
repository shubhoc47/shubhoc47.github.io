const xhr = new XMLHttpRequest();
xhr.open("GET", "words.txt", true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const words = xhr.responseText.split("\n"); // read words from txt file
        let currentWordIndex = -1; // current index of the word being tested
        let correctAnswers = 0; // number of correct answers
        let incorrectAnswers = 0; // number of incorrect answers
        let correctInRow = 0; // number of correct answers in a row
        const synth = window.speechSynthesis; // SpeechSynthesis API instance

        // function to pronounce a word
        function speakWord(word) {
            const utterance = new SpeechSynthesisUtterance(word);
            synth.speak(utterance);
        }

        // function to check the answer
        function checkAnswer() {
            const answer = document.getElementById('answerBox').value;
            const first = words[currentWordIndex];
            const word = first.slice(0,(first.length-1))
            if (answer.toLowerCase() == word.toLowerCase()) {
                document.getElementById('feedback').textContent = 'Correct!';
                currentWordIndex++;
                correctAnswers++;
                correctInRow++;
                if (correctInRow > 1) {
                    document.getElementById('feedback').textContent += ` ${correctInRow} in a row!`;
                }
                if (correctInRow > 2) {
                    document.getElementById('feedback').classList.add('animated', 'heartBeat');
                }
                setTimeout(function() {
                    if (currentWordIndex < words.length) {
                        speakWord(words[currentWordIndex]);
                    } else {
                        document.getElementById('feedback').textContent = 'Quiz completed!';
                    }
                }, 500);
                document.getElementById('answerBox').value = ''; // Clear the answer box
            } else {
                document.getElementById('feedback').textContent = 'Incorrect. Please try again.';
                if (answer !== "") {
                    incorrectAnswers++;
                }
                correctInRow = 0;
            }
            document.getElementById('correctAnswers').textContent = `Correct Answers: ${correctAnswers}`;
            document.getElementById('incorrectAnswers').textContent = `Incorrect Answers: ${incorrectAnswers}`;
            // document.getElementById('correctInRow').textContent = `Correct in a Row: ${correctInRow}`;
        }

        // function to show the correct answer
        function showAnswer() {
            const first = words[currentWordIndex];
            const word = first.slice(0,(first.length-1));
            document.getElementById('feedback').textContent = `The correct answer is ${word}.`;
            incorrectAnswers++;
            correctInRow = 0;
            document.getElementById('correctAnswers').textContent = `Correct Answers: ${correctAnswers}`;
            document.getElementById('incorrectAnswers').textContent = `Incorrect Answers: ${incorrectAnswers}`;
            // document.getElementById('correctInRow').textContent = `Correct in a Row: ${correctInRow}`;
        }

        // event listener for the Listen button
        document.getElementById('listenBtn').addEventListener('click', function() {
            if (currentWordIndex === -1) {
                currentWordIndex = Math.floor(Math.random() * words.length); // choose a random word to start with
            }
            speakWord(words[currentWordIndex]);
        });

        // event listener for the Submit button
        document.getElementById('submitBtn').addEventListener('click', checkAnswer);

        // event listener for the Show Answer button
        document.getElementById('showAnswerBtn').addEventListener('click', showAnswer);
            // event listener for the Enter key in the answer box
    document.getElementById('answerBox').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            checkAnswer();
        }
    });

}
};
xhr.send(); // send the GET request to retrieve the words.txt file

// Function to reset the quiz
function resetQuiz() {
document.getElementById('feedback').textContent = 'Press Listen to start!';
document.getElementById('correctAnswers').textContent = 'Correct Answers: 0';
document.getElementById('incorrectAnswers').textContent = 'Incorrect Answers: 0';
// document.getElementById('correctInRow').textContent = 'Correct in a Row: 0';
document.getElementById('answerBox').value = '';
currentWordIndex = -1;
correctAnswers = 0;
incorrectAnswers = 0;
correctInRow = 0;
synth.cancel();
}
// event listener for the Reset button
document.getElementById('resetBtn').addEventListener('click', resetQuiz);
