export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export const knowledgeBase: KnowledgeDoc[] = [
  {
    id: '1',
    title: 'Kebijakan Cuti Karyawan',
    category: 'HR',
    tags: ['cuti', 'libur', 'karyawan', 'hr'],
    content: `Setiap karyawan berhak mendapatkan 12 hari cuti tahunan yang dapat digunakan setelah masa percobaan 3 bulan selesai.

Prosedur Pengajuan Cuti:
1. Ajukan cuti minimal 3 hari kerja sebelumnya melalui sistem HRIS
2. Dapatkan persetujuan dari atasan langsung
3. HR akan memproses dan mengkonfirmasi

Jenis Cuti:
- Cuti Tahunan: 12 hari/tahun
- Cuti Sakit: Dengan surat dokter
- Cuti Melahirkan: 3 bulan (wanita)
- Cuti Menikah: 3 hari
- Cuti Khusus: Sesuai kebijakan perusahaan

Cuti yang tidak digunakan dapat dibawa maksimal 5 hari ke tahun berikutnya.`
  },
  {
    id: '2',
    title: 'Prosedur Pengajuan Reimburse',
    category: 'Finance',
    tags: ['reimburse', 'klaim', 'biaya', 'finance'],
    content: `Karyawan dapat mengajukan reimburse untuk biaya operasional kerja.

Dokumen yang Diperlukan:
1. Form pengajuan reimburse yang sudah diisi
2. Nota/faktur asli (bukan fotokopi)
3. Bukti transfer (jika ada)
4. Approval dari atasan langsung

Batas Waktu Pengajuan:
- Pengajuan maksimal 30 hari setelah pengeluaran
- Proses pembayaran 7-14 hari kerja setelah disetujui

Jenis Biaya yang Dapat Direimburse:
- Transportasi dinas
- Makan saat meeting dengan klien
- Akomodasi perjalanan dinas
- Pembelian perlengkapan kerja (maks Rp 500.000)

Catatan: Reimburse pribadi tidak dapat diproses.`
  },
  {
    id: '3',
    title: 'Kebijakan Work From Home (WFH)',
    category: 'HR',
    tags: ['wfh', 'remote', 'kerja', 'kantor'],
    content: `Perusahaan menerapkan kebijakan WFH hybrid untuk meningkatkan produktivitas.

Ketentuan WFH:
- Karyawan dapat WFH maksimal 2 hari per minggu
- Wajib mengajukan melalui sistem minimal 1 hari sebelumnya
- Harus tersedia di jam kerja (09.00-17.00)
- Wajib aktif di platform komunikasi perusahaan

Karyawan yang wajib WFO:
- Tim IT Support
- Tim Security
- Tim Operasional Gudang
- Karyawan masa percobaan

Pelanggaran:
- Tidak melaporkan kehadiran: Warning 1
- Absen tanpa keterangan: Warning 2
- Pelanggaran berulang: SP`
  },
  {
    id: '4',
    title: 'Panduan Keamanan Data Perusahaan',
    category: 'IT',
    tags: ['keamanan', 'data', 'password', 'it', 'security'],
    content: `Keamanan data adalah prioritas utama perusahaan.

Kebijakan Password:
- Minimal 8 karakter, kombinasi huruf besar, kecil, angka, simbol
- Wajib diganti setiap 90 hari
- Dilarang menggunakan password yang sama dengan akun pribadi
- Dilarang membagikan password kepada siapapun

Aturan Penggunaan Perangkat:
- Laptop perusahaan hanya untuk keperluan kerja
- Dilarang menginstall software bajakan
- Wajib menggunakan antivirus yang disediakan IT
- Backup data penting ke cloud perusahaan setiap hari

Insiden Keamanan:
Jika menemukan aktivitas mencurigakan:
1. Segera laporkan ke tim IT
2. Jangan klik link atau download file mencurigakan
3. Ganti password segera jika dicurigai bocor

Pelanggaran berat dapat dikenakan sanksi hukum.`
  },
  {
    id: '5',
    title: 'Prosedur Resign dan Exit Interview',
    category: 'HR',
    tags: ['resign', 'keluar', 'exit', 'pengunduran'],
    content: `Prosedur pengunduran diri karyawan:

Langkah-langkah:
1. Ajukan surat resign minimal 30 hari sebelum tanggal efektif
2. Serahkan surat ke atasan langsung dan HR
3. Lakukan serah terima tugas dan aset perusahaan
4. Ikuti exit interview dengan HR
5. Proses clearance dari semua departemen

Dokumen yang Perlu Diserahkan:
- Laptop dan aksesori
- ID Card dan akses kantor
- File dan dokumentasi pekerjaan
- Kontak klien yang ditangani

Hak Karyawan yang Resign:
- Gaji hingga tanggal terakhir kerja
- Sisa cuti yang belum digunakan (dikonversi ke uang)
- Sertifikat pengalaman kerja (atas permintaan)

Catatan: Karyawan yang resign tanpa notice period 30 hari dapat dikenakan denda.`
  },
  {
    id: '6',
    title: 'Jadwal dan Prosedur Meeting Rutin',
    category: 'Operasional',
    tags: ['meeting', 'rapat', 'jadwal', 'tim'],
    content: `Meeting rutin perusahaan untuk koordinasi tim:

Jadwal Meeting:
- Daily Standup: Setiap hari jam 09.00 (15 menit)
- Weekly Review: Setiap Jumat jam 15.00 (1 jam)
- Monthly All-Hands: Minggu pertama setiap bulan (2 jam)
- Quarterly Planning: Setiap awal kuartal ( setengah hari)

Etika Meeting:
- Hadir tepat waktu
- Siapkan agenda dan materi sebelumnya
- Matikan notifikasi perangkat
- Aktif berpartisipasi
- Notulen akan dibagikan setelah meeting

Platform:
- Meeting internal: Google Meet
- Meeting dengan klien: Zoom (link dikirim via email)
- Meeting besar: Aula kantor lantai 2`
  },
  {
    id: '7',
    title: 'Kebijakan Penggunaan Email Perusahaan',
    category: 'IT',
    tags: ['email', 'komunikasi', 'it'],
    content: `Email perusahaan (@company.com) adalah alat komunikasi resmi.

Aturan Penggunaan:
- Gunakan untuk keperluan bisnis saja
- Signature wajib mencakup: Nama, Jabatan, Departemen, Kontak
- Reply email dalam waktu maksimal 24 jam kerja
- CC atasan untuk komunikasi penting dengan klien
- Gunakan BCC untuk email massal

Hal yang Dilarang:
- Mengirim data rahasia via email tanpa enkripsi
- Forward email internal ke pihak luar tanpa izin
- Menggunakan email untuk kepentingan pribadi
- Mengirim attachment berukuran lebih dari 25MB

Tips:
- Gunakan folder dan label untuk organisasi email
- Archive email lama secara berkala
- Gunakan template untuk email yang sering dikirim`
  },
  {
    id: '8',
    title: 'Benefit dan Tunjangan Karyawan',
    category: 'HR',
    tags: ['benefit', 'tunjangan', 'gaji', 'bpjs', 'asuransi'],
    content: `Perusahaan menyediakan berbagai benefit untuk karyawan:

Benefit Wajib:
- BPJS Kesehatan (ditanggung perusahaan 100%)
- BPJS Ketenagakerjaan (JHT, JKK, JKM)
- THR (dibayar sebelum Hari Raya)

Benefit Tambahan:
- Asuransi kesehatan swasta (karyawan + 2 tanggungan)
- Tunjangan makan: Rp 50.000/hari kerja
- Tunjangan transportasi: Rp 30.000/hari kerja
- Bonus tahunan (berdasarkan kinerja)
- Program training dan sertifikasi

Fasilitas Kantor:
- Pantry dengan snack dan minuman gratis
- Gym mini di lantai 3
- Ruang istirahat dengan sofa dan TV
- Parkir gratis untuk karyawan

Benefit berlaku setelah masa percobaan 3 bulan selesai.`
  }
];

export function searchKnowledge(query: string): KnowledgeDoc[] {
  const keywords = query.toLowerCase().split(/\s+/);
  
  const scored = knowledgeBase.map(doc => {
    let score = 0;
    const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
    
    for (const keyword of keywords) {
      if (searchableText.includes(keyword)) {
        score += 1;
      }
      if (doc.title.toLowerCase().includes(keyword)) {
        score += 3;
      }
      if (doc.tags.some(tag => tag.includes(keyword))) {
        score += 2;
      }
    }
    
    return { doc, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.doc);
}
