
(function (window) {
  "use strict";

  var STORAGE_KEY = "efz_app_state_v1";
  var SESSION_API_KEY = "efz_gemini_session_api_key";
  var PERSISTENT_API_KEY = "efz_gemini_persistent_api_key";
  var CURRENT_SCHEMA_VERSION = "1.0.0";

  
  var memoryFallbackState = null;
  var isLocalStorageAvailable = false;

  function checkLocalStorageSupport() {
    try {
      var testKey = "__efz_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (err) {
      return false;
    }
  }

  function createDefaultState() {
    var now = new Date().toISOString();
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      profile: {
        displayName: "Pembelajar",
        currentLevel: "A0",
        targetGoal: "Komunikasi sehari-hari & kerja di Singapura",
      },
      navigation: {
        lastRoute: "dashboard",
      },
      progress: {
        completedLessonIds: [],
        masteredLessonIds: [],
        lessonRecords: {},
        quizAttempts: [],
        vocabularyStatus: {},
        grammarStatus: {},
        recentActivities: [
          {
            id: "init-foundation",
            timestamp: now,
            type: "system",
            title: "Fondasi belajar siap digunakan (Level A0)",
          },
        ],
        conversationSummaries: [],
        workplaceProgress: {},
      },
      settings: {
        theme: "light",
        soundEnabled: true,
        speechRate: 0.9,
        preferredVoiceURI: "",
        rememberApiKeyOnDevice: false,
        geminiModel: "gemini-2.5-flash-preview",
        backendUrl: "http://localhost:3000",
      },
    };
  }

  
  function sanitizeAndMigrateState(rawState) {
    var defaults = createDefaultState();
    if (!rawState || typeof rawState !== "object") {
      return defaults;
    }

    var merged = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      createdAt:
        typeof rawState.createdAt === "string"
          ? rawState.createdAt
          : defaults.createdAt,
      updatedAt: new Date().toISOString(),
      profile: Object.assign({}, defaults.profile, rawState.profile || {}),
      navigation: Object.assign(
        {},
        defaults.navigation,
        rawState.navigation || {},
      ),
      progress: Object.assign({}, defaults.progress, rawState.progress || {}),
      settings: Object.assign({}, defaults.settings, rawState.settings || {}),
    };

    if (!Array.isArray(merged.progress.completedLessonIds)) {
      merged.progress.completedLessonIds = [];
    }
    if (!Array.isArray(merged.progress.masteredLessonIds)) {
      merged.progress.masteredLessonIds = [];
    }
    if (!Array.isArray(merged.progress.quizAttempts)) {
      merged.progress.quizAttempts = [];
    }
    if (!Array.isArray(merged.progress.recentActivities)) {
      merged.progress.recentActivities = defaults.progress.recentActivities;
    }
    if (!Array.isArray(merged.progress.conversationSummaries)) {
      merged.progress.conversationSummaries = [];
    }
    if (
      typeof merged.progress.workplaceProgress !== "object" ||
      Array.isArray(merged.progress.workplaceProgress)
    ) {
      merged.progress.workplaceProgress = {};
    }

    return merged;
  }

  var StorageService = {
    init: function () {
      isLocalStorageAvailable = checkLocalStorageSupport();
      var state = this.getState();
      this.saveState(state);
      return {
        available: isLocalStorageAvailable,
        schemaVersion: state.schemaVersion,
      };
    },

    isPersistentAvailable: function () {
      return isLocalStorageAvailable;
    },

    getSchemaVersion: function () {
      return CURRENT_SCHEMA_VERSION;
    },

    getState: function () {
      if (!isLocalStorageAvailable) {
        if (!memoryFallbackState) {
          memoryFallbackState = createDefaultState();
        }
        return JSON.parse(JSON.stringify(memoryFallbackState));
      }

      try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          var initial = createDefaultState();
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
          return initial;
        }
        var parsed = JSON.parse(raw);
        return sanitizeAndMigrateState(parsed);
      } catch (err) {
        console.warn(
          "[StorageService] Data lokal rusak atau gagal dibaca, memuat ulang state aman:",
          err,
        );
        return createDefaultState();
      }
    },

    saveState: function (nextState) {
      var cleanState = sanitizeAndMigrateState(nextState);
      cleanState.updatedAt = new Date().toISOString();

      if (!isLocalStorageAvailable) {
        memoryFallbackState = cleanState;
        return true;
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
        return true;
      } catch (err) {
        console.error("[StorageService] Gagal menyimpan ke localStorage:", err);
        memoryFallbackState = cleanState;
        return false;
      }
    },

    updateProfile: function (partialProfile) {
      var state = this.getState();
      state.profile = Object.assign({}, state.profile, partialProfile || {});
      this.saveState(state);
      return state.profile;
    },

    setLastRoute: function (routeId) {
      var state = this.getState();
      state.navigation.lastRoute = routeId;
      this.saveState(state);
    },

    addActivity: function (title, type) {
      var state = this.getState();
      state.progress.recentActivities.unshift({
        id: "act-" + Date.now(),
        timestamp: new Date().toISOString(),
        type: type || "info",
        title: title,
      });
      
      state.progress.recentActivities = state.progress.recentActivities.slice(
        0,
        25,
      );
      this.saveState(state);
    },

    resetAllData: function () {
      var fresh = createDefaultState();
      this.clearApiKey();
      this.saveState(fresh);
      return fresh;
    },

    
    getApiKey: function () {
      try {
        var sessionKey = window.sessionStorage.getItem(SESSION_API_KEY);
        if (sessionKey) {
          return sessionKey;
        }
        if (isLocalStorageAvailable) {
          var persisted = window.localStorage.getItem(PERSISTENT_API_KEY);
          if (persisted) {
            return persisted;
          }
        }
      } catch (err) {
        
      }
      return "";
    },

    clearApiKey: function () {
      try {
        window.sessionStorage.removeItem(SESSION_API_KEY);
        if (isLocalStorageAvailable) {
          window.localStorage.removeItem(PERSISTENT_API_KEY);
        }
      } catch (err) {
        
      }
    },

    
    saveApiKey: function (key, persist) {
      try {
        window.sessionStorage.setItem(SESSION_API_KEY, key);
        if (persist && isLocalStorageAvailable) {
          window.localStorage.setItem(PERSISTENT_API_KEY, key);
        } else if (isLocalStorageAvailable) {
          window.localStorage.removeItem(PERSISTENT_API_KEY);
        }
      } catch (err) {
        
      }
    },
  };

  window.EFZStorage = StorageService;
})(window);
