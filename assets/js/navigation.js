
(function (window) {
  "use strict";

  var ROUTES = {
    dashboard: {
      id: "dashboard",
      title: "Dashboard",
      subtitle: "Ringkasan progres belajar dan langkah berikutnya",
      phaseTarget: "Phase 1",
      summary:
        "Menampilkan progres belajar aktual, rekomendasi materi berikutnya, kosakata yang perlu diulas, serta akses cepat ke latihan bicara AI.",
    },
    "learning-path": {
      id: "learning-path",
      title: "Learning Path",
      subtitle: "Kurikulum bertahap dari Level A0 hingga Bahasa Inggris Kerja",
      phaseTarget: "Phase 2",
      summary:
        "Berisi jalur belajar terstruktur mulai dari Level A0 (Unit 1 s/d Unit 6: Huruf, Angka, Kosakata Dasar, Kalimat Dasar, Perkenalan Diri, dan Percakapan Sehari-hari).",
    },
    lesson: {
      id: "lesson",
      title: "Pelajaran",
      subtitle: "Materi pelajaran dan latihan terbimbing",
      phaseTarget: "Phase 2",
      summary:
        "Materi pelajaran dengan penjelasan Bahasa Indonesia, contoh, latihan, dan kuis.",
      parentNav: "learning-path",
      isSubRoute: true,
    },
    quiz: {
      id: "quiz",
      title: "Kuis",
      subtitle: "Uji pemahaman Anda",
      phaseTarget: "Phase 3",
      summary: "Kuis interaktif dengan berbagai tipe soal.",
      parentNav: "learning-path",
      isSubRoute: true,
    },
    vocabulary: {
      id: "vocabulary",
      title: "Vocabulary",
      subtitle:
        "Kosakata bahasa Inggris dengan arti Indonesia, contoh kalimat, dan flashcards",
      phaseTarget: "Phase 4",
      summary:
        "Latihan kosakata terarah (~10 kata per sesi fleksibel) menggunakan Flashcards, pilih arti, pencocokan kata, dan lengkapi kalimat.",
    },
    "vocab-flashcards": {
      id: "vocab-flashcards",
      title: "Flashcards",
      subtitle: "Latihan kosakata dengan flashcards",
      phaseTarget: "Phase 4",
      summary: "Latihan flashcards kosakata.",
      parentNav: "vocabulary",
      isSubRoute: true,
    },
    grammar: {
      id: "grammar",
      title: "Grammar",
      subtitle:
        "Penjelasan tata bahasa Inggris yang ramah pemula dalam Bahasa Indonesia",
      phaseTarget: "Phase 4",
      summary:
        "Mempelajari Subject Pronouns, To Be (am/is/are), struktur kalimat dasar, Simple Present, kalimat negatif/tanya, hingga Past & Future secara bertahap.",
    },
    "grammar-detail": {
      id: "grammar-detail",
      title: "Tata Bahasa",
      subtitle: "Penjelasan tata bahasa",
      phaseTarget: "Phase 4",
      summary: "Detail penjelasan tata bahasa dengan contoh dan latihan.",
      parentNav: "grammar",
      isSubRoute: true,
    },
    listening: {
      id: "listening",
      title: "Listening",
      subtitle:
        "Latihan mendengarkan pelafalan kata, kalimat, dan dialog pendek",
      phaseTarget: "Phase 2",
      summary:
        "Mendengarkan audio bahasa Inggris dengan opsi pemutaran normal/lambat, buka/tutup transkrip, dan soal pemahaman.",
    },
    "listening-exercise": {
      id: "listening-exercise",
      title: "Latihan Listening",
      subtitle: "Dengarkan dan jawab soal pemahaman",
      phaseTarget: "Phase 2",
      summary:
        "Latihan mendengarkan individual dengan audio TTS, transkrip, dan soal.",
      parentNav: "listening",
      isSubRoute: true,
    },
    "speaking-practice": {
      id: "speaking-practice",
      title: "Speaking Practice",
      subtitle:
        "Latihan pengucapan terbimbing menggunakan mikrofon atau fallback teks",
      phaseTarget: "Phase 2",
      summary:
        "Latihan Listen & Repeat, membaca kalimat dengan suara keras, dan menjawab prompt pendek menggunakan SpeechRecognition browser.",
    },
    "speaking-exercise": {
      id: "speaking-exercise",
      title: "Latihan Speaking",
      subtitle: "Berbicara dengan mikrofon atau fallback teks",
      phaseTarget: "Phase 2",
      summary:
        "Latihan pengucapan individual dengan mikrofon dan perbandingan teks.",
      parentNav: "speaking-practice",
      isSubRoute: true,
    },
    "ai-conversation": {
      id: "ai-conversation",
      title: "AI Conversation",
      subtitle:
        "Latihan berbicara bahasa Inggris interaktif bersama AI Tutor yang sabar",
      phaseTarget: "Phase 2",
      summary:
        "Fitur utama untuk mengobrol langsung (suara/teks) dengan AI Tutor pada 5 mode: Guided Beginner Chat, Daily Conversation, Workplace Roleplay, Job Interview, dan Free Practice.",
    },
    "ai-chat": {
      id: "ai-chat",
      title: "AI Chat Room",
      subtitle: "Sesi percakapan dengan AI Tutor",
      phaseTarget: "Phase 2",
      summary: "Ruang percakapan real-time dengan AI Tutor.",
      parentNav: "ai-conversation",
      isSubRoute: true,
    },
    "workplace-english": {
      id: "workplace-english",
      title: "Workplace English",
      subtitle:
        "Bahasa Inggris praktis untuk wawancara dan lingkungan kerja di Singapura",
      phaseTarget: "Phase 3",
      summary:
        "Materi bahasa Inggris praktis untuk 6 sektor kerja: Kantor, IT Support, Gudang, Pabrik, Wawancara Kerja, dan HR.",
    },
    "workplace-detail": {
      id: "workplace-detail",
      title: "Materi Workplace",
      subtitle: "Frasa dan dialog untuk sektor kerja",
      phaseTarget: "Phase 3",
      summary:
        "Frasa, kosakata, dan dialog contoh untuk sektor kerja tertentu.",
      parentNav: "workplace-english",
      isSubRoute: true,
    },
    "vocab-review": {
      id: "vocab-review",
      title: "Vocabulary Review",
      subtitle: "Review kosakata dengan Spaced Repetition",
      phaseTarget: "Phase 3",
      summary: "Sesi review kosakata berdasarkan jadwal Spaced Repetition.",
      parentNav: "vocabulary",
      isSubRoute: true,
    },
    "progress-review": {
      id: "progress-review",
      title: "Progress & Review",
      subtitle:
        "Catatan penguasaan materi, riwayat kuis, rekomendasi, dan jadwal Spaced Review",
      phaseTarget: "Phase 3",
      summary:
        "Memantau pelajaran yang selesai vs dikuasai (mastery), topik yang perlu diulang, serta ringkasan sesi percakapan AI.",
    },
    settings: {
      id: "settings",
      title: "Settings",
      subtitle:
        "Pengaturan profil belajar, suara, tema, dan cadangan data JSON",
      phaseTarget: "Phase 1–8",
      summary:
        "Mengatur nama tampilan, level saat ini, preferensi suara, tema tampilan, serta fitur Export/Import dan Reset progres.",
    },
  };

  var currentRouteId = "dashboard";
  var currentRouteParams = [];
  var onRouteChangeCallback = null;

  
  function parseHashRoute(hashStr) {
    var clean = (hashStr || "").replace(/^#/, "");
    if (!clean) return { base: "dashboard", params: [] };
    var parts = clean.split("/");
    var base = parts[0];
    var params = parts.slice(1).filter(function (p) {
      return p.length > 0;
    });
    return { base: base, params: params };
  }

  function normalizeRoute(routeStr) {
    var parsed = parseHashRoute(routeStr);
    if (parsed.base && ROUTES[parsed.base]) {
      return { id: parsed.base, params: parsed.params };
    }
    return { id: "dashboard", params: [] };
  }

  
  function getNavHighlightRoute(routeId) {
    var route = ROUTES[routeId];
    if (route && route.parentNav) {
      return route.parentNav;
    }
    return routeId;
  }

  var NavigationController = {
    init: function (options) {
      onRouteChangeCallback =
        options && typeof options.onRouteChange === "function"
          ? options.onRouteChange
          : null;

      var self = this;

      
      var navButtons = document.querySelectorAll(".nav-link[data-route]");
      navButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var target = btn.getAttribute("data-route");
          self.navigateTo(target);
          self.closeMobileSidebar();
        });
      });

      
      var mobileMenuBtn = document.getElementById("mobile-menu-btn");
      var closeSidebarBtn = document.getElementById("sidebar-close-btn");
      var overlay = document.getElementById("sidebar-overlay");

      if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", function () {
          self.openMobileSidebar();
        });
      }
      if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", function () {
          self.closeMobileSidebar();
        });
      }
      if (overlay) {
        overlay.addEventListener("click", function () {
          self.closeMobileSidebar();
        });
      }

      
      window.addEventListener("hashchange", function () {
        var parsed = parseHashRoute(window.location.hash);
        var newFullHash =
          parsed.base +
          (parsed.params.length ? "/" + parsed.params.join("/") : "");
        var currentFullHash =
          currentRouteId +
          (currentRouteParams && currentRouteParams.length
            ? "/" + currentRouteParams.join("/")
            : "");
        if (
          parsed.base &&
          ROUTES[parsed.base] &&
          newFullHash !== currentFullHash
        ) {
          self.navigateTo(newFullHash, { skipHashUpdate: true });
        }
      });

      
      var initialHash = window.location.hash.replace("#", "");
      var savedRoute = window.EFZStorage
        ? window.EFZStorage.getState().navigation.lastRoute
        : "dashboard";
      var startRoute = ROUTES[parseHashRoute(initialHash).base]
        ? initialHash
        : normalizeRoute(savedRoute).id;

      this.navigateTo(startRoute, { replaceHash: true });
    },

    getRoutes: function () {
      return ROUTES;
    },

    getCurrentRoute: function () {
      return ROUTES[currentRouteId];
    },

    getCurrentParams: function () {
      return currentRouteParams;
    },

    navigateTo: function (routeStr, opts) {
      var options = opts || {};
      var normalized = normalizeRoute(routeStr);
      var validRouteId = normalized.id;
      var routeParams = normalized.params;
      currentRouteId = validRouteId;
      currentRouteParams = routeParams;
      var routeMeta = ROUTES[validRouteId];

      
      var highlightRoute = getNavHighlightRoute(validRouteId);
      var navButtons = document.querySelectorAll(".nav-link[data-route]");
      navButtons.forEach(function (btn) {
        var isMatch = btn.getAttribute("data-route") === highlightRoute;
        btn.classList.toggle("active", isMatch);
        if (isMatch) {
          btn.setAttribute("aria-current", "page");
        } else {
          btn.removeAttribute("aria-current");
        }
      });

      
      var titleEl = document.getElementById("page-title");
      var subtitleEl = document.getElementById("page-subtitle");
      if (titleEl) {
        titleEl.textContent = routeMeta.title;
      }
      if (subtitleEl) {
        subtitleEl.textContent = routeMeta.subtitle;
      }

      
      if (window.EFZStorage && !ROUTES[validRouteId].isSubRoute) {
        window.EFZStorage.setLastRoute(validRouteId);
      }

      
      var fullHash =
        validRouteId + (routeParams.length ? "/" + routeParams.join("/") : "");
      if (!options.skipHashUpdate) {
        if (
          options.replaceHash &&
          window.history &&
          window.history.replaceState
        ) {
          window.history.replaceState(null, "", "#" + fullHash);
        } else {
          window.location.hash = fullHash;
        }
      }

      
      if (onRouteChangeCallback) {
        onRouteChangeCallback(routeMeta, routeParams);
      }

      
      var contentEl = document.getElementById("app-content");
      if (contentEl) {
        contentEl.scrollTop = 0;
      }
    },

    openMobileSidebar: function () {
      var sidebar = document.getElementById("app-sidebar");
      var overlay = document.getElementById("sidebar-overlay");
      var menuBtn = document.getElementById("mobile-menu-btn");
      if (sidebar) sidebar.classList.add("open");
      if (overlay) overlay.classList.add("active");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    },

    closeMobileSidebar: function () {
      var sidebar = document.getElementById("app-sidebar");
      var overlay = document.getElementById("sidebar-overlay");
      var menuBtn = document.getElementById("mobile-menu-btn");
      if (sidebar) sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("active");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    },
  };

  window.EFZNavigation = NavigationController;
})(window);
