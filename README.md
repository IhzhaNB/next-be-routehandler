# Route Handlers

## Table Content

1. [Route Handlers](#route-handlers)
2. [GET Request](#get-request)
3. [POST Request](#post-request)
4. [Dynamic Route Handlers](#dynamic-route-handlers)
5. [Handling PATCH Request](#handling-patch-request)
6. [DELETE Request](#delete-request)

# Route Handlers

### Memori: Berbagai Jenis Rute dan File Khusus

Kita telah membahas berbagai cara Next.js mengelola rute dan tampilan:

- **Parallel Routes**: Menampilkan beberapa bagian UI secara bersamaan.
- **Conditional Routes**: Menampilkan konten berbeda pada URL yang sama berdasarkan kondisi.
- **Intercepting Routes**: Memuat rute sebagai _overlay_ (modal) sambil menjaga konteks halaman.
- **File _fallback_** seperti `loading.tsx`, `error.tsx`, `not-found.tsx`, `default.tsx`, dan `global-error.tsx` untuk menangani berbagai kondisi UI.

Sekarang, kita akan beralih dari rute yang menampilkan UI ke rute yang menangani permintaan data dan logika _server_: **Route Handlers**.

---

### Route Handlers di Next.js

**Route Handlers** adalah fitur di Next.js App Router yang memungkinkan Anda membuat _custom request handlers_ untuk rute-rute tertentu. Ini pada dasarnya adalah cara untuk membangun _API endpoint_ langsung di dalam aplikasi Next.js Anda, tanpa perlu menyiapkan _server_ terpisah (seperti Node.js + Express).

#### Apa Itu Route Handlers?

- **Mirip API Routes (di Pages Router):** Jika Anda familiar dengan Pages Router di Next.js, Route Handlers adalah analoginya untuk App Router.
- **Endpoint RESTful:** Mereka memungkinkan Anda membangun _endpoint_ yang sesuai dengan prinsip RESTful, memberikan kontrol penuh atas respons yang dikirimkan.
- **Operasi CRUD:** Anda bisa melakukan operasi CRUD (Create, Read, Update, Delete) dengan _database_ atau sumber data lainnya langsung dari _handler_ ini.
- **Permintaan API Eksternal:** Sangat berguna untuk membuat permintaan ke API eksternal. Ini menjaga informasi sensitif (seperti _private key_ API) tetap aman di sisi _server_, karena permintaan dilakukan dari _server_ Next.js Anda, bukan dari _browser_ pengguna.
- **Metode HTTP:** Next.js mendukung metode HTTP umum seperti `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, dan `OPTIONS`. Jika permintaan menggunakan metode yang tidak didukung oleh _handler_ Anda, akan menghasilkan _error_ 405 (Method Not Allowed).

#### Cara Membuat Route Handler

1.  **Lokasi:** Route Handlers harus ditempatkan di dalam _folder_ `app`.

2.  **Nama File:** Buat _file_ bernama **`route.ts`** (untuk TypeScript) atau `route.js` (untuk JavaScript) di dalam _folder_ yang mendefinisikan jalur rute Anda.

    - **Contoh:** Untuk membuat _endpoint_ di `/api/hello`, Anda akan membuat _folder_ `app/api/hello/` dan di dalamnya ada _file_ `route.ts`.

3.  **Ekspor Fungsi Asinkron:** Di dalam _file_ `route.ts`, Anda harus mengekspor fungsi asinkron dengan nama yang sesuai dengan metode HTTP yang ingin Anda tangani.

    **Contoh Kode `app/api/hello/route.ts` (untuk permintaan GET):**

    ```typescript
    // app/api/hello/route.ts

    export async function GET(request: Request) {
      // Anda bisa mengakses request object di sini
      // Misalnya, membaca query parameters atau body

      // Mengembalikan Response standar JavaScript
      return new Response("Halo dari Route Handler Next.js!", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Anda juga bisa menambahkan handler untuk metode lain:
    // export async function POST(request: Request) { ... }
    // export async function PUT(request: Request) { ... }
    ```

#### Pertimbangan Penting

- **Organisasi:** Route Handlers dapat di-_nesting_ (bersarang) dalam _folder_ dan sub-_folder_ untuk organisasi yang lebih baik, sama seperti rute halaman biasa. Ini membantu menjaga struktur API Anda tetap rapi.
  - Contoh: `app/api/users/[id]/route.ts` untuk _endpoint_ detail pengguna.
- **Konflik dengan Rute Halaman:**
  - Jika Anda memiliki _file_ `route.ts` dan _file_ `page.tsx` di level _folder_ yang sama (misalnya, `app/profile/route.ts` dan `app/profile/page.tsx`), secara _default_, `route.ts` akan **mengambil prioritas**. Artinya, jika Anda mengakses `/profile`, yang akan dilayani adalah _Route Handler_, bukan halaman HTML.
  - **Cara Mengatasi Konflik:** Untuk memiliki halaman HTML dan _API endpoint_ untuk jalur dasar yang sama, disarankan untuk memindahkan _file_ `route.ts` ke dalam sub-direktori `api`.
    - **Contoh:** Pindahkan `app/profile/route.ts` menjadi `app/profile/api/route.ts`.
    - Dengan begitu, halaman HTML akan dilayani di `/profile`, dan _API endpoint_ akan tersedia di `/profile/api`.

Route Handlers adalah fondasi penting untuk membangun _backend_ ringan atau _API layer_ langsung di dalam aplikasi Next.js Anda, memungkinkan Anda mengelola data dan logika _server_ dengan efisien.

# GET Request

### Memori: Route Handlers sebagai Backend

Kita sudah membahas bahwa **Route Handlers** adalah cara kita membuat _backend_ (server-side) langsung di dalam proyek Next.js, memungkinkan kita membangun API _endpoint_ untuk berinteraksi dengan _database_, memproses data, atau mengakses API eksternal secara aman.

Sekarang, kita akan melihat contoh praktis bagaimana membuat dan menguji _Route Handler_ untuk permintaan `GET`.

---

### Membuat dan Menguji Route Handler untuk Permintaan GET di Next.js

Penjelasan ini akan fokus pada bagaimana Anda membuat Route Handler yang merespons permintaan `GET`, tanpa melibatkan pembangunan antarmuka pengguna (UI).

#### Persiapan Data (Data In-Memory)

Untuk tujuan demonstrasi dan kesederhanaan, kita akan menggunakan data yang disimpan langsung di dalam memori aplikasi. Perlu diingat bahwa data ini akan hilang setiap kali aplikasi di-_restart_ atau di-_refresh_. Dalam aplikasi nyata, data ini biasanya akan diambil dari _database_.

1.  **Buat Folder `comments`:** Di dalam _folder_ `src` (atau langsung di `app`), buat sebuah _folder_ baru bernama `comments`.

2.  **Buat _File_ Data:** Di dalam _folder_ `comments`, buat _file_ `data.ts` (atau `data.js`) untuk menyimpan _array_ contoh objek komentar. Setiap objek komentar akan memiliki `id` dan `text`.

    **Contoh `src/comments/data.ts`:**

    ```typescript
    // src/comments/data.ts
    interface Comment {
      id: number;
      text: string;
    }

    export const comments: Comment[] = [
      { id: 1, text: "Ini komentar pertama." },
      { id: 2, text: "Komentar kedua di sini." },
      { id: 3, text: "Komentar ketiga Next.js." },
    ];
    ```

#### Membuat Route Handler GET

1.  **Buat _File_ `route.ts`:** Di dalam _folder_ `comments` yang sama, buat _file_ bernama `route.ts` (ini adalah konvensi Next.js untuk Route Handler).

2.  **Impor Data:** Impor _array_ `comments` dari _file_ `data.ts` yang telah Anda buat.

3.  **Ekspor Fungsi `GET` Asinkron:** Definisikan dan ekspor fungsi asinkron bernama `GET`. Fungsi ini akan otomatis dipanggil ketika ada permintaan `GET` ke _endpoint_ ini.

4.  **Kembalikan Respons JSON:** Gunakan `Response.json()` untuk mengembalikan _array_ `comments` sebagai respons JSON.

    **Contoh `src/comments/route.ts`:**

    ```typescript
    // src/comments/route.ts
    import { comments } from "./data"; // Mengimpor data komentar
    import { NextResponse } from "next/server"; // Menggunakan NextResponse untuk respons JSON

    export async function GET() {
      // Mengembalikan data komentar sebagai respons JSON
      return NextResponse.json(comments);
    }
    ```

#### Menguji Route Handler

Karena kita tidak membangun UI, kita perlu alat untuk menguji _API endpoint_ ini. Salah satu alat yang populer adalah **Thunder Client** (ekstensi VS Code) atau Postman.

1.  **Buka Thunder Client (atau Postman):** Buat permintaan baru.
2.  **Setel Metode HTTP:** Pilih metode `GET`.
3.  **Setel URL:** Masukkan URL _endpoint_ Anda, yaitu `http://localhost:3000/comments`.
4.  **Kirim Permintaan:** Kirim permintaan tersebut.

**Hasil yang Diharapkan:**

Anda akan menerima status `200 OK` dan di bagian _body_ respons, Anda akan melihat _array_ komentar dalam format JSON:

```json
[
  { "id": 1, "text": "Ini komentar pertama." },
  { "id": 2, "text": "Komentar kedua di sini." },
  { "id": 3, "text": "Komentar ketiga Next.js." }
]
```

#### Aplikasi Dunia Nyata

Meskipun kita menguji dengan Thunder Client, dalam aplikasi nyata, _Route Handler_ `GET` ini akan diakses oleh komponen _frontend_ Anda (misalnya, komponen React yang menggunakan `fetch` atau _library_ lain seperti `axios`) untuk mengambil data dan menampilkannya di UI. Misalnya, saat halaman komentar dimuat, komponen _client_ akan memanggil `/comments` untuk mendapatkan daftar komentar.

Ini adalah langkah dasar untuk membuat _backend endpoint_ yang sederhana menggunakan Route Handlers di Next.js.

# POST Request

### Menggunakan Route Handler untuk Permintaan POST di Next.js

Penjelasan ini akan menunjukkan langkah-langkah untuk membuat Route Handler yang dapat menerima dan memproses permintaan `POST`.

#### Skenario Permintaan POST

Dalam skenario ini, kita akan membuat _endpoint_ API untuk menambahkan komentar baru. Permintaan `POST` akan dikirimkan ke `http://localhost:3000/comments` dengan data komentar baru di dalam _body_ permintaan.

1.  **Siapkan Permintaan POST:**

    - Menggunakan alat seperti Thunder Client atau Postman, buat permintaan baru.
    - Atur metode HTTP menjadi **`POST`**.
    - Atur URL ke `http://localhost:3000/comments`.
    - Di tab "Body", pilih format "JSON" dan masukkan data komentar baru, misalnya:
      ```json
      { "text": "Ini komentar baru!" }
      ```
    - Jika Anda mengirim permintaan ini sekarang tanpa Route Handler yang sesuai, Anda akan mendapatkan _error_ `405 Method Not Allowed`.

2.  **Buat Route Handler POST:**

    - Di dalam _file_ `route.ts` yang sama di _folder_ `comments` (yang sudah kita buat untuk permintaan `GET`), tambahkan fungsi asinkron baru bernama **`POST`**.
    - Fungsi ini akan menerima objek `Request` standar sebagai parameter.

3.  **Proses Data Permintaan:**

    - Di dalam fungsi `POST`, gunakan `await request.json()` untuk mengekstrak data JSON yang dikirimkan di _body_ permintaan.
    - Buat objek komentar baru. Berikan ID baru (misalnya, berdasarkan jumlah komentar yang sudah ada) dan gunakan teks dari data yang baru diterima.
    - Tambahkan objek komentar baru ini ke _array_ `comments` yang sudah ada (ingat, ini hanya akan mengubah data di memori).

    **Contoh Kode `src/comments/route.ts` (dengan fungsi POST):**

    ```typescript
    // src/comments/route.ts
    import { comments } from "./data";
    import { NextResponse } from "next/server";

    export async function GET() {
      return NextResponse.json(comments);
    }

    // Route Handler untuk permintaan POST
    export async function POST(request: Request) {
      // 1. Ekstrak data dari body permintaan
      const newCommentData = await request.json();

      // 2. Buat objek komentar baru dengan ID unik
      const newComment = {
        id: comments.length + 1,
        text: newCommentData.text,
      };

      // 3. Tambahkan komentar baru ke array in-memory
      comments.push(newComment);

      // 4. Kirim respons
      // Menggunakan NextResponse.json() untuk mengembalikan data dan status 201
      return NextResponse.json(newComment, { status: 201 });
    }
    ```

#### Mengirim Respons yang Tepat

Saat membuat sumber daya baru melalui permintaan `POST`, status HTTP yang benar untuk dikembalikan adalah **`201 Created`**, bukan `200 OK`. `NextResponse.json()` memungkinkan Anda untuk dengan mudah mengatur status ini di dalam parameter kedua.

#### Menguji Kembali

Setelah Anda menambahkan fungsi `POST` ke Route Handler Anda:

- Kirim kembali permintaan `POST` di Thunder Client. Anda akan mendapatkan status **`201 Created`** dan objek komentar baru di dalam _body_ respons.
- Jika Anda mengirim permintaan `GET` ke `http://localhost:3000/comments`, Anda akan melihat komentar yang baru saja Anda tambahkan di dalam _array_.

**Penting:** Perubahan ini hanya bersifat sementara (di memori). Jika Anda me-_refresh_ aplikasi, _array_ `comments` akan kembali ke kondisi awalnya.

Ini adalah dasar dari bagaimana Route Handlers menangani permintaan `POST` untuk membuat sumber daya baru.

# Dynamic Route Handlers

### Memori: Route Handlers dan Parameter Dinamis

Kita telah membahas bahwa **Route Handlers** berfungsi sebagai _backend_ di Next.js. Kita juga sudah tahu cara membuat _handler_ untuk permintaan `GET` dan `POST` yang bersifat statis (misalnya, `/comments`).

Sekarang, kita akan melihat bagaimana Route Handlers menangani **parameter dinamis**, yaitu data yang menjadi bagian dari URL itu sendiri (misalnya, `/comments/1`, di mana `1` adalah parameter dinamis). Ini sangat penting karena memungkinkan kita untuk berinteraksi dengan sumber daya spesifik, seperti mengambil satu komentar berdasarkan ID-nya.

Ini juga akan menjadi perbandingan yang menarik dengan `params` di komponen `page.tsx`. Di sana, `params` diterima sebagai _props_ langsung. Mari kita lihat bagaimana Route Handlers menanganinya.

---

### Membuat dan Mengakses Parameter Dinamis di Route Handlers (Permintaan GET)

Penjelasan ini akan fokus pada bagaimana Anda membuat Route Handler yang dapat merespons permintaan `GET` dengan segmen URL yang dinamis, seperti ID sebuah item.

#### Kebutuhan untuk Rute Dinamis

Meskipun permintaan `GET` dan `POST` untuk koleksi item (misalnya, `/comments`) sudah jelas, permintaan `GET` untuk satu item spesifik (misalnya, komentar dengan ID tertentu) membutuhkan cara untuk mengidentifikasi item tersebut. Ini dilakukan dengan menambahkan segmen dinamis di URL, seperti `/comments/:id`.

#### Cara Membuat Route Handler Dinamis

1.  **Buat Folder Dinamis:** Sama seperti membuat rute halaman dinamis, Anda membuat _folder_ dengan nama segmen dinamis yang dibungkus dalam tanda kurung siku (misalnya, `[id]`) di dalam _folder_ rute yang relevan (misalnya, di dalam `comments`).

2.  **Buat _File_ `route.ts`:** Di dalam _folder_ segmen dinamis ini, Anda membuat _file_ `route.ts`.

    **Contoh Struktur Folder:**

    ```
    src/
    └── comments/
        ├── [id]/          <- Folder untuk rute dinamis
        │   └── route.ts   <- Handler untuk /comments/:id
        └── route.ts       <- Handler untuk /comments
    ```

#### Mengakses Parameter Rute

- Fungsi _handler_ (misalnya, `GET`) akan menerima dua parameter: objek `request` dan objek `context`.

- Objek `context` inilah yang berisi parameter rute (`params`). Objek `params` ini akan berisi segmen dinamis sebagai _key_ (misalnya, `id`) dengan nilainya sebagai _string_.

- Anda dapat langsung mendestrukturisasi `id` dari `context.params`.

  **Contoh Kode `src/comments/[id]/route.ts`:**

  ```typescript
  // src/comments/[id]/route.ts
  import { comments } from "../data";
  import { NextResponse } from "next/server";

  // Handler menerima objek request dan context
  export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;

    // Cari komentar yang sesuai dengan ID
    const searchComment = comments.find(
      (comment) => comment.id === toString(id)
    );

    // Jika komentar ditemukan, kirim respons JSON
    if (searchComment) {
      return NextResponse.json(searchComment);
    }

    // Jika tidak, kirim error 404
    return new NextResponse("Komentar tidak ditemukan", { status: 404 });
  }
  ```

#### Perbandingan dengan `page.tsx`

Penting untuk diperhatikan, cara `params` diakses di Route Handler sedikit berbeda dari `page.tsx`.

- **Di `page.tsx`:** `params` adalah _props_ langsung dari fungsi komponen.
  ```typescript
  export default function MyPage({ params }: { params: { id: string } }) {
    /* ... */
  }
  ```
- **Di Route Handler:** `params` adalah properti dari objek `context` yang merupakan parameter kedua dari fungsi handler.
  ```typescript
  export function GET(request: Request, context: { params: { id: string } }) {
    /* ... */
  }
  ```

#### Menguji Handler Dinamis

Anda dapat menguji Route Handler dinamis ini menggunakan alat seperti Thunder Client atau Postman dengan mengirimkan permintaan `GET` ke URL yang berbeda:

- Permintaan ke `http://localhost:3000/comments/1` akan mengembalikan komentar dengan ID `1`.
- Permintaan ke `http://localhost:3000/comments/2` akan mengembalikan komentar dengan ID `2`.

Memahami cara kerja rute dinamis untuk permintaan `GET` adalah fondasi untuk mengimplementasikan permintaan `PATCH` dan `DELETE` yang juga membutuhkan ID spesifik.

# Handling PATCH Request

### Route Handlers: Memproses Permintaan PATCH

Kita telah membahas Route Handlers untuk permintaan `GET` (mengambil data) dan `POST` (menambahkan data baru). Sekarang, kita akan melihat cara menangani permintaan **`PATCH`**, yang digunakan untuk melakukan **modifikasi parsial** pada sebuah sumber daya yang sudah ada.

#### Skenario Permintaan PATCH

Permintaan `PATCH` sangat berguna ketika Anda ingin memperbarui hanya beberapa properti dari sebuah objek, bukan seluruh objek. Dalam contoh ini, kita akan memperbarui properti `text` dari sebuah komentar berdasarkan ID-nya.

1.  **Siapkan Permintaan PATCH:**

    - Menggunakan alat seperti Thunder Client atau Postman, atur metode HTTP menjadi **`PATCH`**.
    - Atur URL agar menargetkan sumber daya spesifik yang ingin diperbarui, misalnya `http://localhost:3000/comments/3` untuk komentar dengan ID 3.
    - Di tab "Body" (format JSON), sediakan properti yang ingin diperbarui.

    **Contoh Body Permintaan:**

    ```json
    {
      "text": "Komentar ini sudah diperbarui."
    }
    ```

2.  **Buat Route Handler PATCH:**

    - Di dalam _file_ `route.ts` yang sama (di _folder_ `[id]`), tambahkan fungsi asinkron baru bernama **`PATCH`**.
    - Fungsi ini akan menerima objek `request` dan `context` sebagai parameter.
    - Ekstrak `id` dari `context.params` dan teks yang diperbarui dari _body_ `request` dengan `await request.json()`.

3.  **Memperbarui Data:**

    - Gunakan `Array.prototype.findIndex()` pada _array_ komentar untuk menemukan **indeks** dari komentar yang ID-nya cocok dengan ID yang diberikan di URL.
    - Perbarui properti `text` dari objek komentar di indeks yang ditemukan dengan teks baru dari _body_ permintaan.

    **Contoh Kode `src/comments/[id]/route.ts` (dengan fungsi PATCH):**

    ```typescript
    // src/comments/[id]/route.ts
    import { comments } from "../../data";
    import { NextResponse } from "next/server";

    // ... (Fungsi GET sebelumnya)

    export async function PATCH(
      request: Request,
      context: { params: { id: string } }
    ) {
      const { id } = context.params;
      const { text } = await request.json();

      const index = comments.findIndex((c) => c.id.toString() === id);

      if (index !== -1) {
        comments[index].text = text;
        return NextResponse.json(comments[index]);
      }

      // Jika ID tidak ditemukan, kembalikan error 404
      return new NextResponse("Komentar tidak ditemukan", { status: 404 });
    }
    ```

4.  **Mengirim Respons yang Tepat:**

    - Setelah pembaruan berhasil, kembalikan komentar yang sudah diperbarui sebagai respons JSON dengan status **`200 OK`**. Status ini menandakan bahwa permintaan berhasil dan sumber daya telah dimodifikasi.

#### Menguji Kembali

- Setelah menambahkan fungsi `PATCH`, kirim permintaan PATCH Anda di Thunder Client. Anda akan mendapatkan status `200 OK` dan objek komentar yang sudah diperbarui di _body_ respons.
- Lakukan permintaan `GET` ke _endpoint_ `/comments` untuk melihat _array_ komentar lengkap dan memverifikasi bahwa komentar yang relevan sudah diperbarui.

**Penting:** Perlu diingat bahwa perubahan ini, sama seperti permintaan `POST` sebelumnya, hanya terjadi di **memori** dan akan hilang saat aplikasi di-_restart_. Untuk penyimpanan permanen, Anda akan menggunakan _database_.

# DELETE Request

### Memori: Mengimplementasikan `GET`, `POST`, dan `PATCH`

Kita telah membahas cara membuat _Route Handlers_ untuk **`GET`** (mengambil koleksi atau item tunggal), **`POST`** (menambah item baru), dan **`PATCH`** (memperbarui item secara parsial). Kita juga sudah memahami cara kerja `findIndex` untuk menemukan posisi item di dalam _array_.

Sekarang, kita akan melengkapi operasi CRUD dengan `DELETE`.

---

### Route Handlers: Memproses Permintaan DELETE

Permintaan **`DELETE`** digunakan untuk **menghapus** sebuah sumber daya yang spesifik. Sama seperti `GET` dan `PATCH` untuk satu item, `DELETE` juga menggunakan parameter dinamis di URL untuk mengidentifikasi item yang akan dihapus.

#### Skenario Permintaan DELETE

Kita akan membuat _endpoint_ API untuk menghapus komentar berdasarkan ID-nya.

1.  **Siapkan Permintaan DELETE:**

    - Menggunakan alat seperti Thunder Client atau Postman, atur metode HTTP menjadi **`DELETE`**.
    - Atur URL agar menargetkan sumber daya spesifik yang ingin dihapus, misalnya `http://localhost:3000/comments/3` untuk menghapus komentar dengan ID 3.
    - Permintaan `DELETE` **tidak membutuhkan _body_**, jadi Anda bisa membiarkannya kosong.
    - Jika Anda mengirim permintaan ini sekarang, Anda akan mendapatkan _error_ `405 Method Not Allowed` karena _handler_-nya belum dibuat.

2.  **Buat Route Handler DELETE:**

    - Di dalam _file_ `route.ts` yang sama (di _folder_ `[id]`), tambahkan fungsi asinkron baru bernama **`DELETE`**.
    - Fungsi ini akan menerima objek `request` dan `context` sebagai parameter.
    - Ekstrak `id` dari `context.params` untuk mengetahui komentar mana yang harus dihapus.

3.  **Menghapus Data:**

    - Gunakan `Array.prototype.findIndex()` untuk mencari **indeks** dari komentar yang akan dihapus.
    - Jika komentar ditemukan (`index !== -1`), simpan komentar tersebut ke variabel sementara (`deletedComment`). Ini berguna jika Anda ingin mengembalikan informasi item yang baru saja dihapus di respons.
    - Gunakan `Array.prototype.splice()` untuk menghapus komentar dari _array_ berdasarkan indeksnya. `splice(index, 1)` berarti "mulai dari `index`, hapus 1 item".

    **Contoh Kode `src/comments/[id]/route.ts` (dengan fungsi DELETE):**

    ```typescript
    // src/comments/[id]/route.ts
    import { comments } from "../../data";
    import { NextResponse } from "next/server";

    // ... (Fungsi GET, PATCH sebelumnya)

    export async function DELETE(
      request: Request,
      context: { params: { id: string } }
    ) {
      const { id } = context.params;

      const index = comments.findIndex((c) => c.id.toString() === id);

      // Pastikan komentar ditemukan sebelum dihapus
      if (index === -1) {
        return new NextResponse("Komentar tidak ditemukan", { status: 404 });
      }

      const deletedComment = comments[index];
      comments.splice(index, 1);

      // Kembalikan komentar yang dihapus sebagai respons
      return NextResponse.json(deletedComment);
    }
    ```

4.  **Mengirim Respons yang Tepat:**

    - Setelah penghapusan berhasil, kembalikan item yang dihapus sebagai respons JSON dengan status **`200 OK`** (atau `204 No Content` jika Anda tidak ingin mengembalikan _body_).

#### Menguji Kembali

- Kirim permintaan `DELETE` di Thunder Client. Anda akan mendapatkan status `200 OK` dan objek komentar yang sudah dihapus di dalam _body_ respons.
- Lakukan permintaan `GET` ke _endpoint_ `/comments` untuk melihat bahwa komentar yang relevan sudah tidak ada lagi di dalam _array_.

**Penting:** Sama seperti sebelumnya, perubahan ini hanya terjadi di **memori** dan akan hilang saat aplikasi di-_restart_. Untuk penyimpanan permanen, Anda akan menggunakan _database_.
