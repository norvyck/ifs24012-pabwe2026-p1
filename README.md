# TruthCheck Frontend

Frontend React dengan Vite; request API memakai path relatif `/api`.

## Struktur source

```text
src/
├── components/  # komponen UI yang digunakan ulang
├── constants/   # pilihan/status klaim
├── hooks/       # hook navigasi dan interaksi browser
├── pages/       # halaman aplikasi
├── services/    # komunikasi dengan API
└── utils/       # helper tanggal dan sesi
```

`App.jsx` mengatur sesi, memuat data klaim, dan memilih halaman yang ditampilkan.

## Rute aplikasi

Rute publik: `/`, `/auth/login`, `/auth/register`, dan `/claims/:id`.

Rute yang meminta login: `/submit` (kirim klaim), `/dashboard` (klaim saya), `/evidence` (tambahkan bukti), `/votes` (riwayat suara), dan `/profile` (profil).

## Pengembangan lokal

Jalankan backend di terminal terpisah pada lokasi backend dengan `bun run start`, lalu dari root frontend:

```sh
npm install
npm run dev
```

Buka alamat Vite yang ditampilkan di terminal (biasanya `http://localhost:5173`). Proxy Vite meneruskan `/api` ke Express pada `http://localhost:3000`.

## Build

Dari root frontend jalankan:

```sh
npm run build
```

Hasil build ada di `dist/`. Jika backend akan menyajikan file statis frontend, sesuaikan lokasi build dengan konfigurasi backend.
