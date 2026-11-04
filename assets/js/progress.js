
(function (window) {
  "use strict";

  var Progress = {
    

    markLessonComplete: function (lessonId) {
      var state = window.EFZStorage.getState();
      if (state.progress.completedLessonIds.indexOf(lessonId) === -1) {
        state.progress.completedLessonIds.push(lessonId);
      }
      state.progress.lessonRecords[lessonId] =
        state.progress.lessonRecords[lessonId] || {};
      state.progress.lessonRecords[lessonId].completed = true;
      state.progress.lessonRecords[lessonId].completedAt =
        new Date().toISOString();
      window.EFZStorage.saveState(state);
      window.EFZStorage.addActivity(
        "Menyelesaikan pelajaran: " + lessonId,
        "lesson",
      );
    },

    isLessonComplete: function (lessonId) {
      var state = window.EFZStorage.getState();
      return state.progress.completedLessonIds.indexOf(lessonId) !== -1;
    },

    markLessonMastered: function (lessonId) {
      var state = window.EFZStorage.getState();
      if (state.progress.masteredLessonIds.indexOf(lessonId) === -1) {
        state.progress.masteredLessonIds.push(lessonId);
      }
      state.progress.lessonRecords[lessonId] =
        state.progress.lessonRecords[lessonId] || {};
      state.progress.lessonRecords[lessonId].mastered = true;
      state.progress.lessonRecords[lessonId].masteredAt =
        new Date().toISOString();
      window.EFZStorage.saveState(state);
      window.EFZStorage.addActivity(
        "Menguasai pelajaran: " + lessonId,
        "lesson",
      );
    },

    isLessonMastered: function (lessonId) {
      var state = window.EFZStorage.getState();
      return state.progress.masteredLessonIds.indexOf(lessonId) !== -1;
    },

    
    isLessonUnlocked: function (lesson) {
      if (
        !lesson ||
        !lesson.prerequisites ||
        lesson.prerequisites.length === 0
      ) {
        return true;
      }
      var state = window.EFZStorage.getState();
      for (var i = 0; i < lesson.prerequisites.length; i++) {
        if (
          state.progress.completedLessonIds.indexOf(lesson.prerequisites[i]) ===
          -1
        ) {
          return false;
        }
      }
      return true;
    },

    
    getLessonStatus: function (lessonId) {
      var allLessons = window.EFZ_DATA_LESSONS_A0 || [];
      var lesson = null;
      for (var i = 0; i < allLessons.length; i++) {
        if (allLessons[i].id === lessonId) {
          lesson = allLessons[i];
          break;
        }
      }
      var unlocked = lesson ? this.isLessonUnlocked(lesson) : true;
      var completed = this.isLessonComplete(lessonId);
      var mastered = this.isLessonMastered(lessonId);
      var bestScore = this.getBestQuizScore(lessonId);
      return {
        unlocked: unlocked,
        completed: completed,
        mastered: mastered,
        score: bestScore,
      };
    },

    

    recordQuizAttempt: function (
      lessonId,
      quizId,
      score,
      correctCount,
      totalCount,
    ) {
      var state = window.EFZStorage.getState();
      var attempt = {
        id: "qa-" + Date.now(),
        lessonId: lessonId,
        quizId: quizId,
        score: score,
        correctCount: correctCount,
        totalCount: totalCount,
        timestamp: new Date().toISOString(),
      };
      state.progress.quizAttempts.push(attempt);
      window.EFZStorage.saveState(state);

      
      state = window.EFZStorage.getState();
      state.progress.lessonRecords[lessonId] =
        state.progress.lessonRecords[lessonId] || {};
      state.progress.lessonRecords[lessonId].bestScore = Math.max(
        state.progress.lessonRecords[lessonId].bestScore || 0,
        score,
      );
      state.progress.lessonRecords[lessonId].lastScore = score;
      state.progress.lessonRecords[lessonId].attempts =
        (state.progress.lessonRecords[lessonId].attempts || 0) + 1;
      window.EFZStorage.saveState(state);

      
      if (score >= 80) {
        this.markLessonComplete(lessonId);
      }
      
      if (score >= 90) {
        this.markLessonMastered(lessonId);
      }

      window.EFZStorage.addActivity(
        "Kuis " + lessonId + ": skor " + score + "%",
        "quiz",
      );
      return attempt;
    },

    getQuizAttempts: function (lessonId) {
      var state = window.EFZStorage.getState();
      return state.progress.quizAttempts.filter(function (a) {
        return a.lessonId === lessonId;
      });
    },

    getBestQuizScore: function (lessonId) {
      var attempts = this.getQuizAttempts(lessonId);
      if (!attempts.length) return null;
      var best = 0;
      for (var i = 0; i < attempts.length; i++) {
        if (attempts[i].score > best) best = attempts[i].score;
      }
      return best;
    },

    

    toggleVocabularyFavorite: function (vocabId) {
      var state = window.EFZStorage.getState();
      state.progress.vocabularyStatus[vocabId] =
        state.progress.vocabularyStatus[vocabId] || {};
      state.progress.vocabularyStatus[vocabId].favorite =
        !state.progress.vocabularyStatus[vocabId].favorite;
      window.EFZStorage.saveState(state);
      return state.progress.vocabularyStatus[vocabId].favorite;
    },

    isVocabularyFavorite: function (vocabId) {
      var state = window.EFZStorage.getState();
      return !!(
        state.progress.vocabularyStatus[vocabId] &&
        state.progress.vocabularyStatus[vocabId].favorite
      );
    },

    markVocabularyLearned: function (vocabId) {
      var state = window.EFZStorage.getState();
      state.progress.vocabularyStatus[vocabId] =
        state.progress.vocabularyStatus[vocabId] || {};
      state.progress.vocabularyStatus[vocabId].learned = true;
      state.progress.vocabularyStatus[vocabId].learnedAt =
        new Date().toISOString();
      window.EFZStorage.saveState(state);
    },

    isVocabularyLearned: function (vocabId) {
      var state = window.EFZStorage.getState();
      return !!(
        state.progress.vocabularyStatus[vocabId] &&
        state.progress.vocabularyStatus[vocabId].learned
      );
    },

    getLearnedVocabularyCount: function () {
      var state = window.EFZStorage.getState();
      var count = 0;
      var keys = Object.keys(state.progress.vocabularyStatus);
      for (var i = 0; i < keys.length; i++) {
        if (state.progress.vocabularyStatus[keys[i]].learned) count++;
      }
      return count;
    },

    getFavoriteVocabularyIds: function () {
      var state = window.EFZStorage.getState();
      var ids = [];
      var keys = Object.keys(state.progress.vocabularyStatus);
      for (var i = 0; i < keys.length; i++) {
        if (state.progress.vocabularyStatus[keys[i]].favorite)
          ids.push(keys[i]);
      }
      return ids;
    },

    

    markGrammarStudied: function (grammarId) {
      var state = window.EFZStorage.getState();
      state.progress.grammarStatus[grammarId] =
        state.progress.grammarStatus[grammarId] || {};
      state.progress.grammarStatus[grammarId].studied = true;
      state.progress.grammarStatus[grammarId].studiedAt =
        new Date().toISOString();
      window.EFZStorage.saveState(state);
      window.EFZStorage.addActivity(
        "Mempelajari tata bahasa: " + grammarId,
        "grammar",
      );
    },

    isGrammarStudied: function (grammarId) {
      var state = window.EFZStorage.getState();
      return !!(
        state.progress.grammarStatus[grammarId] &&
        state.progress.grammarStatus[grammarId].studied
      );
    },

    getStudiedGrammarCount: function () {
      var state = window.EFZStorage.getState();
      var count = 0;
      var keys = Object.keys(state.progress.grammarStatus);
      for (var i = 0; i < keys.length; i++) {
        if (state.progress.grammarStatus[keys[i]].studied) count++;
      }
      return count;
    },

    

    getCompletedLessonsCount: function () {
      return window.EFZStorage.getState().progress.completedLessonIds.length;
    },

    getMasteredLessonsCount: function () {
      return window.EFZStorage.getState().progress.masteredLessonIds.length;
    },

    getTotalLessonsCount: function () {
      return (window.EFZ_DATA_LESSONS_A0 || []).length;
    },

    getOverallProgress: function () {
      var total = this.getTotalLessonsCount();
      if (total === 0) return 0;
      return Math.round((this.getCompletedLessonsCount() / total) * 100);
    },

    
    getNextLesson: function () {
      var lessons = window.EFZ_DATA_LESSONS_A0 || [];
      for (var i = 0; i < lessons.length; i++) {
        var lesson = lessons[i];
        if (
          !this.isLessonComplete(lesson.id) &&
          this.isLessonUnlocked(lesson)
        ) {
          return lesson;
        }
      }
      return null;
    },

    
    getLessonsInProgress: function () {
      var lessons = window.EFZ_DATA_LESSONS_A0 || [];
      var result = [];
      for (var i = 0; i < lessons.length; i++) {
        var lesson = lessons[i];
        if (
          this.isLessonUnlocked(lesson) &&
          !this.isLessonComplete(lesson.id)
        ) {
          result.push(lesson);
        }
      }
      return result;
    },

    
    getRecentActivities: function (limit) {
      var state = window.EFZStorage.getState();
      return state.progress.recentActivities.slice(0, limit || 5);
    },

    
    getVocabularyDueForReview: function () {
      var state = window.EFZStorage.getState();
      var now = Date.now();
      var dueIds = [];
      var keys = Object.keys(state.progress.vocabularyStatus);
      for (var i = 0; i < keys.length; i++) {
        var s = state.progress.vocabularyStatus[keys[i]];
        if (s.learned && s.nextReviewDate) {
          if (new Date(s.nextReviewDate).getTime() <= now) {
            dueIds.push(keys[i]);
          }
        } else if (s.learned && !s.nextReviewDate) {
          
          dueIds.push(keys[i]);
        }
      }
      return dueIds;
    },

    

    
    recordVocabularyReview: function (vocabId, quality) {
      var state = window.EFZStorage.getState();
      var s = state.progress.vocabularyStatus[vocabId] || {};

      var interval = s.reviewInterval || 1; 
      var ease = s.easeFactor || 2.5;
      var count = s.reviewCount || 0;

      
      if (quality >= 2) {
        
        if (count === 0) {
          interval = 1;
        } else if (count === 1) {
          interval = 3;
        } else {
          interval = Math.round(interval * ease);
        }
        ease = Math.max(1.3, ease + 0.1 - (2 - quality) * 0.08);
      } else {
        
        interval = 1;
        ease = Math.max(1.3, ease - 0.2);
      }

      
      interval = Math.min(60, Math.max(1, interval));

      var nextDate = new Date(
        Date.now() + interval * 24 * 60 * 60 * 1000,
      ).toISOString();

      s.reviewInterval = interval;
      s.easeFactor = ease;
      s.reviewCount = count + 1;
      s.lastReviewed = new Date().toISOString();
      s.nextReviewDate = nextDate;
      s.learned = true;

      state.progress.vocabularyStatus[vocabId] = s;
      window.EFZStorage.saveState(state);
    },

    
    initSRSForExistingVocab: function () {
      var state = window.EFZStorage.getState();
      var now = new Date().toISOString();
      var keys = Object.keys(state.progress.vocabularyStatus);
      var updated = false;
      keys.forEach(function (id) {
        var s = state.progress.vocabularyStatus[id];
        if (s.learned && !s.nextReviewDate) {
          s.nextReviewDate = now; 
          s.reviewInterval = 1;
          s.easeFactor = 2.5;
          s.reviewCount = 0;
          state.progress.vocabularyStatus[id] = s;
          updated = true;
        }
      });
      if (updated) window.EFZStorage.saveState(state);
    },

    
    getSRSStats: function () {
      var state = window.EFZStorage.getState();
      var now = Date.now();
      var totalLearned = 0,
        dueNow = 0,
        reviewedToday = 0;
      var todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      var keys = Object.keys(state.progress.vocabularyStatus);
      keys.forEach(function (id) {
        var s = state.progress.vocabularyStatus[id];
        if (!s.learned) return;
        totalLearned++;
        if (s.nextReviewDate && new Date(s.nextReviewDate).getTime() <= now)
          dueNow++;
        if (!s.nextReviewDate) dueNow++;
        if (
          s.lastReviewed &&
          new Date(s.lastReviewed).getTime() >= todayStart.getTime()
        )
          reviewedToday++;
      });

      return {
        totalLearned: totalLearned,
        dueNow: dueNow,
        reviewedToday: reviewedToday,
      };
    },

    

    markWorkphrasePracticed: function (sectorId, phraseKey) {
      var state = window.EFZStorage.getState();
      if (!state.progress.workplaceProgress)
        state.progress.workplaceProgress = {};
      if (!state.progress.workplaceProgress[sectorId])
        state.progress.workplaceProgress[sectorId] = {};
      state.progress.workplaceProgress[sectorId][phraseKey] = {
        practiced: true,
        lastPracticed: new Date().toISOString(),
      };
      window.EFZStorage.saveState(state);
    },

    getWorkplaceProgress: function (sectorId) {
      var state = window.EFZStorage.getState();
      if (!state.progress.workplaceProgress) return {};
      return state.progress.workplaceProgress[sectorId] || {};
    },

    

    
    getRecommendations: function () {
      var recs = [];
      var prog = this;

      
      var nextLesson = prog.getNextLesson();
      if (nextLesson) {
        recs.push({
          type: "lesson",
          icon: "📚",
          title: "Lanjutkan Pelajaran",
          description: nextLesson.title + " (" + nextLesson.titleId + ")",
          action: "lesson",
          actionParam: nextLesson.id,
          priority: 1,
        });
      }

      
      var srsStats = prog.getSRSStats();
      if (srsStats.dueNow > 0) {
        recs.push({
          type: "vocab-review",
          icon: "🔁",
          title: "Review Kosakata",
          description:
            srsStats.dueNow + " kata siap untuk diulas ulang hari ini",
          action: "vocab-review",
          actionParam: "",
          priority: 2,
        });
      }

      
      var state = window.EFZStorage.getState();
      var failedLessons = [];
      Object.keys(state.progress.lessonRecords).forEach(function (id) {
        var r = state.progress.lessonRecords[id];
        if (r.bestScore !== undefined && r.bestScore < 80) {
          var lesson = prog.findLessonById(id);
          if (lesson)
            failedLessons.push({
              id: id,
              title: lesson.title,
              score: r.bestScore,
            });
        }
      });
      if (failedLessons.length > 0) {
        failedLessons.sort(function (a, b) {
          return a.score - b.score;
        });
        recs.push({
          type: "retry-quiz",
          icon: "📝",
          title: "Ulangi Kuis",
          description:
            'Skor kuis "' +
            failedLessons[0].title +
            '" belum lulus (' +
            failedLessons[0].score +
            "%)",
          action: "quiz",
          actionParam: failedLessons[0].id,
          priority: 3,
        });
      }

      
      var grammarData = window.EFZ_DATA_GRAMMAR_A0 || [];
      var unstudied = grammarData.filter(function (g) {
        return !prog.isGrammarStudied(g.id);
      });
      if (unstudied.length > 0) {
        recs.push({
          type: "grammar",
          icon: "📖",
          title: "Pelajari Tata Bahasa",
          description: unstudied[0].title + " — " + unstudied[0].titleId,
          action: "grammar-detail",
          actionParam: unstudied[0].id,
          priority: 4,
        });
      }

      
      var convCount = (state.progress.conversationSummaries || []).length;
      if (convCount === 0) {
        recs.push({
          type: "ai-chat",
          icon: "🤖",
          title: "Coba AI Conversation",
          description: "Mulai percakapan pertama dengan AI Tutor",
          action: "ai-conversation",
          actionParam: "",
          priority: 5,
        });
      } else {
        recs.push({
          type: "ai-chat",
          icon: "🤖",
          title: "Latihan Percakapan AI",
          description: "Lanjutkan berlatih speaking dengan AI Tutor",
          action: "ai-conversation",
          actionParam: "",
          priority: 5,
        });
      }

      
      var completed = prog.getCompletedLessonsCount();
      if (completed >= 5) {
        recs.push({
          type: "workplace",
          icon: "🏢",
          title: "Workplace English",
          description:
            "Pelajari bahasa Inggris untuk lingkungan kerja di Singapura",
          action: "workplace-english",
          actionParam: "",
          priority: 6,
        });
      }

      
      recs.sort(function (a, b) {
        return a.priority - b.priority;
      });
      return recs.slice(0, 4); 
    },

    
    findLessonById: function (lessonId) {
      var lessons = window.EFZ_DATA_LESSONS_A0 || [];
      for (var i = 0; i < lessons.length; i++) {
        if (lessons[i].id === lessonId) return lessons[i];
      }
      return null;
    },

    
    findQuizByLessonId: function (lessonId) {
      var quizzes = window.EFZ_DATA_QUIZZES_A0 || [];
      for (var i = 0; i < quizzes.length; i++) {
        if (quizzes[i].lessonId === lessonId) return quizzes[i];
      }
      return null;
    },
  };

  window.EFZProgress = Progress;
})(window);
