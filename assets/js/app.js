
(function (window, document) {
  "use strict";

  

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeAnswer(str) {
    return String(str || "")
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ");
  }

  function detectBrowserCapabilities() {
    var hasLocalStorage = window.EFZStorage
      ? window.EFZStorage.isPersistentAvailable()
      : false;
    var hasSpeechSynthesis =
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    var hasSpeechRecognition =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    var isFileProtocol = window.location.protocol === "file:";
    var isOnline = window.navigator.onLine;
    return {
      localStorage: hasLocalStorage,
      speechSynthesis: hasSpeechSynthesis,
      speechRecognition: hasSpeechRecognition,
      fileProtocol: isFileProtocol,
      online: isOnline,
    };
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return "";
    var now = new Date().getTime();
    var then = new Date(isoString).getTime();
    var diff = Math.floor((now - then) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
    if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
    if (diff < 604800) return Math.floor(diff / 86400) + " hari lalu";
    return new Date(isoString).toLocaleDateString("id-ID");
  }

  function updateChromeIndicators() {
    var state = window.EFZStorage.getState();
    var caps = detectBrowserCapabilities();

    var nameEl = document.getElementById("sidebar-learner-name");
    var levelEl = document.getElementById("sidebar-level-badge");
    if (nameEl) nameEl.textContent = state.profile.displayName || "Pembelajar";
    if (levelEl)
      levelEl.textContent = "Level " + (state.profile.currentLevel || "A0");

    var dotEl = document.getElementById("storage-status-dot");
    var textEl = document.getElementById("storage-status-text");
    if (dotEl && textEl) {
      if (caps.localStorage) {
        dotEl.className = "status-dot status-ok";
        textEl.textContent =
          "LocalStorage Aktif (v" + state.schemaVersion + ")";
      } else {
        dotEl.className = "status-dot status-warn";
        textEl.textContent = "Mode Memori Sesi (v" + state.schemaVersion + ")";
      }
    }

    var connBadge = document.getElementById("connection-badge");
    if (connBadge) {
      if (caps.online) {
        connBadge.className = "connection-badge online";
        connBadge.textContent = "Online (Siap API AI)";
      } else {
        connBadge.className = "connection-badge offline";
        connBadge.textContent = "Offline (Mode Lokal)";
      }
    }
  }

  /* ════════════════════════════════════════════════════════════════
       DASHBOARD
       ════════════════════════════════════════════════════════════════ */

  function renderDashboard(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var state = window.EFZStorage.getState();
    var caps = detectBrowserCapabilities();

    var completedCount = prog.getCompletedLessonsCount();
    var masteredCount = prog.getMasteredLessonsCount();
    var totalLessons = prog.getTotalLessonsCount();
    var vocabCount = prog.getLearnedVocabularyCount();
    var totalVocab = (window.EFZ_DATA_VOCABULARY_A0 || []).length;
    var overallProgress = prog.getOverallProgress();
    var nextLesson = prog.getNextLesson();
    var activities = prog.getRecentActivities(5);
    // Use SRS-aware count
    prog.initSRSForExistingVocab();
    var srsStats = prog.getSRSStats();
    var vocabReviewDue = srsStats.dueNow;
    var recommendations = prog.getRecommendations();

    // Hero greeting
    var greeting =
      ui.getTimeGreeting() + ", " + escapeHtml(state.profile.displayName) + "!";

    var html =
      '<div class="dashboard-hero">' +
      '<div class="dashboard-hero-text">' +
      "<h2>" +
      greeting +
      "</h2>" +
      "<p>Teruslah belajar sedikit demi sedikit. Setiap langkah penting!</p>" +
      "</div>" +
      '<span class="dashboard-hero-badge">Level ' +
      escapeHtml(state.profile.currentLevel) +
      "</span>" +
      "</div>";

    // Stats
    html +=
      '<section class="grid-stats" aria-label="Statistik Belajar">' +
      ui.statCard(
        "Level Saat Ini",
        state.profile.currentLevel,
        "Pemula dari nol",
        "&#127891;",
      ) +
      ui.statCard(
        "Pelajaran Selesai",
        completedCount + "/" + totalLessons,
        "Dikuasai: " + masteredCount,
        "&#9989;",
      ) +
      ui.statCard(
        "Kosakata Dipelajari",
        vocabCount + "/" + totalVocab,
        "Target fleksibel ~10/sesi",
        "&#128221;",
      ) +
      ui.statCard(
        "Progres Keseluruhan",
        overallProgress + "%",
        "Berdasarkan pelajaran selesai",
        "&#128200;",
      ) +
      "</section>";

    // Continue Learning + Next Lesson
    html += '<div class="grid-two-col">';
    html +=
      '<section class="card dashboard-continue-card">' +
      '<div class="card-header">' +
      "<div>" +
      '<h2 class="card-title">Lanjutkan Belajar</h2>' +
      '<p class="card-subtitle">Pelajaran yang bisa Anda pelajari berikutnya</p>' +
      "</div>";
    if (nextLesson) {
      html += ui.badge("Terbuka", "info");
    }
    html += "</div>";

    if (nextLesson) {
      html +=
        '<div class="lesson-item" data-lesson-id="' +
        escapeHtml(nextLesson.id) +
        '" role="button" tabindex="0">' +
        '<div class="lesson-item-icon"><span class="lesson-number">' +
        nextLesson.order +
        "</span></div>" +
        '<div class="lesson-item-body">' +
        '<div class="lesson-item-title">' +
        escapeHtml(nextLesson.title) +
        "</div>" +
        '<div class="lesson-item-subtitle">' +
        escapeHtml(nextLesson.titleId) +
        "</div>" +
        "</div>" +
        '<span class="lesson-item-arrow">&#8250;</span>' +
        "</div>";
      html +=
        '<div class="btn-group">' +
        ui.button("Mulai Pelajaran", "primary", {
          lessonId: nextLesson.id,
          action: "open-lesson",
        }) +
        ui.button("Lihat Learning Path", "outline", {
          routeTarget: "learning-path",
        }) +
        "</div>";
    } else {
      html += ui.emptyState(
        "Semua Pelajaran Selesai!",
        "Anda telah menyelesaikan semua pelajaran A0 yang tersedia. Kerja bagus!",
        "Buka Vocabulary",
        "vocabulary",
      );
    }
    html += "</section>";

    // Quick Actions
    html +=
      '<section class="card">' +
      '<div class="card-header"><div><h2 class="card-title">Akses Cepat</h2>' +
      '<p class="card-subtitle">Pintasan ke modul utama</p></div></div>' +
      '<div class="dashboard-quick-actions">' +
      ui.button("AI Conversation", "secondary", {
        routeTarget: "ai-conversation",
      }) +
      ui.button("Speaking Practice", "secondary", {
        routeTarget: "speaking-practice",
      }) +
      ui.button("Flashcards", "secondary", {
        routeTarget: "vocab-flashcards",
      }) +
      ui.button("Tata Bahasa", "outline", { routeTarget: "grammar" }) +
      ui.button("Pengaturan", "outline", { routeTarget: "settings" }) +
      "</div>";

    // Recent activity
    if (activities.length) {
      html +=
        '<div style="margin-top:1.25rem;">' +
        '<h3 class="card-title" style="font-size:0.95rem; margin-bottom:0.5rem;">Aktivitas Terbaru</h3>' +
        '<div class="dashboard-activity-list">';
      activities.forEach(function (act) {
        html +=
          '<div class="activity-item">' +
          '<span class="activity-dot"></span>' +
          '<span class="activity-text">' +
          escapeHtml(act.title) +
          "</span>" +
          '<span class="activity-time">' +
          formatTimeAgo(act.timestamp) +
          "</span>" +
          "</div>";
      });
      html += "</div></div>";
    }
    html += "</section>";
    html += "</div>"; // grid-two-col

    // Diagnostics + Progress detail
    html += '<div class="grid-two-col">';
    html +=
      '<section class="card">' +
      '<div class="card-header"><div>' +
      '<h2 class="card-title">Progres Detail</h2>' +
      '<p class="card-subtitle">Rincian pencapaian belajar Anda</p>' +
      "</div></div>" +
      ui.progressBar(
        totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
        "Pelajaran Selesai (" + completedCount + "/" + totalLessons + ")",
      ) +
      ui.progressBar(
        totalLessons > 0 ? (masteredCount / totalLessons) * 100 : 0,
        "Pelajaran Dikuasai (" + masteredCount + "/" + totalLessons + ")",
      ) +
      ui.progressBar(
        totalVocab > 0 ? (vocabCount / totalVocab) * 100 : 0,
        "Kosakata Dipelajari (" + vocabCount + "/" + totalVocab + ")",
      );
    if (vocabReviewDue > 0) {
      html +=
        '<div class="alert alert-warning" style="margin-top:0.75rem;">' +
        "<strong>" +
        vocabReviewDue +
        " kata</strong> siap untuk diulas (Spaced Repetition). " +
        '<button type="button" class="btn btn-sm btn-primary" style="margin-left:0.5rem;" data-route-target="vocab-review">Review Sekarang</button>' +
        "</div>";
    } else if (srsStats.totalLearned > 0) {
      html +=
        '<div class="alert alert-success" style="margin-top:0.75rem;">Semua kosakata sudah direview hari ini. \uD83C\uDF89</div>';
    }
    html += "</section>";

    // Recommendations section
    if (recommendations.length > 0) {
      html += '<section class="card" style="margin-top:1.25rem;">';
      html +=
        '<div class="card-header"><div><h2 class="card-title">\uD83C\uDFAF Rekomendasi Hari Ini</h2>' +
        '<p class="card-subtitle">Berdasarkan progres belajar Anda</p></div></div>';
      html += '<div class="rec-list">';
      recommendations.slice(0, 3).forEach(function (rec) {
        var routeTarget = rec.actionParam
          ? rec.action + "/" + rec.actionParam
          : rec.action;
        html +=
          '<div class="rec-item">' +
          '<span class="rec-icon">' +
          rec.icon +
          "</span>" +
          '<div class="rec-body">' +
          '<div class="rec-title">' +
          escapeHtml(rec.title) +
          "</div>" +
          '<div class="rec-desc">' +
          escapeHtml(rec.description) +
          "</div>" +
          "</div>" +
          '<button type="button" class="btn btn-sm btn-primary" data-route-target="' +
          escapeHtml(routeTarget) +
          '">Mulai</button>' +
          "</div>";
      });
      html += "</div></section>";
    }

    // Browser diagnostics
    html +=
      '<section class="card">' +
      '<div class="card-header"><div>' +
      '<h2 class="card-title">Diagnostik Browser</h2>' +
      '<p class="card-subtitle">Pemeriksaan kapabilitas perangkat</p>' +
      "</div></div>" +
      '<ul class="diag-list">' +
      '<li class="diag-item"><span class="diag-name">LocalStorage</span>' +
      ui.badge(
        caps.localStorage ? "Tersedia" : "Terbatas",
        caps.localStorage ? "success" : "warning",
      ) +
      "</li>" +
      '<li class="diag-item"><span class="diag-name">Text-to-Speech</span>' +
      ui.badge(
        caps.speechSynthesis ? "Didukung" : "Tidak Ada",
        caps.speechSynthesis ? "success" : "warning",
      ) +
      "</li>" +
      '<li class="diag-item"><span class="diag-name">Speech-to-Text</span>' +
      ui.badge(
        caps.speechRecognition ? "Didukung" : "Fallback Teks",
        caps.speechRecognition ? "success" : "warning",
      ) +
      "</li>" +
      '<li class="diag-item"><span class="diag-name">Mode Buka</span>' +
      ui.badge(escapeHtml(window.location.protocol), "info") +
      "</li>" +
      "</ul>" +
      "</section>";
    html += "</div>";

    container.innerHTML = html;
  }

  /* ════════════════════════════════════════════════════════════════
       LEARNING PATH
       ════════════════════════════════════════════════════════════════ */

  function renderLearningPath(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var levels = window.EFZ_DATA_LEVELS || [];
    var allLessons = window.EFZ_DATA_LESSONS_A0 || [];

    var html = ui.progressBar(
      prog.getOverallProgress(),
      "Progres Level A0 (" +
        prog.getCompletedLessonsCount() +
        "/" +
        prog.getTotalLessonsCount() +
        " pelajaran)",
    );

    levels.forEach(function (level) {
      var isCurrentLevel =
        level.id === window.EFZStorage.getState().profile.currentLevel;

      if (level.locked || level.units.length === 0) {
        html +=
          '<div class="level-section">' +
          '<div class="level-header">' +
          '<div class="level-header-info">' +
          "<h2>" +
          escapeHtml(level.fullName) +
          "</h2>" +
          "<p>" +
          escapeHtml(level.description) +
          "</p>" +
          "</div>" +
          '<div class="level-header-badge">' +
          ui.badge("Akan Datang", "info") +
          "</div>" +
          "</div>" +
          '<div class="alert alert-info">Kurikulum Level ' +
          escapeHtml(level.id) +
          " akan tersedia setelah Level A0 selesai. Fokuskan dulu pada A0!</div>" +
          "</div>";
        return;
      }

      html += '<div class="level-section">';
      html +=
        '<div class="level-header">' +
        '<div class="level-header-info">' +
        "<h2>" +
        escapeHtml(level.fullName) +
        "</h2>" +
        "<p>" +
        escapeHtml(level.outcome || level.description) +
        "</p>" +
        "</div>" +
        '<div class="level-header-badge">' +
        (isCurrentLevel ? ui.badge("Level Aktif", "success") : "") +
        "</div>" +
        "</div>";

      level.units.forEach(function (unit, unitIdx) {
        html += '<div class="unit-card">';
        html +=
          '<div class="unit-header">' +
          '<div class="unit-header-left">' +
          '<div class="unit-number">' +
          (unitIdx + 1) +
          "</div>" +
          "<div>" +
          '<div class="unit-title">' +
          escapeHtml(unit.title) +
          "</div>" +
          '<div class="unit-subtitle">' +
          escapeHtml(unit.titleId) +
          " &mdash; " +
          escapeHtml(unit.description) +
          "</div>" +
          "</div>" +
          "</div>" +
          '<div class="unit-header-right">' +
          ui.badge(unit.lessonIds.length + " pelajaran", "info") +
          "</div>" +
          "</div>";

        html += '<div class="unit-lessons">';
        unit.lessonIds.forEach(function (lessonId) {
          var lesson = null;
          for (var i = 0; i < allLessons.length; i++) {
            if (allLessons[i].id === lessonId) {
              lesson = allLessons[i];
              break;
            }
          }
          if (!lesson) return;
          var status = prog.getLessonStatus(lessonId);
          html += ui.lessonItem(lesson, status);
        });
        html += "</div>";
        html += "</div>";
      });

      html += "</div>";
    });

    container.innerHTML = html;
  }

  /* ════════════════════════════════════════════════════════════════
       LESSON DETAIL
       ════════════════════════════════════════════════════════════════ */

  function renderLessonDetail(container, params) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var lessonId = params && params.length > 0 ? params[0] : "";
    var lesson = prog.findLessonById(lessonId);

    if (!lesson) {
      container.innerHTML = ui.emptyState(
        "Pelajaran Tidak Ditemukan",
        "Pelajaran yang Anda cari tidak tersedia atau ID tidak valid.",
        "Kembali ke Learning Path",
        "learning-path",
      );
      return;
    }

    var status = prog.getLessonStatus(lessonId);
    if (!status.unlocked) {
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="learning-path">&#8249; Kembali ke Learning Path</button>' +
        ui.emptyState(
          "Pelajaran Terkunci",
          "Selesaikan pelajaran prasyarat terlebih dahulu untuk membuka pelajaran ini.",
          "Kembali ke Learning Path",
          "learning-path",
        );
      return;
    }

    var allLessons = window.EFZ_DATA_LESSONS_A0 || [];
    var lessonIdx = -1;
    for (var i = 0; i < allLessons.length; i++) {
      if (allLessons[i].id === lessonId) {
        lessonIdx = i;
        break;
      }
    }
    var prevLesson = lessonIdx > 0 ? allLessons[lessonIdx - 1] : null;
    var nextLesson =
      lessonIdx < allLessons.length - 1 ? allLessons[lessonIdx + 1] : null;

    var html =
      '<button type="button" class="back-btn" data-route-target="learning-path">&#8249; Kembali ke Learning Path</button>';

    // Header
    html +=
      '<div class="lesson-detail-header">' +
      '<div class="lesson-detail-title">' +
      escapeHtml(lesson.title) +
      "</div>" +
      '<div class="lesson-detail-subtitle">' +
      escapeHtml(lesson.titleId) +
      "</div>";
    var badges = "";
    if (status.mastered) badges += ui.badge("Dikuasai", "success") + " ";
    else if (status.completed) badges += ui.badge("Selesai", "success") + " ";
    if (status.score !== null && status.score !== undefined)
      badges += ui.badge(
        "Skor Kuis: " + status.score + "%",
        status.score >= 80 ? "success" : "warning",
      );
    if (badges) html += '<div style="margin-top:0.5rem;">' + badges + "</div>";
    html += "</div>";

    // Objectives
    if (lesson.objectives && lesson.objectives.length) {
      html +=
        '<div class="lesson-objectives">' +
        '<div class="lesson-objectives-title">Tujuan Belajar</div>' +
        "<ul>";
      lesson.objectives.forEach(function (obj) {
        html += "<li>" + escapeHtml(obj) + "</li>";
      });
      html += "</ul></div>";
    }

    // Content sections
    if (lesson.sections) {
      lesson.sections.forEach(function (section) {
        html += '<div class="lesson-section">';
        html +=
          '<h3 class="lesson-section-title">' +
          escapeHtml(section.title) +
          "</h3>";

        if (section.type === "explanation") {
          html +=
            '<div class="lesson-content-text">' +
            escapeHtml(section.content) +
            "</div>";
        } else if (section.type === "examples") {
          html += '<div class="lesson-examples">';
          section.items.forEach(function (item) {
            html += ui.exampleRow(item, true);
          });
          html += "</div>";
        } else if (section.type === "tips") {
          html +=
            '<div class="lesson-tips"><div class="lesson-content-text">' +
            escapeHtml(section.content) +
            "</div></div>";
        }
        html += "</div>";
      });
    }

    // Practice
    if (lesson.practice && lesson.practice.length) {
      html += '<div class="lesson-practice">';
      html += '<h3 class="lesson-section-title">Latihan Terbimbing</h3>';
      lesson.practice.forEach(function (p, idx) {
        html +=
          '<div class="practice-item" data-practice-idx="' +
          idx +
          '">' +
          '<div class="practice-prompt">' +
          escapeHtml(p.prompt) +
          "</div>";
        if (p.hint)
          html +=
            '<div class="practice-hint">Petunjuk: ' +
            escapeHtml(p.hint) +
            "</div>";
        html +=
          '<div class="practice-input-row">' +
          '<input type="text" class="practice-input" placeholder="Ketik jawaban..." autocomplete="off" />' +
          '<button type="button" class="btn btn-sm btn-primary" data-action="check-practice">Periksa</button>' +
          "</div>" +
          '<div class="practice-feedback" style="display:none;"></div>' +
          "</div>";
      });
      html += "</div>";
    }

    // Summary
    if (lesson.summary) {
      html +=
        '<div class="lesson-summary">' +
        '<div class="lesson-summary-title">Ringkasan</div>' +
        '<div class="lesson-summary-text">' +
        escapeHtml(lesson.summary) +
        "</div>" +
        "</div>";
    }

    // Actions
    html += '<div class="lesson-actions">';
    html += ui.button("Mulai Kuis", "primary", {
      lessonId: lessonId,
      action: "start-quiz",
    });
    if (prevLesson) {
      html += ui.button("&#8249; Sebelumnya", "outline", {
        lessonId: prevLesson.id,
        action: "open-lesson",
      });
    }
    if (nextLesson) {
      var nextStatus = prog.getLessonStatus(nextLesson.id);
      if (nextStatus.unlocked) {
        html += ui.button("Berikutnya &#8250;", "outline", {
          lessonId: nextLesson.id,
          action: "open-lesson",
        });
      }
    }
    html += "</div>";

    container.innerHTML = html;
  }

  function bindLessonEvents(container) {
    // Practice check buttons
    container
      .querySelectorAll('[data-action="check-practice"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var item = btn.closest(".practice-item");
          var idx = parseInt(item.getAttribute("data-practice-idx"), 10);
          var lessonId = window.EFZNavigation.getCurrentParams()[0];
          var lesson = window.EFZProgress.findLessonById(lessonId);
          if (!lesson || !lesson.practice || !lesson.practice[idx]) return;

          var input = item.querySelector(".practice-input");
          var feedback = item.querySelector(".practice-feedback");
          var userAnswer = input.value;
          var correctAnswer = lesson.practice[idx].answer;
          var acceptable = [correctAnswer];
          if (lesson.practice[idx].acceptableAnswers) {
            acceptable = acceptable.concat(
              lesson.practice[idx].acceptableAnswers,
            );
          }

          var isCorrect = false;
          for (var i = 0; i < acceptable.length; i++) {
            if (
              normalizeAnswer(acceptable[i]) === normalizeAnswer(userAnswer)
            ) {
              isCorrect = true;
              break;
            }
          }

          feedback.style.display = "block";
          if (isCorrect) {
            feedback.className = "practice-feedback correct";
            feedback.innerHTML = "&#10004; Benar! Bagus sekali.";
          } else {
            feedback.className = "practice-feedback wrong";
            feedback.innerHTML =
              '&#10006; Jawaban: "' +
              escapeHtml(userAnswer) +
              '". Yang benar: <strong>' +
              escapeHtml(correctAnswer) +
              "</strong>";
          }
          input.disabled = true;
          btn.disabled = true;
        });
      });

    // Lesson navigation
    container
      .querySelectorAll('[data-action="open-lesson"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-lesson-id");
          window.EFZNavigation.navigateTo("lesson/" + id);
        });
      });

    // Start quiz
    container
      .querySelectorAll('[data-action="start-quiz"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-lesson-id");
          window.EFZNavigation.navigateTo("quiz/" + id);
        });
      });
  }

  /* ════════════════════════════════════════════════════════════════
       QUIZ
       ════════════════════════════════════════════════════════════════ */

  function renderQuiz(container, params) {
    var ui = window.EFZUI;
    var lessonId = params && params.length > 0 ? params[0] : "";
    var lesson = window.EFZProgress.findLessonById(lessonId);

    if (!lesson) {
      container.innerHTML = ui.emptyState(
        "Pelajaran Tidak Ditemukan",
        "Tidak dapat memulai kuis karena pelajaran tidak ditemukan.",
        "Kembali ke Learning Path",
        "learning-path",
      );
      return;
    }

    var quiz = window.EFZProgress.findQuizByLessonId(lessonId);
    if (!quiz) {
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="learning-path">&#8249; Kembali</button>' +
        ui.emptyState(
          "Kuis Belum Tersedia",
          "Kuis untuk pelajaran ini belum tersedia.",
          "Kembali ke Pelajaran",
          "learning-path",
        );
      return;
    }

    var status = window.EFZProgress.getLessonStatus(lessonId);
    if (!status.unlocked) {
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="learning-path">&#8249; Kembali</button>' +
        ui.emptyState(
          "Pelajaran Terkunci",
          "Selesaikan pelajaran prasyarat terlebih dahulu.",
          "Kembali ke Learning Path",
          "learning-path",
        );
      return;
    }

    // Quiz intro
    var attempts = window.EFZProgress.getQuizAttempts(lessonId);
    var bestScore = window.EFZProgress.getBestQuizScore(lessonId);

    var introHtml =
      '<button type="button" class="back-btn" data-route-target="lesson/' +
      lessonId +
      '">&#8249; Kembali ke Pelajaran</button>' +
      '<div class="card" style="max-width:560px; margin: 1rem auto;">' +
      '<div style="text-align:center; padding:1rem;">' +
      '<h2 class="card-title" style="font-size:1.3rem; margin-bottom:0.5rem;">' +
      escapeHtml(quiz.title) +
      "</h2>" +
      '<p class="card-subtitle">' +
      quiz.questions.length +
      " soal &bull; Batas lulus: " +
      quiz.passingScore +
      "%</p>";

    if (attempts.length > 0) {
      introHtml +=
        '<div style="margin-top:0.75rem;">' +
        ui.badge(
          "Skor terbaik: " + bestScore + "%",
          bestScore >= 80 ? "success" : "warning",
        ) +
        " " +
        ui.badge(attempts.length + " percobaan", "info") +
        "</div>";
    }

    introHtml +=
      '<div class="alert alert-info" style="margin-top:1rem; text-align:left;">' +
      "<strong>Aturan Penilaian:</strong><br>" +
      "90-100: Excellent (Dikuasai) &bull; 80-89: Lulus &bull; 60-79: Perlu latihan &bull; 0-59: Belum lulus<br>" +
      "Jawaban salah akan diberi penjelasan dalam Bahasa Indonesia." +
      "</div>";

    introHtml +=
      '<div class="btn-group" style="justify-content:center;">' +
      '<button type="button" class="btn btn-primary btn-block" id="quiz-start-btn">Mulai Kuis &#8250;</button>' +
      "</div>" +
      "</div></div>";

    container.innerHTML = introHtml;

    var startBtn = container.querySelector("#quiz-start-btn");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        window.EFZQuiz.start(quiz, container, function (score, correct, total) {
          updateChromeIndicators();
        });
      });
    }
  }

  /* ════════════════════════════════════════════════════════════════
       VOCABULARY
       ════════════════════════════════════════════════════════════════ */

  function renderVocabulary(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];

    // Collect unique topics
    var topics = {};
    vocab.forEach(function (v) {
      topics[v.topic] = true;
    });
    var topicList = Object.keys(topics).sort();

    var html =
      '<div class="vocab-toolbar">' +
      '<select class="vocab-filter-select" id="vocab-topic-filter">' +
      '<option value="">Semua Topik</option>';
    topicList.forEach(function (t) {
      html +=
        '<option value="' + escapeHtml(t) + '">' + escapeHtml(t) + "</option>";
    });
    html +=
      "</select>" +
      '<input type="text" class="vocab-search-input" id="vocab-search" placeholder="Cari kata..." />' +
      '<label style="font-size:0.85rem; display:flex; align-items:center; gap:0.3rem; cursor:pointer;">' +
      '<input type="checkbox" id="vocab-fav-only" /> Favorit saja' +
      "</label>" +
      ui.button("Flashcards", "secondary", {
        routeTarget: "vocab-flashcards",
      }) +
      "</div>";

    html += '<div class="vocab-grid" id="vocab-grid"></div>';
    container.innerHTML = html;

    renderVocabGrid(container);

    var filterSel = container.querySelector("#vocab-topic-filter");
    var searchInput = container.querySelector("#vocab-search");
    var favCheckbox = container.querySelector("#vocab-fav-only");

    if (filterSel)
      filterSel.addEventListener("change", function () {
        renderVocabGrid(container);
      });
    if (searchInput)
      searchInput.addEventListener("input", function () {
        renderVocabGrid(container);
      });
    if (favCheckbox)
      favCheckbox.addEventListener("change", function () {
        renderVocabGrid(container);
      });
  }

  function renderVocabGrid(container) {
    var prog = window.EFZProgress;
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];
    var grid = container.querySelector("#vocab-grid");
    if (!grid) return;

    var topicFilter = container.querySelector("#vocab-topic-filter");
    var searchInput = container.querySelector("#vocab-search");
    var favOnly = container.querySelector("#vocab-fav-only");

    var topic = topicFilter ? topicFilter.value : "";
    var search = searchInput ? searchInput.value.toLowerCase().trim() : "";
    var favOnlyChecked = favOnly ? favOnly.checked : false;

    var filtered = vocab.filter(function (v) {
      if (topic && v.topic !== topic) return false;
      if (favOnlyChecked && !prog.isVocabularyFavorite(v.id)) return false;
      if (search) {
        var inEnglish = v.english.toLowerCase().indexOf(search) !== -1;
        var inIndonesian = v.indonesian.toLowerCase().indexOf(search) !== -1;
        if (!inEnglish && !inIndonesian) return false;
      }
      return true;
    });

    if (!filtered.length) {
      grid.innerHTML = window.EFZUI.emptyState(
        "Tidak Ada Kosakata",
        "Tidak ada kosakata yang cocok dengan filter Anda. Coba ubah filter atau kata kunci pencarian.",
        "",
        "",
      );
      return;
    }

    var html = "";
    filtered.forEach(function (v) {
      var isFav = prog.isVocabularyFavorite(v.id);
      var isLearned = prog.isVocabularyLearned(v.id);
      html +=
        '<div class="vocab-card" data-vocab-id="' +
        escapeHtml(v.id) +
        '">' +
        '<div class="vocab-card-header">' +
        "<div>" +
        '<div class="vocab-english">' +
        escapeHtml(v.english) +
        "</div>" +
        (v.pronunciation
          ? '<div class="vocab-pron">/' +
            escapeHtml(v.pronunciation) +
            "/</div>"
          : "") +
        "</div>" +
        (isLearned ? window.EFZUI.badge("Dipelajari", "success") : "") +
        "</div>" +
        '<div class="vocab-indonesian">' +
        escapeHtml(v.indonesian) +
        "</div>" +
        '<div class="vocab-pos">' +
        escapeHtml(v.partOfSpeech || "") +
        " &bull; " +
        escapeHtml(v.topic) +
        "</div>";
      if (v.example) {
        html +=
          '<div class="vocab-example">' +
          escapeHtml(v.example) +
          "</div>" +
          '<div class="vocab-example-translation">' +
          escapeHtml(v.exampleTranslation || "") +
          "</div>";
      }
      html +=
        '<div class="vocab-card-actions">' +
        '<button type="button" class="vocab-action-btn ' +
        (isFav ? "active" : "") +
        '" data-action="toggle-fav" data-vocab-id="' +
        escapeHtml(v.id) +
        '">' +
        (isFav ? "&#9733; Favorit" : "&#9734; Favorit") +
        "</button>" +
        '<button type="button" class="vocab-action-btn ' +
        (isLearned ? "active" : "") +
        '" data-action="toggle-learned" data-vocab-id="' +
        escapeHtml(v.id) +
        '">' +
        (isLearned ? "&#10003; Dipelajari" : "Tandai Dipelajari") +
        "</button>" +
        "</div>";
      html += "</div>";
    });
    grid.innerHTML = html;

    // Bind action buttons
    grid.querySelectorAll('[data-action="toggle-fav"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-vocab-id");
        prog.toggleVocabularyFavorite(id);
        renderVocabulary(container);
      });
    });

    grid
      .querySelectorAll('[data-action="toggle-learned"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-vocab-id");
          if (!prog.isVocabularyLearned(id)) {
            prog.markVocabularyLearned(id);
            window.EFZStorage.addActivity(
              "Mempelajari kosakata baru",
              "vocabulary",
            );
            renderVocabulary(container);
          }
        });
      });
  }

  /* ── Flashcards ── */
  function renderVocabularyFlashcards(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];
    var favIds = prog.getFavoriteVocabularyIds();
    var cards = vocab;

    // Use favorites if available, otherwise use all
    if (favIds.length > 0) {
      cards = vocab.filter(function (v) {
        return favIds.indexOf(v.id) !== -1;
      });
    }

    if (!cards.length) {
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="vocabulary">&#8249; Kembali ke Vocabulary</button>' +
        ui.emptyState(
          "Belum Ada Kartu",
          "Tandai beberapa kosakata sebagai favorit untuk membuat set flashcards, atau gunakan semua kosakata.",
          "Buka Vocabulary",
          "vocabulary",
        );
      return;
    }

    var currentIdx = 0;

    function showCard() {
      var card = cards[currentIdx];
      var isLearned = prog.isVocabularyLearned(card.id);

      var html =
        '<button type="button" class="back-btn" data-route-target="vocabulary">&#8249; Kembali ke Vocabulary</button>' +
        '<div class="flashcard-container">' +
        '<div class="flashcard" id="flashcard">' +
        '<div class="flashcard-inner">' +
        '<div class="flashcard-front">' +
        '<div class="flashcard-label">Kata Inggris (Klik untuk membalik)</div>' +
        '<div class="flashcard-word">' +
        escapeHtml(card.english) +
        "</div>" +
        (card.pronunciation
          ? '<div class="flashcard-pron">/' +
            escapeHtml(card.pronunciation) +
            "/</div>"
          : "") +
        '<div class="flashcard-example">' +
        escapeHtml(card.partOfSpeech) +
        "</div>" +
        "</div>" +
        '<div class="flashcard-back">' +
        '<div class="flashcard-label">Arti Indonesia</div>' +
        '<div class="flashcard-word">' +
        escapeHtml(card.indonesian) +
        "</div>" +
        (card.example
          ? '<div class="flashcard-example">' +
            escapeHtml(card.example) +
            "<br>" +
            escapeHtml(card.exampleTranslation) +
            "</div>"
          : "") +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="flashcard-controls">' +
        '<button type="button" class="flashcard-nav-btn" id="fc-prev" ' +
        (currentIdx === 0 ? "disabled" : "") +
        ">&#8249;</button>" +
        '<span class="flashcard-counter">' +
        (currentIdx + 1) +
        " / " +
        cards.length +
        "</span>" +
        '<button type="button" class="flashcard-nav-btn" id="fc-next" ' +
        (currentIdx === cards.length - 1 ? "disabled" : "") +
        ">&#8250;</button>" +
        "</div>" +
        '<div class="flashcard-actions">' +
        '<button type="button" class="vocab-action-btn ' +
        (isLearned ? "active" : "") +
        '" id="fc-learned">' +
        (isLearned ? "&#10003; Sudah Dipelajari" : "Tandai Dipelajari") +
        "</button>" +
        "</div>" +
        "</div>";

      container.innerHTML = html;

      var cardEl = container.querySelector("#flashcard");
      if (cardEl) {
        cardEl.addEventListener("click", function () {
          cardEl.classList.toggle("flipped");
        });
      }

      var prevBtn = container.querySelector("#fc-prev");
      var nextBtn = container.querySelector("#fc-next");
      var learnedBtn = container.querySelector("#fc-learned");

      if (prevBtn && currentIdx > 0) {
        prevBtn.addEventListener("click", function () {
          currentIdx--;
          showCard();
        });
      }
      if (nextBtn && currentIdx < cards.length - 1) {
        nextBtn.addEventListener("click", function () {
          currentIdx++;
          showCard();
        });
      }
      if (learnedBtn) {
        learnedBtn.addEventListener("click", function () {
          prog.markVocabularyLearned(card.id);
          window.EFZStorage.addActivity(
            "Mempelajari kosakata: " + card.english,
            "vocabulary",
          );
          showCard();
        });
      }
    }

    showCard();
  }

  /* ════════════════════════════════════════════════════════════════
       GRAMMAR
       ════════════════════════════════════════════════════════════════ */

  function renderGrammar(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var topics = window.EFZ_DATA_GRAMMAR_A0 || [];

    var studiedCount = prog.getStudiedGrammarCount();

    var html = ui.progressBar(
      topics.length > 0 ? (studiedCount / topics.length) * 100 : 0,
      "Tata Bahasa Dipelajari (" + studiedCount + "/" + topics.length + ")",
    );

    html += '<div class="grammar-grid">';
    topics.forEach(function (t) {
      var isStudied = prog.isGrammarStudied(t.id);
      html +=
        '<div class="grammar-topic-card" data-grammar-id="' +
        escapeHtml(t.id) +
        '" role="button" tabindex="0">' +
        '<div class="grammar-topic-header">' +
        '<div class="grammar-topic-number">' +
        t.order +
        "</div>" +
        '<div style="flex:1;">' +
        '<div class="grammar-topic-title">' +
        escapeHtml(t.title) +
        "</div>" +
        '<div class="grammar-topic-subtitle">' +
        escapeHtml(t.titleId) +
        "</div>" +
        "</div>" +
        (isStudied ? ui.badge("Dipelajari", "success") : "") +
        "</div>" +
        '<div class="grammar-topic-preview">' +
        escapeHtml(t.explanation.substring(0, 120)) +
        "...</div>" +
        "</div>";
    });
    html += "</div>";

    container.innerHTML = html;

    container.querySelectorAll(".grammar-topic-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-grammar-id");
        window.EFZNavigation.navigateTo("grammar-detail/" + id);
      });
    });
  }

  function renderGrammarDetail(container, params) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var grammarId = params && params.length > 0 ? params[0] : "";
    var topics = window.EFZ_DATA_GRAMMAR_A0 || [];
    var topic = null;
    for (var i = 0; i < topics.length; i++) {
      if (topics[i].id === grammarId) {
        topic = topics[i];
        break;
      }
    }

    if (!topic) {
      container.innerHTML = ui.emptyState(
        "Topik Tidak Ditemukan",
        "Topik tata bahasa tidak ditemukan.",
        "Kembali ke Grammar",
        "grammar",
      );
      return;
    }

    var isStudied = prog.isGrammarStudied(topic.id);

    var html =
      '<button type="button" class="back-btn" data-route-target="grammar">&#8249; Kembali ke Grammar</button>' +
      '<div class="grammar-detail">' +
      '<h2 style="font-size:1.4rem; font-weight:700; margin-bottom:0.25rem;">' +
      escapeHtml(topic.title) +
      "</h2>" +
      '<p style="color:var(--color-text-secondary); margin-bottom:1.25rem;">' +
      escapeHtml(topic.titleId) +
      "</p>";

    if (isStudied)
      html +=
        '<div style="margin-bottom:1rem;">' +
        ui.badge("Sudah Dipelajari", "success") +
        "</div>";

    // Explanation
    html +=
      '<div class="grammar-explanation">' +
      escapeHtml(topic.explanation) +
      "</div>";

    // Formula
    if (topic.formula) {
      html +=
        '<div class="grammar-formula">' + escapeHtml(topic.formula) + "</div>";
    }

    // Examples
    if (topic.examples && topic.examples.length) {
      html += '<div class="grammar-section-title">Contoh</div>';
      html += '<div class="lesson-examples" style="margin-bottom:1.25rem;">';
      topic.examples.forEach(function (ex) {
        html += ui.exampleRow(ex, false);
      });
      html += "</div>";
    }

    // Common mistakes
    if (topic.commonMistakes && topic.commonMistakes.length) {
      html += '<div class="grammar-section-title">Kesalahan Umum</div>';
      html += '<div class="grammar-mistakes"><ul>';
      topic.commonMistakes.forEach(function (m) {
        html += "<li>" + escapeHtml(m) + "</li>";
      });
      html += "</ul></div>";
    }

    // Exercises
    if (topic.exerciseItems && topic.exerciseItems.length) {
      html += '<div class="grammar-section-title">Latihan</div>';
      topic.exerciseItems.forEach(function (ex, idx) {
        html +=
          '<div class="grammar-exercise-item" data-exercise-idx="' +
          idx +
          '">' +
          '<div class="practice-prompt">' +
          escapeHtml(ex.prompt) +
          "</div>" +
          '<div class="practice-input-row">' +
          '<input type="text" class="practice-input" placeholder="Ketik jawaban..." autocomplete="off" />' +
          '<button type="button" class="btn btn-sm btn-primary" data-action="check-exercise">Periksa</button>' +
          "</div>" +
          '<div class="practice-feedback" style="display:none;"></div>' +
          "</div>";
      });
    }

    // Actions
    html +=
      '<div class="lesson-actions">' +
      '<button type="button" class="btn btn-primary" id="grammar-mark-studied">' +
      (isStudied ? "&#10003; Sudah Dipelajari" : "Tandai Sudah Dipelajari") +
      "</button>";
    html += "</div>";

    html += "</div>";

    container.innerHTML = html;

    // Bind exercise check buttons
    container
      .querySelectorAll('[data-action="check-exercise"]')
      .forEach(function (btn) {
        btn.addEventListener("click", function () {
          var item = btn.closest(".grammar-exercise-item");
          var idx = parseInt(item.getAttribute("data-exercise-idx"), 10);
          if (!topic.exerciseItems || !topic.exerciseItems[idx]) return;

          var input = item.querySelector(".practice-input");
          var feedback = item.querySelector(".practice-feedback");
          var userAnswer = input.value;
          var correctAnswer = topic.exerciseItems[idx].answer;

          var isCorrect =
            normalizeAnswer(correctAnswer) === normalizeAnswer(userAnswer);

          feedback.style.display = "block";
          if (isCorrect) {
            feedback.className = "practice-feedback correct";
            feedback.innerHTML = "&#10004; Benar!";
          } else {
            feedback.className = "practice-feedback wrong";
            feedback.innerHTML =
              "&#10006; Yang benar: <strong>" +
              escapeHtml(correctAnswer) +
              "</strong>";
          }
          input.disabled = true;
          btn.disabled = true;
        });
      });

    // Bind mark studied
    var markBtn = container.querySelector("#grammar-mark-studied");
    if (markBtn && !isStudied) {
      markBtn.addEventListener("click", function () {
        prog.markGrammarStudied(topic.id);
        renderGrammarDetail(container, params);
      });
    }
  }

  /* ════════════════════════════════════════════════════════════════
       SETTINGS
       ════════════════════════════════════════════════════════════════ */

  function renderSettings(container) {
    var ui = window.EFZUI;
    var state = window.EFZStorage.getState();

    var html = '<div style="max-width:680px;">';

    // Profile section
    html += ui.card({
      title: "Profil Pembelajar",
      subtitle: "Atur nama dan level belajar Anda",
      badgeText: "Skema v" + state.schemaVersion,
      content:
        '<form id="settings-profile-form">' +
        '<div class="form-group">' +
        '<label class="form-label" for="input-display-name">Nama Panggilan</label>' +
        '<input type="text" id="input-display-name" class="form-input" value="' +
        escapeHtml(state.profile.displayName) +
        '" maxlength="40" required>' +
        "</div>" +
        '<div class="form-group">' +
        '<label class="form-label" for="select-current-level">Level Belajar</label>' +
        '<select id="select-current-level" class="form-select">' +
        '<option value="A0"' +
        (state.profile.currentLevel === "A0" ? " selected" : "") +
        ">A0 — Pemula dari Nol (Disarankan)</option>" +
        '<option value="A1"' +
        (state.profile.currentLevel === "A1" ? " selected" : "") +
        ">A1 — Dasar Sehari-hari</option>" +
        '<option value="A2"' +
        (state.profile.currentLevel === "A2" ? " selected" : "") +
        ">A2 — Komunikasi Rutin</option>" +
        '<option value="B1"' +
        (state.profile.currentLevel === "B1" ? " selected" : "") +
        ">B1 — Percakapan Mandiri</option>" +
        "</select>" +
        "</div>" +
        '<button type="submit" class="btn btn-primary">Simpan Profil</button>' +
        "</form>",
    });

    // Appearance section
    html += ui.card({
      title: "Tampilan",
      subtitle: "Pengaturan tema dan suara",
      content:
        '<div class="form-group">' +
        '<label class="form-label">Tema Tampilan</label>' +
        '<div class="btn-group">' +
        '<button type="button" class="btn ' +
        (state.settings.theme === "light" ? "btn-primary" : "btn-outline") +
        '" data-theme-set="light">&#9728; Mode Terang</button>' +
        '<button type="button" class="btn ' +
        (state.settings.theme === "dark" ? "btn-primary" : "btn-outline") +
        '" data-theme-set="dark">&#9789; Mode Gelap</button>' +
        "</div>" +
        "</div>" +
        '<div class="form-group">' +
        '<label class="form-label" for="settings-sound-toggle">Suara</label>' +
        '<label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">' +
        '<input type="checkbox" id="settings-sound-toggle" ' +
        (state.settings.soundEnabled ? "checked" : "") +
        ' style="width:18px; height:18px;" />' +
        "<span>Aktifkan efek suara</span>" +
        "</label>" +
        "</div>",
    });

    // Backend Server section
    html += ui.card({
      title: "Backend Server",
      subtitle: "Hubungkan ke backend untuk fitur AI Conversation",
      badgeText: "Phase 5",
      content:
        '<div id="backend-feedback" aria-live="polite"></div>' +
        '<div class="alert alert-info" style="margin-bottom:0.75rem;">' +
        "<strong>Perubahan Phase 5:</strong> API Key Gemini kini disimpan aman di server backend (<code>.env</code>), " +
        "tidak lagi di browser. Frontend hanya perlu mengatur URL backend." +
        "</div>" +
        '<form id="backend-url-form">' +
        '<div class="form-group">' +
        '<label class="form-label" for="backend-url-input">Backend Server URL</label>' +
        '<input type="text" id="backend-url-input" class="form-input" value="' +
        escapeHtml(state.settings.backendUrl || "http://localhost:3000") +
        '" placeholder="http:
        '<p class="form-help">URL server backend Express.js. Default: <code>http://localhost:3000</code>. ' +
        "Jalankan backend dengan <code>cd server && npm start</code>.</p>" +
        "</div>" +
        '<div class="btn-group">' +
        '<button type="submit" class="btn btn-primary">Simpan URL</button>' +
        '<button type="button" class="btn btn-secondary" id="btn-test-backend">Tes Koneksi</button>' +
        "</div>" +
        "</form>" +
        '<div id="backend-test-result" style="margin-top:0.75rem;"></div>' +
        '<div class="alert alert-warning" style="margin-top:0.75rem; font-size:0.82rem;">' +
        "<strong>Catatan:</strong> Jika backend tidak berjalan, semua fitur belajar (pelajaran, kuis, kosakata, tata bahasa, listening, speaking, workplace) tetap berfungsi. " +
        "Hanya AI Conversation yang membutuhkan backend." +
        "</div>",
    });

    
    var audio = window.EFZAudio;
    var voices = audio.isSupported() ? audio.getEnglishVoices() : [];
    var voiceOptions = "";
    if (voices.length > 0) {
      voiceOptions = voices
        .map(function (v) {
          return (
            '<option value="' +
            escapeHtml(v.voiceURI) +
            '"' +
            (v.voiceURI === state.settings.preferredVoiceURI
              ? " selected"
              : "") +
            ">" +
            escapeHtml(v.name) +
            " (" +
            escapeHtml(v.lang) +
            ")</option>"
          );
        })
        .join("");
    }

    html += ui.card({
      title: "Pengaturan Suara & TTS",
      subtitle: "Pilih suara Text-to-Speech dan atur kecepatan",
      content:
        '<div class="form-group">' +
        '<label class="form-label" for="tts-voice-select">Suara TTS</label>' +
        (audio.isSupported()
          ? '<select id="tts-voice-select" class="form-select">' +
            '<option value="">Suara Default</option>' +
            voiceOptions +
            "</select>"
          : '<p class="form-help" style="color:var(--color-warning-600);">Text-to-Speech tidak didukung browser ini.</p>') +
        "</div>" +
        '<div class="form-group">' +
        '<label class="form-label" for="tts-rate-range">Kecepatan Bicara: <span id="tts-rate-value">' +
        state.settings.speechRate +
        "x</span></label>" +
        '<input type="range" id="tts-rate-range" min="0.5" max="1.5" step="0.1" value="' +
        state.settings.speechRate +
        '" style="width:100%; max-width:300px;" />' +
        '<div style="display:flex; gap:0.5rem; margin-top:0.5rem;">' +
        '<button type="button" class="btn btn-sm btn-secondary" id="tts-test-btn">&#25B8; Tes Suara</button>' +
        "</div>" +
        "</div>",
    });

    
    html += ui.card({
      title: "Manajemen Data",
      subtitle: "Cadangkan, pulihkan, atau reset progres belajar",
      content:
        '<div id="data-feedback" aria-live="polite"></div>' +
        '<div class="btn-group">' +
        '<button type="button" class="btn btn-secondary" id="btn-export-data">&#128190; Ekspor Data (JSON)</button>' +
        '<label class="btn btn-secondary" style="cursor:pointer;">' +
        "&#128194; Impor Data" +
        '<input type="file" id="import-file-input" accept=".json" style="display:none;" />' +
        "</label>" +
        '<button type="button" class="btn btn-danger" id="btn-reset-data">Reset Semua Data</button>' +
        "</div>" +
        '<p class="form-help" style="margin-top:0.75rem;">' +
        "<strong>Ekspor</strong>: Simpan progres ke file JSON untuk cadangan atau pindah ke browser lain.<br>" +
        "<strong>Impor</strong>: Pulihkan progres dari file JSON. Data saat ini akan diganti.<br>" +
        "<strong>Reset</strong>: Hapus semua data dan kembali ke kondisi awal. Tidak dapat dibatalkan." +
        "</p>",
    });

    html += "</div>";
    container.innerHTML = html;

    bindSettingsEvents(container);
  }

  function bindSettingsEvents(container) {
    
    var form = container.querySelector("#settings-profile-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var nameInput = container.querySelector("#input-display-name");
        var levelSelect = container.querySelector("#select-current-level");
        var cleanName = (nameInput.value || "").trim() || "Pembelajar";
        var selectedLevel = levelSelect.value || "A0";
        window.EFZStorage.updateProfile({
          displayName: cleanName,
          currentLevel: selectedLevel,
        });
        window.EFZStorage.addActivity(
          "Memperbarui profil: " + cleanName + " (Level " + selectedLevel + ")",
          "settings",
        );
        updateChromeIndicators();
      });
    }

    
    container.querySelectorAll("[data-theme-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var theme = btn.getAttribute("data-theme-set");
        var state = window.EFZStorage.getState();
        state.settings.theme = theme;
        window.EFZStorage.saveState(state);
        window.EFZSettings.applyTheme();
        renderSettings(container);
      });
    });

    
    var soundToggle = container.querySelector("#settings-sound-toggle");
    if (soundToggle) {
      soundToggle.addEventListener("change", function () {
        window.EFZSettings.updateSoundSettings({
          soundEnabled: soundToggle.checked,
        });
      });
    }

    
    var backendForm = container.querySelector("#backend-url-form");
    if (backendForm) {
      backendForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var urlInput = container.querySelector("#backend-url-input");
        var url = urlInput ? urlInput.value.trim() : "";
        if (!url) url = "http://localhost:3000";

        window.EFZSettings.setBackendUrl(url);
        window.EFZAIConversation.refreshApiKey();

        var feedback = container.querySelector("#backend-feedback");
        if (feedback) {
          feedback.innerHTML =
            '<div class="alert alert-success">URL backend berhasil disimpan: ' +
            escapeHtml(url) +
            "</div>";
        }
      });
    }

    
    var testBtn = container.querySelector("#btn-test-backend");
    if (testBtn) {
      testBtn.addEventListener("click", function () {
        var urlInput = container.querySelector("#backend-url-input");
        var url = urlInput ? urlInput.value.trim() : "";
        var resultEl = container.querySelector("#backend-test-result");
        if (!resultEl) return;

        resultEl.innerHTML =
          '<div class="alert alert-info">Menguji koneksi ke ' +
          escapeHtml(url) +
          "...</div>";

        fetch(url.replace(/\/$/, "") + "/api/health")
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (data.status === "ok") {
              resultEl.innerHTML =
                '<div class="alert alert-success">\u2705 Backend terhubung! Model: ' +
                escapeHtml(data.model || "unknown") +
                "</div>";
            } else {
              resultEl.innerHTML =
                '<div class="alert alert-warning">Backend merespons tetapi status tidak ok.</div>';
            }
          })
          .catch(function () {
            resultEl.innerHTML =
              '<div class="alert alert-error">\u274C Tidak dapat terhubung ke ' +
              escapeHtml(url) +
              ". Pastikan server berjalan dengan <code>cd server && npm start</code>.</div>";
          });
      });
    }

    
    var voiceSelect = container.querySelector("#tts-voice-select");
    if (voiceSelect) {
      voiceSelect.addEventListener("change", function () {
        window.EFZAudio.setPreferredVoice(voiceSelect.value);
      });
    }

    
    var rateRange = container.querySelector("#tts-rate-range");
    var rateValue = container.querySelector("#tts-rate-value");
    if (rateRange) {
      rateRange.addEventListener("input", function () {
        if (rateValue) rateValue.textContent = rateRange.value + "x";
        window.EFZAudio.setRate(parseFloat(rateRange.value));
      });
    }

    
    var ttsTestBtn = container.querySelector("#tts-test-btn");
    if (ttsTestBtn) {
      ttsTestBtn.addEventListener("click", function () {
        window.EFZAudio.speak("Hello! How are you today?", {
          onStart: function () {
            ttsTestBtn.disabled = true;
            ttsTestBtn.textContent = "\u23F8 Sedang Bicara...";
          },
          onEnd: function () {
            ttsTestBtn.disabled = false;
            ttsTestBtn.textContent = "\u25B8 Tes Suara";
          },
        });
      });
    }

    
    var exportBtn = container.querySelector("#btn-export-data");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        window.EFZSettings.exportData();
        var feedback = container.querySelector("#data-feedback");
        if (feedback)
          feedback.innerHTML =
            '<div class="alert alert-success">Data berhasil diekspor! File JSON telah diunduh.</div>';
      });
    }

    
    var importInput = container.querySelector("#import-file-input");
    if (importInput) {
      importInput.addEventListener("change", function (e) {
        var file = e.target.files[0];
        window.EFZSettings.importData(file, function (success, message) {
          var feedback = container.querySelector("#data-feedback");
          if (feedback) {
            feedback.innerHTML = success
              ? '<div class="alert alert-success">' +
                escapeHtml(message) +
                "</div>"
              : '<div class="alert alert-error">' +
                escapeHtml(message) +
                "</div>";
          }
        });
      });
    }

    
    var resetBtn = container.querySelector("#btn-reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        window.EFZSettings.resetData(function (message) {
          var feedback = container.querySelector("#data-feedback");
          if (feedback) {
            feedback.innerHTML =
              '<div class="alert alert-info">' + escapeHtml(message) + "</div>";
          }
        });
      });
    }
  }

  

  function renderProgressReview(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var state = window.EFZStorage.getState();
    var allLessons = window.EFZ_DATA_LESSONS_A0 || [];

    var completedCount = prog.getCompletedLessonsCount();
    var masteredCount = prog.getMasteredLessonsCount();
    var totalLessons = prog.getTotalLessonsCount();
    var vocabLearned = prog.getLearnedVocabularyCount();
    var grammarStudied = prog.getStudiedGrammarCount();

    var html =
      '<section class="grid-stats">' +
      ui.statCard(
        "Pelajaran Selesai",
        completedCount + "/" + totalLessons,
        "Dikuasai: " + masteredCount,
        "&#9989;",
      ) +
      ui.statCard(
        "Kosakata",
        vocabLearned,
        "Dari " + (window.EFZ_DATA_VOCABULARY_A0 || []).length + " kata",
        "&#128221;",
      ) +
      ui.statCard(
        "Tata Bahasa",
        grammarStudied,
        "Dari " + (window.EFZ_DATA_GRAMMAR_A0 || []).length + " topik",
        "&#129513;",
      ) +
      ui.statCard(
        "Total Kuis",
        state.progress.quizAttempts.length,
        "Percobaan kuis",
        "&#128221;",
      ) +
      "</section>";

    html += ui.progressBar(prog.getOverallProgress(), "Progres Keseluruhan");

    
    html += '<div class="grid-two-col">';
    html +=
      '<section class="card">' +
      '<div class="card-header"><div><h2 class="card-title">Status Pelajaran</h2></div></div>';

    var completedLessons = allLessons.filter(function (l) {
      return prog.isLessonComplete(l.id);
    });
    var lockedLessons = allLessons.filter(function (l) {
      return !prog.isLessonUnlocked(l);
    });

    if (completedLessons.length) {
      html +=
        '<div class="lesson-section-title">Selesai (' +
        completedCount +
        ")</div>";
      completedLessons.forEach(function (l) {
        var st = prog.getLessonStatus(l.id);
        html +=
          '<div class="lesson-item lesson-item-completed' +
          (st.mastered ? " lesson-item-mastered" : "") +
          '">' +
          '<div class="lesson-item-icon">' +
          (st.mastered ? "&#11088;" : "&#9989;") +
          "</div>" +
          '<div class="lesson-item-body">' +
          '<div class="lesson-item-title">' +
          escapeHtml(l.title) +
          "</div>" +
          "</div>" +
          '<div class="lesson-item-meta">' +
          (st.score !== null
            ? ui.badge(st.score + "%", st.score >= 80 ? "success" : "warning")
            : "") +
          "</div>" +
          "</div>";
      });
    } else {
      html +=
        '<div class="alert alert-info">Belum ada pelajaran yang selesai. Mulai dari Learning Path!</div>';
    }

    if (lockedLessons.length) {
      html +=
        '<div class="lesson-section-title" style="margin-top:1rem;">Terkunci (' +
        lockedLessons.length +
        ")</div>";
      html +=
        '<div class="alert alert-warning">Selesaikan pelajaran prasyarat untuk membuka pelajaran berikutnya.</div>';
    }
    html += "</section>";

    
    html +=
      '<section class="card">' +
      '<div class="card-header"><div><h2 class="card-title">Riwayat Kuis Terbaru</h2></div></div>';

    var recentAttempts = state.progress.quizAttempts.slice(-8).reverse();
    if (recentAttempts.length) {
      html += '<div class="dashboard-activity-list">';
      recentAttempts.forEach(function (a) {
        var lesson = prog.findLessonById(a.lessonId);
        html +=
          '<div class="activity-item">' +
          '<span class="activity-dot" style="background-color:' +
          (a.score >= 80
            ? "var(--color-success-500)"
            : "var(--color-warning-600)") +
          '"></span>' +
          '<span class="activity-text">' +
          (lesson ? escapeHtml(lesson.title) : escapeHtml(a.lessonId)) +
          " &mdash; <strong>" +
          a.score +
          "%</strong> (" +
          a.correctCount +
          "/" +
          a.totalCount +
          ")" +
          "</span>" +
          '<span class="activity-time">' +
          formatTimeAgo(a.timestamp) +
          "</span>" +
          "</div>";
      });
      html += "</div>";
    } else {
      html +=
        '<div class="alert alert-info">Belum ada percobaan kuis. Mulai kuis dari halaman pelajaran!</div>';
    }
    html += "</section>";
    html += "</div>";

    
    var activities = prog.getRecentActivities(8);
    if (activities.length) {
      html +=
        '<section class="card" style="margin-top:1.25rem;">' +
        '<div class="card-header"><div><h2 class="card-title">Aktivitas Terbaru</h2></div></div>' +
        '<div class="dashboard-activity-list">';
      activities.forEach(function (act) {
        html +=
          '<div class="activity-item">' +
          '<span class="activity-dot"></span>' +
          '<span class="activity-text">' +
          escapeHtml(act.title) +
          "</span>" +
          '<span class="activity-time">' +
          formatTimeAgo(act.timestamp) +
          "</span>" +
          "</div>";
      });
      html += "</div></section>";
    }

    
    var convSummaries = state.progress.conversationSummaries || [];
    if (convSummaries.length) {
      var recentConv = convSummaries.slice(-5).reverse();
      html +=
        '<section class="card" style="margin-top:1.25rem;">' +
        '<div class="card-header"><div><h2 class="card-title">Sesi Percakapan AI</h2>' +
        '<p class="card-subtitle">Riwayat percakapan dengan AI Tutor</p></div></div>' +
        '<div class="dashboard-activity-list">';
      recentConv.forEach(function (s) {
        html +=
          '<div class="activity-item">' +
          '<span class="activity-dot" style="background-color:var(--color-primary-500);"></span>' +
          '<span class="activity-text"><strong>' +
          escapeHtml(s.modeTitleId || s.modeTitle) +
          "</strong> &mdash; " +
          s.userTurns +
          " percakapan, " +
          (s.corrections || 0) +
          " koreksi (Level " +
          escapeHtml(s.level || "A0") +
          ")" +
          "</span>" +
          '<span class="activity-time">' +
          formatTimeAgo(s.endTime || s.startTime) +
          "</span>" +
          "</div>";
      });
      html += "</div></section>";
    }

    
    var srsStats = prog.getSRSStats();
    html +=
      '<section class="card" style="margin-top:1.25rem;">' +
      '<div class="card-header"><div><h2 class="card-title">\uD83D\uDD01 Vocabulary Review (Spaced Repetition)</h2>' +
      '<p class="card-subtitle">Jadwal review otomatis berdasarkan kemampuan mengingat</p></div>' +
      (srsStats.dueNow > 0
        ? '<button type="button" class="btn btn-primary btn-sm" data-route-target="vocab-review">Mulai Review</button>'
        : "") +
      "</div>";

    html += ui.progressBar(
      srsStats.totalLearned > 0
        ? (srsStats.reviewedToday / srsStats.totalLearned) * 100
        : 0,
      "Direview hari ini: " +
        srsStats.reviewedToday +
        " dari " +
        srsStats.totalLearned +
        " kata",
    );

    html +=
      '<div class="grid-stats" style="margin-top:0.75rem; grid-template-columns: repeat(3,1fr);">' +
      ui.statCard(
        "Dipelajari",
        srsStats.totalLearned,
        "Dari " + (window.EFZ_DATA_VOCABULARY_A0 || []).length + " kata",
        "\uD83D\uDCDA",
      ) +
      ui.statCard(
        "Perlu Review",
        srsStats.dueNow,
        "Siap direview sekarang",
        "\uD83D\uDD01",
      ) +
      ui.statCard(
        "Direview Hari Ini",
        srsStats.reviewedToday,
        "Kata yang direview hari ini",
        "\u2705",
      ) +
      "</div>";

    if (srsStats.dueNow === 0) {
      html += ui.alert(
        "success",
        "Semua kosakata sudah direview untuk hari ini. Kerja bagus!",
      );
    }
    html += "</section>";

    
    var recs = prog.getRecommendations();
    if (recs.length > 0) {
      html +=
        '<section class="card" style="margin-top:1.25rem;">' +
        '<div class="card-header"><div><h2 class="card-title">\uD83C\uDFAF Rekomendasi Belajar</h2>' +
        '<p class="card-subtitle">Disarankan berdasarkan progres Anda saat ini</p></div></div>' +
        '<div class="rec-list">';
      recs.forEach(function (rec) {
        var routeTarget = rec.actionParam
          ? rec.action + "/" + rec.actionParam
          : rec.action;
        html +=
          '<div class="rec-item">' +
          '<span class="rec-icon">' +
          rec.icon +
          "</span>" +
          '<div class="rec-body">' +
          '<div class="rec-title">' +
          escapeHtml(rec.title) +
          "</div>" +
          '<div class="rec-desc">' +
          escapeHtml(rec.description) +
          "</div>" +
          "</div>" +
          '<button type="button" class="btn btn-sm btn-primary" data-route-target="' +
          escapeHtml(routeTarget) +
          '">Mulai</button>' +
          "</div>";
      });
      html += "</div></section>";
    }

    container.innerHTML = html;
  }

  

  

  function renderListening(container) {
    var ui = window.EFZUI;
    var audio = window.EFZAudio;

    var supported = audio.isSupported();
    var warning = supported
      ? ""
      : ui.alert(
          "warning",
          "<strong>Browser Anda tidak mendukung Text-to-Speech.</strong> Latihan listening membutuhkan SpeechSynthesis. Gunakan Chrome atau Edge terbaru untuk pengalaman terbaik.",
        );

    var exercises = [
      {
        id: "word-recognition",
        title: "Word Recognition",
        titleId: "Tebak Kata",
        icon: "\uD83D\uDD0D",
        description:
          "Dengarkan kata bahasa Inggris, lalu pilih arti Indonesia yang benar.",
        type: "word",
      },
      {
        id: "sentence-listening",
        title: "Sentence Listening",
        titleId: "Dengar Kalimat",
        icon: "\uD83C\uDFA7",
        description:
          "Dengarkan kalimat bahasa Inggris, lalu jawab soal pemahaman.",
        type: "sentence",
      },
      {
        id: "dictation",
        title: "Dictation",
        titleId: "Menulis Dikte",
        icon: "\u270F\uFE0F",
        description:
          "Dengarkan kalimat dan ketik apa yang Anda dengar. Latih telinga dan ejaan.",
        type: "dictation",
      },
    ];

    var html = warning;
    html += ui.sectionTitle(
      "Listening Exercises",
      "Latih pendengaran dengan Text-to-Speech browser",
    );

    html += '<div class="listening-exercise-grid">';
    exercises.forEach(function (ex) {
      html +=
        '<div class="listening-exercise-card" data-listening-id="' +
        escapeHtml(ex.id) +
        '" role="button" tabindex="0">' +
        '<div class="listening-exercise-icon">' +
        ex.icon +
        "</div>" +
        '<div class="listening-exercise-body">' +
        '<div class="listening-exercise-title">' +
        escapeHtml(ex.title) +
        "</div>" +
        '<div class="listening-exercise-subtitle">' +
        escapeHtml(ex.titleId) +
        "</div>" +
        '<div class="listening-exercise-desc">' +
        escapeHtml(ex.description) +
        "</div>" +
        "</div>" +
        '<span class="listening-exercise-arrow">\u203A</span>' +
        "</div>";
    });
    html += "</div>";

    container.innerHTML = html;

    container.querySelectorAll("[data-listening-id]").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-listening-id");
        window.EFZNavigation.navigateTo("listening-exercise/" + id);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function renderListeningExercise(container, params) {
    var ui = window.EFZUI;
    var audio = window.EFZAudio;
    var exerciseId = params && params.length > 0 ? params[0] : "";
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];

    if (!vocab.length) {
      container.innerHTML = ui.emptyState(
        "Data Kosakata Tidak Tersedia",
        "Tidak dapat membuat latihan listening.",
        "Kembali",
        "listening",
      );
      return;
    }

    
    var shuffled = vocab.slice().sort(function () {
      return Math.random() - 0.5;
    });
    var items = shuffled.slice(0, 5);
    var currentIdx = 0;
    var correctCount = 0;
    var showTranscript = false;

    function renderCurrent() {
      var item = items[currentIdx];
      if (!item) {
        renderResults();
        return;
      }

      var html =
        '<button type="button" class="back-btn" data-route-target="listening">\u2039 Kembali</button>';

      html += ui.sectionTitle(
        exerciseId === "dictation"
          ? "Dictation"
          : exerciseId === "sentence-listening"
            ? "Sentence Listening"
            : "Word Recognition",
        "Soal " + (currentIdx + 1) + " dari " + items.length,
      );

      
      html += ui.progressBar(
        (currentIdx / items.length) * 100,
        "Progres latihan",
      );

      
      var playText =
        exerciseId === "word-recognition"
          ? item.english
          : item.example || item.english;
      html +=
        '<div class="listening-player">' +
        '<div class="listening-player-icon">\uD83C\uDFA7</div>' +
        '<div class="listening-player-info">' +
        '<div class="listening-player-label">Klik untuk mendengarkan</div>' +
        '<div class="listening-player-status">Belum diputar</div>' +
        "</div>" +
        '<button type="button" class="btn btn-primary listening-play-btn" id="listening-play">' +
        "\u25B8 Putar Audio" +
        "</button>" +
        '<button type="button" class="btn btn-outline btn-sm listening-slow-btn" id="listening-slow">' +
        "\uD83D\uDD0B Pelan" +
        "</button>" +
        "</div>";

      
      if (showTranscript) {
        html +=
          '<div class="listening-transcript">' +
          '<div class="listening-transcript-label">Transkrip:</div>' +
          '<div class="listening-transcript-text">' +
          escapeHtml(playText) +
          "</div>" +
          (item.indonesian
            ? '<div class="listening-transcript-translation">' +
              escapeHtml(item.indonesian) +
              "</div>"
            : "") +
          "</div>";
      }

      html +=
        '<button type="button" class="btn btn-sm btn-outline listening-transcript-btn" id="listening-transcript-toggle">' +
        (showTranscript ? "Sembunyikan Transkrip" : "Tampilkan Transkrip") +
        "</button>";

      
      html += '<div class="listening-question-area">';

      if (exerciseId === "word-recognition") {
        
        var options = [item.indonesian];
        var pool = vocab.filter(function (v) {
          return v.indonesian !== item.indonesian;
        });
        pool = pool.sort(function () {
          return Math.random() - 0.5;
        });
        for (var i = 0; i < 3 && i < pool.length; i++) {
          options.push(pool[i].indonesian);
        }
        options = options.sort(function () {
          return Math.random() - 0.5;
        });

        html +=
          '<div class="listening-question-text">Pilih arti Indonesia yang benar:</div>';
        html += '<div class="quiz-options">';
        options.forEach(function (opt, idx) {
          html +=
            '<button type="button" class="quiz-option" data-option="' +
            escapeHtml(opt) +
            '">' +
            '<span class="quiz-option-letter">' +
            String.fromCharCode(65 + idx) +
            "</span>" +
            '<span class="quiz-option-text">' +
            escapeHtml(opt) +
            "</span>" +
            "</button>";
        });
        html += "</div>";
      } else if (exerciseId === "dictation") {
        html +=
          '<div class="listening-question-text">Ketik apa yang Anda dengar:</div>';
        html +=
          '<div class="quiz-fill-wrap">' +
          '<input type="text" class="quiz-fill-input" id="dictation-input" placeholder="Ketik dalam bahasa Inggris..." autocomplete="off" autocapitalize="off" />' +
          '<button type="button" class="btn btn-primary" id="dictation-check">Periksa</button>' +
          "</div>";
      } else {
        
        html +=
          '<div class="listening-question-text">Apa arti dari kalimat yang Anda dengar?</div>';
        var sentOptions = [item.indonesian];
        var sentPool = vocab
          .filter(function (v) {
            return v.indonesian !== item.indonesian && v.example;
          })
          .sort(function () {
            return Math.random() - 0.5;
          });
        for (var j = 0; j < 3 && j < sentPool.length; j++) {
          sentOptions.push(sentPool[j].indonesian);
        }
        sentOptions = sentOptions.sort(function () {
          return Math.random() - 0.5;
        });

        html += '<div class="quiz-options">';
        sentOptions.forEach(function (opt, idx) {
          html +=
            '<button type="button" class="quiz-option" data-option="' +
            escapeHtml(opt) +
            '">' +
            '<span class="quiz-option-letter">' +
            String.fromCharCode(65 + idx) +
            "</span>" +
            '<span class="quiz-option-text">' +
            escapeHtml(opt) +
            "</span>" +
            "</button>";
        });
        html += "</div>";
      }

      html +=
        '<div class="quiz-feedback" id="listening-feedback" style="display:none;"></div>';
      html += "</div>";

      container.innerHTML = html;
      bindListeningEvents(container, item, playText, exerciseId);
    }

    function renderResults() {
      var total = items.length;
      var score = Math.round((correctCount / total) * 100);
      var passed = score >= 60;
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="listening">\u2039 Kembali</button>' +
        '<div class="quiz-result">' +
        '<div class="quiz-result-icon">' +
        (passed ? "\uD83C\uDF89" : "\uD83D\uDCDA") +
        "</div>" +
        '<h2 class="quiz-result-title">' +
        (passed ? "Selesai!" : "Tetap Berlatih") +
        "</h2>" +
        '<div class="quiz-result-score ' +
        (score >= 80 ? "quiz-result-score-passed" : "quiz-result-score-warn") +
        '">' +
        score +
        "%</div>" +
        '<p class="quiz-result-detail">Jawaban benar: ' +
        correctCount +
        " dari " +
        total +
        " soal</p>" +
        '<div class="btn-group quiz-result-actions">' +
        '<button type="button" class="btn btn-outline" id="listening-retry">Ulangi Latihan</button>' +
        '<button type="button" class="btn btn-primary" data-route-target="listening">Kembali ke Listening</button>' +
        "</div>" +
        "</div>";

      var retryBtn = container.querySelector("#listening-retry");
      if (retryBtn) {
        retryBtn.addEventListener("click", function () {
          currentIdx = 0;
          correctCount = 0;
          showTranscript = false;
          shuffled = vocab.slice().sort(function () {
            return Math.random() - 0.5;
          });
          items = shuffled.slice(0, 5);
          renderCurrent();
        });
      }
      window.EFZStorage.addActivity(
        "Latihan listening: " + score + "% (" + exerciseId + ")",
        "listening",
      );
    }

    function bindListeningEvents(container, item, playText, exType) {
      var playBtn = container.querySelector("#listening-play");
      var slowBtn = container.querySelector("#listening-slow");
      var transcriptBtn = container.querySelector(
        "#listening-transcript-toggle",
      );
      var feedback = container.querySelector("#listening-feedback");

      if (playBtn) {
        playBtn.addEventListener("click", function () {
          audio.speak(playText, {
            onStart: function () {
              playBtn.textContent = "\u23F8 Sedang Diputar...";
              playBtn.disabled = true;
            },
            onEnd: function () {
              playBtn.textContent = "\u25B8 Putar Ulang";
              playBtn.disabled = false;
            },
          });
        });
      }

      if (slowBtn) {
        slowBtn.addEventListener("click", function () {
          audio.speakSlowly(playText, {
            onEnd: function () {
              playBtn.textContent = "\u25B8 Putar Ulang";
            },
          });
        });
      }

      if (transcriptBtn) {
        transcriptBtn.addEventListener("click", function () {
          showTranscript = !showTranscript;
          renderCurrent();
        });
      }

      
      container
        .querySelectorAll(".quiz-option[data-option]")
        .forEach(function (btn) {
          btn.addEventListener("click", function () {
            var chosen = btn.getAttribute("data-option");
            var isCorrect = chosen === item.indonesian;
            container.querySelectorAll(".quiz-option").forEach(function (b) {
              b.disabled = true;
            });
            btn.classList.add(
              isCorrect ? "quiz-option-correct" : "quiz-option-wrong",
            );
            if (!isCorrect) {
              container.querySelectorAll(".quiz-option").forEach(function (b) {
                if (b.getAttribute("data-option") === item.indonesian)
                  b.classList.add("quiz-option-correct");
              });
            }
            if (isCorrect) correctCount++;
            showListeningFeedback(
              feedback,
              isCorrect,
              item.english,
              item.indonesian,
              exType,
            );
          });
        });

      
      var dictInput = container.querySelector("#dictation-input");
      var dictCheck = container.querySelector("#dictation-check");
      if (dictCheck && dictInput) {
        var checkFn = function () {
          var userAnswer = dictInput.value;
          var isCorrect =
            normalizeAnswer(userAnswer) === normalizeAnswer(playText);
          dictInput.disabled = true;
          dictCheck.disabled = true;
          dictInput.classList.add(
            isCorrect ? "quiz-input-correct" : "quiz-input-wrong",
          );
          if (isCorrect) correctCount++;
          showListeningFeedback(feedback, isCorrect, playText, "", "dictation");
        };
        dictCheck.addEventListener("click", checkFn);
        dictInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            checkFn();
          }
        });
        dictInput.focus();
      }
    }

    function showListeningFeedback(
      feedback,
      isCorrect,
      english,
      indonesian,
      exType,
    ) {
      if (!feedback) return;
      var html =
        '<div class="quiz-feedback-' +
        (isCorrect ? "correct" : "wrong") +
        '">' +
        '<div class="quiz-feedback-icon">' +
        (isCorrect ? "\u2714 Benar!" : "\u2718 Belum tepat") +
        "</div>";
      if (!isCorrect) {
        if (exType === "dictation") {
          html +=
            '<p class="quiz-feedback-detail">Jawaban benar: <strong>' +
            escapeHtml(english) +
            "</strong></p>";
        } else {
          html +=
            '<p class="quiz-feedback-detail">Jawaban benar: <strong>' +
            escapeHtml(indonesian) +
            "</strong> (" +
            escapeHtml(english) +
            ")</p>";
        }
      }
      html +=
        '<button type="button" class="btn btn-primary" id="listening-next">' +
        (currentIdx + 1 < items.length
          ? "Soal Berikutnya \u203A"
          : "Lihat Hasil \u203A") +
        "</button></div>";
      feedback.innerHTML = html;
      feedback.style.display = "block";
      feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });

      var nextBtn = feedback.querySelector("#listening-next");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          currentIdx++;
          renderCurrent();
        });
      }
    }

    renderCurrent();
  }

  

  function renderSpeakingPractice(container) {
    var ui = window.EFZUI;
    var speech = window.EFZSpeech;
    var audio = window.EFZAudio;

    var sttSupported = speech.isSupported();
    var ttsSupported = audio.isSupported();

    var warning = "";
    if (!sttSupported) {
      warning = ui.alert(
        "warning",
        "<strong>Pengenalan suara tidak didukung.</strong> Anda masih bisa berlatih dengan fallback teks. Untuk pengenalan suara, gunakan Chrome atau Edge.",
      );
    }
    if (!ttsSupported) {
      warning += ui.alert(
        "warning",
        "<strong>Text-to-Speech tidak didukung.</strong> Latihan Listen & Repeat membutuhkan SpeechSynthesis.",
      );
    }

    var exercises = [
      {
        id: "listen-repeat",
        title: "Listen & Repeat",
        titleId: "Dengar dan Ulangi",
        icon: "\uD83C\uDFA7",
        description:
          "Dengarkan kata/kalimat bahasa Inggris, lalu ulangi dengan suara Anda.",
      },
      {
        id: "read-aloud",
        title: "Read Aloud",
        titleId: "Baca Keras-keras",
        icon: "\uD83D\uDCD2",
        description:
          "Baca kalimat Inggris yang ditampilkan dengan suara keras. AI memeriksa pengucapan Anda.",
      },
      {
        id: "answer-prompt",
        title: "Answer a Prompt",
        titleId: "Jawab Pertanyaan",
        icon: "\uD83D\uDCAC",
        description:
          "Jawab pertanyaan sederhana dengan berbicara. Latih kemampuan merespons lisan.",
      },
    ];

    var html = warning;
    html += ui.sectionTitle(
      "Speaking Practice",
      "Berlatih berbicara dengan mikrofon atau fallback teks",
    );

    html += '<div class="listening-exercise-grid">';
    exercises.forEach(function (ex) {
      html +=
        '<div class="listening-exercise-card" data-speaking-id="' +
        escapeHtml(ex.id) +
        '" role="button" tabindex="0">' +
        '<div class="listening-exercise-icon">' +
        ex.icon +
        "</div>" +
        '<div class="listening-exercise-body">' +
        '<div class="listening-exercise-title">' +
        escapeHtml(ex.title) +
        "</div>" +
        '<div class="listening-exercise-subtitle">' +
        escapeHtml(ex.titleId) +
        "</div>" +
        '<div class="listening-exercise-desc">' +
        escapeHtml(ex.description) +
        "</div>" +
        "</div>" +
        '<span class="listening-exercise-arrow">\u203A</span>' +
        "</div>";
    });
    html += "</div>";

    container.innerHTML = html;

    container.querySelectorAll("[data-speaking-id]").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-speaking-id");
        window.EFZNavigation.navigateTo("speaking-exercise/" + id);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function renderSpeakingExercise(container, params) {
    var ui = window.EFZUI;
    var speech = window.EFZSpeech;
    var audio = window.EFZAudio;
    var exerciseId = params && params.length > 0 ? params[0] : "";
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];
    var lessons = window.EFZ_DATA_LESSONS_A0 || [];

    if (!vocab.length) {
      container.innerHTML = ui.emptyState(
        "Data Tidak Tersedia",
        "Tidak dapat membuat latihan speaking.",
        "Kembali",
        "speaking-practice",
      );
      return;
    }

    
    var targets = [];
    if (exerciseId === "listen-repeat") {
      
      vocab.forEach(function (v) {
        if (v.example) {
          targets.push({
            text: v.example,
            translation: v.exampleTranslation || v.indonesian,
            display: v.english,
          });
        }
      });
    } else if (exerciseId === "read-aloud") {
      
      lessons.forEach(function (l) {
        if (l.sections) {
          l.sections.forEach(function (s) {
            if (s.type === "examples" && s.items) {
              s.items.forEach(function (it) {
                if (it.english && it.english.length < 60) {
                  targets.push({
                    text: it.english,
                    translation: it.indonesian,
                    display: it.english,
                  });
                }
              });
            }
          });
        }
      });
    } else {
      
      vocab.forEach(function (v) {
        if (v.example) {
          targets.push({
            text: v.english,
            translation: v.indonesian,
            display: v.indonesian,
            isPrompt: true,
            promptQuestion: "Sebutkan bahasa Inggris dari: " + v.indonesian,
          });
        }
      });
    }

    
    targets = targets.sort(function () {
      return Math.random() - 0.5;
    });
    targets = targets.slice(0, 5);

    var currentIdx = 0;

    function renderCurrent() {
      var target = targets[currentIdx];
      if (!target) {
        renderSpeakingResults();
        return;
      }

      var html =
        '<button type="button" class="back-btn" data-route-target="speaking-practice">\u2039 Kembali</button>';
      html += ui.sectionTitle(
        exerciseId === "listen-repeat"
          ? "Listen & Repeat"
          : exerciseId === "read-aloud"
            ? "Read Aloud"
            : "Answer a Prompt",
        "Soal " + (currentIdx + 1) + " dari " + targets.length,
      );

      html += ui.progressBar(
        (currentIdx / targets.length) * 100,
        "Progres latihan",
      );

      
      html += '<div class="speaking-target-card">';
      if (exerciseId === "listen-repeat") {
        html +=
          '<div class="speaking-target-label">Dengarkan dan ulangi:</div>';
        html +=
          '<div class="speaking-target-text" id="speaking-target-text" style="visibility:hidden;">' +
          escapeHtml(target.text) +
          "</div>";
        html +=
          '<button type="button" class="btn btn-primary speaking-play-btn" id="speaking-play">' +
          "\u25B8 Dengarkan" +
          "</button>";
        html +=
          '<button type="button" class="btn btn-outline btn-sm" id="speaking-reveal">Tampilkan Teks</button>';
      } else if (exerciseId === "read-aloud") {
        html +=
          '<div class="speaking-target-label">Baca kalimat ini dengan suara keras:</div>';
        html +=
          '<div class="speaking-target-text">' +
          escapeHtml(target.text) +
          "</div>";
        html +=
          '<div class="speaking-target-translation">' +
          escapeHtml(target.translation) +
          "</div>";
      } else {
        html +=
          '<div class="speaking-target-label">' +
          escapeHtml(target.promptQuestion) +
          "</div>";
      }
      html += "</div>";

      
      var sttSupported = speech.isSupported();
      html += '<div class="speaking-input-area">';
      if (sttSupported) {
        html +=
          '<button type="button" class="speaking-mic-btn" id="speaking-mic" aria-label="Mulai merekam">' +
          '<span class="speaking-mic-icon">\uD83C\uDF99\uFE0F</span>' +
          '<span class="speaking-mic-label">Tekan untuk Bicara</span>' +
          "</button>";
      }

      html +=
        '<div class="speaking-text-input-wrap">' +
        '<input type="text" class="practice-input" id="speaking-text-input" placeholder="' +
        (sttSupported
          ? "Atau ketik jawaban Anda..."
          : "Ketik jawaban Anda (fallback teks)...") +
        '" autocomplete="off" autocapitalize="off" />' +
        '<button type="button" class="btn btn-primary" id="speaking-check">Periksa</button>' +
        "</div>";

      html +=
        '<div class="speaking-recognized" id="speaking-recognized" style="display:none;"></div>';
      html +=
        '<div class="speaking-feedback" id="speaking-feedback" style="display:none;"></div>';
      html += '<div class="speaking-status" id="speaking-status"></div>';
      html += "</div>";

      container.innerHTML = html;
      bindSpeakingEvents(container, target, exerciseId);
    }

    function renderSpeakingResults() {
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="speaking-practice">\u2039 Kembali</button>' +
        '<div class="quiz-result">' +
        '<div class="quiz-result-icon">\uD83C\uDF89</div>' +
        '<h2 class="quiz-result-title">Latihan Selesai!</h2>' +
        '<p class="quiz-result-detail">Anda telah menyelesaikan ' +
        targets.length +
        " latihan speaking.</p>" +
        '<div class="btn-group quiz-result-actions">' +
        '<button type="button" class="btn btn-outline" id="speaking-retry">Ulangi Latihan</button>' +
        '<button type="button" class="btn btn-primary" data-route-target="speaking-practice">Kembali</button>' +
        "</div>" +
        "</div>";

      var retryBtn = container.querySelector("#speaking-retry");
      if (retryBtn) {
        retryBtn.addEventListener("click", function () {
          currentIdx = 0;
          targets = vocab.slice().sort(function () {
            return Math.random() - 0.5;
          });
          targets = targets.slice(0, 5);
          renderCurrent();
        });
      }
      window.EFZStorage.addActivity(
        "Latihan speaking: " + exerciseId,
        "speaking",
      );
    }

    function bindSpeakingEvents(container, target, exType) {
      var playBtn = container.querySelector("#speaking-play");
      var revealBtn = container.querySelector("#speaking-reveal");
      var micBtn = container.querySelector("#speaking-mic");
      var textInput = container.querySelector("#speaking-text-input");
      var checkBtn = container.querySelector("#speaking-check");
      var recognized = container.querySelector("#speaking-recognized");
      var feedback = container.querySelector("#speaking-feedback");
      var status = container.querySelector("#speaking-status");

      if (playBtn) {
        playBtn.addEventListener("click", function () {
          audio.speak(target.text, {
            onStart: function () {
              playBtn.textContent = "\u23F8 Sedang Diputar...";
              playBtn.disabled = true;
            },
            onEnd: function () {
              playBtn.textContent = "\u25B8 Dengarkan Ulang";
              playBtn.disabled = false;
            },
          });
        });
      }

      if (revealBtn) {
        revealBtn.addEventListener("click", function () {
          var textEl = container.querySelector("#speaking-target-text");
          if (textEl) textEl.style.visibility = "visible";
          revealBtn.style.display = "none";
        });
      }

      if (micBtn) {
        micBtn.addEventListener("click", function () {
          if (speech.isListening()) {
            speech.stop();
            return;
          }
          status.textContent =
            "\uD83C\uDF99\uFE0F Mendengarkan... Bicara sekarang!";
          micBtn.classList.add("speaking-mic-active");
          speech.start({
            lang: "en-US",
            interimResults: false,
            onStart: function () {
              micBtn.classList.add("speaking-mic-recording");
              micBtn.querySelector(".speaking-mic-label").textContent =
                "Sedang Mendengarkan... (Klik untuk berhenti)";
            },
            onResult: function (transcript, isFinal) {
              if (textInput) textInput.value = transcript;
              if (recognized) {
                recognized.style.display = "block";
                recognized.innerHTML =
                  '<div class="speaking-recognized-label">Anda mengatakan:</div>' +
                  '<div class="speaking-recognized-text">"' +
                  escapeHtml(transcript) +
                  '"</div>';
              }
            },
            onError: function (errorCode) {
              status.textContent =
                "\u26A0\uFE0F " + speech.getErrorMessage(errorCode);
              micBtn.classList.remove("speaking-mic-active");
              micBtn.classList.remove("speaking-mic-recording");
              micBtn.querySelector(".speaking-mic-label").textContent =
                "Tekan untuk Bicara";
            },
            onEnd: function () {
              micBtn.classList.remove("speaking-mic-active");
              micBtn.classList.remove("speaking-mic-recording");
              micBtn.querySelector(".speaking-mic-label").textContent =
                "Tekan untuk Bicara";
              status.textContent = "";
            },
          });
        });
      }

      var checkFn = function () {
        var userAnswer = textInput ? textInput.value : "";
        if (!userAnswer.trim()) return;

        var targetText = exType === "answer-prompt" ? target.text : target.text;
        var isCorrect =
          normalizeAnswer(userAnswer) === normalizeAnswer(targetText);
        var similarity = calculateSimilarity(userAnswer, targetText);

        if (feedback) {
          feedback.style.display = "block";
          feedback.className =
            "speaking-feedback " + (isCorrect ? "correct" : "wrong");
          feedback.innerHTML =
            (isCorrect
              ? "\u2714 Bagus! Pengucapan Anda tepat."
              : "\u2718 Belum tepat.") +
            '<div class="speaking-feedback-detail">' +
            "<div><strong>Target:</strong> " +
            escapeHtml(targetText) +
            "</div>" +
            "<div><strong>Anda:</strong> " +
            escapeHtml(userAnswer) +
            "</div>" +
            "<div><strong>Kemiripan:</strong> " +
            similarity +
            "%</div>" +
            "</div>";
        }

        if (textInput) textInput.disabled = true;
        if (checkBtn) checkBtn.disabled = true;
        if (micBtn) micBtn.disabled = true;

        
        if (feedback) {
          feedback.innerHTML +=
            '<button type="button" class="btn btn-primary" id="speaking-next">' +
            (currentIdx + 1 < targets.length
              ? "Soal Berikutnya \u203A"
              : "Selesai \u203A") +
            "</button>";
          var nextBtn = feedback.querySelector("#speaking-next");
          if (nextBtn) {
            nextBtn.addEventListener("click", function () {
              currentIdx++;
              renderCurrent();
            });
          }
        }
      };

      if (checkBtn) checkBtn.addEventListener("click", checkFn);
      if (textInput) {
        textInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            e.preventDefault();
            checkFn();
          }
        });
        textInput.focus();
      }
    }

    function calculateSimilarity(str1, str2) {
      var a = normalizeAnswer(str1);
      var b = normalizeAnswer(str2);
      if (a === b) return 100;
      var words1 = a.split(" ");
      var words2 = b.split(" ");
      var matches = 0;
      words1.forEach(function (w) {
        if (words2.indexOf(w) !== -1) matches++;
      });
      var maxLen = Math.max(words1.length, words2.length);
      return maxLen > 0 ? Math.round((matches / maxLen) * 100) : 0;
    }

    renderCurrent();
  }

  

  function renderAIConversation(container) {
    var ui = window.EFZUI;
    var ai = window.EFZAIConversation;
    var state = window.EFZStorage.getState();

    ai.refreshApiKey();
    var hasKey = ai.hasApiKey();
    var summaries = ai.getConversationSummaries();

    var html = "";

    
    if (!hasKey) {
      html += ui.alert(
        "warning",
        "<strong>Backend belum dikonfigurasi.</strong> Untuk mulai berbicara dengan AI Tutor, atur URL backend di " +
          '<button type="button" class="btn btn-sm btn-secondary" style="margin-left:0.3rem;" data-route-target="settings">Settings</button>. ' +
          "Jalankan backend dengan <code>cd server && npm start</code>.",
      );
    }

    html += ui.sectionTitle(
      "AI Conversation",
      "Berlatih berbicara bahasa Inggris dengan AI Tutor yang sabar",
    );

    
    var modes = window.EFZ_DATA_CONVERSATIONS || [];
    html += '<div class="ai-mode-grid">';
    modes.forEach(function (mode) {
      var disabled = !hasKey;
      html +=
        '<div class="ai-mode-card' +
        (disabled ? " ai-mode-card-disabled" : "") +
        '" data-mode-id="' +
        escapeHtml(mode.id) +
        '" role="button" tabindex="' +
        (disabled ? "-1" : "0") +
        '"' +
        (disabled ? ' aria-disabled="true"' : "") +
        ">" +
        '<div class="ai-mode-icon">' +
        mode.icon +
        "</div>" +
        '<div class="ai-mode-body">' +
        '<div class="ai-mode-title">' +
        escapeHtml(mode.title) +
        "</div>" +
        '<div class="ai-mode-title-id">' +
        escapeHtml(mode.titleId) +
        "</div>" +
        '<div class="ai-mode-desc">' +
        escapeHtml(mode.description) +
        "</div>" +
        '<div class="ai-mode-phase">' +
        ui.badge("Level " + mode.phaseTarget, "info") +
        "</div>" +
        "</div>" +
        '<span class="ai-mode-arrow">\u203A</span>' +
        "</div>";
    });
    html += "</div>";

    
    if (summaries.length > 0) {
      var recentSummaries = summaries.slice(-5).reverse();
      html +=
        '<section class="card" style="margin-top:1.5rem;">' +
        '<div class="card-header"><div><h2 class="card-title">Riwayat Sesi</h2>' +
        '<p class="card-subtitle">Percakapan AI terbaru</p></div></div>' +
        '<div class="dashboard-activity-list">';
      recentSummaries.forEach(function (s) {
        html +=
          '<div class="activity-item">' +
          '<span class="activity-dot" style="background-color:var(--color-primary-500);"></span>' +
          '<span class="activity-text"><strong>' +
          escapeHtml(s.modeTitleId || s.modeTitle) +
          "</strong> &mdash; " +
          s.userTurns +
          " percakapan, " +
          (s.corrections || 0) +
          " koreksi</span>" +
          '<span class="activity-time">' +
          formatTimeAgo(s.endTime || s.startTime) +
          "</span>" +
          "</div>";
      });
      html += "</div></section>";
    }

    
    html +=
      '<div class="alert alert-info" style="margin-top:1.5rem;">' +
      "<strong>Catatan Keamanan:</strong> API key disimpan di browser Anda (default: sessionStorage, hilang saat tab ditutup). " +
      "Opsi simpan permanen tersedia di Settings dengan peringatan keamanan. " +
      "Jangan bagikan API key Anda kepada orang lain." +
      "</div>";

    container.innerHTML = html;

    
    container.querySelectorAll("[data-mode-id]").forEach(function (card) {
      if (!hasKey) return;
      card.addEventListener("click", function () {
        var modeId = card.getAttribute("data-mode-id");
        window.EFZNavigation.navigateTo("ai-chat/" + modeId);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function renderAIChatRoom(container, params) {
    var ui = window.EFZUI;
    var ai = window.EFZAIConversation;
    var audio = window.EFZAudio;
    var speech = window.EFZSpeech;
    var modeId = params && params.length > 0 ? params[0] : "";
    var state = window.EFZStorage.getState();
    var level = state.profile.currentLevel || "A0";

    ai.refreshApiKey();

    if (!ai.hasApiKey()) {
      container.innerHTML = ui.emptyState(
        "Backend Diperlukan",
        "Atur URL backend di Settings dan pastikan server berjalan untuk mulai berbicara dengan AI Tutor.",
        "Buka Settings",
        "settings",
      );
      return;
    }

    var mode = window.EFZ_DATA_CONVERSATION_HELPERS
      ? window.EFZ_DATA_CONVERSATION_HELPERS.findById(modeId)
      : null;
    if (!mode) {
      container.innerHTML = ui.emptyState(
        "Mode Tidak Ditemukan",
        "Mode percakapan tidak ditemukan.",
        "Kembali",
        "ai-conversation",
      );
      return;
    }

    
    ai.startSession(modeId, level);
    var messages = ai.getDisplayMessages();
    var sttSupported = speech.isSupported();
    var ttsSupported = audio.isSupported();

    
    var html =
      '<button type="button" class="back-btn" data-route-target="ai-conversation">\u2039 Kembali</button>';

    html +=
      '<div class="ai-chat-header">' +
      '<div class="ai-chat-mode-info">' +
      '<span class="ai-chat-mode-icon">' +
      mode.icon +
      "</span>" +
      "<div>" +
      '<div class="ai-chat-mode-title">' +
      escapeHtml(mode.title) +
      "</div>" +
      '<div class="ai-chat-mode-subtitle">Level ' +
      escapeHtml(level) +
      "</div>" +
      "</div>" +
      "</div>" +
      '<button type="button" class="btn btn-danger btn-sm" id="ai-chat-end">Akhiri Sesi</button>' +
      "</div>";

    
    html += '<div class="ai-chat-messages" id="ai-chat-messages">';
    messages.forEach(function (msg) {
      html += renderChatMessage(msg, ttsSupported);
    });
    html += "</div>";

    
    html +=
      '<div class="ai-chat-typing" id="ai-chat-typing" style="display:none;">' +
      '<div class="ai-message ai-message-ai">' +
      '<div class="ai-message-avatar">\uD83E\uDD16</div>' +
      '<div class="ai-message-content"><div class="ai-message-bubble">' +
      '<div class="typing-dots"><span></span><span></span><span></span></div>' +
      "</div></div>" +
      "</div>" +
      "</div>";

    
    html += '<div class="ai-chat-input">';
    if (sttSupported) {
      html +=
        '<button type="button" class="ai-chat-mic-btn" id="ai-chat-mic" aria-label="Bicara dengan mikrofon">' +
        "\uD83C\uDF99\uFE0F" +
        "</button>";
    }
    html +=
      '<input type="text" class="ai-chat-text-input" id="ai-chat-text" placeholder="' +
      (sttSupported ? "Ketik atau bicara..." : "Ketik pesan Anda...") +
      '" autocomplete="off" />' +
      '<button type="button" class="btn btn-primary ai-chat-send-btn" id="ai-chat-send">' +
      "Kirim" +
      "</button>";
    html += "</div>";

    
    html +=
      '<div class="ai-chat-error-area" id="ai-chat-error" style="display:none;"></div>';

    
    html += '<div class="ai-chat-stt-status" id="ai-chat-stt-status"></div>';

    container.innerHTML = html;

    
    var messagesEl = container.querySelector("#ai-chat-messages");
    var textInput = container.querySelector("#ai-chat-text");
    var sendBtn = container.querySelector("#ai-chat-send");
    var micBtn = container.querySelector("#ai-chat-mic");
    var endBtn = container.querySelector("#ai-chat-end");
    var typingEl = container.querySelector("#ai-chat-typing");
    var errorEl = container.querySelector("#ai-chat-error");
    var sttStatusEl = container.querySelector("#ai-chat-stt-status");

    
    messagesEl.scrollTop = messagesEl.scrollHeight;

    
    function sendMessage() {
      var text = textInput.value.trim();
      if (!text) return;
      textInput.value = "";
      errorEl.style.display = "none";

      
      messagesEl.insertAdjacentHTML(
        "beforeend",
        renderChatMessage(
          { sender: "user", text: text, timestamp: new Date().toISOString() },
          false,
        ),
      );
      messagesEl.scrollTop = messagesEl.scrollHeight;

      
      typingEl.style.display = "block";
      messagesEl.scrollTop = messagesEl.scrollHeight;
      textInput.disabled = true;
      sendBtn.disabled = true;

      
      ai.sendMessage(text, function (result) {
        typingEl.style.display = "none";
        textInput.disabled = false;
        sendBtn.disabled = false;
        textInput.focus();

        if (result.success) {
          messagesEl.insertAdjacentHTML(
            "beforeend",
            renderChatMessage(
              {
                sender: "ai",
                text: result.text,
                timestamp: new Date().toISOString(),
                isCorrection: result.isCorrection,
              },
              ttsSupported,
            ),
          );
          messagesEl.scrollTop = messagesEl.scrollHeight;

          
          if (
            ttsSupported &&
            window.EFZStorage.getState().settings.soundEnabled
          ) {
            audio.speak(result.text);
          }
        } else {
          
          errorEl.style.display = "block";
          errorEl.innerHTML =
            '<div class="alert alert-error">' +
            escapeHtml(result.message) +
            "</div>";
          if (result.error === "no-api-key") {
            errorEl.innerHTML +=
              '<button type="button" class="btn btn-sm btn-primary" data-route-target="settings">Buka Settings</button>';
          }
        }
      });
    }

    sendBtn.addEventListener("click", sendMessage);
    textInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

    
    if (micBtn) {
      micBtn.addEventListener("click", function () {
        if (speech.isListening()) {
          speech.stop();
          return;
        }
        micBtn.classList.add("ai-chat-mic-active");
        sttStatusEl.textContent =
          "\uD83C\uDF99\uFE0F Mendengarkan... Bicara sekarang!";
        speech.start({
          lang: "en-US",
          interimResults: false,
          onStart: function () {
            micBtn.classList.add("ai-chat-mic-recording");
          },
          onResult: function (transcript) {
            textInput.value = transcript;
            textInput.focus();
          },
          onError: function (errorCode) {
            sttStatusEl.textContent =
              "\u26A0\uFE0F " + speech.getErrorMessage(errorCode);
          },
          onEnd: function () {
            micBtn.classList.remove("ai-chat-mic-active");
            micBtn.classList.remove("ai-chat-mic-recording");
            sttStatusEl.textContent = "";
          },
        });
      });
    }

    
    endBtn.addEventListener("click", function () {
      if (
        !confirm("Akhiri sesi percakapan? Anda akan menerima ringkasan sesi.")
      ) {
        return;
      }
      endBtn.disabled = true;
      endBtn.textContent = "Membuat ringkasan...";

      ai.endSession(function (result) {
        renderSessionReview(container, result.summary);
      });
    });

    
    messagesEl.addEventListener("click", function (e) {
      var playBtn = e.target.closest("[data-tts-text]");
      if (playBtn) {
        var text = playBtn.getAttribute("data-tts-text");
        if (audio.isSpeaking()) {
          audio.stop();
          playBtn.textContent = "\u25B8 Putar";
        } else {
          audio.speak(text, {
            onEnd: function () {
              playBtn.textContent = "\u25B8 Putar";
            },
          });
          playBtn.textContent = "\u23F8 Stop";
        }
      }
    });

    
    if (
      ttsSupported &&
      window.EFZStorage.getState().settings.soundEnabled &&
      messages.length > 0
    ) {
      setTimeout(function () {
        audio.speak(messages[0].text);
      }, 500);
    }
  }

  function renderChatMessage(msg, ttsSupported) {
    var isAI = msg.sender === "ai";
    var bubbleClass = isAI
      ? msg.isCorrection
        ? "ai-message-bubble ai-message-correction"
        : "ai-message-bubble"
      : "ai-message-bubble ai-message-user-bubble";

    var html =
      '<div class="ai-message ' +
      (isAI ? "ai-message-ai" : "ai-message-user") +
      '">' +
      '<div class="ai-message-avatar">' +
      (isAI ? "\uD83E\uDD16" : "\uD83D\uDC64") +
      "</div>" +
      '<div class="ai-message-content">' +
      '<div class="' +
      bubbleClass +
      '">' +
      formatChatText(msg.text) +
      "</div>";

    
    if (isAI && ttsSupported) {
      html +=
        '<button type="button" class="ai-message-play-btn" data-tts-text="' +
        escapeHtml(msg.text.replace(/"/g, "&quot;")) +
        '">\u25B8 Putar</button>';
    }

    html += "</div></div>";
    return html;
  }

  function formatChatText(text) {
    // Convert correction format to formatted HTML
    var html = escapeHtml(text);
    // Bold the correction labels
    html = html.replace(/^(Your sentence:)/gm, "<strong>$1</strong>");
    html = html.replace(
      /^(Better sentence:)/gm,
      "<strong style='color:#10b981;'>$1</strong>",
    );
    html = html.replace(
      /^(Penjelasan:)/gm,
      "<strong style='color:#3b82f6;'>$1</strong>",
    );
    html = html.replace(
      /^(Try again:)/gm,
      "<strong style='color:#f59e0b;'>$1</strong>",
    );
    // Convert newlines to <br>
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  function renderSessionReview(container, summary) {
    var ui = window.EFZUI;
    var html =
      '<button type="button" class="back-btn" data-route-target="ai-conversation">\u2039 Kembali ke AI Conversation</button>';

    html +=
      '<div class="ai-session-review">' +
      '<div class="quiz-result-icon">\uD83D\uDCDD</div>' +
      '<h2 class="quiz-result-title">Ringkasan Sesi</h2>' +
      '<div class="ai-review-meta">' +
      ui.badge(summary.modeTitleId || summary.modeTitle, "info") +
      " " +
      ui.badge(summary.userTurns + " percakapan", "success") +
      " " +
      ui.badge((summary.corrections || 0) + " koreksi", "warning") +
      "</div>";

    // Review text (formatted)
    var reviewHtml = escapeHtml(summary.review || "");
    reviewHtml = reviewHtml.replace(/\n/g, "<br>");
    html += '<div class="ai-review-content">' + reviewHtml + "</div>";

    html +=
      '<div class="btn-group quiz-result-actions">' +
      '<button type="button" class="btn btn-primary" data-route-target="ai-conversation">Sesi Baru</button>' +
      '<button type="button" class="btn btn-outline" data-route-target="progress-review">Lihat Progres</button>' +
      '<button type="button" class="btn btn-outline" data-route-target="dashboard">Dashboard</button>' +
      "</div>" +
      "</div>";

    container.innerHTML = html;
    container.scrollIntoView({ behavior: "smooth", block: "start" });
    updateChromeIndicators();
  }

  /* ════════════════════════════════════════════════════════════════
     WORKPLACE ENGLISH
     ════════════════════════════════════════════════════════════════ */

  function renderWorkplaceEnglish(container) {
    var ui = window.EFZUI;
    var helpers = window.EFZ_DATA_WORKPLACE_HELPERS;
    if (!helpers) {
      container.innerHTML = ui.emptyState(
        "Data Tidak Tersedia",
        "Data Workplace English belum dimuat.",
        "Kembali ke Dashboard",
        "dashboard",
      );
      return;
    }
    var sectors = helpers.getSectorList();
    var html =
      ui.sectionTitle(
        "Workplace English",
        "Frasa dan dialog praktis untuk 6 sektor kerja di Singapura",
      ) +
      '<div class="alert alert-info" style="margin-bottom:1.5rem;">' +
      "Klik sektor kerja untuk mempelajari frasa, kosakata, dan dialog contoh. " +
      "Gunakan <strong>AI Conversation &rarr; Workplace Roleplay</strong> untuk berlatih langsung dengan AI." +
      "</div>" +
      '<div class="wp-sector-grid">';

    sectors.forEach(function (s) {
      html +=
        '<div class="wp-sector-card" data-sector-id="' +
        escapeHtml(s.id) +
        '" role="button" tabindex="0" style="--sector-color:' +
        escapeHtml(s.color) +
        '">' +
        '<div class="wp-sector-icon">' +
        s.icon +
        "</div>" +
        '<div class="wp-sector-body">' +
        '<div class="wp-sector-title">' +
        escapeHtml(s.title) +
        "</div>" +
        '<div class="wp-sector-title-id">' +
        escapeHtml(s.titleId) +
        "</div>" +
        '<div class="wp-sector-desc">' +
        escapeHtml(s.description) +
        "</div>" +
        "</div>" +
        '<span class="wp-sector-arrow">\u203A</span>' +
        "</div>";
    });

    html += "</div>";

    // Quick AI Practice section
    html +=
      '<section class="card" style="margin-top:1.5rem;">' +
      '<div class="card-header"><div>' +
      '<h2 class="card-title">\uD83E\uDD16 Latihan AI Workplace</h2>' +
      '<p class="card-subtitle">Gunakan AI Tutor untuk berlatih skenario kerja langsung</p>' +
      "</div></div>" +
      '<div class="wp-ai-practice-grid">';

    var aiModes = [
      {
        id: "workplace-roleplay",
        title: "Workplace Roleplay",
        titleId: "Roleplay Dunia Kerja",
        icon: "\uD83D\uDCBC",
        desc: "Berlatih percakapan dengan supervisor, rekan kerja, HR, atau pelanggan.",
      },
      {
        id: "job-interview",
        title: "Job Interview Practice",
        titleId: "Latihan Wawancara Kerja",
        icon: "\uD83D\uDC65",
        desc: "Simulasi wawancara kerja dengan pertanyaan umum entry-level di Singapura.",
      },
    ];

    aiModes.forEach(function (m) {
      html +=
        '<div class="wp-ai-mode-card" data-mode-id="' +
        escapeHtml(m.id) +
        '">' +
        '<span style="font-size:1.5rem;">' +
        m.icon +
        "</span>" +
        "<div>" +
        '<div style="font-weight:700; font-size:0.92rem;">' +
        escapeHtml(m.title) +
        "</div>" +
        '<div style="font-size:0.82rem; color:var(--color-text-secondary);">' +
        escapeHtml(m.desc) +
        "</div>" +
        "</div>" +
        '<button type="button" class="btn btn-sm btn-primary">Mulai</button>' +
        "</div>";
    });

    html += "</div></section>";
    container.innerHTML = html;

    container.querySelectorAll("[data-sector-id]").forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-sector-id");
        window.EFZNavigation.navigateTo("workplace-detail/" + id);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    container.querySelectorAll("[data-mode-id]").forEach(function (card) {
      var btn = card.querySelector(".btn");
      if (btn)
        btn.addEventListener("click", function () {
          var modeId = card.getAttribute("data-mode-id");
          window.EFZAIConversation && window.EFZAIConversation.refreshApiKey();
          if (
            window.EFZAIConversation &&
            window.EFZAIConversation.hasApiKey()
          ) {
            window.EFZNavigation.navigateTo("ai-chat/" + modeId);
          } else {
            window.EFZNavigation.navigateTo("ai-conversation");
          }
        });
    });
  }

  function renderWorkplaceDetail(container, params) {
    var ui = window.EFZUI;
    var audio = window.EFZAudio;
    var sectorId = params && params[0] ? params[0] : "";
    var sector = window.EFZ_DATA_WORKPLACE_HELPERS
      ? window.EFZ_DATA_WORKPLACE_HELPERS.getSector(sectorId)
      : null;

    if (!sector) {
      container.innerHTML = ui.emptyState(
        "Sektor Tidak Ditemukan",
        "Data sektor tidak tersedia.",
        "Kembali ke Workplace English",
        "workplace-english",
      );
      return;
    }

    var html =
      '<button type="button" class="back-btn" data-route-target="workplace-english">\u2039 Kembali ke Workplace English</button>';

    html +=
      '<div class="wp-detail-header" style="border-left:4px solid ' +
      escapeHtml(sector.color) +
      '">' +
      '<span class="wp-detail-icon">' +
      sector.icon +
      "</span>" +
      "<div>" +
      '<h2 class="wp-detail-title">' +
      escapeHtml(sector.title) +
      "</h2>" +
      '<p class="wp-detail-subtitle">' +
      escapeHtml(sector.titleId) +
      " &mdash; " +
      escapeHtml(sector.description) +
      "</p>" +
      "</div>" +
      "</div>";

    // Tab navigation between categories
    var cats = sector.categories || [];
    if (cats.length) {
      html += '<div class="wp-tab-nav" id="wp-tab-nav">';
      cats.forEach(function (cat, idx) {
        html +=
          '<button type="button" class="wp-tab-btn' +
          (idx === 0 ? " active" : "") +
          '" data-cat-idx="' +
          idx +
          '">' +
          escapeHtml(cat.titleId) +
          "</button>";
      });
      html += "</div>";

      cats.forEach(function (cat, idx) {
        html +=
          '<div class="wp-cat-panel' +
          (idx === 0 ? " active" : "") +
          '" data-panel-idx="' +
          idx +
          '">';

        html += '<div class="wp-phrase-list">';
        cat.phrases.forEach(function (p, pIdx) {
          html +=
            '<div class="wp-phrase-item">' +
            '<div class="wp-phrase-num">' +
            (pIdx + 1) +
            "</div>" +
            '<div class="wp-phrase-body">' +
            '<div class="wp-phrase-english">' +
            escapeHtml(p.english) +
            "</div>" +
            (p.pronunciation
              ? '<div class="wp-phrase-pron">/' +
                escapeHtml(p.pronunciation) +
                "/</div>"
              : "") +
            '<div class="wp-phrase-indonesian">' +
            escapeHtml(p.indonesian) +
            "</div>" +
            (p.context
              ? '<div class="wp-phrase-context">' +
                escapeHtml(p.context) +
                "</div>"
              : "") +
            "</div>" +
            '<div class="wp-phrase-actions">' +
            (audio.isSupported()
              ? '<button type="button" class="btn btn-sm btn-outline wp-play-btn" data-text="' +
                escapeHtml(p.english) +
                '">\u25B8</button>'
              : "") +
            "</div>" +
            "</div>";
        });
        html += "</div></div>";
      });
    }

    // Vocabulary section
    if (sector.vocabulary && sector.vocabulary.length) {
      html +=
        '<section class="card" style="margin-top:1.5rem;">' +
        '<div class="card-header"><div><h2 class="card-title">Kosakata Penting</h2></div></div>' +
        '<div class="wp-vocab-grid">';
      sector.vocabulary.forEach(function (v) {
        html +=
          '<div class="wp-vocab-chip">' +
          '<div class="wp-vocab-english">' +
          escapeHtml(v.english) +
          "</div>" +
          '<div class="wp-vocab-indonesian">' +
          escapeHtml(v.indonesian) +
          "</div>" +
          (v.example
            ? '<div class="wp-vocab-example">' +
              escapeHtml(v.example) +
              "</div>"
            : "") +
          "</div>";
      });
      html += "</div></section>";
    }

    // Dialog examples
    if (sector.dialogExamples && sector.dialogExamples.length) {
      html += '<section class="card" style="margin-top:1.5rem;">';
      html +=
        '<div class="card-header"><div><h2 class="card-title">Contoh Dialog</h2><p class="card-subtitle">Pelajari pola percakapan nyata</p></div></div>';
      sector.dialogExamples.forEach(function (dialog) {
        html +=
          '<div class="wp-dialog">' +
          '<div class="wp-dialog-title">' +
          escapeHtml(dialog.title) +
          ' <span style="color:var(--color-text-muted); font-size:0.85rem;">(' +
          escapeHtml(dialog.titleId) +
          ")</span></div>" +
          '<div class="wp-dialog-exchanges">';
        dialog.exchanges.forEach(function (ex) {
          var isYou = ex.speaker === "You";
          html +=
            '<div class="wp-dialog-exchange' +
            (isYou ? " wp-dialog-you" : "") +
            '">' +
            '<span class="wp-dialog-speaker">' +
            escapeHtml(ex.speaker) +
            "</span>" +
            '<div class="wp-dialog-bubble">' +
            '<div class="wp-dialog-english">' +
            escapeHtml(ex.english) +
            "</div>" +
            '<div class="wp-dialog-indonesian">' +
            escapeHtml(ex.indonesian) +
            "</div>" +
            "</div>" +
            "</div>";
        });
        html += "</div></div>";
      });
      html += "</section>";
    }

    // AI Roleplay button
    html +=
      '<div class="btn-group" style="margin-top:1.5rem;">' +
      '<button type="button" class="btn btn-primary" id="wp-ai-practice-btn">\uD83E\uDD16 Latihan dengan AI Tutor</button>' +
      '<button type="button" class="btn btn-outline" data-route-target="workplace-english">Kembali</button>' +
      "</div>";

    container.innerHTML = html;

    // Bind tab switching
    container.querySelectorAll(".wp-tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-cat-idx"), 10);
        container.querySelectorAll(".wp-tab-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        container.querySelectorAll(".wp-cat-panel").forEach(function (p) {
          p.classList.remove("active");
        });
        btn.classList.add("active");
        var panel = container.querySelector('[data-panel-idx="' + idx + '"]');
        if (panel) panel.classList.add("active");
      });
    });

    // Bind TTS play buttons
    container.querySelectorAll(".wp-play-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-text");
        audio.speak(text, {
          onStart: function () {
            btn.textContent = "\u23F8";
            btn.disabled = true;
          },
          onEnd: function () {
            btn.textContent = "\u25B8";
            btn.disabled = false;
          },
        });
      });
    });

    // Bind AI practice button
    var aiBtn = container.querySelector("#wp-ai-practice-btn");
    if (aiBtn) {
      aiBtn.addEventListener("click", function () {
        window.EFZAIConversation && window.EFZAIConversation.refreshApiKey();
        var modeId =
          sectorId === "interview" ? "job-interview" : "workplace-roleplay";
        if (window.EFZAIConversation && window.EFZAIConversation.hasApiKey()) {
          window.EFZNavigation.navigateTo("ai-chat/" + modeId);
        } else {
          window.EFZNavigation.navigateTo("ai-conversation");
        }
      });
    }

    // Track progress
    window.EFZStorage.addActivity(
      "Mempelajari Workplace English: " + sector.titleId,
      "workplace",
    );
  }

  /* ════════════════════════════════════════════════════════════════
     VOCABULARY REVIEW (SPACED REPETITION)
     ════════════════════════════════════════════════════════════════ */

  function renderVocabReview(container) {
    var ui = window.EFZUI;
    var prog = window.EFZProgress;
    var audio = window.EFZAudio;

    // Inisialisasi SRS untuk kata yang sudah dipelajari sebelumnya
    prog.initSRSForExistingVocab();

    var dueIds = prog.getVocabularyDueForReview();
    var vocab = window.EFZ_DATA_VOCABULARY_A0 || [];
    var srsStats = prog.getSRSStats();

    if (dueIds.length === 0) {
      var nextReviewMsg = "";
      // Cari review terdekat berikutnya
      var state = window.EFZStorage.getState();
      var nextDates = Object.keys(state.progress.vocabularyStatus)
        .map(function (id) {
          var s = state.progress.vocabularyStatus[id];
          return s.nextReviewDate ? new Date(s.nextReviewDate) : null;
        })
        .filter(function (d) {
          return d && d > new Date();
        })
        .sort(function (a, b) {
          return a - b;
        });
      if (nextDates.length > 0) {
        nextReviewMsg =
          " Review berikutnya: " +
          nextDates[0].toLocaleDateString("id-ID") +
          ".";
      }

      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="vocabulary">\u2039 Kembali ke Vocabulary</button>' +
        '<div class="quiz-result">' +
        '<div class="quiz-result-icon">\uD83C\uDF89</div>' +
        '<h2 class="quiz-result-title">Tidak Ada Review Hari Ini!</h2>' +
        '<p class="quiz-result-detail">Semua kosakata Anda sudah direview.' +
        escapeHtml(nextReviewMsg) +
        "</p>" +
        ui.progressBar(
          srsStats.totalLearned > 0
            ? (srsStats.reviewedToday / srsStats.totalLearned) * 100
            : 0,
          "Direview hari ini: " +
            srsStats.reviewedToday +
            " dari " +
            srsStats.totalLearned,
        ) +
        '<div class="btn-group quiz-result-actions">' +
        '<button type="button" class="btn btn-primary" data-route-target="vocabulary">Kembali ke Vocabulary</button>' +
        "</div></div>";
      return;
    }

    // Ambil kata yang due
    var dueVocab = vocab.filter(function (v) {
      return dueIds.indexOf(v.id) !== -1;
    });
    // Acak
    dueVocab = dueVocab.sort(function () {
      return Math.random() - 0.5;
    });
    // Batasi 10 per sesi
    dueVocab = dueVocab.slice(0, 10);

    var currentIdx = 0;
    var results = { correct: 0, hint: 0, incorrect: 0 };

    function renderCard() {
      var item = dueVocab[currentIdx];
      if (!item) {
        renderReviewResults();
        return;
      }

      var allVocab = vocab;
      // 4 pilihan jawaban
      var options = [item.indonesian];
      var pool = allVocab
        .filter(function (v) {
          return v.indonesian !== item.indonesian;
        })
        .sort(function () {
          return Math.random() - 0.5;
        });
      for (var i = 0; i < 3 && i < pool.length; i++)
        options.push(pool[i].indonesian);
      options = options.sort(function () {
        return Math.random() - 0.5;
      });

      var html =
        '<button type="button" class="back-btn" data-route-target="vocabulary">\u2039 Kembali</button>' +
        ui.sectionTitle(
          "Vocabulary Review",
          "Soal " +
            (currentIdx + 1) +
            " dari " +
            dueVocab.length +
            " \u2014 " +
            srsStats.dueNow +
            " kata perlu direview",
        ) +
        ui.progressBar((currentIdx / dueVocab.length) * 100, "") +
        '<div class="srs-card">' +
        '<div class="srs-card-inner">' +
        '<div class="srs-card-label">Apa arti kata berikut?</div>' +
        '<div class="srs-card-word">' +
        escapeHtml(item.english) +
        "</div>" +
        (item.pronunciation
          ? '<div class="srs-card-pron">/' +
            escapeHtml(item.pronunciation) +
            "/</div>"
          : "") +
        (audio.isSupported()
          ? '<button type="button" class="btn btn-sm btn-outline srs-play-btn" id="srs-play-btn">\u25B8 Dengarkan</button>'
          : "") +
        "</div>" +
        "</div>" +
        '<div class="quiz-options" id="srs-options">';

      options.forEach(function (opt, idx) {
        html +=
          '<button type="button" class="quiz-option" data-option="' +
          escapeHtml(opt) +
          '">' +
          '<span class="quiz-option-letter">' +
          String.fromCharCode(65 + idx) +
          "</span>" +
          '<span class="quiz-option-text">' +
          escapeHtml(opt) +
          "</span>" +
          "</button>";
      });

      html +=
        "</div>" +
        '<div id="srs-feedback" class="quiz-feedback" style="display:none;"></div>';

      container.innerHTML = html;

      // TTS play button
      var playBtn = container.querySelector("#srs-play-btn");
      if (playBtn) {
        playBtn.addEventListener("click", function () {
          audio.speak(item.english, {
            onStart: function () {
              playBtn.disabled = true;
              playBtn.textContent = "\u23F8";
            },
            onEnd: function () {
              playBtn.disabled = false;
              playBtn.textContent = "\u25B8 Dengarkan";
            },
          });
        });
      }

      // Answer selection
      container.querySelectorAll(".quiz-option").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var chosen = btn.getAttribute("data-option");
          var isCorrect = chosen === item.indonesian;
          container.querySelectorAll(".quiz-option").forEach(function (b) {
            b.disabled = true;
          });
          btn.classList.add(
            isCorrect ? "quiz-option-correct" : "quiz-option-wrong",
          );
          if (!isCorrect) {
            container.querySelectorAll(".quiz-option").forEach(function (b) {
              if (b.getAttribute("data-option") === item.indonesian)
                b.classList.add("quiz-option-correct");
            });
          }

          var quality = isCorrect ? 2 : 0;
          if (isCorrect) results.correct++;
          else results.incorrect++;

          prog.recordVocabularyReview(item.id, quality);

          var feedback = container.querySelector("#srs-feedback");
          if (feedback) {
            feedback.style.display = "block";
            feedback.innerHTML =
              '<div class="quiz-feedback-' +
              (isCorrect ? "correct" : "wrong") +
              '">' +
              '<div class="quiz-feedback-icon">' +
              (isCorrect ? "\u2714 Benar!" : "\u2718 Belum tepat") +
              "</div>" +
              (isCorrect
                ? '<p class="quiz-feedback-detail">Interval review berikutnya sudah diperbarui.</p>'
                : '<p class="quiz-feedback-detail">Jawaban benar: <strong>' +
                  escapeHtml(item.indonesian) +
                  "</strong></p>") +
              (item.example
                ? '<p class="quiz-feedback-explanation">Contoh: ' +
                  escapeHtml(item.example) +
                  "</p>"
                : "") +
              '<button type="button" class="btn btn-primary" id="srs-next-btn">' +
              (currentIdx + 1 < dueVocab.length
                ? "Soal Berikutnya \u203A"
                : "Lihat Hasil \u203A") +
              "</button></div>";

            var nextBtn = feedback.querySelector("#srs-next-btn");
            if (nextBtn) {
              nextBtn.addEventListener("click", function () {
                currentIdx++;
                renderCard();
              });
            }
          }
        });
      });
    }

    function renderReviewResults() {
      var total = dueVocab.length;
      var score = Math.round((results.correct / total) * 100);
      container.innerHTML =
        '<button type="button" class="back-btn" data-route-target="vocabulary">\u2039 Kembali</button>' +
        '<div class="quiz-result">' +
        '<div class="quiz-result-icon">' +
        (score >= 70 ? "\uD83C\uDF89" : "\uD83D\uDCDA") +
        "</div>" +
        '<h2 class="quiz-result-title">Sesi Review Selesai!</h2>' +
        '<div class="quiz-result-score ' +
        (score >= 70 ? "quiz-result-score-passed" : "quiz-result-score-warn") +
        '">' +
        score +
        "%</div>" +
        '<p class="quiz-result-detail">' +
        "Benar: " +
        results.correct +
        " &bull; " +
        "Salah: " +
        results.incorrect +
        " &bull; " +
        "Total: " +
        total +
        "</p>" +
        '<div class="alert alert-success" style="text-align:left;">' +
        "<strong>Jadwal review otomatis diperbarui!</strong> Kata yang benar akan muncul lebih lama lagi, kata yang salah akan muncul lebih cepat." +
        "</div>" +
        '<div class="btn-group quiz-result-actions">' +
        (prog.getVocabularyDueForReview().length > 0
          ? '<button type="button" class="btn btn-outline" id="srs-continue-btn">Lanjut Review</button>'
          : "") +
        '<button type="button" class="btn btn-primary" data-route-target="vocabulary">Kembali ke Vocabulary</button>' +
        "</div></div>";

      var continueBtn = container.querySelector("#srs-continue-btn");
      if (continueBtn)
        continueBtn.addEventListener("click", function () {
          renderVocabReview(container);
        });

      window.EFZStorage.addActivity(
        "Vocabulary Review: " +
          results.correct +
          "/" +
          total +
          " benar (" +
          score +
          "%)",
        "review",
      );
    }

    renderCard();
  }

  function renderModuleRoadmapCard(container, routeMeta) {
    var ui = window.EFZUI;
    var state = window.EFZStorage.getState();
    container.innerHTML = ui.card({
      title: "Modul " + routeMeta.title,
      subtitle: routeMeta.subtitle,
      badgeText: routeMeta.phaseTarget,
      content:
        '<p style="font-size:0.92rem; color:var(--color-text-secondary); margin-bottom:1rem;">' +
        escapeHtml(routeMeta.summary) +
        "</p>" +
        ui.alert(
          "info",
          "<strong>Status:</strong> Modul <strong>" +
            escapeHtml(routeMeta.title) +
            "</strong> akan dibangun pada <strong>" +
            escapeHtml(routeMeta.phaseTarget) +
            "</strong>. " +
            "Fokuskan dulu pada pelajaran A0 yang sudah tersedia di Learning Path!",
        ) +
        '<div class="btn-group">' +
        ui.button("Kembali ke Dashboard", "primary", {
          routeTarget: "dashboard",
        }) +
        ui.button("Buka Learning Path", "outline", {
          routeTarget: "learning-path",
        }) +
        "</div>",
    });
  }

  /* ════════════════════════════════════════════════════════════════
       ROUTE DISPATCHER
       ════════════════════════════════════════════════════════════════ */

  function renderRouteView(routeMeta, params) {
    var container = document.getElementById("app-content");
    if (!container) return;

    var routeId = routeMeta.id;
    params = params || [];

    switch (routeId) {
      case "dashboard":
        renderDashboard(container);
        break;
      case "learning-path":
        renderLearningPath(container);
        bindLearningPathEvents(container);
        break;
      case "lesson":
        renderLessonDetail(container, params);
        bindLessonEvents(container);
        break;
      case "quiz":
        renderQuiz(container, params);
        break;
      case "vocabulary":
        renderVocabulary(container);
        break;
      case "vocab-flashcards":
        renderVocabularyFlashcards(container);
        break;
      case "grammar":
        renderGrammar(container);
        break;
      case "grammar-detail":
        renderGrammarDetail(container, params);
        break;
      case "settings":
        renderSettings(container);
        break;
      case "progress-review":
        renderProgressReview(container);
        break;
      case "listening":
        renderListening(container);
        break;
      case "listening-exercise":
        renderListeningExercise(container, params);
        break;
      case "speaking-practice":
        renderSpeakingPractice(container);
        break;
      case "speaking-exercise":
        renderSpeakingExercise(container, params);
        break;
      case "ai-conversation":
        renderAIConversation(container);
        break;
      case "ai-chat":
        renderAIChatRoom(container, params);
        break;
      case "workplace-english":
        renderWorkplaceEnglish(container);
        break;
      case "workplace-detail":
        renderWorkplaceDetail(container, params);
        break;
      case "vocab-review":
        renderVocabReview(container);
        break;
      default:
        renderModuleRoadmapCard(container, routeMeta);
        break;
    }
  }

  function bindLearningPathEvents(container) {
    container
      .querySelectorAll(".lesson-item[data-lesson-id]")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          var id = item.getAttribute("data-lesson-id");
          if (id) window.EFZNavigation.navigateTo("lesson/" + id);
        });
        item.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            item.click();
          }
        });
      });
  }

  /* ════════════════════════════════════════════════════════════════
       GLOBAL EVENT DELEGATION
       ════════════════════════════════════════════════════════════════ */

  function bindGlobalDelegatedEvents() {
    document.addEventListener("click", function (e) {
      // Route target buttons
      var targetBtn = e.target.closest("[data-route-target]");
      if (targetBtn && window.EFZNavigation) {
        var targetRoute = targetBtn.getAttribute("data-route-target");
        window.EFZNavigation.navigateTo(targetRoute);
      }

      // Theme toggle in header
      var themeToggle = e.target.closest("#theme-toggle");
      if (themeToggle) {
        window.EFZSettings.toggleTheme();
      }

      // Open lesson action (Dashboard, other views)
      var openLessonBtn = e.target.closest('[data-action="open-lesson"]');
      if (openLessonBtn) {
        var lessonId = openLessonBtn.getAttribute("data-lesson-id");
        if (lessonId) window.EFZNavigation.navigateTo("lesson/" + lessonId);
      }

      // Start quiz action
      var startQuizBtn = e.target.closest('[data-action="start-quiz"]');
      if (startQuizBtn) {
        var quizLessonId = startQuizBtn.getAttribute("data-lesson-id");
        if (quizLessonId)
          window.EFZNavigation.navigateTo("quiz/" + quizLessonId);
      }

      // Lesson item click (Dashboard continue learning card)
      var lessonItem = e.target.closest(".lesson-item[data-lesson-id]");
      if (lessonItem && !e.target.closest("[data-action]")) {
        var itemLessonId = lessonItem.getAttribute("data-lesson-id");
        if (itemLessonId)
          window.EFZNavigation.navigateTo("lesson/" + itemLessonId);
      }
    });

    window.addEventListener("online", updateChromeIndicators);
    window.addEventListener("offline", updateChromeIndicators);
  }

  /* ════════════════════════════════════════════════════════════════
       INITIALIZATION
       ════════════════════════════════════════════════════════════════ */

  document.addEventListener("DOMContentLoaded", function () {
    window.EFZStorage.init();
    window.EFZAudio.init();
    window.EFZAIConversation.init();
    window.EFZSettings.applyTheme();
    updateChromeIndicators();
    bindGlobalDelegatedEvents();

    window.EFZNavigation.init({
      onRouteChange: function (routeMeta, params) {
        renderRouteView(routeMeta, params);
      },
    });
  });
})(window, document);
