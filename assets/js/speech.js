
(function (window) {
    'use strict';

    var SpeechService = {
        _recognition: null,
        _isListening: false,
        _currentOpts: null,

        isSupported: function () {
            return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
        },

        
        start: function (opts) {
            if (!this.isSupported()) {
                if (opts && opts.onError) opts.onError('not-supported');
                return false;
            }
            opts = opts || {};
            this._currentOpts = opts;

            
            this.stop();

            var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SR();

            recognition.lang = opts.lang || 'en-US';
            recognition.continuous = opts.continuous !== undefined ? opts.continuous : false;
            recognition.interimResults = opts.interimResults !== undefined ? opts.interimResults : false;
            recognition.maxAlternatives = 1;

            var self = this;

            recognition.onstart = function () {
                self._isListening = true;
                if (opts.onStart) opts.onStart();
            };

            recognition.onresult = function (event) {
                var transcript = '';
                var isFinal = false;
                for (var i = event.resultIndex; i < event.results.length; i++) {
                    transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) isFinal = true;
                }
                if (opts.onResult) opts.onResult(transcript, isFinal);
            };

            recognition.onerror = function (event) {
                self._isListening = false;
                var errorMsg = event.error || 'unknown';
                
                if (opts.onError) opts.onError(errorMsg);
            };

            recognition.onend = function () {
                self._isListening = false;
                if (opts.onEnd) opts.onEnd();
            };

            this._recognition = recognition;

            try {
                recognition.start();
                return true;
            } catch (e) {
                if (opts.onError) opts.onError('start-failed');
                return false;
            }
        },

        stop: function () {
            if (this._recognition) {
                try {
                    this._recognition.stop();
                } catch (e) {}
            }
            this._isListening = false;
        },

        isListening: function () {
            return this._isListening;
        },

        
        getErrorMessage: function (errorCode) {
            var messages = {
                'not-supported': 'Browser Anda tidak mendukung pengenalan suara. Gunakan Chrome atau Edge, atau ketik jawaban Anda.',
                'no-speech': 'Tidak ada suara terdeteksi. Coba bicara lebih keras atau lebih dekat ke mikrofon.',
                'audio-capture': 'Tidak dapat mengakses mikrofon. Periksa apakah mikrofon terhubung dan izinkan akses.',
                'not-allowed': 'Izin mikrofon ditolak. Berikan izin mikrofon di pengaturan browser untuk menggunakan fitur ini.',
                'network': 'Kesalahan jaringan saat pengenalan suara. Periksa koneksi internet Anda.',
                'start-failed': 'Gagal memulai pengenalan suara. Coba lagi.',
                'unknown': 'Terjadi kesalahan tidak diketahui saat pengenalan suara.'
            };
            return messages[errorCode] || messages['unknown'];
        }
    };

    window.EFZSpeech = SpeechService;
})(window);
