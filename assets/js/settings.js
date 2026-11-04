
(function (window, document) {
  "use strict";

  var Settings = {
    
    applyTheme: function () {
      var state = window.EFZStorage.getState();
      var theme = state.settings.theme || "light";
      var htmlEl = document.documentElement;
      htmlEl.setAttribute("data-theme", theme);

      
      var themeToggle = document.getElementById("theme-toggle");
      if (themeToggle) {
        themeToggle.innerHTML = theme === "dark" ? "&#9728;" : "&#9789;";
        themeToggle.setAttribute(
          "aria-label",
          theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap",
        );
        themeToggle.title = theme === "dark" ? "Mode Terang" : "Mode Gelap";
      }
    },

    
    toggleTheme: function () {
      var state = window.EFZStorage.getState();
      var newTheme = state.settings.theme === "dark" ? "light" : "dark";
      state.settings.theme = newTheme;
      window.EFZStorage.saveState(state);
      this.applyTheme();
    },

    
    updateSoundSettings: function (opts) {
      var state = window.EFZStorage.getState();
      if (opts.soundEnabled !== undefined) {
        state.settings.soundEnabled = opts.soundEnabled;
      }
      if (opts.speechRate !== undefined) {
        state.settings.speechRate = opts.speechRate;
      }
      if (opts.preferredVoiceURI !== undefined) {
        state.settings.preferredVoiceURI = opts.preferredVoiceURI;
      }
      window.EFZStorage.saveState(state);
    },

    
    exportData: function () {
      var state = window.EFZStorage.getState();
      var exportObj = {
        schemaVersion: state.schemaVersion,
        exportedAt: new Date().toISOString(),
        data: state,
      };
      var json = JSON.stringify(exportObj, null, 2);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download =
        "english-from-zero-backup-" +
        new Date().toISOString().slice(0, 10) +
        ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    
    importData: function (file, callback) {
      if (!file) {
        if (callback) callback(false, "Tidak ada file yang dipilih.");
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var parsed = JSON.parse(e.target.result);
          var data = parsed.data || parsed;
          if (!data.schemaVersion || !data.profile || !data.progress) {
            if (callback)
              callback(
                false,
                "File JSON tidak valid atau tidak memiliki struktur data yang diharapkan.",
              );
            return;
          }

          
          var confirmMsg =
            "Impor data akan MENGGANTI seluruh progres yang ada saat ini. " +
            "Apakah Anda yakin ingin melanjutkan?";
          var confirmed = window.confirm(confirmMsg);
          if (!confirmed) {
            if (callback) callback(false, "Impor dibatalkan.");
            return;
          }

          window.EFZStorage.saveState(data);
          if (callback)
            callback(true, "Data berhasil diimpor! Halaman akan dimuat ulang.");
          
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        } catch (err) {
          if (callback)
            callback(
              false,
              "Gagal membaca file: " + (err.message || "format tidak valid"),
            );
        }
      };
      reader.onerror = function () {
        if (callback) callback(false, "Gagal membaca file.");
      };
      reader.readAsText(file);
    },

    
    resetData: function (callback) {
      var confirm1 = window.confirm(
        "PERINGATAN: Tindakan ini akan MENGHAPUS seluruh progres belajar, " +
          "riwayat kuis, dan pengaturan Anda. Data yang dihapus TIDAK dapat dikembalikan.\n\n" +
          "Apakah Anda yakin ingin melanjutkan?",
      );
      if (!confirm1) {
        if (callback) callback("Reset dibatalkan.");
        return;
      }

      var confirm2 = window.confirm(
        "Konfirmasi terakhir: Yakin ingin menghapus SEMUA data dan kembali ke kondisi awal?",
      );
      if (!confirm2) {
        if (callback) callback("Reset dibatalkan.");
        return;
      }

      window.EFZStorage.resetAllData();
      if (callback)
        callback(
          "Seluruh data berhasil direset ke kondisi awal. Halaman akan dimuat ulang.",
        );
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    },

    
    saveApiKey: function (key, persistOnDevice) {
      window.EFZStorage.saveApiKey(key, persistOnDevice);
      var state = window.EFZStorage.getState();
      state.settings.rememberApiKeyOnDevice = !!persistOnDevice;
      window.EFZStorage.saveState(state);
    },

    
    setGeminiModel: function (model) {
      var state = window.EFZStorage.getState();
      state.settings.geminiModel = model || "gemini-2.5-flash-preview";
      window.EFZStorage.saveState(state);
    },

    
    setBackendUrl: function (url) {
      var state = window.EFZStorage.getState();
      state.settings.backendUrl = url || "http://localhost:3000";
      window.EFZStorage.saveState(state);
    },
  };

  window.EFZSettings = Settings;
})(window, document);
