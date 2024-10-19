document.addEventListener('DOMContentLoaded', () => {
    fetch('https://my-first-project-mb6t.onrender.com/quiz')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        
        .then(data => {
            console.log('Fetched data:', data);

            if (!data || !Array.isArray(data)) {
                console.error('Data format is incorrect:', data);
                document.getElementById('quiz-container').innerHTML = '<p>Error: No valid quiz data found.</p>';
                return;
            }

            const quizContainer = document.getElementById('quiz-container');
            const categorySelect = document.getElementById('category');
            let filteredQuestions = [];
            let currentQuestionIndex = 0;

            const loadQuestions = (category) => {
                filteredQuestions = category === 'all' ? data : data.filter(q => q.category.trim() === category.trim());
                currentQuestionIndex = 0;
                displayQuestion();
            };

            const displayQuestion = () => {
                if (filteredQuestions.length > 0) {
                    const question = filteredQuestions[currentQuestionIndex];
                    quizContainer.innerHTML = `
                        <div class="question">
                            <p>${currentQuestionIndex + 1}. ${question.question}</p>
                            <input type="text" id="answer-input" placeholder="Your answer here">
                        </div>
                    `;
                    document.getElementById('result').innerHTML = '';
                } else {
                    quizContainer.innerHTML = '<p>No questions available.</p>';
                }
            };

            loadQuestions('all');

            categorySelect.addEventListener('change', () => {
                loadQuestions(categorySelect.value);
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                if (currentQuestionIndex < filteredQuestions.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion();
                } else {
                    alert('No more questions!');
                }
            });

            document.getElementById('submit-btn').addEventListener('click', () => {
                const userAnswer = document.getElementById('answer-input').value.trim();
                if (!filteredQuestions.length) {
                    alert('No questions to answer.');
                    return;
                }
                const correctAnswer = filteredQuestions[currentQuestionIndex].answer.trim();
                const result = userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? 'Correct!' : `Incorrect! The correct answer is: ${correctAnswer}`;
                document.getElementById('result').innerHTML = result;
            });

            // Update question functionality
            document.getElementById('update-btn').addEventListener('click', () => {
                const newQuestion = prompt('Enter the new question:', filteredQuestions[currentQuestionIndex].question);
                const newAnswer = prompt('Enter the new answer:', filteredQuestions[currentQuestionIndex].answer);
                const newCategory = prompt('Enter the new category:', filteredQuestions[currentQuestionIndex].category);

                if (newQuestion && newAnswer && newCategory) {
                    filteredQuestions[currentQuestionIndex].question = newQuestion;
                    filteredQuestions[currentQuestionIndex].answer = newAnswer;
                    filteredQuestions[currentQuestionIndex].category = newCategory;
                    alert('Question updated successfully!');
                    displayQuestion();
                }
            });

            // Delete question functionality
            document.getElementById('delete-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this question?')) {
                    filteredQuestions.splice(currentQuestionIndex, 1);
                    if (filteredQuestions.length === 0) {
                        quizContainer.innerHTML = '<p>No questions available.</p>';
                        document.getElementById('result').innerHTML = '';
                    } else {
                        currentQuestionIndex = Math.max(currentQuestionIndex - 1, 0);
                        displayQuestion();
                    }
                    alert('Question deleted successfully!');
                }
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById('quiz-container').innerHTML = '<p>Error loading questions. Please try again later.</p>';
        });
});
