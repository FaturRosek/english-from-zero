
(function (window) {
    'use strict';

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    var UI = {
        escapeHtml: escapeHtml,

        /**
         * Membuat HTML string untuk card.
         * @param {Object} opts - { title, subtitle, badgeText, badgeType, content, footerContent }
         */
        card: function (opts) {
            opts = opts || {};
            var html = '<section class="card';
            if (opts.modifier) html += ' card--' + opts.modifier;
            html += '">';
            if (opts.title || opts.badgeText) {
                html += '<div class="card-header">';
                html += '<div>';
                if (opts.title) html += '<h2 class="card-title">' + escapeHtml(opts.title) + '</h2>';
                if (opts.subtitle) html += '<p class="card-subtitle">' + escapeHtml(opts.subtitle) + '</p>';
                html += '</div>';
                if (opts.badgeText) html += UI.badge(opts.badgeText, opts.badgeType || 'info');
                html += '</div>';
            }
            if (opts.content) html += opts.content;
            if (opts.footerContent) html += opts.footerContent;
            html += '</section>';
            return html;
        },

        statCard: function (label, value, meta, icon) {
            return '<div class="stat-card">' +
                (icon ? '<div class="stat-icon">' + icon + '</div>' : '') +
                '<div class="stat-label">' + escapeHtml(label) + '</div>' +
                '<div class="stat-value">' + escapeHtml(String(value)) + '</div>' +
                (meta ? '<div class="stat-meta">' + escapeHtml(meta) + '</div>' : '') +
                '</div>';
        },

        badge: function (text, type) {
            return '<span class="badge badge-' + (type || 'info') + '">' + escapeHtml(text) + '</span>';
        },

        alert: function (type, message) {
            return '<div class="alert alert-' + (type || 'info') + '">' + message + '</div>';
        },

        emptyState: function (title, message, actionText, actionTarget) {
            var html = '<div class="empty-state">' +
                '<div class="empty-state-icon" aria-hidden="true">&#128218;</div>' +
                '<h3 class="empty-state-title">' + escapeHtml(title) + '</h3>' +
                '<p class="empty-state-message">' + escapeHtml(message) + '</p>';
            if (actionText && actionTarget) {
                html += '<button type="button" class="btn btn-primary" data-route-target="' +
                    escapeHtml(actionTarget) + '">' + escapeHtml(actionText) + '</button>';
            }
            html += '</div>';
            return html;
        },

        progressBar: function (percent, label) {
            var safePercent = Math.max(0, Math.min(100, Math.round(percent || 0)));
            var html = '<div class="progress-bar-wrap">' +
                (label ? '<div class="progress-bar-label">' + escapeHtml(label) + '</div>' : '') +
                '<div class="progress-bar-track">' +
                '<div class="progress-bar-fill" style="width:' + safePercent + '%"></div>' +
                '</div>';
            if (label) {
                html += '<div class="progress-bar-value">' + safePercent + '%</div>';
            }
            html += '</div>';
            return html;
        },

        button: function (text, type, opts) {
            opts = opts || {};
            var cls = 'btn btn-' + (type || 'primary');
            if (opts.size === 'sm') cls += ' btn-sm';
            if (opts.block) cls += ' btn-block';
            var attrs = '';
            if (opts.routeTarget) attrs += ' data-route-target="' + escapeHtml(opts.routeTarget) + '"';
            if (opts.lessonId) attrs += ' data-lesson-id="' + escapeHtml(opts.lessonId) + '"';
            if (opts.id) attrs += ' id="' + escapeHtml(opts.id) + '"';
            if (opts.action) attrs += ' data-action="' + escapeHtml(opts.action) + '"';
            if (opts.disabled) attrs += ' disabled';
            return '<button type="button" class="' + cls.trim() + '"' + attrs + '>' + escapeHtml(text) + '</button>';
        },

        sectionTitle: function (title, subtitle) {
            var html = '<div class="section-title-wrap">';
            html += '<h2 class="section-title">' + escapeHtml(title) + '</h2>';
            if (subtitle) html += '<p class="section-subtitle">' + escapeHtml(subtitle) + '</p>';
            html += '</div>';
            return html;
        },

        /**
         * Membuat HTML untuk item daftar pelajaran.
         * @param {Object} lesson - data pelajaran
         * @param {Object} status - { completed, mastered, unlocked, score }
         */
        lessonItem: function (lesson, status) {
            var html = '<div class="lesson-item';
            if (!status.unlocked) html += ' lesson-item-locked';
            if (status.completed) html += ' lesson-item-completed';
            if (status.mastered) html += ' lesson-item-mastered';
            html += '"';
            if (status.unlocked) {
                html += ' data-lesson-id="' + escapeHtml(lesson.id) + '"';
                html += ' role="button" tabindex="0"';
            }
            html += '>';
            html += '<div class="lesson-item-icon">';
            if (!status.unlocked) {
                html += '&#128274;'; // lock
            } else if (status.mastered) {
                html += '&#11088;'; // star
            } else if (status.completed) {
                html += '&#9989;'; // check
            } else {
                html += '<span class="lesson-number">' + lesson.order + '</span>';
            }
            html += '</div>';
            html += '<div class="lesson-item-body">';
            html += '<div class="lesson-item-title">' + escapeHtml(lesson.title) + '</div>';
            html += '<div class="lesson-item-subtitle">' + escapeHtml(lesson.titleId) + '</div>';
            html += '</div>';
            html += '<div class="lesson-item-meta">';
            if (status.unlocked) {
                if (status.completed) {
                    html += UI.badge('Selesai', 'success');
                }
                if (status.mastered) {
                    html += UI.badge('Dikuasai', 'success');
                }
                if (status.score !== undefined && status.score !== null) {
                    html += UI.badge(status.score + '%', status.score >= 80 ? 'success' : 'warning');
                }
                if (!status.completed && !status.mastered && !status.score) {
                    html += '<span class="lesson-item-arrow">&#8250;</span>';
                }
            } else {
                html += UI.badge('Terkunci', 'warning');
            }
            html += '</div>';
            html += '</div>';
            return html;
        },

        /**
         * Membuat HTML untuk contoh kata/kalimat Inggris-Indonesia.
         */
        exampleRow: function (item, showPronunciation) {
            var html = '<div class="example-row">';
            html += '<div class="example-english">' + escapeHtml(item.english) + '</div>';
            if (showPronunciation && item.pronunciation) {
                html += '<div class="example-pron">/' + escapeHtml(item.pronunciation) + '/</div>';
            }
            html += '<div class="example-indonesian">' + escapeHtml(item.indonesian) + '</div>';
            html += '</div>';
            return html;
        },

        /**
         * Mendeteksi sapaan berdasarkan waktu.
         */
        getTimeGreeting: function () {
            var hour = new Date().getHours();
            if (hour < 11) return 'Selamat pagi';
            if (hour < 15) return 'Selamat siang';
            if (hour < 18) return 'Selamat sore';
            return 'Selamat malam';
        }
    };

    window.EFZUI = UI;
})(window);
