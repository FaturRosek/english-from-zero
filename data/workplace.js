
(function (window) {
    'use strict';

    
    window.EFZ_DATA_WORKPLACE = {

        
        office: {
            id: 'office',
            title: 'Office Communication',
            titleId: 'Komunikasi Kantor',
            icon: '🏢',
            color: '#2563eb',
            description: 'Bahasa Inggris untuk lingkungan kantor: email, meeting, kolega, dan atasan.',
            categories: [
                {
                    id: 'office-greetings',
                    title: 'Daily Greetings & Small Talk',
                    titleId: 'Sapaan Harian & Obrolan Ringan',
                    phrases: [
                        { english: 'Good morning, how are you?', indonesian: 'Selamat pagi, apa kabar?', pronunciation: 'gud MOR-ning, how ar yoo', context: 'Sapaan di pagi hari kepada rekan kerja.' },
                        { english: 'How was your weekend?', indonesian: 'Bagaimana akhir pekanmu?', pronunciation: 'how wuz yor WEEK-end', context: 'Pertanyaan santai di hari Senin.' },
                        { english: 'Are you free for a meeting later?', indonesian: 'Apakah kamu bisa meeting nanti?', pronunciation: 'ar yoo FREE for a MEE-ting LAY-ter', context: 'Mengajak meeting tidak formal.' },
                        { english: 'Could I speak to your manager, please?', indonesian: 'Bisakah saya berbicara dengan manajer Anda?', pronunciation: 'kud eye SPEEK too yor MAN-uh-jer PLEEZ', context: 'Kepada resepsionis atau staf.' },
                        { english: 'I will be right back.', indonesian: 'Saya akan segera kembali.', pronunciation: 'ai wil bee RAIT bak', context: 'Saat meninggalkan meja sebentar.' },
                        { english: 'See you tomorrow!', indonesian: 'Sampai jumpa besok!', pronunciation: 'see yoo toh-MOR-oh', context: 'Saat pulang kerja.' },
                        { english: 'Have a good day!', indonesian: 'Semoga harimu menyenangkan!', pronunciation: 'hav a gud DAY', context: 'Perpisahan ramah kepada siapa saja.' }
                    ]
                },
                {
                    id: 'office-tasks',
                    title: 'Asking & Giving Instructions',
                    titleId: 'Meminta & Memberi Instruksi',
                    phrases: [
                        { english: 'Could you please help me with this?', indonesian: 'Bisakah kamu membantu saya dengan ini?', pronunciation: 'kud yoo PLEEZ help mee with THIS', context: 'Meminta bantuan dengan sopan.' },
                        { english: 'I need this done by today.', indonesian: 'Saya butuh ini selesai hari ini.', pronunciation: 'ai NEED this DUN bai toh-DAY', context: 'Instruksi dengan batas waktu.' },
                        { english: 'Can you send me the report?', indonesian: 'Bisakah kamu kirimkan laporan itu?', pronunciation: 'kan yoo SEND mee the ri-PORT', context: 'Meminta dokumen melalui email atau chat.' },
                        { english: 'Please check this document for me.', indonesian: 'Tolong periksa dokumen ini untuk saya.', pronunciation: 'PLEEZ chek this DOK-yoo-ment for mee', context: 'Meminta review dokumen.' },
                        { english: 'I will take care of that.', indonesian: 'Saya akan menangani itu.', pronunciation: 'ai wil TAYK ker ov THAT', context: 'Menyatakan bahwa Anda akan menyelesaikan tugas.' },
                        { english: 'When is the deadline?', indonesian: 'Kapan batas waktunya?', pronunciation: 'WEN iz the DED-lain', context: 'Menanyakan tenggat waktu.' },
                        { english: 'Can we move the meeting to 3pm?', indonesian: 'Bisakah kita pindahkan meeting ke jam 3?', pronunciation: 'kan wee MOOV the MEE-ting too THREE pee em', context: 'Menjadwal ulang rapat.' }
                    ]
                },
                {
                    id: 'office-problems',
                    title: 'Reporting & Clarifying',
                    titleId: 'Melapor & Meminta Klarifikasi',
                    phrases: [
                        { english: 'Sorry, I do not understand. Can you explain?', indonesian: 'Maaf, saya tidak mengerti. Bisakah dijelaskan?', pronunciation: 'SOR-ee, ai doh NOT un-der-STAND. kan yoo eks-PLAYN', context: 'Meminta penjelasan ulang.' },
                        { english: 'Could you say that again, please?', indonesian: 'Bisakah diulangi, tolong?', pronunciation: 'kud yoo SAY that uh-GEN PLEEZ', context: 'Meminta pengulangan.' },
                        { english: 'I have a problem. Can you help me?', indonesian: 'Saya ada masalah. Bisakah membantu?', pronunciation: 'ai hav a PROB-lem. kan yoo HELP mee', context: 'Melaporkan masalah kepada rekan atau atasan.' },
                        { english: 'I made a mistake. I am sorry.', indonesian: 'Saya melakukan kesalahan. Saya minta maaf.', pronunciation: 'ai mayd a mis-TAYK. ai am SOR-ee', context: 'Mengakui kesalahan dengan bertanggung jawab.' },
                        { english: 'Can I get some time to work on this?', indonesian: 'Bisakah saya diberi waktu untuk mengerjakan ini?', pronunciation: 'kan ai GET sum TAIM too WERK on this', context: 'Meminta waktu lebih untuk tugas.' },
                        { english: 'This is urgent. I need help now.', indonesian: 'Ini mendesak. Saya butuh bantuan sekarang.', pronunciation: 'this iz ER-jent. ai NEED help NOW', context: 'Situasi darurat di kantor.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'meeting', indonesian: 'rapat/pertemuan', example: 'We have a meeting at 10am.' },
                { english: 'deadline', indonesian: 'batas waktu', example: 'The deadline is tomorrow.' },
                { english: 'email', indonesian: 'surel', example: 'Please send me an email.' },
                { english: 'colleague', indonesian: 'rekan kerja', example: 'My colleague helped me.' },
                { english: 'manager', indonesian: 'manajer/atasan', example: 'The manager approved it.' },
                { english: 'report', indonesian: 'laporan', example: 'I need to write a report.' },
                { english: 'urgent', indonesian: 'mendesak', example: 'This is urgent!' },
                { english: 'schedule', indonesian: 'jadwal', example: 'Check the schedule please.' }
            ],
            dialogExamples: [
                {
                    title: 'Asking for Help',
                    titleId: 'Meminta Bantuan',
                    exchanges: [
                        { speaker: 'You', english: 'Excuse me, can you help me with this form?', indonesian: 'Permisi, bisakah membantu saya dengan formulir ini?' },
                        { speaker: 'Colleague', english: 'Sure! What do you need?', indonesian: 'Tentu! Apa yang kamu butuhkan?' },
                        { speaker: 'You', english: 'I don\'t know how to fill in this section.', indonesian: 'Saya tidak tahu cara mengisi bagian ini.' },
                        { speaker: 'Colleague', english: 'No problem. I will show you.', indonesian: 'Tidak masalah. Saya akan tunjukkan.' }
                    ]
                },
                {
                    title: 'Talking to Your Manager',
                    titleId: 'Berbicara dengan Atasan',
                    exchanges: [
                        { speaker: 'You', english: 'Good morning. Can I speak to you for a moment?', indonesian: 'Selamat pagi. Bisakah saya bicara sebentar?' },
                        { speaker: 'Manager', english: 'Of course. What is it?', indonesian: 'Tentu. Ada apa?' },
                        { speaker: 'You', english: 'I have a problem with the delivery order.', indonesian: 'Saya ada masalah dengan pesanan pengiriman.' },
                        { speaker: 'Manager', english: 'Okay, tell me what happened.', indonesian: 'Baik, ceritakan apa yang terjadi.' }
                    ]
                }
            ]
        },

        
        it: {
            id: 'it',
            title: 'IT Support',
            titleId: 'Dukungan IT',
            icon: '💻',
            color: '#7c3aed',
            description: 'Bahasa Inggris untuk IT support: melaporkan masalah, meminta bantuan teknis.',
            categories: [
                {
                    id: 'it-reporting',
                    title: 'Reporting Technical Problems',
                    titleId: 'Melaporkan Masalah Teknis',
                    phrases: [
                        { english: 'My computer is not working.', indonesian: 'Komputer saya tidak berfungsi.', pronunciation: 'mai kom-PYOO-ter iz NOT WER-king', context: 'Laporan kerusakan umum.' },
                        { english: 'I cannot log in to the system.', indonesian: 'Saya tidak bisa masuk ke sistem.', pronunciation: 'ai KAN-not LOG in too the SIS-tem', context: 'Masalah login.' },
                        { english: 'The internet is not working.', indonesian: 'Internet tidak berjalan.', pronunciation: 'the IN-ter-net iz NOT WER-king', context: 'Gangguan koneksi internet.' },
                        { english: 'My password is not working.', indonesian: 'Kata sandi saya tidak berfungsi.', pronunciation: 'mai PAS-werd iz NOT WER-king', context: 'Masalah kata sandi.' },
                        { english: 'The printer is broken.', indonesian: 'Printer rusak.', pronunciation: 'the PRIN-ter iz BROH-ken', context: 'Kerusakan printer.' },
                        { english: 'I keep getting an error message.', indonesian: 'Saya terus mendapat pesan error.', pronunciation: 'ai keep GET-ing an ER-er MES-ij', context: 'Error berulang di sistem.' },
                        { english: 'Can you come and check my computer?', indonesian: 'Bisakah datang dan cek komputer saya?', pronunciation: 'kan yoo KUM and CHEK mai kom-PYOO-ter', context: 'Meminta kunjungan IT.' }
                    ]
                },
                {
                    id: 'it-requests',
                    title: 'Making IT Requests',
                    titleId: 'Membuat Permintaan IT',
                    phrases: [
                        { english: 'I need a new password, please.', indonesian: 'Saya perlu kata sandi baru, tolong.', pronunciation: 'ai NEED a nyoo PAS-werd PLEEZ', context: 'Permintaan reset password.' },
                        { english: 'Can you install this software for me?', indonesian: 'Bisakah memasang software ini untuk saya?', pronunciation: 'kan yoo in-STOL this SOHFT-wer for mee', context: 'Instalasi aplikasi.' },
                        { english: 'I need access to this folder.', indonesian: 'Saya perlu akses ke folder ini.', pronunciation: 'ai NEED AK-ses too this FOL-der', context: 'Permintaan akses file/folder.' },
                        { english: 'How do I connect to the Wi-Fi?', indonesian: 'Bagaimana cara terhubung ke Wi-Fi?', pronunciation: 'how doo ai koh-NEKT too the WAI-fai', context: 'Menghubungkan perangkat ke jaringan.' },
                        { english: 'My email is not sending messages.', indonesian: 'Email saya tidak bisa mengirim pesan.', pronunciation: 'mai EE-mayl iz NOT SEN-ding MES-ij-iz', context: 'Masalah email.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'password', indonesian: 'kata sandi', example: 'Reset my password please.' },
                { english: 'software', indonesian: 'perangkat lunak', example: 'Install the software.' },
                { english: 'error', indonesian: 'kesalahan/error', example: 'I see an error message.' },
                { english: 'network', indonesian: 'jaringan', example: 'The network is slow.' },
                { english: 'login', indonesian: 'masuk', example: 'I cannot login.' },
                { english: 'printer', indonesian: 'pencetak', example: 'The printer is not working.' },
                { english: 'reboot', indonesian: 'mulai ulang', example: 'Please reboot your computer.' },
                { english: 'update', indonesian: 'pembaruan', example: 'Install the update.' }
            ],
            dialogExamples: [
                {
                    title: 'Calling IT Help Desk',
                    titleId: 'Menghubungi Help Desk IT',
                    exchanges: [
                        { speaker: 'IT Staff', english: 'IT support, how can I help you?', indonesian: 'IT support, ada yang bisa saya bantu?' },
                        { speaker: 'You', english: 'Hi, my computer is not turning on.', indonesian: 'Halo, komputer saya tidak bisa dinyalakan.' },
                        { speaker: 'IT Staff', english: 'Okay. Did you check the power cable?', indonesian: 'Baik. Sudah cek kabel powernya?' },
                        { speaker: 'You', english: 'Yes, I checked it but it still does not work.', indonesian: 'Sudah, tapi tetap tidak bisa.' },
                        { speaker: 'IT Staff', english: 'I will come and check it for you.', indonesian: 'Saya akan datang untuk memeriksanya.' }
                    ]
                }
            ]
        },

        
        warehouse: {
            id: 'warehouse',
            title: 'Warehouse Operations',
            titleId: 'Operasional Gudang',
            icon: '📦',
            color: '#d97706',
            description: 'Bahasa Inggris untuk bekerja di gudang: instruksi, laporan barang, dan keselamatan.',
            categories: [
                {
                    id: 'warehouse-instructions',
                    title: 'Following Instructions',
                    titleId: 'Mengikuti Instruksi',
                    phrases: [
                        { english: 'Move these boxes to the other side.', indonesian: 'Pindahkan kotak-kotak ini ke sisi lain.', pronunciation: 'MOOV theez BOK-siz too the UTH-er SAID', context: 'Instruksi memindahkan barang.' },
                        { english: 'Stack the items carefully, please.', indonesian: 'Susun barang-barang dengan hati-hati, tolong.', pronunciation: 'STAK the AI-temz KER-foo-lee PLEEZ', context: 'Instruksi menyusun barang.' },
                        { english: 'Check the item against the packing list.', indonesian: 'Periksa barang sesuai daftar packing.', pronunciation: 'CHEK the AI-tem uh-GENST the PAK-ing list', context: 'Verifikasi barang sebelum dikirim.' },
                        { english: 'Handle with care. It is fragile.', indonesian: 'Tangani dengan hati-hati. Ini mudah pecah.', pronunciation: 'HAN-del with KER. it iz FRAJ-il', context: 'Instruksi untuk barang rapuh.' },
                        { english: 'Load the truck by 8am.', indonesian: 'Muat truk sebelum jam 8 pagi.', pronunciation: 'LOHD the TRUK bai EYT ay em', context: 'Instruksi dengan batas waktu pengiriman.' },
                        { english: 'Please sign here for the delivery.', indonesian: 'Tolong tanda tangan di sini untuk pengiriman.', pronunciation: 'PLEEZ SAIN heer for the dee-LIV-er-ee', context: 'Konfirmasi penerimaan barang.' },
                        { english: 'Where do these boxes go?', indonesian: 'Kotak-kotak ini mau ditaruh di mana?', pronunciation: 'WER doo theez BOK-siz GOH', context: 'Menanyakan lokasi penyimpanan barang.' }
                    ]
                },
                {
                    id: 'warehouse-problems',
                    title: 'Reporting Issues',
                    titleId: 'Melaporkan Masalah',
                    phrases: [
                        { english: 'This item is damaged. I cannot ship it.', indonesian: 'Barang ini rusak. Saya tidak bisa mengirimnya.', pronunciation: 'this AI-tem iz DAM-ijd. ai KAN-not SHIP it', context: 'Melaporkan kerusakan barang.' },
                        { english: 'Some items are missing from the order.', indonesian: 'Beberapa barang hilang dari pesanan.', pronunciation: 'sum AI-temz ar MIS-ing from the OR-der', context: 'Melaporkan kekurangan barang.' },
                        { english: 'This is the wrong item.', indonesian: 'Ini barang yang salah.', pronunciation: 'this iz the RONG AI-tem', context: 'Barang tidak sesuai pesanan.' },
                        { english: 'I need help lifting this box.', indonesian: 'Saya perlu bantuan mengangkat kotak ini.', pronunciation: 'ai NEED help LIF-ting this BOK', context: 'Meminta bantuan untuk barang berat.' },
                        { english: 'The forklift is not working.', indonesian: 'Forklift tidak berfungsi.', pronunciation: 'the FORK-lift iz NOT WER-king', context: 'Melaporkan kerusakan peralatan.' }
                    ]
                },
                {
                    id: 'warehouse-safety',
                    title: 'Safety & Rules',
                    titleId: 'Keselamatan & Peraturan',
                    phrases: [
                        { english: 'Please wear your safety helmet.', indonesian: 'Tolong pakai helm keselamatan Anda.', pronunciation: 'PLEEZ WER yor SAYF-tee HEL-met', context: 'Instruksi keselamatan.' },
                        { english: 'No smoking in this area.', indonesian: 'Tidak boleh merokok di area ini.', pronunciation: 'NOH SMOH-king in this AYR-ee-uh', context: 'Peraturan area larangan merokok.' },
                        { english: 'Be careful! The floor is wet.', indonesian: 'Hati-hati! Lantai basah.', pronunciation: 'bee KER-ful! the FLOR iz WET', context: 'Peringatan bahaya.' },
                        { english: 'Always lift properly to avoid injury.', indonesian: 'Selalu angkat dengan benar untuk menghindari cedera.', pronunciation: 'OL-weyz LIFT PROP-er-lee too uh-VOID IN-juh-ree', context: 'Instruksi teknik pengangkatan aman.' },
                        { english: 'Emergency exit is this way.', indonesian: 'Pintu darurat di arah ini.', pronunciation: 'ee-MER-jen-see EK-zit iz this WAY', context: 'Prosedur keadaan darurat.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'delivery', indonesian: 'pengiriman', example: 'Sign for the delivery.' },
                { english: 'packing', indonesian: 'pengemasan', example: 'Check the packing list.' },
                { english: 'shipment', indonesian: 'kiriman', example: 'The shipment arrived today.' },
                { english: 'forklift', indonesian: 'forklift', example: 'Operate the forklift safely.' },
                { english: 'inventory', indonesian: 'inventaris', example: 'Update the inventory.' },
                { english: 'damaged', indonesian: 'rusak', example: 'The item is damaged.' },
                { english: 'load', indonesian: 'muat', example: 'Load the truck now.' },
                { english: 'safety helmet', indonesian: 'helm keselamatan', example: 'Wear your safety helmet.' }
            ],
            dialogExamples: [
                {
                    title: 'Reporting a Damaged Item',
                    titleId: 'Melaporkan Barang Rusak',
                    exchanges: [
                        { speaker: 'You', english: 'Excuse me, supervisor. I have a problem.', indonesian: 'Permisi, supervisor. Saya ada masalah.' },
                        { speaker: 'Supervisor', english: 'What is the problem?', indonesian: 'Apa masalahnya?' },
                        { speaker: 'You', english: 'This box is damaged. The item inside is broken.', indonesian: 'Kotak ini rusak. Barang di dalamnya pecah.' },
                        { speaker: 'Supervisor', english: 'Good job for catching that. Put it to the side and fill in a damage report.', indonesian: 'Bagus sudah menemukannya. Taruh di pinggir dan isi laporan kerusakan.' },
                        { speaker: 'You', english: 'Okay. Where is the damage report form?', indonesian: 'Baik. Di mana formulir laporan kerusakannya?' }
                    ]
                }
            ]
        },

        
        factory: {
            id: 'factory',
            title: 'Factory & Manufacturing',
            titleId: 'Pabrik & Manufaktur',
            icon: '🏭',
            color: '#059669',
            description: 'Bahasa Inggris untuk bekerja di pabrik: instruksi produksi, kualitas, dan keselamatan.',
            categories: [
                {
                    id: 'factory-instructions',
                    title: 'Production Instructions',
                    titleId: 'Instruksi Produksi',
                    phrases: [
                        { english: 'Follow the standard operating procedure.', indonesian: 'Ikuti prosedur operasi standar.', pronunciation: 'FOL-oh the STAN-derd OP-er-ay-ting proh-SEE-jer', context: 'Instruksi dasar di area produksi.' },
                        { english: 'Check the quality before packing.', indonesian: 'Cek kualitas sebelum packing.', pronunciation: 'CHEK the KWOL-ih-tee bee-FOR PAK-ing', context: 'Proses quality control.' },
                        { english: 'The machine is ready. Start the process.', indonesian: 'Mesin sudah siap. Mulai prosesnya.', pronunciation: 'the muh-SHEEN iz RED-ee. START the PROH-ses', context: 'Memulai produksi.' },
                        { english: 'Stop the machine. There is a problem.', indonesian: 'Hentikan mesin. Ada masalah.', pronunciation: 'STOP the muh-SHEEN. THER iz a PROB-lem', context: 'Darurat produksi.' },
                        { english: 'How many units do we need today?', indonesian: 'Berapa unit yang kita butuhkan hari ini?', pronunciation: 'how MEN-ee YOO-nits doo wee NEED toh-DAY', context: 'Menanyakan target produksi.' },
                        { english: 'The production target is 500 units per day.', indonesian: 'Target produksi adalah 500 unit per hari.', pronunciation: 'the proh-DUK-shun TAR-git iz FIVE HUN-dred YOO-nits per DAY', context: 'Informasi target produksi.' }
                    ]
                },
                {
                    id: 'factory-quality',
                    title: 'Quality & Defects',
                    titleId: 'Kualitas & Cacat Produk',
                    phrases: [
                        { english: 'This product does not meet the standard.', indonesian: 'Produk ini tidak memenuhi standar.', pronunciation: 'this PROD-ukt duz NOT MEET the STAN-derd', context: 'Melaporkan produk yang gagal QC.' },
                        { english: 'Put the defective items in the reject bin.', indonesian: 'Taruh barang cacat di tempat reject.', pronunciation: 'put the dih-FEK-tiv AI-temz in the ree-JEKT BIN', context: 'Penanganan produk cacat.' },
                        { english: 'This part is the wrong size.', indonesian: 'Bagian ini ukurannya salah.', pronunciation: 'this PART iz the RONG SAIZ', context: 'Melaporkan kesalahan ukuran.' },
                        { english: 'How many defects did you find?', indonesian: 'Berapa banyak cacat yang kamu temukan?', pronunciation: 'how MEN-ee DEE-fekts did yoo FIND', context: 'Pertanyaan tentang hasil inspeksi.' }
                    ]
                },
                {
                    id: 'factory-safety',
                    title: 'Factory Safety',
                    titleId: 'Keselamatan Pabrik',
                    phrases: [
                        { english: 'Always wear your safety equipment.', indonesian: 'Selalu pakai perlengkapan keselamatan.', pronunciation: 'OL-weyz WER yor SAYF-tee ee-KWIP-ment', context: 'Aturan APD wajib.' },
                        { english: 'Do not touch the machine when it is running.', indonesian: 'Jangan sentuh mesin saat sedang beroperasi.', pronunciation: 'doh NOT TUCH the muh-SHEEN wen it iz RUN-ing', context: 'Peringatan keselamatan mesin.' },
                        { english: 'Report any accident immediately.', indonesian: 'Laporkan kecelakaan apapun segera.', pronunciation: 'ree-PORT EN-ee AK-sih-dent ih-MEE-dee-it-lee', context: 'Prosedur kecelakaan kerja.' },
                        { english: 'The emergency stop button is in red.', indonesian: 'Tombol berhenti darurat berwarna merah.', pronunciation: 'the ee-MER-jen-see STOP BUT-on iz in RED', context: 'Pengenalan tombol darurat.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'production', indonesian: 'produksi', example: 'Start production now.' },
                { english: 'quality', indonesian: 'kualitas', example: 'Check the quality.' },
                { english: 'defect', indonesian: 'cacat/rusak', example: 'Found a defect.' },
                { english: 'machine', indonesian: 'mesin', example: 'The machine broke down.' },
                { english: 'target', indonesian: 'target', example: 'We met the target.' },
                { english: 'shift', indonesian: 'giliran kerja', example: 'My shift starts at 7am.' },
                { english: 'maintenance', indonesian: 'pemeliharaan', example: 'Schedule maintenance.' },
                { english: 'safety equipment', indonesian: 'perlengkapan keselamatan', example: 'Wear safety equipment.' }
            ],
            dialogExamples: [
                {
                    title: 'Reporting a Machine Problem',
                    titleId: 'Melaporkan Masalah Mesin',
                    exchanges: [
                        { speaker: 'You', english: 'The machine stopped. I don\'t know why.', indonesian: 'Mesin berhenti. Saya tidak tahu kenapa.' },
                        { speaker: 'Team Leader', english: 'Did you press the emergency stop?', indonesian: 'Apa kamu menekan tombol berhenti darurat?' },
                        { speaker: 'You', english: 'No, it stopped by itself.', indonesian: 'Tidak, berhenti sendiri.' },
                        { speaker: 'Team Leader', english: 'Okay. Call maintenance right away.', indonesian: 'Baik. Hubungi maintenance sekarang juga.' },
                        { speaker: 'You', english: 'Understood. I will call them now.', indonesian: 'Mengerti. Saya akan hubungi mereka sekarang.' }
                    ]
                }
            ]
        },

        
        interview: {
            id: 'interview',
            title: 'Job Interview',
            titleId: 'Wawancara Kerja',
            icon: '👔',
            color: '#dc2626',
            description: 'Persiapan wawancara kerja: pertanyaan umum, cara menjawab, dan tips yang berguna.',
            categories: [
                {
                    id: 'interview-intro',
                    title: 'Self Introduction',
                    titleId: 'Perkenalan Diri',
                    phrases: [
                        { english: 'My name is [name] and I am from Indonesia.', indonesian: 'Nama saya [nama] dan saya dari Indonesia.', pronunciation: '', context: 'Awal perkenalan diri.' },
                        { english: 'I am applying for the [position] position.', indonesian: 'Saya melamar posisi [jabatan].', pronunciation: 'ai am uh-PLAI-ing for the poh-ZI-shun', context: 'Menyebut posisi yang dilamar.' },
                        { english: 'I have [number] years of experience in [field].', indonesian: 'Saya punya [angka] tahun pengalaman di bidang [bidang].', pronunciation: 'ai hav yeerz ov eks-PEE-ree-ens in', context: 'Menyebutkan pengalaman kerja.' },
                        { english: 'I am a fast learner and hardworking.', indonesian: 'Saya cepat belajar dan pekerja keras.', pronunciation: 'ai am a FAST LER-ner and HARD-werk-ing', context: 'Menyebutkan kelebihan diri.' },
                        { english: 'I am very motivated to work here.', indonesian: 'Saya sangat termotivasi untuk bekerja di sini.', pronunciation: 'ai am VER-ee MOH-tih-vay-tid too WERK HEER', context: 'Menyatakan ketertarikan pada perusahaan.' }
                    ]
                },
                {
                    id: 'interview-common',
                    title: 'Common Interview Questions',
                    titleId: 'Pertanyaan Interview Umum',
                    phrases: [
                        { english: 'Tell me about yourself.', indonesian: 'Ceritakan tentang diri Anda.', pronunciation: 'TEL mee uh-BOUT yor-SELF', context: 'Pertanyaan pembuka. Jawab dengan latar belakang singkat.' },
                        { english: 'Why do you want to work here?', indonesian: 'Mengapa Anda ingin bekerja di sini?', pronunciation: 'WAI doo yoo WANT too WERK HEER', context: 'Alasan memilih perusahaan ini.' },
                        { english: 'What are your strengths?', indonesian: 'Apa kelebihan Anda?', pronunciation: 'WUT ar yor STRENGTHS', context: 'Menyebutkan keunggulan diri.' },
                        { english: 'What are your weaknesses?', indonesian: 'Apa kekurangan Anda?', pronunciation: 'WUT ar yor WEEK-nes-iz', context: 'Jawab jujur dan tunjukkan Anda sedang memperbaikinya.' },
                        { english: 'Can you work in a team?', indonesian: 'Bisakah bekerja dalam tim?', pronunciation: 'kan yoo WERK in a TEEM', context: 'Kemampuan kerja tim.' },
                        { english: 'Can you work on weekends or overtime?', indonesian: 'Bisakah bekerja di akhir pekan atau lembur?', pronunciation: 'kan yoo WERK on WEEK-endz or OH-ver-taim', context: 'Fleksibilitas jadwal kerja.' },
                        { english: 'When can you start?', indonesian: 'Kapan bisa mulai bekerja?', pronunciation: 'WEN kan yoo START', context: 'Ketersediaan mulai kerja.' }
                    ]
                },
                {
                    id: 'interview-answers',
                    title: 'Sample Answers',
                    titleId: 'Contoh Jawaban',
                    phrases: [
                        { english: 'I am a reliable and punctual worker.', indonesian: 'Saya pekerja yang dapat diandalkan dan tepat waktu.', pronunciation: 'ai am a ree-LAI-uh-bul and PUNGK-choo-ul WER-ker', context: 'Jawaban untuk pertanyaan kelebihan.' },
                        { english: 'I learn fast and I am ready to follow your company\'s rules.', indonesian: 'Saya cepat belajar dan siap mengikuti peraturan perusahaan.', pronunciation: '', context: 'Jawaban untuk pertanyaan kesiapan kerja.' },
                        { english: 'Yes, I can work overtime when needed.', indonesian: 'Ya, saya bisa lembur bila diperlukan.', pronunciation: 'yes ai kan WERK OH-ver-taim wen NEE-did', context: 'Jawaban untuk pertanyaan lembur.' },
                        { english: 'I am available to start immediately.', indonesian: 'Saya siap mulai bekerja segera.', pronunciation: 'ai am uh-VAY-luh-bul too START ih-MEE-dee-it-lee', context: 'Jawaban untuk kapan bisa mulai.' },
                        { english: 'Do you have any questions for me?', indonesian: 'Apakah Anda punya pertanyaan untuk saya?', pronunciation: 'doo yoo hav EN-ee KWES-chunz for mee', context: 'Pertanyaan yang mungkin diajukan pewawancara di akhir.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'experience', indonesian: 'pengalaman', example: 'I have 2 years of experience.' },
                { english: 'position', indonesian: 'posisi/jabatan', example: 'What is the position?' },
                { english: 'salary', indonesian: 'gaji', example: 'What is the salary?' },
                { english: 'qualification', indonesian: 'kualifikasi', example: 'Check my qualifications.' },
                { english: 'overtime', indonesian: 'lembur', example: 'Can you do overtime?' },
                { english: 'punctual', indonesian: 'tepat waktu', example: 'I am always punctual.' },
                { english: 'teamwork', indonesian: 'kerja tim', example: 'I am good at teamwork.' },
                { english: 'reliable', indonesian: 'dapat diandalkan', example: 'I am reliable and honest.' }
            ],
            dialogExamples: [
                {
                    title: 'Basic Interview Exchange',
                    titleId: 'Percakapan Interview Dasar',
                    exchanges: [
                        { speaker: 'Interviewer', english: 'Good morning. Please have a seat.', indonesian: 'Selamat pagi. Silakan duduk.' },
                        { speaker: 'You', english: 'Good morning. Thank you.', indonesian: 'Selamat pagi. Terima kasih.' },
                        { speaker: 'Interviewer', english: 'Can you tell me about yourself?', indonesian: 'Bisakah ceritakan tentang diri Anda?' },
                        { speaker: 'You', english: 'My name is Budi. I am from Indonesia. I have 2 years of experience in warehouse work.', indonesian: 'Nama saya Budi. Saya dari Indonesia. Saya punya 2 tahun pengalaman di gudang.' },
                        { speaker: 'Interviewer', english: 'Good. Why do you want to work here?', indonesian: 'Bagus. Mengapa ingin bekerja di sini?' },
                        { speaker: 'You', english: 'I want to grow and learn. I am a hardworking person.', indonesian: 'Saya ingin berkembang dan belajar. Saya orang yang pekerja keras.' }
                    ]
                }
            ]
        },

        
        hr: {
            id: 'hr',
            title: 'HR & Admin',
            titleId: 'HR & Administrasi',
            icon: '📋',
            color: '#0891b2',
            description: 'Bahasa Inggris untuk urusan HR: kontrak, cuti, gaji, dan administrasi.',
            categories: [
                {
                    id: 'hr-leave',
                    title: 'Leave & Attendance',
                    titleId: 'Cuti & Kehadiran',
                    phrases: [
                        { english: 'I would like to apply for annual leave.', indonesian: 'Saya ingin mengajukan cuti tahunan.', pronunciation: 'ai wud LAIK too uh-PLAI for AN-yoo-ul LEEV', context: 'Permohonan cuti kepada HR.' },
                        { english: 'I am sick today. I cannot come to work.', indonesian: 'Saya sakit hari ini. Tidak bisa masuk kerja.', pronunciation: 'ai am SIK toh-DAY. ai KAN-not KUM too WERK', context: 'Laporan tidak masuk karena sakit.' },
                        { english: 'Can I have a medical certificate form?', indonesian: 'Bisakah saya dapat formulir surat sakit?', pronunciation: 'kan ai hav a MED-ih-kul SER-tif-ih-kit FORM', context: 'Meminta form MC.' },
                        { english: 'How many days of leave do I have left?', indonesian: 'Berapa hari cuti saya yang tersisa?', pronunciation: 'how MEN-ee DAYZ ov LEEV doo ai hav LEFT', context: 'Menanyakan sisa cuti.' },
                        { english: 'I would like to request an off day on Friday.', indonesian: 'Saya ingin meminta hari libur pada hari Jumat.', pronunciation: 'ai wud LAIK too ree-KWEST an OFF DAY on FRAI-day', context: 'Permintaan hari libur spesifik.' }
                    ]
                },
                {
                    id: 'hr-payroll',
                    title: 'Salary & Payroll',
                    titleId: 'Gaji & Penggajian',
                    phrases: [
                        { english: 'I have a question about my salary.', indonesian: 'Saya punya pertanyaan tentang gaji saya.', pronunciation: 'ai hav a KWES-chun uh-BOUT mai SAL-uh-ree', context: 'Menanyakan tentang gaji.' },
                        { english: 'I did not receive my pay this month.', indonesian: 'Saya tidak menerima gaji bulan ini.', pronunciation: 'ai did NOT ree-SEEV mai PAY this MUNTH', context: 'Melaporkan masalah gaji tidak masuk.' },
                        { english: 'Can you explain my pay slip?', indonesian: 'Bisakah menjelaskan slip gaji saya?', pronunciation: 'kan yoo eks-PLAYN mai PAY SLIP', context: 'Meminta penjelasan rincian gaji.' },
                        { english: 'I worked overtime last week.', indonesian: 'Saya lembur minggu lalu.', pronunciation: 'ai WERKT OH-ver-taim LAST WEEK', context: 'Melaporkan klaim lembur.' }
                    ]
                }
            ],
            vocabulary: [
                { english: 'leave', indonesian: 'cuti', example: 'I applied for leave.' },
                { english: 'medical certificate', indonesian: 'surat sakit', example: 'I have a medical certificate.' },
                { english: 'pay slip', indonesian: 'slip gaji', example: 'Check my pay slip.' },
                { english: 'contract', indonesian: 'kontrak', example: 'Sign the contract.' },
                { english: 'probation', indonesian: 'masa percobaan', example: 'I am on probation.' },
                { english: 'overtime', indonesian: 'lembur', example: 'I worked overtime.' },
                { english: 'annual leave', indonesian: 'cuti tahunan', example: 'I have 14 days annual leave.' },
                { english: 'HR', indonesian: 'departemen SDM', example: 'Talk to HR.' }
            ],
            dialogExamples: [
                {
                    title: 'Applying for Leave',
                    titleId: 'Mengajukan Cuti',
                    exchanges: [
                        { speaker: 'You', english: 'Good morning. I would like to apply for one day leave next Friday.', indonesian: 'Selamat pagi. Saya ingin mengajukan cuti satu hari Jumat depan.' },
                        { speaker: 'HR', english: 'Okay. Is there a reason?', indonesian: 'Baik. Ada alasannya?' },
                        { speaker: 'You', english: 'I have a family event that day.', indonesian: 'Saya ada acara keluarga hari itu.' },
                        { speaker: 'HR', english: 'Alright. Please fill in the leave form and submit it by Wednesday.', indonesian: 'Baik. Tolong isi formulir cuti dan submit sebelum Rabu.' },
                        { speaker: 'You', english: 'Thank you. Where can I get the form?', indonesian: 'Terima kasih. Di mana saya bisa mendapatkan formulirnya?' }
                    ]
                }
            ]
        }
    };

    
    window.EFZ_DATA_WORKPLACE_HELPERS = {
        getSectorList: function () {
            return Object.keys(window.EFZ_DATA_WORKPLACE).map(function (key) {
                var s = window.EFZ_DATA_WORKPLACE[key];
                return { id: s.id, title: s.title, titleId: s.titleId, icon: s.icon, color: s.color, description: s.description };
            });
        },

        getSector: function (id) {
            return window.EFZ_DATA_WORKPLACE[id] || null;
        },

        getAllPhrases: function () {
            var all = [];
            Object.keys(window.EFZ_DATA_WORKPLACE).forEach(function (sectorKey) {
                var sector = window.EFZ_DATA_WORKPLACE[sectorKey];
                (sector.categories || []).forEach(function (cat) {
                    (cat.phrases || []).forEach(function (phrase) {
                        all.push({ sectorId: sector.id, sectorTitle: sector.titleId, categoryId: cat.id, categoryTitle: cat.titleId, phrase: phrase });
                    });
                });
            });
            return all;
        }
    };
})(window);
