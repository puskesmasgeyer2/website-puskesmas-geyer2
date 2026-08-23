(function () {

  'use strict';

  const box = document.getElementById('detail-pengumuman');

  if (!box) return;


  /* =========================================
     HELPER
     ========================================= */

  function pick(obj, keys, fallback = '') {

    for (const key of keys) {

      if (
        obj &&
        obj[key] !== undefined &&
        obj[key] !== null &&
        String(obj[key]).trim() !== ''
      ) {

        return obj[key];

      }

    }

    return fallback;

  }


  function escapeHtml(value) {

    return String(value).replace(
      /[&<>'"]/g,
      ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[ch])
    );

  }


  function formatDate(value) {

    if (!value) return '';

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {

      return String(value);

    }

    return d.toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );

  }


  function normalizeList(payload) {

    if (Array.isArray(payload)) {
      return payload;
    }

    if (
      payload &&
      Array.isArray(payload.data)
    ) {
      return payload.data;
    }

    if (
      payload &&
      Array.isArray(payload.pengumuman)
    ) {
      return payload.pengumuman;
    }

    if (
      payload &&
      Array.isArray(payload.items)
    ) {
      return payload.items;
    }

    return [];

  }


  /* =========================================
     AMBIL ID DARI URL
     ========================================= */

  const params = new URLSearchParams(
    window.location.search
  );

  const id = params.get('id');


  if (!id) {

    box.innerHTML = `
      <div class="detail-error">

        <h2>Pengumuman tidak ditemukan</h2>

        <p>
          ID pengumuman tidak tersedia.
        </p>

        <a
          href="pengumuman.html"
          class="back-pengumuman"
        >
          ← Kembali ke Pengumuman
        </a>

      </div>
    `;

    return;

  }


  /* =========================================
     BACA DATA JSON
     ========================================= */

  fetch(
    'data/pengumuman.json',
    {
      cache: 'no-store'
    }
  )

  .then(response => {

    if (!response.ok) {

      throw new Error(
        'Gagal membaca data/pengumuman.json'
      );

    }

    return response.json();

  })


  .then(payload => {

    const list = normalizeList(payload);

    const item = list.find(
      data =>
        String(
          pick(data, ['id', 'ID', 'kode'], '')
        ) === String(id)
    );


    /* =========================================
       JIKA TIDAK DITEMUKAN
       ========================================= */

    if (!item) {

      box.innerHTML = `
        <div class="detail-error">

          <h2>Pengumuman tidak ditemukan</h2>

          <p>
            Pengumuman yang Anda cari
            tidak tersedia atau telah dihapus.
          </p>

          <a
            href="pengumuman.html"
            class="back-pengumuman"
          >
            ← Kembali ke Pengumuman
          </a>

        </div>
      `;

      return;

    }


    /* =========================================
       AMBIL DATA
       ========================================= */

    const category = pick(
      item,
      ['kategori', 'category', 'jenis'],
      'Pengumuman'
    );


    const title = pick(
      item,
      ['judul', 'title', 'nama'],
      'Pengumuman Puskesmas Geyer 2'
    );


    const date = formatDate(
      pick(
        item,
        ['tanggal', 'date', 'created_at'],
        ''
      )
    );


    const summary = pick(
      item,
      [
        'ringkasan',
        'summary',
        'excerpt',
        'deskripsi',
        'description'
      ],
      ''
    );


    const content = pick(
      item,
      [
        'isi',
        'content',
        'konten',
        'body',
        'deskripsi',
        'description'
      ],
      summary
    );


    const status = pick(
      item,
      ['status'],
      'publish'
    );


    /* =========================================
       CEK STATUS
       ========================================= */

    if (
      String(status).toLowerCase() !== 'publish'
    ) {

      box.innerHTML = `
        <div class="detail-error">

          <h2>Pengumuman belum tersedia</h2>

          <p>
            Pengumuman ini belum dipublikasikan.
          </p>

          <a
            href="pengumuman.html"
            class="back-pengumuman"
          >
            ← Kembali ke Pengumuman
          </a>

        </div>
      `;

      return;

    }


    /* =========================================
       TAMPILKAN DETAIL
       ========================================= */

    box.innerHTML = `

      <article class="pengumuman-detail-card">

        <span class="detail-category">
          ${escapeHtml(category)}
        </span>


        <h1 class="detail-title">
          ${escapeHtml(title)}
        </h1>


        <div class="detail-meta">

          <span>
            📅 ${escapeHtml(date)}
          </span>

          <span>
            🏥 UPTD Puskesmas Geyer 2
          </span>

        </div>


        ${
          summary
            ? `
              <div class="detail-summary">

                <strong>Ringkasan</strong>

                <p>
                  ${escapeHtml(summary)}
                </p>

              </div>
            `
            : ''
        }


        <div class="detail-content">

          ${formatContent(content)}

        </div>


        <div class="detail-footer">

          Informasi resmi
          UPTD Puskesmas Geyer 2,
          Kabupaten Grobogan.

        </div>

      </article>

    `;


    document.title =
      `${title} - UPTD Puskesmas Geyer 2`;

  })


  .catch(error => {

    console.error(error);

    box.innerHTML = `

      <div class="detail-error">

        <h2>Pengumuman belum dapat dimuat</h2>

        <p>
          Terjadi masalah saat membaca
          data pengumuman.
        </p>

        <a
          href="pengumuman.html"
          class="back-pengumuman"
        >
          ← Kembali ke Pengumuman
        </a>

      </div>

    `;

  });


  /* =========================================
     FORMAT ISI
     ========================================= */

  function formatContent(value) {

    if (!value) {

      return `
        <p>
          Informasi lengkap pengumuman
          belum tersedia.
        </p>
      `;

    }


    const text = String(value);


    /*
      Jika nanti isi berisi HTML sederhana,
      kita izinkan struktur paragraf.

      Untuk sementara teks biasa
      dipisahkan berdasarkan baris kosong.
    */

    if (/<(p|h[1-6]|ul|ol|li|br|strong|b|table)\b/i.test(text)) {

      return text;

    }


    return text
      .split(/\n\s*\n/)
      .map(paragraph => {

        return `
          <p>
            ${escapeHtml(paragraph)}
          </p>
        `;

      })
      .join('');

  }


})();
