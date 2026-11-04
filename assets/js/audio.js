
(function (window) {
    'use strict';

    var AudioService = {
        _synth: null,
        _voices: [],
        _currentUtterance: null,
        _isSpeaking: false,
        _initialized: false,

        init: function () {
            if (!this.isSupported() || this._initialized) return;
            this._synth = window.speechSynthesis;
            this._loadVoices();
            var self = this;
            
            if (this._synth.onvoiceschanged !== undefined) {
                this._synth.onvoiceschanged = function () {
                    self._loadVoices();
                };
            }
            
            setTimeout(function () { self._loadVoices(); }, 500);
            this._initialized = true;
        },

        isSupported: function () {
            return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
        },

        _loadVoices: function () {
            if (this._synth) {
                try {
                    this._voices = this._synth.getVoices() || [];
                } catch (e) {
                    this._voices = [];
                }
            }
        },

        getEnglishVoices: function () {
            return this._voices.filter(function (v) {
                return v.lang && v.lang.toLowerCase().startsWith('en');
            });
        },

        getAllVoices: function () {
            return this._voices;
        },

        
        speak: function (text, opts) {
            if (!this.isSupported()) {
                if (opts && opts.onError) opts.onError('not-supported');
                return;
            }
            if (!text || !text.trim()) {
                if (opts && opts.onError) opts.onError('empty-text');
                return;
            }

            opts = opts || {};
            this.stop(); 

            var utterance = new SpeechSynthesisUtterance(text);

            
            var state = window.EFZStorage ? window.EFZStorage.getState() : null;
            var rate = opts.rate !== undefined ? opts.rate : (state ? state.settings.speechRate : 0.9);
            var voiceURI = opts.voiceURI || (state ? state.settings.preferredVoiceURI : '');

            utterance.rate = Math.max(0.1, Math.min(2.0, rate));
            utterance.lang = 'en-US';
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            
            var chosenVoice = null;
            if (voiceURI) {
                for (var i = 0; i < this._voices.length; i++) {
                    if (this._voices[i].voiceURI === voiceURI) {
                        chosenVoice = this._voices[i];
                        break;
                    }
                }
            }
            if (!chosenVoice) {
                
                for (var j = 0; j < this._voices.length; j++) {
                    if (this._voices[j].lang && this._voices[j].lang.toLowerCase().startsWith('en')) {
                        chosenVoice = this._voices[j];
                        break;
                    }
                }
            }
            if (chosenVoice) {
                utterance.voice = chosenVoice;
                utterance.lang = chosenVoice.lang;
            }

            var self = this;
            utterance.onstart = function () {
                self._isSpeaking = true;
                if (opts.onStart) opts.onStart();
            };
            utterance.onend = function () {
                self._isSpeaking = false;
                self._currentUtterance = null;
                if (opts.onEnd) opts.onEnd();
            };
            utterance.onerror = function (e) {
                self._isSpeaking = false;
                self._currentUtterance = null;
                if (opts.onError) opts.onError(e.error || 'speech-error');
            };

            this._currentUtterance = utterance;
            this._synth.speak(utterance);
        },

        
        speakSlowly: function (text, opts) {
            opts = opts || {};
            opts.rate = 0.6;
            this.speak(text, opts);
        },

        stop: function () {
            if (this.isSupported() && this._synth) {
                try {
                    this._synth.cancel();
                } catch (e) {}
            }
            this._isSpeaking = false;
            this._currentUtterance = null;
        },

        isSpeaking: function () {
            if (!this.isSupported() || !this._synth) return false;
            return this._synth.speaking;
        },

        
        setPreferredVoice: function (voiceURI) {
            if (!window.EFZStorage) return;
            var state = window.EFZStorage.getState();
            state.settings.preferredVoiceURI = voiceURI;
            window.EFZStorage.saveState(state);
        },

        
        setRate: function (rate) {
            if (!window.EFZStorage) return;
            var state = window.EFZStorage.getState();
            state.settings.speechRate = Math.max(0.1, Math.min(2.0, rate));
            window.EFZStorage.saveState(state);
        }
    };

    window.EFZAudio = AudioService;
})(window);
