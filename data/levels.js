
(function (window) {
    'use strict';

    window.EFZ_DATA_LEVELS = [
        {
            id: 'A0',
            name: 'A0',
            fullName: 'A0 — Pemula dari Nol',
            description: 'Mengenal huruf, suara, angka, kata dasar, dan menyusun kalimat sederhana.',
            outcome: 'Mengenali bahasa Inggris dasar dan membentuk kalimat sangat sederhana.',
            units: [
                {
                    id: 'a0-u1',
                    title: 'Getting Started',
                    titleId: 'Memulai',
                    description: 'Pengenalan bahasa Inggris, alfabet A–Z, huruf vokal/konsonan, dan mengeja nama.',
                    lessonIds: ['a0-u1-l1', 'a0-u1-l2', 'a0-u1-l3', 'a0-u1-l4']
                },
                {
                    id: 'a0-u2',
                    title: 'Numbers and Time',
                    titleId: 'Angka dan Waktu',
                    description: 'Angka 1–100, hari, bulan, tanggal, dan cara memberitahu waktu.',
                    lessonIds: ['a0-u2-l1', 'a0-u2-l2', 'a0-u2-l3', 'a0-u2-l4']
                },
                {
                    id: 'a0-u3',
                    title: 'Basic Vocabulary',
                    titleId: 'Kosakata Dasar',
                    description: 'Orang dan keluarga, benda sehari-hari, warna, dan kata kerja umum.',
                    lessonIds: ['a0-u3-l1', 'a0-u3-l2', 'a0-u3-l3', 'a0-u3-l4']
                },
                {
                    id: 'a0-u4',
                    title: 'Building Basic Sentences',
                    titleId: 'Menyusun Kalimat Dasar',
                    description: 'Kata ganti subjek, kata kerja to be, urutan kalimat, kalimat positif/negatif, dan pertanyaan.',
                    lessonIds: ['a0-u4-l1', 'a0-u4-l2', 'a0-u4-l3', 'a0-u4-l4', 'a0-u4-l5']
                },
                {
                    id: 'a0-u5',
                    title: 'Introducing Yourself',
                    titleId: 'Memperkenalkan Diri',
                    description: 'Nama, informasi pribadi, asal daerah, latar belakang, dan perkenalan singkat.',
                    lessonIds: ['a0-u5-l1', 'a0-u5-l2', 'a0-u5-l3', 'a0-u5-l4']
                },
                {
                    id: 'a0-u6',
                    title: 'Everyday English',
                    titleId: 'Bahasa Inggris Sehari-hari',
                    description: 'Sapaan, pertanyaan sederhana, makanan dan minuman, tempat dan arah, serta minta mengulang.',
                    lessonIds: ['a0-u6-l1', 'a0-u6-l2', 'a0-u6-l3', 'a0-u6-l4', 'a0-u6-l5']
                }
            ]
        },
        {
            id: 'A1',
            name: 'A1',
            fullName: 'A1 — Dasar Sehari-hari',
            description: 'Informasi pribadi, rutinitas harian, pertanyaan umum, dan percakapan dasar.',
            outcome: 'Menangani pertukaran percakapan sehari-hari yang sudah dikenal.',
            units: [],
            locked: true
        },
        {
            id: 'A2',
            name: 'A2',
            fullName: 'A2 — Komunikasi Rutin',
            description: 'Pengalaman, rencana, kebutuhan, arah, dan dasar-dasar bahasa kerja.',
            outcome: 'Berkomunikasi dalam situasi rutin yang umum.',
            units: [],
            locked: true
        },
        {
            id: 'B1',
            name: 'B1',
            fullName: 'B1 — Percakapan Mandiri',
            description: 'Percakapan lebih panjang, penjelasan, dan deskripsi masalah.',
            outcome: 'Berkomunikasi lebih mandiri.',
            units: [],
            locked: true
        }
    ];

    
    function findUnitByLessonId(lessonId) {
        for (var i = 0; i < window.EFZ_DATA_LEVELS.length; i++) {
            var level = window.EFZ_DATA_LEVELS[i];
            for (var j = 0; j < level.units.length; j++) {
                var unit = level.units[j];
                if (unit.lessonIds.indexOf(lessonId) !== -1) {
                    return { level: level, unit: unit };
                }
            }
        }
        return null;
    }

    window.EFZ_DATA_HELPERS = window.EFZ_DATA_HELPERS || {};
    window.EFZ_DATA_HELPERS.findUnitByLessonId = findUnitByLessonId;
})(window);
