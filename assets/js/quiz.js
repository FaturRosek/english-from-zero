
(function (window, document) {
    'use strict';

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Normalisasi jawaban untuk perbandingan.
     */
    function normalizeAnswer(str) {
        return String(str || '').toLowerCase().trim().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');
    }

    var QuizEngine = {
        /**
         * Mulai sesi kuis.
         * @param {Object} quiz - Objek kuis dari data
         * @param {HTMLElement} container - Elemen wadah untuk render
         * @param {Function} onComplete - Callback saat kuis selesai (score, correctCount, totalCount)
         */
        start: function (quiz, container, onComplete) {
            var self = this;
            this._quiz = quiz;
            this._container = container;
            this._onComplete = onComplete;
            this._currentIndex = 0;
            this._userAnswers = [];
            this._correctCount = 0;

            this._renderQuestion();
        },

        _renderQuestion: function () {
            var self = this;
            var quiz = this._quiz;
            var idx = this._currentIndex;
            var q = quiz.questions[idx];
            var total = quiz.questions.length;

            if (!q) {
                this._showResults();
                return;
            }

            var html = '<div class="quiz-container">' +
                '<div class="quiz-header">' +
                    '<div class="quiz-progress-info">' +
                        '<span class="quiz-question-num">Soal ' + (idx + 1) + ' dari ' + total + '</span>' +
                        '<span class="quiz-score-info">Benar: ' + this._correctCount + '</span>' +
                    '</div>' +
                    '<div class="progress-bar-track quiz-progress-bar">' +
                        '<div class="progress-bar-fill" style="width:' + Math.round((idx / total) * 100) + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="quiz-question">' +
                    '<h3 class="quiz-question-text">' + escapeHtml(q.question) + '</h3>';

            // Render berdasarkan tipe soal
            if (q.type === 'multiple-choice') {
                html += '<div class="quiz-options" id="quiz-options">';
                for (var i = 0; i < q.options.length; i++) {
                    html += '<button type="button" class="quiz-option" data-index="' + i + '">' +
                        '<span class="quiz-option-letter">' + String.fromCharCode(65 + i) + '</span>' +
                        '<span class="quiz-option-text">' + escapeHtml(q.options[i]) + '</span>' +
                        '</button>';
                }
                html += '</div>';
            } else if (q.type === 'true-false') {
                html += '<div class="quiz-options quiz-options-tf" id="quiz-options">' +
                    '<button type="button" class="quiz-option" data-value="true">' +
                    '<span class="quiz-option-letter">A</span>' +
                    '<span class="quiz-option-text">True (Benar)</span>' +
                    '</button>' +
                    '<button type="button" class="quiz-option" data-value="false">' +
                    '<span class="quiz-option-letter">B</span>' +
                    '<span class="quiz-option-text">False (Salah)</span>' +
                    '</button>' +
                    '</div>';
            } else if (q.type === 'fill-blank') {
                html += '<div class="quiz-fill-wrap">' +
                    '<input type="text" id="quiz-fill-input" class="quiz-fill-input" ' +
                    'placeholder="Ketik jawaban Anda..." autocomplete="off" autocapitalize="off" />' +
                    '<button type="button" class="btn btn-primary" id="quiz-fill-submit">Periksa Jawaban</button>' +
                    '</div>';
                if (q.hint) {
                    html += '<p class="quiz-hint">Petunjuk: ' + escapeHtml(q.hint) + '</p>';
                }
            } else if (q.type === 'word-order') {
                // Tampilkan kata-kata yang harus disusun (dalam urutan acak)
                var shuffled = q.words.slice();
                // Acak urutan kata
                for (var j = shuffled.length - 1; j > 0; j--) {
                    var swapIdx = Math.floor(Math.random() * (j + 1));
                    var tmp = shuffled[j];
                    shuffled[j] = shuffled[swapIdx];
                    shuffled[swapIdx] = tmp;
                }
                html += '<div class="quiz-word-bank" id="quiz-word-bank">';
                for (var k = 0; k < shuffled.length; k++) {
                    html += '<button type="button" class="quiz-word-chip" data-word="' +
                        escapeHtml(shuffled[k]) + '">' + escapeHtml(shuffled[k]) + '</button>';
                }
                html += '</div>';
                html += '<div class="quiz-answer-area" id="quiz-answer-area">' +
                    '<p class="quiz-answer-placeholder">Klik kata untuk menyusun kalimat</p>' +
                    '</div>';
                html += '<button type="button" class="btn btn-primary" id="quiz-word-submit" disabled>Periksa Jawaban</button>';
                html += '<button type="button" class="btn btn-outline btn-sm" id="quiz-word-reset">Reset</button>';
            }

            html += '</div>'; // quiz-question
            html += '<div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>';
            html += '</div>'; // quiz-container

            this._container.innerHTML = html;
            this._bindQuestionEvents(q);
        },

        _bindQuestionEvents: function (q) {
            var self = this;

            if (q.type === 'multiple-choice') {
                var options = this._container.querySelectorAll('.quiz-option');
                options.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var chosenIndex = parseInt(btn.getAttribute('data-index'), 10);
                        self._checkMultipleChoice(q, chosenIndex, btn, options);
                    });
                });
            } else if (q.type === 'true-false') {
                var tfButtons = this._container.querySelectorAll('.quiz-option');
                tfButtons.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var val = btn.getAttribute('data-value') === 'true';
                        self._checkTrueFalse(q, val, btn, tfButtons);
                    });
                });
            } else if (q.type === 'fill-blank') {
                var input = this._container.querySelector('#quiz-fill-input');
                var submitBtn = this._container.querySelector('#quiz-fill-submit');
                var checkFn = function () {
                    var val = input.value;
                    self._checkFillBlank(q, val);
                };
                if (submitBtn) submitBtn.addEventListener('click', checkFn);
                if (input) {
                    input.focus();
                    input.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            checkFn();
                        }
                    });
                }
            } else if (q.type === 'word-order') {
                this._initWordOrder(q);
            }
        },

        _checkMultipleChoice: function (q, chosenIndex, clickedBtn, allBtns) {
            var isCorrect = chosenIndex === q.correctIndex;
            // Disable all buttons
            allBtns.forEach(function (btn) { btn.disabled = true; });

            // Highlight chosen
            clickedBtn.classList.add(isCorrect ? 'quiz-option-correct' : 'quiz-option-wrong');
            // Highlight correct answer if wrong
            if (!isCorrect) {
                var correctBtn = this._container.querySelector('.quiz-option[data-index="' + q.correctIndex + '"]');
                if (correctBtn) correctBtn.classList.add('quiz-option-correct');
            }

            this._showFeedback(q, isCorrect);
            this._recordAnswer(isCorrect);
        },

        _checkTrueFalse: function (q, chosenValue, clickedBtn, allBtns) {
            var isCorrect = chosenValue === q.answer;
            allBtns.forEach(function (btn) { btn.disabled = true; });

            clickedBtn.classList.add(isCorrect ? 'quiz-option-correct' : 'quiz-option-wrong');
            if (!isCorrect) {
                var correctVal = q.answer ? 'true' : 'false';
                var correctBtn = this._container.querySelector('.quiz-option[data-value="' + correctVal + '"]');
                if (correctBtn) correctBtn.classList.add('quiz-option-correct');
            }

            this._showFeedback(q, isCorrect);
            this._recordAnswer(isCorrect);
        },

        _checkFillBlank: function (q, userInput) {
            var normalizedInput = normalizeAnswer(userInput);
            var acceptable = [q.answer];
            if (q.acceptableAnswers && q.acceptableAnswers.length) {
                acceptable = acceptable.concat(q.acceptableAnswers);
            }
            var isCorrect = false;
            for (var i = 0; i < acceptable.length; i++) {
                if (normalizeAnswer(acceptable[i]) === normalizedInput) {
                    isCorrect = true;
                    break;
                }
            }

            var input = this._container.querySelector('#quiz-fill-input');
            var submitBtn = this._container.querySelector('#quiz-fill-submit');
            if (input) input.disabled = true;
            if (submitBtn) submitBtn.disabled = true;

            if (input) {
                input.classList.add(isCorrect ? 'quiz-input-correct' : 'quiz-input-wrong');
            }

            this._showFeedback(q, isCorrect, userInput);
            this._recordAnswer(isCorrect);
        },

        _initWordOrder: function (q) {
            var self = this;
            var bank = this._container.querySelector('#quiz-word-bank');
            var answerArea = this._container.querySelector('#quiz-answer-area');
            var submitBtn = this._container.querySelector('#quiz-word-submit');
            var resetBtn = this._container.querySelector('#quiz-word-reset');
            var selectedWords = [];

            var chips = bank.querySelectorAll('.quiz-word-chip');
            chips.forEach(function (chip) {
                chip.addEventListener('click', function () {
                    if (chip.classList.contains('quiz-word-used')) return;
                    var word = chip.getAttribute('data-word');
                    selectedWords.push(word);
                    chip.classList.add('quiz-word-used');
                    chip.disabled = true;
                    self._renderWordOrderAnswer(answerArea, selectedWords);
                    if (selectedWords.length === q.words.length) {
                        if (submitBtn) submitBtn.disabled = false;
                    }
                });
            });

            // Click on answer area to remove last word
            answerArea.addEventListener('click', function (e) {
                if (e.target.classList.contains('quiz-answer-chip')) {
                    var idx = parseInt(e.target.getAttribute('data-idx'), 10);
                    var word = selectedWords[idx];
                    selectedWords.splice(idx, 1);
                    // Re-enable the chip
                    var chip = bank.querySelector('.quiz-word-chip[data-word="' + word + '"].quiz-word-used');
                    if (chip) {
                        chip.classList.remove('quiz-word-used');
                        chip.disabled = false;
                    }
                    self._renderWordOrderAnswer(answerArea, selectedWords);
                    if (submitBtn) submitBtn.disabled = selectedWords.length !== q.words.length;
                }
            });

            if (resetBtn) {
                resetBtn.addEventListener('click', function () {
                    selectedWords = [];
                    chips.forEach(function (chip) {
                        chip.classList.remove('quiz-word-used');
                        chip.disabled = false;
                    });
                    answerArea.innerHTML = '<p class="quiz-answer-placeholder">Klik kata untuk menyusun kalimat</p>';
                    if (submitBtn) submitBtn.disabled = true;
                });
            }

            if (submitBtn) {
                submitBtn.addEventListener('click', function () {
                    var isCorrect = selectedWords.length === q.correctOrder.length;
                    if (isCorrect) {
                        for (var i = 0; i < selectedWords.length; i++) {
                            if (normalizeAnswer(selectedWords[i]) !== normalizeAnswer(q.correctOrder[i])) {
                                isCorrect = false;
                                break;
                            }
                        }
                    }
                    submitBtn.disabled = true;
                    if (resetBtn) resetBtn.disabled = true;
                    self._showFeedback(q, isCorrect, selectedWords.join(' '));
                    self._recordAnswer(isCorrect);
                });
            }
        },

        _renderWordOrderAnswer: function (answerArea, words) {
            if (!words.length) {
                answerArea.innerHTML = '<p class="quiz-answer-placeholder">Klik kata untuk menyusun kalimat</p>';
                return;
            }
            var html = '';
            for (var i = 0; i < words.length; i++) {
                html += '<span class="quiz-answer-chip" data-idx="' + i + '" role="button" tabindex="0">' +
                    escapeHtml(words[i]) + ' <span class="quiz-chip-x">&#10005;</span></span>';
            }
            answerArea.innerHTML = html;
        },

        _showFeedback: function (q, isCorrect, userInput) {
            var feedback = this._container.querySelector('#quiz-feedback');
            if (!feedback) return;

            var html = '<div class="quiz-feedback-' + (isCorrect ? 'correct' : 'wrong') + '">' +
                '<div class="quiz-feedback-icon">' + (isCorrect ? '&#10004; Benar!' : '&#10006; Belum tepat') + '</div>';

            if (q.type === 'fill-blank' && !isCorrect && userInput) {
                html += '<p class="quiz-feedback-detail">Jawaban Anda: "' + escapeHtml(userInput) + '"</p>';
            }
            if (q.type === 'word-order' && !isCorrect && userInput) {
                html += '<p class="quiz-feedback-detail">Susunan Anda: "' + escapeHtml(userInput) + '"</p>';
            }
            if (q.type === 'multiple-choice' && !isCorrect) {
                html += '<p class="quiz-feedback-detail">Jawaban benar: ' + escapeHtml(q.options[q.correctIndex]) + '</p>';
            }
            if (q.type === 'true-false' && !isCorrect) {
                html += '<p class="quiz-feedback-detail">Jawaban benar: ' + (q.answer ? 'True (Benar)' : 'False (Salah)') + '</p>';
            }
            if (q.type === 'fill-blank' || q.type === 'word-order') {
                var correctAns = q.answer || (q.correctOrder ? q.correctOrder.join(' ') : '');
                html += '<p class="quiz-feedback-detail">Jawaban benar: <strong>' + escapeHtml(correctAns) + '</strong></p>';
            }

            html += '<p class="quiz-feedback-explanation">' + escapeHtml(q.explanation) + '</p>';
            html += '<button type="button" class="btn btn-primary" id="quiz-next-btn">' +
                (this._currentIndex + 1 < this._quiz.questions.length ? 'Soal Berikutnya &#8250;' : 'Lihat Hasil &#8250;') +
                '</button>';
            html += '</div>';

            feedback.innerHTML = html;
            feedback.style.display = 'block';

            // Scroll to feedback
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            var nextBtn = this._container.querySelector('#quiz-next-btn');
            var self = this;
            if (nextBtn) {
                nextBtn.addEventListener('click', function () {
                    self._currentIndex++;
                    self._renderQuestion();
                });
            }
        },

        _recordAnswer: function (isCorrect) {
            if (isCorrect) this._correctCount++;
            this._userAnswers.push({ correct: isCorrect });
        },

        _showResults: function () {
            var quiz = this._quiz;
            var total = quiz.questions.length;
            var correct = this._correctCount;
            var score = Math.round((correct / total) * 100);
            var passed = score >= quiz.passingScore;
            var mastered = score >= 90;

            var statusClass = 'quiz-result-score-warn';
            var statusText = 'Perlu Latihan';
            var statusColor = 'warning';

            if (score >= 90) {
                statusClass = 'quiz-result-score-excellent';
                statusText = 'Excellent!';
                statusColor = 'success';
            } else if (score >= 80) {
                statusClass = 'quiz-result-score-passed';
                statusText = 'Lulus!';
                statusColor = 'success';
            } else if (score >= 60) {
                statusText = 'Perlu Latihan';
                statusColor = 'warning';
            } else {
                statusText = 'Belum Lulus';
                statusColor = 'danger';
            }

            // Record attempt
            var attempt = window.EFZProgress.recordQuizAttempt(
                quiz.lessonId, quiz.id, score, correct, total
            );

            var html = '<div class="quiz-result">' +
                '<div class="quiz-result-icon">' +
                    (passed ? '&#127881;' : '&#128226;') +
                '</div>' +
                '<h2 class="quiz-result-title">' + statusText + '</h2>' +
                '<div class="quiz-result-score ' + statusClass + '">' +
                    score + '%' +
                '</div>' +
                '<p class="quiz-result-detail">' +
                    'Jawaban benar: ' + correct + ' dari ' + total + ' soal' +
                '</p>';

            // Pass/fail message
            if (score >= 90) {
                html += '<div class="alert alert-success">Anda mendapat skor Excellent (90+)! Pelajaran ini ditandai sebagai <strong>dikuasai (mastery)</strong>.</div>';
            } else if (score >= 80) {
                html += '<div class="alert alert-success">Selamat! Anda lulus kuis ini (skor &ge; 80%). Pelajaran ditandai sebagai <strong>selesai</strong>.</div>';
            } else if (score >= 60) {
                html += '<div class="alert alert-warning">Skor Anda mendekati batas lulus (80%). Coba ulangi untuk meningkatkan skor. Tinjau kembali materi pelajaran.</div>';
            } else {
                html += '<div class="alert alert-error">Skor belum mencapai batas lulus (80%). Silakan pelajari ulang materi pelajaran, lalu coba kuis lagi.</div>';
            }

            // Assessment table
            html += '<div class="quiz-result-breakdown">' +
                '<h3 class="quiz-breakdown-title">Rincian Penilaian</h3>' +
                '<table class="quiz-breakdown-table">' +
                '<thead><tr><th>Skor</th><th>Status</th><th>Tindakan</th></tr></thead>' +
                '<tbody>' +
                '<tr><td>90-100</td><td>Excellent</td><td>Dikuasai (Mastery)</td></tr>' +
                '<tr><td>80-89</td><td>Lulus</td><td>Buka pelajaran berikutnya</td></tr>' +
                '<tr class="quiz-breakdown-row-active-' + statusColor + '"><td>60-79</td><td>Perlu Latihan</td><td>Disarankan ulangi/tinjau</td></tr>' +
                '<tr><td>0-59</td><td>Belum Lulus</td><td>Pelajari ulang materi</td></tr>' +
                '</tbody></table>' +
                '</div>';

            // Action buttons
            html += '<div class="btn-group quiz-result-actions">';
            // Retry button
            html += '<button type="button" class="btn btn-outline" id="quiz-retry-btn">Ulangi Kuis</button>';
            // Back to lesson
            html += '<button type="button" class="btn btn-primary" id="quiz-back-lesson-btn">Kembali ke Pelajaran</button>';
            // Next lesson if passed
            var nextLesson = window.EFZProgress.getNextLesson();
            if (passed && nextLesson && nextLesson.id !== quiz.lessonId) {
                html += '<button type="button" class="btn btn-primary" id="quiz-next-lesson-btn" data-lesson-id="' +
                    escapeHtml(nextLesson.id) + '">Pelajaran Berikutnya &#8250;</button>';
            }
            html += '</div>';
            html += '</div>';

            this._container.innerHTML = html;

            // Bind action buttons
            var self = this;
            var retryBtn = this._container.querySelector('#quiz-retry-btn');
            var backBtn = this._container.querySelector('#quiz-back-lesson-btn');
            var nextLessonBtn = this._container.querySelector('#quiz-next-lesson-btn');

            if (retryBtn) {
                retryBtn.addEventListener('click', function () {
                    self.start(quiz, self._container, self._onComplete);
                });
            }
            if (backBtn) {
                backBtn.addEventListener('click', function () {
                    window.EFZNavigation.navigateTo('lesson/' + quiz.lessonId);
                });
            }
            if (nextLessonBtn) {
                nextLessonBtn.addEventListener('click', function () {
                    var lessonId = nextLessonBtn.getAttribute('data-lesson-id');
                    window.EFZNavigation.navigateTo('lesson/' + lessonId);
                });
            }

            // Callback
            if (this._onComplete) {
                this._onComplete(score, correct, total);
            }

            // Scroll to top
            this._container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.EFZQuiz = QuizEngine;
})(window, document);
