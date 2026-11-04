
(function (window) {
  "use strict";

  var DEFAULT_BACKEND_URL = "http://localhost:3000";

  var AIConversation = {
    _session: null,
    _backendUrl: "",

    init: function () {
      var state = window.EFZStorage ? window.EFZStorage.getState() : null;
      this._backendUrl =
        (state && state.settings.backendUrl) || DEFAULT_BACKEND_URL;
    },

    
    hasApiKey: function () {
      return !!(this._backendUrl && this._backendUrl.trim());
    },

    
    refreshApiKey: function () {
      var state = window.EFZStorage ? window.EFZStorage.getState() : null;
      this._backendUrl =
        (state && state.settings.backendUrl) || DEFAULT_BACKEND_URL;
    },

    
    checkBackend: function (callback) {
      var self = this;
      if (!this._backendUrl) {
        if (callback) callback(false);
        return;
      }
      fetch(this._backendUrl + "/api/health", { method: "GET", timeout: 5000 })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (callback) callback(data.status === "ok");
        })
        .catch(function () {
          if (callback) callback(false);
        });
    },

    
    startSession: function (modeId, level) {
      var mode = window.EFZ_DATA_CONVERSATION_HELPERS
        ? window.EFZ_DATA_CONVERSATION_HELPERS.findById(modeId)
        : null;
      if (!mode) return null;

      this.refreshApiKey();

      this._session = {
        mode: mode,
        level: level || "A0",
        messages: [],
        displayMessages: [],
        startTime: new Date().toISOString(),
        userTurns: 0,
        corrections: [],
        status: "active",
      };

      if (mode.starterMessage) {
        this._session.messages.push({
          role: "model",
          text: mode.starterMessage,
        });
        this._session.displayMessages.push({
          sender: "ai",
          text: mode.starterMessage,
          timestamp: new Date().toISOString(),
          isCorrection: false,
        });
      }

      return this._session;
    },

    getSession: function () {
      return this._session;
    },
    getDisplayMessages: function () {
      return this._session ? this._session.displayMessages : [];
    },
    isSessionActive: function () {
      return !!(this._session && this._session.status === "active");
    },

    
    sendMessage: function (text, callback) {
      if (!this._session) {
        callback({ success: false, message: "Tidak ada sesi aktif." });
        return;
      }
      if (!this.hasApiKey()) {
        callback({
          success: false,
          error: "no-backend",
          message:
            "Backend URL belum dikonfigurasi. Buka Settings untuk mengatur Backend Server URL.",
        });
        return;
      }

      this._session.messages.push({ role: "user", text: text });
      this._session.displayMessages.push({
        sender: "user",
        text: text,
        timestamp: new Date().toISOString(),
        isCorrection: false,
      });
      this._session.userTurns++;

      var systemPrompt = window.EFZ_DATA_CONVERSATION_HELPERS
        ? window.EFZ_DATA_CONVERSATION_HELPERS.buildSystemPrompt(
            this._session.mode,
            this._session.level,
          )
        : "";

      this._callBackend("/api/ai/chat", systemPrompt, callback);
    },

    
    _callBackend: function (endpoint, systemPrompt, callback) {
      var self = this;
      var url = this._backendUrl.replace(/\/$/, "") + endpoint;

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: this._session.messages,
          systemPrompt: systemPrompt,
        }),
      })
        .then(function (response) {
          if (!response.ok) {
            return response
              .json()
              .catch(function () {
                return {
                  success: false,
                  message: "Server error (" + response.status + ")",
                };
              })
              .then(function (errData) {
                throw errData;
              });
          }
          return response.json();
        })
        .then(function (data) {
          if (data.success && data.text) {
            var isCorrection =
              data.isCorrection ||
              data.text.indexOf("Better sentence:") !== -1 ||
              data.text.indexOf("Penjelasan:") !== -1;

            self._session.messages.push({ role: "model", text: data.text });
            self._session.displayMessages.push({
              sender: "ai",
              text: data.text,
              timestamp: new Date().toISOString(),
              isCorrection: isCorrection,
            });
            if (isCorrection) self._session.corrections.push(data.text);
            callback({
              success: true,
              text: data.text,
              isCorrection: isCorrection,
            });
          } else {
            callback({
              success: false,
              error: data.error || "empty-response",
              message:
                data.message ||
                "AI tidak memberikan respons. Coba kirim pesan lagi.",
            });
          }
        })
        .catch(function (error) {
          var msg =
            error && error.message
              ? error.message
              : "Tidak dapat terhubung ke server backend. Pastikan server berjalan.";
          if (error && error.error) {
            msg = error.message || msg;
          }
          callback({
            success: false,
            error: error.error || "network",
            message: msg,
          });
        });
    },

    
    endSession: function (callback) {
      if (!this._session) {
        callback({ success: false, message: "Tidak ada sesi aktif." });
        return;
      }

      this._session.status = "ended";
      var self = this;
      var localSummary = this._buildLocalSummary();

      if (this.hasApiKey() && this._session.userTurns > 0) {
        var reviewPrompt =
          "Sesi latihan sudah selesai. Tolong berikan ringkasan singkat dalam format ini:\n\n" +
          "Topik: [topik yang dipraktikkan]\n" +
          "Jumlah percakapan: [jumlah percakapan saya]\n" +
          "Kata/frasa baru: [2-3 kata atau frasa berguna yang bisa saya pelajari]\n" +
          'Kesalahan berulang: [1-2 kesalahan yang berulang, jika ada. Jika tidak ada, tulis "Tidak ada kesalahan signifikan"]\n' +
          "Contoh koreksi: [1-2 kalimat yang dikoreksi dari percakapan kita]\n" +
          "Saran berikutnya: [satu saran latihan berikutnya]\n\n" +
          "Tulis dalam Bahasa Indonesia kecuali untuk contoh kalimat Inggris. Jangan beri nilai atau skor.";

        this._session.messages.push({ role: "user", text: reviewPrompt });

        var systemPrompt = window.EFZ_DATA_CONVERSATION_HELPERS
          ? window.EFZ_DATA_CONVERSATION_HELPERS.buildSystemPrompt(
              this._session.mode,
              this._session.level,
            )
          : "";

        var url = this._backendUrl.replace(/\/$/, "") + "/api/ai/session-end";

        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: this._session.messages,
            systemPrompt: systemPrompt,
          }),
        })
          .then(function (response) {
            if (!response.ok) throw { status: response.status };
            return response.json();
          })
          .then(function (data) {
            if (data.success && data.review) {
              localSummary.review = data.review;
            }
            self._saveSummary(localSummary);
            callback({ success: true, summary: localSummary });
            self._session = null;
          })
          .catch(function () {
            self._saveSummary(localSummary);
            callback({ success: true, summary: localSummary });
            self._session = null;
          });
      } else {
        this._saveSummary(localSummary);
        callback({ success: true, summary: localSummary });
        this._session = null;
      }
    },

    _buildLocalSummary: function () {
      var s = this._session;
      var reviewText =
        "Sesi: " +
        s.mode.titleId +
        "\n" +
        "Jumlah percakapan: " +
        s.userTurns +
        " kali\n" +
        "Koreksi diberikan: " +
        s.corrections.length +
        " kali\n";
      if (s.corrections.length > 0) {
        reviewText +=
          "Contoh koreksi:\n" + s.corrections[0].substring(0, 200) + "...\n";
      }
      reviewText +=
        "Saran berikutnya: Lanjutkan berlatih untuk meningkatkan kelancaran.";
      return {
        id: "conv-" + Date.now(),
        modeId: s.mode.id,
        modeTitle: s.mode.title,
        modeTitleId: s.mode.titleId,
        level: s.level,
        startTime: s.startTime,
        endTime: new Date().toISOString(),
        userTurns: s.userTurns,
        corrections: s.corrections.length,
        review: reviewText,
      };
    },

    _saveSummary: function (summary) {
      if (!window.EFZStorage) return;
      var state = window.EFZStorage.getState();
      state.progress.conversationSummaries.push(summary);
      state.progress.conversationSummaries =
        state.progress.conversationSummaries.slice(-20);
      window.EFZStorage.saveState(state);
      window.EFZStorage.addActivity(
        "Sesi percakapan AI: " +
          summary.modeTitleId +
          " (" +
          summary.userTurns +
          " percakapan)",
        "conversation",
      );
    },

    clearSession: function () {
      this._session = null;
    },

    getConversationSummaries: function () {
      var state = window.EFZStorage.getState();
      return state.progress.conversationSummaries || [];
    },
  };

  window.EFZAIConversation = AIConversation;
})(window);
