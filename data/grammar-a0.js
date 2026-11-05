
(function (window) {
    'use strict';

    window.EFZ_DATA_GRAMMAR_A0 = [
        {
            id: 'g-01',
            order: 1,
            title: 'Subject Pronouns',
            titleId: 'Kata Ganti Subjek',
            level: 'A0',
            explanation:
                'Kata ganti subjek (subject pronouns) adalah kata yang menggantikan nama orang atau benda yang menjadi subjek dalam kalimat. ' +
                'Dalam bahasa Inggris, ada tujuh kata ganti subjek utama: I, you, he, she, it, we, they. ' +
                'Kata ganti ini dipakai supaya kita tidak perlu menyebut nama orang berulang-ulang.',
            formula: 'Subjek + kata kerja + objek/keterangan',
            examples: [
                { english: 'I am a student.', indonesian: 'Saya seorang siswa.' },
                { english: 'You are my friend.', indonesian: 'Kamu teman saya.' },
                { english: 'He is my brother.', indonesian: 'Dia saudara laki-laki saya.' },
                { english: 'She is a teacher.', indonesian: 'Dia seorang guru.' },
                { english: 'It is a book.', indonesian: 'Itu sebuah buku.' },
                { english: 'We are a team.', indonesian: 'Kami sebuah tim.' },
                { english: 'They are students.', indonesian: 'Mereka siswa.' }
            ],
            commonMistakes: [
                'Menggunakan nama diri terus-menerus alih-alih kata ganti. Contoh salah: "Budi is tall." → Seharusnya: "He is tall."',
                'Menggunakan "he" untuk perempuan atau "she" untuk laki-laki. He = laki-laki, She = perempuan.',
                'Lupa bahwa "I" selalu ditulis huruf kapital, di mana pun posisinya dalam kalimat.',
                'Menggunakan "it" untuk orang. "It" hanya untuk benda atau hewan.'
            ],
            exerciseItems: [
                { prompt: '___ am from Indonesia. (saya)', answer: 'I' },
                { prompt: '___ is my sister. (dia, perempuan)', answer: 'She' },
                { prompt: '___ are happy. (mereka)', answer: 'They' },
                { prompt: '___ is a cat. (benda/hewan)', answer: 'It' },
                { prompt: '___ are my friends. (kamu)', answer: 'You' }
            ]
        },
        {
            id: 'g-02',
            order: 2,
            title: 'To Be (am / is / are)',
            titleId: 'Kata Kerja To Be',
            level: 'A0',
            explanation:
                'Kata kerja "to be" adalah kata kerja paling dasar dalam bahasa Inggris. ' +
                'Fungsinya seperti kata "adalah/ialah" dalam bahasa Indonesia. ' +
                'To be dipakai untuk menjelaskan identitas, sifat, atau keadaan. ' +
                'Bentuk to be berubah tergantung subjek: I → am, he/she/it → is, you/we/they → are.',
            formula: 'Subjek + to be (am/is/are) + keterangan',
            examples: [
                { english: 'I am a student.', indonesian: 'Saya seorang siswa.' },
                { english: 'He is tall.', indonesian: 'Dia tinggi.' },
                { english: 'She is happy.', indonesian: 'Dia senang.' },
                { english: 'It is a cat.', indonesian: 'Itu seekor kucing.' },
                { english: 'You are kind.', indonesian: 'Kamu baik hati.' },
                { english: 'We are ready.', indonesian: 'Kami siap.' },
                { english: 'They are my friends.', indonesian: 'Mereka teman-teman saya.' }
            ],
            commonMistakes: [
                'Menggunakan "is" setelah "I". Salah: "I is happy." → Benar: "I am happy."',
                'Menggunakan "am" setelah "he/she/it". Salah: "She am tall." → Benar: "She is tall."',
                'Menggunakan "is" setelah "they". Salah: "They is here." → Benar: "They are here."',
                'Lupa menggunakan to be sama sekali. Salah: "He tall." → Benar: "He is tall."'
            ],
            exerciseItems: [
                { prompt: 'I ___ a teacher. (am/is/are)', answer: 'am' },
                { prompt: 'She ___ my friend. (am/is/are)', answer: 'is' },
                { prompt: 'They ___ students. (am/is/are)', answer: 'are' },
                { prompt: 'It ___ a good book. (am/is/are)', answer: 'is' },
                { prompt: 'We ___ from Indonesia. (am/is/are)', answer: 'are' }
            ]
        },
        {
            id: 'g-03',
            order: 3,
            title: 'Nouns, Verbs, and Adjectives',
            titleId: 'Kata Benda, Kata Kerja, dan Kata Sifat',
            level: 'A0',
            explanation:
                'Dalam bahasa Inggris, kata dibagi menjadi beberapa jenis. ' +
                'Kata benda (noun) adalah nama orang, tempat, benda, atau konsep. ' +
                'Kata kerja (verb) adalah kata yang menunjukkan aksi atau keadaan. ' +
                'Kata sifat (adjective) adalah kata yang menerangkan kata benda, seperti sifat, warna, ukuran, atau perasaan.',
            formula: 'Kata benda + kata kerja + kata sifat → contoh: "The book is new."',
            examples: [
                { english: 'book (noun) — buku', indonesian: 'book = kata benda' },
                { english: 'eat (verb) — makan', indonesian: 'eat = kata kerja' },
                { english: 'red (adjective) — merah', indonesian: 'red = kata sifat' },
                { english: 'The book is new.', indonesian: 'Buku itu baru. (book=benda, is=kerja, new=sifat)' },
                { english: 'She eats rice.', indonesian: 'Dia makan nasi. (she=benda, eats=kerja, rice=benda)' },
                { english: 'The red car is big.', indonesian: 'Mobil merah itu besar. (car=benda, red=sifat, big=sifat)' }
            ],
            commonMistakes: [
                'Menggunakan kata sifat tanpa kata benda. "Red is car" → Seharusnya "The car is red."',
                'Menggunakan kata benda sebagai kata kerja. "She book" → Seharusnya "She reads a book."',
                'Meletakkan kata sifat setelah kata benda. "The car red" → Seharusnya "The red car."'
            ],
            exerciseItems: [
                { prompt: '"run" adalah kata ___ (benda/kerja/sifat)', answer: 'kerja' },
                { prompt: '"happy" adalah kata ___ (benda/kerja/sifat)', answer: 'sifat' },
                { prompt: '"table" adalah kata ___ (benda/kerja/sifat)', answer: 'benda' },
                { prompt: '"big" adalah kata ___ (benda/kerja/sifat)', answer: 'sifat' },
                { prompt: '"sleep" adalah kata ___ (benda/kerja/sifat)', answer: 'kerja' }
            ]
        },
        {
            id: 'g-04',
            order: 4,
            title: 'Basic Sentence Structure',
            titleId: 'Struktur Kalimat Dasar',
            level: 'A0',
            explanation:
                'Kalimat bahasa Inggris yang paling dasar mengikuti pola: Subjek + Kata Kerja + Objek/Keterangan. ' +
                'Ini berbeda dengan bahasa Indonesia yang kadang lebih fleksibel. ' +
                'Dalam bahasa Inggris, urutan kata sangat penting. ' +
                'Jika urutan salah, makna kalimat bisa berubah atau tidak masuk akal.',
            formula: 'Subjek + Kata Kerja + Objek/Keterangan (S + V + O/C)',
            examples: [
                { english: 'I eat rice.', indonesian: 'Saya makan nasi. (S=I, V=eat, O=rice)' },
                { english: 'She works in an office.', indonesian: 'Dia bekerja di kantor. (S=She, V=works, C=in an office)' },
                { english: 'They go to school.', indonesian: 'Mereka pergi ke sekolah. (S=They, V=go, C=to school)' },
                { english: 'We read books.', indonesian: 'Kami membaca buku. (S=We, V=read, O=books)' },
                { english: 'He is my friend.', indonesian: 'Dia teman saya. (S=He, V=is, C=my friend)' }
            ],
            commonMistakes: [
                'Membalik urutan subjek dan objek. Salah: "Rice eat I." → Benar: "I eat rice."',
                'Menggunakan struktur bahasa Indonesia. Salah: "Saya pergi ke sekolah" → Benar: "I go to school." bukan "I to school go."',
                'Lupa kata kerja. Salah: "He to school." → Benar: "He goes to school."'
            ],
            exerciseItems: [
                { prompt: 'Susun: (eat / I / rice) → ___', answer: 'I eat rice' },
                { prompt: 'Susun: (school / to / go / they) → ___', answer: 'They go to school' },
                { prompt: 'Susun: (friend / my / is / she) → ___', answer: 'She is my friend' },
                { prompt: 'Susun: (office / in / works / he / an) → ___', answer: 'He works in an office' },
                { prompt: 'Susun: (books / we / read) → ___', answer: 'We read books' }
            ]
        },
        {
            id: 'g-05',
            order: 5,
            title: 'Simple Present Tense',
            titleId: 'Waktu Sekarang Sederhana',
            level: 'A0',
            explanation:
                'Simple Present digunakan untuk kebiasaan, fakta, atau hal yang berlaku umum. ' +
                'Pola dasarnya: Subjek + Kata Kerja. ' +
                'Penting: jika subjek adalah he, she, atau it, kata kerja mendapat tambahan -s atau -es. ' +
                'Contoh: I work → He works. I go → She goes. I watch → It watches.',
            formula: 'Subjek + kata kerja (+ s/es jika he/she/it) + objek/keterangan',
            examples: [
                { english: 'I work every day.', indonesian: 'Saya bekerja setiap hari.' },
                { english: 'He works every day.', indonesian: 'Dia bekerja setiap hari. (works mendapat -s)' },
                { english: 'She goes to school.', indonesian: 'Dia pergi ke sekolah. (goes mendapat -es)' },
                { english: 'It rains a lot here.', indonesian: 'Hujan sering turun di sini. (rains mendapat -s)' },
                { english: 'We eat rice.', indonesian: 'Kami makan nasi.' },
                { english: 'They play football.', indonesian: 'Mereka bermain sepak bola.' }
            ],
            commonMistakes: [
                'Lupa menambah -s untuk he/she/it. Salah: "He work hard." → Benar: "He works hard."',
                'Menambah -s pada you/we/they. Salah: "They works here." → Benar: "They work here."',
                'Kata kerja khusus seperti go → goes, watch → watches, study → studies. Salah: "She go to school." → Benar: "She goes to school."'
            ],
            exerciseItems: [
                { prompt: 'She ___ (work) in an office.', answer: 'works' },
                { prompt: 'I ___ (eat) rice every day.', answer: 'eat' },
                { prompt: 'He ___ (go) to school.', answer: 'goes' },
                { prompt: 'They ___ (play) football.', answer: 'play' },
                { prompt: 'It ___ (rain) a lot here.', answer: 'rains' }
            ]
        },
        {
            id: 'g-06',
            order: 6,
            title: 'Negatives and Questions',
            titleId: 'Kalimat Negatif dan Pertanyaan',
            level: 'A0',
            explanation:
                'Untuk membuat kalimat negatif dan pertanyaan dalam Simple Present, kita menggunakan kata bantu "do" dan "does". ' +
                'Does dipakai untuk he/she/it. Do dipakai untuk I/you/we/they. ' +
                'Kalimat negatif: Subjek + do/does + not + kata kerja dasar. ' +
                'Pertanyaan: Do/Does + subjek + kata kerja dasar + ? ' +
                'Penting: setelah do/does, kata kerja kembali ke bentuk dasar (tanpa -s).',
            formula: 'Negatif: S + do/does + not + V. Tanya: Do/Does + S + V + ?',
            examples: [
                { english: 'I do not eat meat.', indonesian: 'Saya tidak makan daging.' },
                { english: 'He does not work on Sunday.', indonesian: 'Dia tidak bekerja hari Minggu.' },
                { english: 'Do you like tea?', indonesian: 'Apakah kamu suka teh?' },
                { english: 'Does she speak English?', indonesian: 'Apakah dia berbicara bahasa Inggris?' },
                { english: "They don't go to school.", indonesian: 'Mereka tidak pergi ke sekolah. (don\'t = do not)' },
                { english: "He doesn't eat fish.", indonesian: 'Dia tidak makan ikan. (doesn\'t = does not)' }
            ],
            commonMistakes: [
                'Lupa menghilangkan -s setelah does. Salah: "He doesn\'t works." → Benar: "He doesn\'t work." (kerja dasar, tanpa -s)',
                'Menggunakan do untuk he/she/it. Salah: "He don\'t go." → Benar: "He doesn\'t go."',
                'Lupa kata kerja dalam pertanyaan. Salah: "Do you?" → Benar: "Do you like it?"'
            ],
            exerciseItems: [
                { prompt: 'She ___ not eat meat. (do/does)', answer: 'does' },
                { prompt: '___ you like coffee? (Do/Does)', answer: 'Do' },
                { prompt: "He doesn't ___ to school. (go/goes)", answer: 'go' },
                { prompt: 'They ___ not work on Sunday. (do/does)', answer: 'do' },
                { prompt: '___ she speak English? (Do/Does)', answer: 'Does' }
            ]
        },
        {
            id: 'g-07',
            order: 7,
            title: 'Question Words',
            titleId: 'Kata Tanya',
            level: 'A0',
            explanation:
                'Kata tanya (question words) digunakan untuk mengajukan pertanyaan yang butuh informasi spesifik, bukan hanya jawaban ya/tidak. ' +
                'Kata tanya diletakkan di awal kalimat, diikuti do/does, subjek, dan kata kerja. ' +
                'What = apa, Where = di mana, When = kapan, Who = siapa, How = bagaimana, Why = mengapa.',
            formula: 'Kata Tanya + do/does + subjek + kata kerja + ?',
            examples: [
                { english: 'What do you do?', indonesian: 'Apa pekerjaanmu? (Apa yang kamu lakukan?)' },
                { english: 'Where do you live?', indonesian: 'Di mana kamu tinggal?' },
                { english: 'When do you work?', indonesian: 'Kapan kamu bekerja?' },
                { english: 'Who is he?', indonesian: 'Siapa dia?' },
                { english: 'How are you?', indonesian: 'Apa kabarmu?' },
                { english: 'Why do you learn English?', indonesian: 'Mengapa kamu belajar bahasa Inggris?' }
            ],
            commonMistakes: [
                'Meletakkan kata tanya di akhir. Salah: "You live where?" → Benar: "Where do you live?"',
                'Lupa do/does. Salah: "Where you live?" → Benar: "Where do you live?"',
                'Menggunakan what untuk tempat. Salah: "What do you live?" → Benar: "Where do you live?"'
            ],
            exerciseItems: [
                { prompt: '___ do you live? (Di mana kamu tinggal?)', answer: 'Where' },
                { prompt: '___ is your name? (Siapa namamu?)', answer: 'What' },
                { prompt: '___ do you work? (Kapan kamu bekerja?)', answer: 'When' },
                { prompt: '___ are you? (Apa kabarmu?)', answer: 'How' },
                { prompt: '___ is she? (Siapa dia?)', answer: 'Who' }
            ]
        },
        {
            id: 'g-08',
            order: 8,
            title: 'Simple Past Tense',
            titleId: 'Waktu Lampau Sederhana',
            level: 'A0',
            explanation:
                'Simple Past digunakan untuk kejadian yang sudah terjadi di masa lampau. ' +
                'Untuk kata kerja beraturan, tambahkan -ed di akhir kata kerja (work → worked, play → played). ' +
                'Ada juga kata kerja tidak beraturan yang harus dihafal (go → went, eat → ate, see → saw). ' +
                'Untuk negatif dan pertanyaan, gunakan "did" (untuk semua subjek), lalu kata kerja kembali ke bentuk dasar.',
            formula: 'Kalimat: S + V(-ed/irregular). Negatif: S + did not + V. Tanya: Did + S + V + ?',
            examples: [
                { english: 'I worked yesterday.', indonesian: 'Saya bekerja kemarin.' },
                { english: 'She went to school.', indonesian: 'Dia pergi ke sekolah. (went = bentuk lampau go)' },
                { english: 'They ate rice.', indonesian: 'Mereka makan nasi. (ate = bentuk lampau eat)' },
                { english: 'I did not work on Sunday.', indonesian: 'Saya tidak bekerja hari Minggu.' },
                { english: 'Did you see the film?', indonesian: 'Apakah kamu menonton film itu?' }
            ],
            commonMistakes: [
                'Menggunakan bentuk sekarang untuk masa lampau. Salah: "I go yesterday." → Benar: "I went yesterday."',
                'Menambah -ed pada kata kerja tidak beraturan. Salah: "I goed." → Benar: "I went."',
                'Lupa mengembalikan kata kerja ke bentuk dasar setelah did. Salah: "Did you went?" → Benar: "Did you go?"'
            ],
            exerciseItems: [
                { prompt: 'I ___ (work) yesterday.', answer: 'worked' },
                { prompt: 'She ___ (go) to school. (lampau)', answer: 'went' },
                { prompt: 'Did you ___ (see) the film?', answer: 'see' },
                { prompt: 'They ___ (eat) rice. (lampau)', answer: 'ate' },
                { prompt: 'He did not ___ (work) on Sunday.', answer: 'work' }
            ]
        },
        {
            id: 'g-09',
            order: 9,
            title: 'Simple Future Tense',
            titleId: 'Waktu Akan Datang Sederhana',
            level: 'A0',
            explanation:
                'Simple Future digunakan untuk hal yang akan terjadi di masa depan. ' +
                'Gunakan kata bantu "will" diikuti kata kerja dasar. ' +
                'Pola: Subjek + will + kata kerja dasar. ' +
                'Untuk negatif: Subjek + will not (won\'t) + kata kerja. ' +
                'Untuk pertanyaan: Will + subjek + kata kerja + ?',
            formula: 'Kalimat: S + will + V. Negatif: S + will not (won\'t) + V. Tanya: Will + S + V + ?',
            examples: [
                { english: 'I will go to work tomorrow.', indonesian: 'Saya akan pergi bekerja besok.' },
                { english: 'She will learn English.', indonesian: 'Dia akan belajar bahasa Inggris.' },
                { english: 'They will eat dinner.', indonesian: 'Mereka akan makan malam.' },
                { english: "I won't be late.", indonesian: 'Saya tidak akan terlambat. (won\'t = will not)' },
                { english: 'Will you help me?', indonesian: 'Apakah kamu akan membantuku?' }
            ],
            commonMistakes: [
                'Menambah -s pada kata kerja setelah will. Salah: "He will goes." → Benar: "He will go." (kata kerja dasar)',
                'Menggunakan do/does dengan will. Salah: "Will you do go?" → Benar: "Will you go?"',
                'Lupa kata kerja setelah will. Salah: "I will to school." → Benar: "I will go to school."'
            ],
            exerciseItems: [
                { prompt: 'I will ___ (go) to work tomorrow.', answer: 'go' },
                { prompt: 'She will ___ (learn) English.', answer: 'learn' },
                { prompt: '___ you help me? (Will/Do)', answer: 'Will' },
                { prompt: "They won't ___ (eat) dinner.", answer: 'eat' },
                { prompt: 'He will ___ (work) on Monday.', answer: 'work' }
            ]
        }
    ];
})(window);
