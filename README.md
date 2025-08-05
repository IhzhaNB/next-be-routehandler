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
