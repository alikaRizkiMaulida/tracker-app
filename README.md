# Expense Tracker

Aplikasi pelacak pengeluaran (Expense Tracker) berbasis web yang sederhana untuk mencatat pemasukan dan pengeluaran harian.

## 📌 Deskripsi

Expense Tracker membantu pengguna untuk memantau kondisi keuangan harian dengan mencatat setiap transaksi, baik berupa pemasukan (income) maupun pengeluaran (expense). Aplikasi ini juga menampilkan saldo terkini secara otomatis berdasarkan seluruh transaksi yang telah dicatat.

## ✨ Fitur

- **Tambah Transaksi** – Mencatat transaksi baru dengan nama, jumlah, jenis (Pemasukan/Pengeluaran), dan kategori.
- **Hitung Saldo Otomatis** – Menampilkan total saldo, total pemasukan, dan total pengeluaran secara real-time.
- **Riwayat Transaksi** – Menampilkan daftar seluruh transaksi yang telah ditambahkan.
- **Hapus Transaksi** – Menghapus transaksi yang tidak dibutuhkan dari daftar riwayat.
- **Penyimpanan Lokal (LocalStorage)** – Data transaksi tetap tersimpan di browser meski halaman dimuat ulang.
- **Desain Responsif** – Tampilan dapat menyesuaikan dengan berbagai ukuran layar (desktop dan mobile).

## 🛠️ Teknologi yang Digunakan

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) – Struktur halaman web
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) – Styling dan tata letak
- [JavaScript (Vanilla JS)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – Logika aplikasi

## 📁 Struktur Proyek

```text
expense-tracker-starter-project/
├── css/
│   └── style.css        # File styling aplikasi
├── js/
│   └── app.js           # Logika utama aplikasi (DOM, perhitungan, LocalStorage)
├── index.html           # Halaman utama aplikasi
└── README.md            # Dokumentasi proyek

## 🚀 Cara Menjalankan
Ada dua cara untuk menjalankan proyek ini:
1. Langsung di Browser
1. Unduh atau clone repositori ini
2. Buka file index.html dengan browser pilihan Anda (Chrome, Firefox, Edge, dll.)
3. Aplikasi siap digunakan
2. Menggunakan Live Server (VS Code)
1. Buka folder proyek di Visual Studio Code (https://code.visualstudio.com/)
2. Install ekstensi Live Server (https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (jika belum)
3. Klik kanan pada index.html → Open with Live Server
4. Browser akan terbuka secara otomatis dengan fitur live reload

💡 Cara Penggunaan
1. Masukkan Nama Transaksi pada kolom yang tersedia
2. Masukkan Jumlah Transaksi (hanya angka, berupa nilai positif)
3. Pilih Jenis Transaksi (Pemasukan atau Pengeluaran)
4. Pilih Kategori sesuai transaksi (Contohnya: Makanan, Transportasi, Gaji, dll.)
5. Klik tombol Tambah Transaksi
6. Transaksi akan tampil di riwayat dan saldo akan ter-update secara otomatis
7. Untuk menghapus transaksi, klik tombol Hapus pada transaksi yang ingin dihapus

## 📝 Catatan
- Seluruh data disimpan secara lokal menggunakan localStorage. Jika Anda menghapus data browser (cache/storage), maka data transaksi juga akan terhapus.
- Proyek ini bersifat starter project, sehingga bisa dikembangkan lebih lanjut sesuai kebutuhan.
## 📄 Lisensi
Proyek ini dibuat untuk keperluan pembelajaran dan tidak memiliki lisensi khusus.
```
