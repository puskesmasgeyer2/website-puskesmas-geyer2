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
     FALLBACK IMAGE
     
     JANGAN menggunakan:
     assets/img/health/facilities-9.webp
     
     karena file tersebut tidak tersedia.
     ========================================================= */

  const FALLBACK_IMAGE =
    'images/logo-puskesmas.PNG';



  /* =========================================================
     HELPER: PICK
     ========================================================= */

  function pick(
    obj,
    keys,
    fallback = ''
  ) {

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
     HELPER: NORMALIZE LIST
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
      Array.isArray(payload.agenda)
    ) {

      return payload.agenda;

    }


    if (
      payload &&
      Array.isArray(payload.galeri)
    ) {

      return payload.galeri;

    }


    if (
      payload &&
      Array.isArray(payload.gallery)
    ) {

      return payload.gallery;

    }


    if (
      payload &&
      Array.isArray(payload.download)
    ) {

      return payload.download;

    }


    if (
      payload &&
      Array.isArray(payload.dokumen)
    ) {

      return payload.dokumen;

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



  /* =========================================================
     HELPER: IMAGE URL
     ========================================================= */

  function imageUrl(value) {

    if (!value) {

      return FALLBACK_IMAGE;

    }


    const s = String(value).trim();


    if (
      /^https?:\/\//i.test(s)
    ) {

      return s;

    }


    if (
      s.startsWith('/')
    ) {

      return s.slice(1);

    }


    if (
      s.startsWith('images/')
    ) {

      return s;

    }


    if (
      s.startsWith('assets/')
    ) {

      return s;

    }


    return (
      'images/' +
      s.replace(/^\.\//, '')
    );

  }



  /* =========================================================
     HELPER: FORMAT DATE
     ========================================================= */

  function formatDate(value) {

    if (!value) {

      return '';

    }


    const d = new Date(value);


    if (
      Number.isNaN(d.getTime())
    ) {

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
     HELPER: CLEAN TEXT
     ========================================================= */

  function cleanText(value) {

    return String(value || '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  }



  /* =========================================================
     HELPER: SHORT TEXT
     ========================================================= */

  function shortText(
    value,
    max = 150
  ) {

    const text =
      cleanText(value);


    if (
      text.length > max
    ) {

      return (
        text
          .slice(0, max)
          .trim() +
        '…'
      );

    }


    return text;

  }



  /* =========================================================
     HELPER: SORT TERBARU
     ========================================================= */

  function sortNewest(list) {

    return list.sort(
      function (a, b) {

        const dateB =
          String(
            pick(
              b,
              [
                'tanggal',
                'date',
                'created_at',
                'tgl'
              ],
              ''
            )
          );


        const dateA =
          String(
            pick(
              a,
              [
                'tanggal',
                'date',
                'created_at',
                'tgl'
              ],
              ''
            )
          );


        return dateB.localeCompare(
          dateA
        );

      }
    );

  }



  /* =========================================================
     HELPER: FETCH JSON
     ========================================================= */

  async function getJson(url) {

    const response =
      await fetch(
        url,
        {
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        url +
        ' (' +
        response.status +
        ')'
      );

    }


    return response.json();

  }



  /* =========================================================
     HELPER: COBA BEBERAPA FILE JSON
     ========================================================= */

  async function loadFirstJson(
    urls
  ) {

    for (
      const url of urls
    ) {

      try {

        return await getJson(
          url
        );

      } catch (error) {

        /*
         * Coba file berikutnya.
         */

      }

    }


    return null;

  }



  /* =========================================================
     HELPER: PESAN
     ========================================================= */

  function setMessage(
    box,
    message
  ) {

    if (!box) {

      return;

    }


    box.innerHTML = `

      <div
        class="col-12 text-center p-5"
      >

        <div class="pkm-loading">

          ${escapeHtml(message)}

        </div>

      </div>

    `;

  }



  /* =========================================================
     BERITA
     ========================================================= */

  async function loadNews() {

    const box =
      document.getElementById(
        'home-news'
      );


    if (!box) {

      return;

    }


    try {

      const payload =
        await getJson(
          'data/berita.json'
        );


      let list =
        normalizeList(
          payload
        );


      list =
        sortNewest(
          list
        ).slice(
          0,
          3
        );


      if (!list.length) {

        setMessage(
          box,
          'Belum ada berita yang dapat ditampilkan.'
        );

        return;

      }


      box.innerHTML =
        list.map(
          function (item) {


            const id =
              pick(
                item,
                [
                  'id',
                  'ID',
                  'kode'
                ],
                ''
              );


            const title =
              pick(
                item,
                [
                  'judul',
                  'title',
                  'nama'
                ],
                'Berita Puskesmas Geyer 2'
              );


            const summary =
              pick(
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


            const date =
              formatDate(
                pick(
                  item,
                  [
                    'tanggal',
                    'date',
                    'created_at',
                    'tgl'
                  ],
                  ''
                )
              );


            const category =
              pick(
                item,
                [
                  'kategori',
                  'category',
                  'jenis'
                ],
                'Berita'
              );


            const image =
              imageUrl(
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


            const link = 'berita.html';


            return `

              <div
                class="col-lg-4 col-md-6"
              >

                <article
                  class="pkm-news-card"
                >


                  <div
                    class="pkm-news-image-wrap"
                  >

                    <img
                      class="pkm-news-image"
                      src="${escapeHtml(image)}"
                      alt="${escapeHtml(title)}"
                      onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                    >

                  </div>


                  <div
                    class="pkm-news-body"
                  >


                    <div
                      class="pkm-news-meta"
                    >

                      <span class="pkm-category">
                        ${escapeHtml(category)}
                      </span>

                    </div>


                    <div
                      class="pkm-news-date"
                    >
                      ${escapeHtml(date)}
                    </div>


                    <h3>

                      ${escapeHtml(title)}

                    </h3>


                    <p>

                      ${escapeHtml(
                        shortText(
                          summary,
                          150
                        )
                      )}

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

          }
        ).join('');


    } catch (error) {

      console.error(
        'Gagal memuat berita:',
        error
      );


      setMessage(
        box,
        'Berita belum dapat dimuat.'
      );

    }

  }



  /* =========================================================
     AGENDA
     ========================================================= */

  async function loadAgenda() {

    const box =
      document.getElementById(
        'home-agenda'
      );


    if (!box) {

      return;

    }


    const payload =
      await loadFirstJson(
        [
          'data/agenda.json',
          'data/agendas.json'
        ]
      );


    if (!payload) {

      setMessage(
        box,
        'Belum ada agenda yang dapat ditampilkan.'
      );

      return;

    }


    let list =
      normalizeList(
        payload
      );


    list =
      sortNewest(
        list
      ).slice(
        0,
        3
      );


    if (!list.length) {

      setMessage(
        box,
        'Belum ada agenda yang dapat ditampilkan.'
      );

      return;

    }


    box.innerHTML =
      list.map(
        function (item) {


          const title =
            pick(
              item,
              [
                'judul',
                'title',
                'nama',
                'kegiatan'
              ],
              'Agenda Puskesmas Geyer 2'
            );


          const date =
            formatDate(
              pick(
                item,
                [
                  'tanggal',
                  'date',
                  'tgl',
                  'tanggal_kegiatan'
                ],
                ''
              )
            );


          const time =
            pick(
              item,
              [
                'waktu',
                'jam',
                'time'
              ],
              ''
            );


          const place =
            pick(
              item,
              [
                'tempat',
                'lokasi',
                'location'
              ],
              ''
            );


          const description =
            pick(
              item,
              [
                'deskripsi',
                'description',
                'keterangan',
                'ringkasan'
              ],
              'Agenda kegiatan UPTD Puskesmas Geyer 2.'
            );


          return `

            <div
              class="col-lg-4 col-md-6"
            >

              <div
                class="pkm-feature-card h-100"
              >

                <div
                  class="feature-number"
                >

                  ${escapeHtml(
                    date || 'AGENDA'
                  )}

                </div>


                <h3>

                  ${escapeHtml(title)}

                </h3>


                <p>

                  ${escapeHtml(
                    shortText(
                      description,
                      130
                    )
                  )}

                </p>


                ${
                  time || place
                    ? `
                      <small>

                        ${escapeHtml(time)}

                        ${
                          time && place
                            ? ' • '
                            : ''
                        }

                        ${escapeHtml(place)}

                      </small>
                    `
                    : ''
                }


              </div>

            </div>

          `;

        }
      ).join('');

  }



  /* =========================================================
     GALERI
     ========================================================= */

  async function loadGallery() {

    const box =
      document.getElementById(
        'home-gallery'
      );


    if (!box) {

      return;

    }


    const payload =
      await loadFirstJson(
        [
          'data/galeri.json',
          'data/gallery.json'
        ]
      );


    if (!payload) {

      setMessage(
        box,
        'Belum ada dokumentasi galeri yang dapat ditampilkan.'
      );

      return;

    }


    let list =
      normalizeList(
        payload
      );


    list =
      sortNewest(
        list
      ).slice(
        0,
        3
      );


    if (!list.length) {

      setMessage(
        box,
        'Belum ada dokumentasi galeri yang dapat ditampilkan.'
      );

      return;

    }


    box.innerHTML =
      list.map(
        function (item) {


          const title =
            pick(
              item,
              [
                'judul',
                'title',
                'nama',
                'kegiatan'
              ],
              'Dokumentasi Puskesmas Geyer 2'
            );


          const image =
            imageUrl(
              pick(
                item,
                [
                  'gambar',
                  'image',
                  'foto',
                  'thumbnail',
                  'url'
                ],
                ''
              )
            );


          const date =
            formatDate(
              pick(
                item,
                [
                  'tanggal',
                  'date',
                  'created_at',
                  'tgl'
                ],
                ''
              )
            );


          return `

            <div
              class="col-lg-4 col-md-6"
            >

              <article
                class="pkm-news-card"
              >


                <img
                  class="pkm-news-image"
                  src="${escapeHtml(image)}"
                  alt="${escapeHtml(title)}"
                  onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >


                <div
                  class="pkm-news-body"
                >


                  <div
                    class="pkm-news-meta"
                  >

                    ${escapeHtml(date)}

                  </div>


                  <h3>

                    ${escapeHtml(title)}

                  </h3>


                </div>


              </article>

            </div>

          `;

        }
      ).join('');

  }



  /* =========================================================
     DOWNLOAD
     ========================================================= */

  async function loadDownload() {

    const box =
      document.getElementById(
        'home-download'
      );


    if (!box) {

      return;

    }


    const payload =
      await loadFirstJson(
        [
          'data/download.json',
          'data/dokumen.json',
          'data/downloads.json'
        ]
      );


    if (!payload) {

      setMessage(
        box,
        'Belum ada dokumen yang dapat ditampilkan.'
      );

      return;

    }


    const list =
      normalizeList(
        payload
      ).slice(
        0,
        3
      );


    if (!list.length) {

      setMessage(
        box,
        'Belum ada dokumen yang dapat ditampilkan.'
      );

      return;

    }


    box.innerHTML =
      list.map(
        function (item) {


          const title =
            pick(
              item,
              [
                'judul',
                'title',
                'nama',
                'nama_dokumen'
              ],
              'Dokumen Puskesmas Geyer 2'
            );


          const description =
            pick(
              item,
              [
                'deskripsi',
                'description',
                'keterangan',
                'ringkasan'
              ],
              'Dokumen dan formulir informasi Puskesmas.'
            );


          const url =
            pick(
              item,
              [
                'url',
                'link',
                'file',
                'download',
                'href'
              ],
              'download.html'
            );


          return `

            <div
              class="col-lg-4 col-md-6"
            >

              <div
                class="pkm-feature-card h-100"
              >


                <div
                  class="feature-number"
                >
                  PDF
                </div>


                <h3>

                  ${escapeHtml(title)}

                </h3>


                <p>

                  ${escapeHtml(
                    shortText(
                      description,
                      130
                    )
                  )}

                </p>


                <a
                  class="pkm-news-link"
                  href="${escapeHtml(url)}"
                  target="_blank"
                  rel="noopener"
                >
                  Unduh dokumen →
                </a>


              </div>

            </div>

          `;

        }
      ).join('');

  }



  /* =========================================================
     JALANKAN SEMUA
     ========================================================= */

  loadNews();

  loadAgenda();

  loadGallery();

  loadDownload();


})();
