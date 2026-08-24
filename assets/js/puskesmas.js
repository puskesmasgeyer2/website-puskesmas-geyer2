(function () {

  'use strict';


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const nav = document.getElementById('navmenu');
  const toggle = document.querySelector('.mobile-nav-toggle');


  if (toggle && nav) {

    toggle.addEventListener('click', function () {

      nav.classList.toggle('mobile-open');

      toggle.textContent =
        nav.classList.contains('mobile-open')
          ? '✕'
          : '☰';

    });


    nav.querySelectorAll('a').forEach(function (a) {

      a.addEventListener('click', function () {

        nav.classList.remove('mobile-open');

        toggle.textContent = '☰';

      });

    });

  }



  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const year = document.getElementById('current-year');

  if (year) {

    year.textContent = new Date().getFullYear();

  }



  /* =========================================================
     HOME NEWS
     ========================================================= */

  const newsBox = document.getElementById('home-news');


  /*
   * Jika halaman tidak mempunyai #home-news,
   * JavaScript tetap berhenti dengan aman.
   */

  if (!newsBox) {
    return;
  }



  /* =========================================================
     HELPER: AMBIL NILAI OBJECT
     ========================================================= */

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



  /* =========================================================
     HELPER: NORMALISASI DATA
     ========================================================= */

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
      Array.isArray(payload.berita)
    ) {
      return payload.berita;
    }


    if (
      payload &&
      Array.isArray(payload.items)
    ) {
      return payload.items;
    }


    return [];

  }



  /* =========================================================
     HELPER: URL GAMBAR
     ========================================================= */

  function imageUrl(value) {

    if (!value) {

      return 'assets/img/health/facilities-9.webp';

    }


    let s = String(value).trim();


    if (/^https?:\/\//i.test(s)) {

      return s;

    }


    if (s.startsWith('/')) {

      return s.slice(1);

    }


    if (
      s.startsWith('images/') ||
      s.startsWith('assets/')
    ) {

      return s;

    }


    return 'images/' + s.replace(/^\.\//, '');

  }



  /* =========================================================
     HELPER: FORMAT TANGGAL
     ========================================================= */

  function formatDate(value) {

    if (!value) {
      return '';
    }


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



  /* =========================================================
     HELPER: ESCAPE HTML
     ========================================================= */

  function escapeHtml(value) {

    return String(value).replace(
      /[&<>'"]/g,
      function (ch) {

        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[ch];

      }
    );

  }



  /* =========================================================
     LOAD BERITA
     ========================================================= */

  fetch(
    'data/berita.json',
    {
      cache: 'no-store'
    }
  )

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          'Gagal membaca data/berita.json'
        );

      }


      return response.json();

    })


    .then(function (payload) {

      let list = normalizeList(payload);


      /* =====================================================
         SORT BERITA TERBARU
         ===================================================== */

      list.sort(function (a, b) {

        const dateB = String(
          pick(
            b,
            [
              'tanggal',
              'date',
              'created_at'
            ],
            ''
          )
        );


        const dateA = String(
          pick(
            a,
            [
              'tanggal',
              'date',
              'created_at'
            ],
            ''
          )
        );


        return dateB.localeCompare(dateA);

      });



      /* =====================================================
         AMBIL 3 BERITA TERBARU
         ===================================================== */

      list = list.slice(0, 3);



      /* =====================================================
         JIKA TIDAK ADA DATA
         ===================================================== */

      if (!list.length) {

        newsBox.innerHTML = `
          <div class="col-12 text-center">
            <p class="pkm-loading">
              Belum ada berita yang dapat ditampilkan.
            </p>
          </div>
        `;

        return;

      }



      /* =====================================================
         TAMPILKAN BERITA
         ===================================================== */

      newsBox.innerHTML = list.map(function (item) {


        /* ---------------------------------------------------
           ID
           --------------------------------------------------- */

        const id = pick(
          item,
          [
            'id',
            'ID',
            'kode'
          ],
          ''
        );



        /* ---------------------------------------------------
           JUDUL
           --------------------------------------------------- */

        const title = pick(
          item,
          [
            'judul',
            'title',
            'nama'
          ],
          'Berita Puskesmas Geyer 2'
        );



        /* ---------------------------------------------------
           RINGKASAN
           --------------------------------------------------- */

        const summary = pick(
          item,
          [
            'ringkasan',
            'summary',
            'excerpt',
            'deskripsi',
            'description',
            'isi'
          ],
          'Informasi terbaru dari UPTD Puskesmas Geyer 2.'
        );



        /* ---------------------------------------------------
           TANGGAL
           --------------------------------------------------- */

        const date = formatDate(
          pick(
            item,
            [
              'tanggal',
              'date',
              'created_at'
            ],
            ''
          )
        );



        /* ---------------------------------------------------
           KATEGORI
           --------------------------------------------------- */

        const category = pick(
          item,
          [
            'kategori',
            'category',
            'jenis'
          ],
          'Berita'
        );



        /* ---------------------------------------------------
           GAMBAR
           --------------------------------------------------- */

        const image = imageUrl(
          pick(
            item,
            [
              'gambar',
              'image',
              'foto',
              'thumbnail'
            ],
            ''
          )
        );



        /* ---------------------------------------------------
           LINK
           --------------------------------------------------- */

        const link = id
          ? `detail-berita.html?id=${encodeURIComponent(id)}`
          : 'berita.html';



        /* ---------------------------------------------------
           BERSIHKAN RINGKASAN DARI HTML
           --------------------------------------------------- */

        const cleanSummary = String(summary)
          .replace(/<[^>]*>/g, '')
          .trim();


        const shortSummary =
          cleanSummary.length > 150
            ? cleanSummary.slice(0, 150) + '…'
            : cleanSummary;



        /* ---------------------------------------------------
           TEMPLATE BERITA
           --------------------------------------------------- */

        return `
          <div class="col-lg-4 col-md-6">

            <article class="pkm-news-card">

              <img
                class="pkm-news-image"
                src="${escapeHtml(image)}"
                alt="${escapeHtml(title)}"
                onerror="this.src='assets/img/health/facilities-9.webp'"
              >


              <div class="pkm-news-body">


                <div class="pkm-news-meta">

                  ${escapeHtml(date)}

                  ${date ? ' • ' : ''}

                  ${escapeHtml(category)}

                </div>


                <h3>
                  ${escapeHtml(title)}
                </h3>


                <p>
                  ${escapeHtml(shortSummary)}
                </p>


                <a
                  class="pkm-news-link"
                  href="${escapeHtml(link)}"
                >
                  Baca selengkapnya →
                </a>


              </div>

            </article>

          </div>
        `;

      }).join('');


    })


    /* =======================================================
       ERROR
       ======================================================= */

    .catch(function (err) {

      console.error(
        'Kesalahan memuat berita:',
        err
      );


      newsBox.innerHTML = `
        <div class="col-12 text-center">

          <p class="pkm-loading">
            Berita belum dapat dimuat.
            Silakan cek koneksi API/data.
          </p>

        </div>
      `;

    });


})();
