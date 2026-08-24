/* =========================================================
   FORCE HOMEPAGE TO START FROM TOP
   Mencegah Chrome mengembalikan posisi scroll lama
   ========================================================= */

if (
  'scrollRestoration' in history
) {
  history.scrollRestoration = 'manual';
}


window.addEventListener(
  'load',
  function () {

    /*
      Kalau URL tidak mempunyai hash (#...)
      selalu mulai dari bagian paling atas.
    */

    if (!window.location.hash) {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

    }

  }
);


/* =========================================================
   SCRIPT UTAMA
   ========================================================= */

(function () {

  'use strict';
(function () {

  'use strict';


  /* =========================================================
     MOBILE NAVIGATION
     ========================================================= */

  const nav =
    document.getElementById('navmenu');

  const toggle =
    document.querySelector('.mobile-nav-toggle');


  if (toggle && nav) {

    toggle.addEventListener(
      'click',
      function () {

        nav.classList.toggle(
          'mobile-open'
        );

        toggle.textContent =
          nav.classList.contains('mobile-open')
            ? '✕'
            : '☰';

      }
    );


    nav.querySelectorAll('a')
      .forEach(function (link) {

        link.addEventListener(
          'click',
          function () {

            nav.classList.remove(
              'mobile-open'
            );

            toggle.textContent = '☰';

          }
        );

      });

  }



  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const year =
    document.getElementById(
      'current-year'
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }



  /* =========================================================
     HELPER
     ========================================================= */

  function pick(
    object,
    keys,
    fallback = ''
  ) {

    for (
      const key of keys
    ) {

      if (
        object &&
        object[key] !== undefined &&
        object[key] !== null &&
        String(object[key]).trim() !== ''
      ) {

        return object[key];

      }

    }


    return fallback;

  }



  /* =========================================================
     NORMALIZE JSON
     ========================================================= */

  function normalizeList(
    payload
  ) {

    if (
      Array.isArray(payload)
    ) {

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
      Array.isArray(payload.items)
    ) {

      return payload.items;

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
      Array.isArray(payload.download)
    ) {

      return payload.download;

    }


    return [];

  }



  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHtml(
    value
  ) {

    return String(
      value ?? ''
    ).replace(
      /[&<>'"]/g,
      function (char) {

        return {

          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'

        }[char];

      }
    );

  }



  /* =========================================================
     CLEAN TEXT
     ========================================================= */

  function cleanText(
    value
  ) {

    return String(
      value ?? ''
    )
      .replace(
        /<[^>]*>/g,
        ''
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim();

  }



  /* =========================================================
     PARSE DATE
     ========================================================= */

  function parseDate(
    value
  ) {

    if (!value) {

      return null;

    }


    const raw =
      String(value).trim();


    /*
      YYYY-MM-DD
      YYYY-MM-DDTHH:mm:ss
    */

    let match =
      raw.match(
        /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
      );


    if (match) {

      const date =
        new Date(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3])
        );


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        return date;

      }

    }


    /*
      DD/MM/YYYY
      DD-MM-YYYY
    */

    match =
      raw.match(
        /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/
      );


    if (match) {

      const date =
        new Date(
          Number(match[3]),
          Number(match[2]) - 1,
          Number(match[1])
        );


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        return date;

      }

    }


    /*
      Fallback
    */

    const date =
      new Date(raw);


    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date;

    }


    return null;

  }



  /* =========================================================
     FORMAT DATE
     ========================================================= */

  function formatDate(
    value
  ) {

    const date =
      parseDate(value);


    if (!date) {

      return String(
        value ?? ''
      );

    }


    return date.toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );

  }



  /* =========================================================
     STATUS
     ========================================================= */

  function isPublished(
    item
  ) {

    const status =
      String(
        pick(
          item,
          [
            'status',
            'Status',
            'publish',
            'published'
          ],
          ''
        )
      )
      .trim()
      .toLowerCase();


    /*
      Jika tidak ada kolom status,
      data tetap dianggap aktif.
    */

    if (!status) {

      return true;

    }


    return [

      'publish',
      'published',
      'aktif',
      'active',
      'tayang',
      'ya',
      'yes',
      '1',
      'true'

    ].includes(
      status
    );

  }



  /* =========================================================
     IMAGE URL
     ========================================================= */

  function imageUrl(
    value
  ) {

    if (!value) {

      return 'images/logo-puskesmas.PNG';

    }


    let image =
      String(value).trim();


    /*
      URL eksternal
    */

    if (
      /^https?:\/\//i.test(image)
    ) {


      /*
        Google Drive:
        /file/d/ID/
      */

      const driveFile =
        image.match(
          /drive\.google\.com\/file\/d\/([^/]+)/
        );


      if (driveFile) {

        return (
          'https://drive.google.com/thumbnail?id=' +
          encodeURIComponent(
            driveFile[1]
          ) +
          '&sz=w1200'
        );

      }


      /*
        Google Drive:
        ?id=ID
      */

      const driveId =
        image.match(
          /[?&]id=([^&]+)/
        );


      if (
        image.includes(
          'drive.google.com'
        ) &&
        driveId
      ) {

        return (
          'https://drive.google.com/thumbnail?id=' +
          encodeURIComponent(
            driveId[1]
          ) +
          '&sz=w1200'
        );

      }


      return image;

    }


    /*
      Root relative
    */

    if (
      image.startsWith('/')
    ) {

      return image.substring(1);

    }


    /*
      Sudah mempunyai folder
    */

    if (
      image.startsWith('images/') ||
      image.startsWith('assets/')
    ) {

      return image;

    }


    /*
      File gambar biasa
    */

    return (
      'images/' +
      image.replace(
        /^\.\/+/,
        ''
      )
    );

  }



  /* =========================================================
     FILE URL
     ========================================================= */

  function fileUrl(
    value
  ) {

    if (!value) {

      return '';

    }


    const file =
      String(value).trim();


    /*
      URL eksternal
    */

    if (
      /^https?:\/\//i.test(file)
    ) {

      return file;

    }


    /*
      Root relative
    */

    if (
      file.startsWith('/')
    ) {

      return file.substring(1);

    }


    /*
      Sudah mempunyai folder
    */

    if (
      file.startsWith('files/') ||
      file.startsWith('assets/') ||
      file.startsWith('documents/') ||
      file.startsWith('download/')
    ) {

      return file;

    }


    /*
      Nama file saja
    */

    return (
      'files/' +
      file.replace(
        /^\.\/+/,
        ''
      )
    );

  }



  /* =========================================================
     LOAD JSON
     ========================================================= */

  async function loadJson(
    url
  ) {

    const response =
      await fetch(
        url,
        {
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        'Gagal membaca ' +
        url +
        ' (' +
        response.status +
        ')'
      );

    }


    return response.json();

  }



  /* =========================================================
     EMPTY
     ========================================================= */

  function renderEmpty(
    element,
    title,
    message
  ) {

    if (!element) {

      return;

    }


    element.innerHTML = `

      <div class="col-12">

        <div class="pkm-placeholder">

          <strong>
            ${escapeHtml(title)}
          </strong>

          <span>
            ${escapeHtml(message)}
          </span>

        </div>

      </div>

    `;

  }



  /* =========================================================
     ERROR
     ========================================================= */

  function renderError(
    element,
    title,
    message
  ) {

    renderEmpty(
      element,
      title,
      message
    );

  }



  /* =========================================================
     BERITA
     ========================================================= */

  const newsBox =
    document.getElementById(
      'home-news'
    );


  if (newsBox) {

    loadJson(
      'data/berita.json'
    )

      .then(function (payload) {

        let list =
          normalizeList(
            payload
          );


        list =
          list.filter(
            isPublished
          );


        /*
          Terbaru terlebih dahulu
        */

        list.sort(
          function (a, b) {

            const dateA =
              parseDate(
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


            const dateB =
              parseDate(
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


            if (!dateA) {

              return 1;

            }


            if (!dateB) {

              return -1;

            }


            return (
              dateB.getTime() -
              dateA.getTime()
            );

          }
        );


        list =
          list.slice(
            0,
            3
          );


        if (!list.length) {

          renderEmpty(
            newsBox,
            'Belum ada berita',
            'Belum ada berita yang dapat ditampilkan.'
          );

          return;

        }


        newsBox.innerHTML =
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


              const date =
                formatDate(
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


              const summary =
                cleanText(
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
                  )
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


              const link =
                id
                  ? (
                    'detail-berita.html?id=' +
                    encodeURIComponent(id)
                  )
                  : 'berita.html';


              const shortSummary =
                summary.length > 160
                  ? summary.substring(0, 160) + '…'
                  : summary;


              return `

                <div class="col-lg-4 col-md-6">

                  <article
                    class="pkm-news-card h-100"
                  >

                    <div
                      class="pkm-news-image-wrap"
                    >

                      <img
                        class="pkm-news-image"
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='images/logo-puskesmas.PNG';"
                      >

                    </div>


                    <div
                      class="pkm-news-body"
                    >

                      <div
                        class="pkm-news-meta"
                      >

                        <span
                          class="pkm-category"
                        >
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

            }
          ).join('');

      })

      .catch(
        function (error) {

          console.error(
            'BERITA:',
            error
          );


          renderError(
            newsBox,
            'Berita belum dapat dimuat',
            'Silakan periksa data/berita.json.'
          );

        }
      );

  }



  /* =========================================================
     AGENDA
     ========================================================= */

  const agendaBox =
    document.getElementById(
      'home-agenda'
    );


  if (agendaBox) {

    loadJson(
      'data/agenda.json'
    )

      .then(function (payload) {

        let list =
          normalizeList(
            payload
          );


        list =
          list.filter(
            isPublished
          );


        const today =
          new Date();


        const todayOnly =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );


        /*
          Prioritaskan agenda yang belum lewat
        */

        const upcoming =
          list.filter(
            function (item) {

              const date =
                parseDate(
                  pick(
                    item,
                    [
                      'tanggal',
                      'date'
                    ],
                    ''
                  )
                );


              if (!date) {

                return true;

              }


              return date >= todayOnly;

            }
          );


        let finalList =
          upcoming.length
            ? upcoming
            : list;


        /*
          Urut terdekat
        */

        finalList.sort(
          function (a, b) {

            const dateA =
              parseDate(
                pick(
                  a,
                  [
                    'tanggal',
                    'date'
                  ],
                  ''
                )
              );


            const dateB =
              parseDate(
                pick(
                  b,
                  [
                    'tanggal',
                    'date'
                  ],
                  ''
                )
              );


            if (!dateA) {

              return 1;

            }


            if (!dateB) {

              return -1;

            }


            return (
              dateA.getTime() -
              dateB.getTime()
            );

          }
        );


        finalList =
          finalList.slice(
            0,
            3
          );


        if (!finalList.length) {

          renderEmpty(
            agendaBox,
            'Belum ada agenda',
            'Belum ada agenda kegiatan yang dapat ditampilkan.'
          );

          return;

        }


        agendaBox.innerHTML =
          finalList.map(
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
                    'kegiatan',
                    'judul',
                    'title',
                    'nama'
                  ],
                  'Agenda Puskesmas'
                );


              const category =
                pick(
                  item,
                  [
                    'kategori',
                    'category',
                    'jenis'
                  ],
                  'Agenda'
                );


              const dateValue =
                parseDate(
                  pick(
                    item,
                    [
                      'tanggal',
                      'date'
                    ],
                    ''
                  )
                );


              const dateText =
                dateValue
                  ? dateValue.toLocaleDateString(
                      'id-ID',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      }
                    )
                  : '';


              const jam =
                pick(
                  item,
                  [
                    'jam',
                    'waktu',
                    'time'
                  ],
                  ''
                );


              const tempat =
                pick(
                  item,
                  [
                    'tempat',
                    'lokasi',
                    'location'
                  ],
                  ''
                );


              const pj =
                pick(
                  item,
                  [
                    'penanggungjawab',
                    'penanggung_jawab',
                    'pj'
                  ],
                  ''
                );


              const summary =
                cleanText(
                  pick(
                    item,
                    [
                      'ringkasan',
                      'summary',
                      'deskripsi',
                      'description',
                      'keterangan'
                    ],
                    ''
                  )
                );


              const link =
                id
                  ? (
                    'detail-agenda.html?id=' +
                    encodeURIComponent(id)
                  )
                  : 'agenda.html';


              return `

                <div class="col-lg-4 col-md-6">

                  <article
                    class="pkm-agenda-card"
                  >


                    <div
                      class="pkm-agenda-date"
                    >

                      <div
                        class="pkm-agenda-date-icon"
                      >
                        📅
                      </div>


                      <div>

                        <small>
                          Tanggal
                        </small>

                        <strong>
                          ${escapeHtml(dateText)}
                        </strong>

                      </div>

                    </div>


                    <span
                      class="pkm-agenda-category"
                    >
                      ${escapeHtml(category)}
                    </span>


                    <h3>
                      ${escapeHtml(title)}
                    </h3>


                    ${
                      summary
                        ? `
                          <p>
                            ${escapeHtml(
                              summary.length > 140
                                ? summary.substring(0, 140) + '…'
                                : summary
                            )}
                          </p>
                        `
                        : ''
                    }


                    <div
                      class="pkm-agenda-info"
                    >

                      ${
                        jam
                          ? `
                            <div>
                              🕐
                              <strong>
                                Jam:
                              </strong>
                              ${escapeHtml(jam)}
                            </div>
                          `
                          : ''
                      }


                      ${
                        tempat
                          ? `
                            <div>
                              📍
                              <strong>
                                Tempat:
                              </strong>
                              ${escapeHtml(tempat)}
                            </div>
                          `
                          : ''
                      }


                      ${
                        pj
                          ? `
                            <div>
                              👤
                              <strong>
                                Penanggung Jawab:
                              </strong>
                              ${escapeHtml(pj)}
                            </div>
                          `
                          : ''
                      }


                    </div>


                    <a
                      href="${escapeHtml(link)}"
                      class="pkm-agenda-link"
                    >
                      Lihat agenda →
                    </a>


                  </article>

                </div>

              `;

            }
          ).join('');

      })

      .catch(
        function (error) {

          console.error(
            'AGENDA:',
            error
          );


          renderError(
            agendaBox,
            'Agenda belum dapat dimuat',
            'Silakan periksa data/agenda.json.'
          );

        }
      );

  }



  /* =========================================================
     GALERI
     ========================================================= */

  const galleryBox =
    document.getElementById(
      'home-gallery'
    );


  if (galleryBox) {

    loadJson(
      'data/galeri.json'
    )

      .then(function (payload) {

        let list =
          normalizeList(
            payload
          );


        list =
          list.filter(
            isPublished
          );


        /*
          Terbaru
        */

        list.sort(
          function (a, b) {

            const dateA =
              parseDate(
                pick(
                  a,
                  [
                    'tanggal',
                    'date'
                  ],
                  ''
                )
              );


            const dateB =
              parseDate(
                pick(
                  b,
                  [
                    'tanggal',
                    'date'
                  ],
                  ''
                )
              );


            if (!dateA) {

              return 1;

            }


            if (!dateB) {

              return -1;

            }


            return (
              dateB.getTime() -
              dateA.getTime()
            );

          }
        );


        list =
          list.slice(
            0,
            6
          );


        if (!list.length) {

          renderEmpty(
            galleryBox,
            'Belum ada galeri',
            'Belum ada dokumentasi kegiatan yang dapat ditampilkan.'
          );

          return;

        }


        galleryBox.innerHTML =
          list.map(
            function (item) {

              const title =
                pick(
                  item,
                  [
                    'judul',
                    'title',
                    'nama'
                  ],
                  'Dokumentasi Kegiatan'
                );


              const album =
                pick(
                  item,
                  [
                    'album',
                    'kategori',
                    'category'
                  ],
                  'Kegiatan Puskesmas'
                );


              const date =
                formatDate(
                  pick(
                    item,
                    [
                      'tanggal',
                      'date'
                    ],
                    ''
                  )
                );


              const image =
                imageUrl(
                  pick(
                    item,
                    [
                      'foto',
                      'gambar',
                      'image',
                      'thumbnail'
                    ],
                    ''
                  )
                );


              const description =
                cleanText(
                  pick(
                    item,
                    [
                      'keterangan',
                      'deskripsi',
                      'description'
                    ],
                    ''
                  )
                );


              return `

                <div class="col-lg-4 col-md-6">

                  <a
                    href="galeri.html"
                    class="text-decoration-none"
                  >

                    <article
                      class="pkm-gallery-card"
                    >


                      <div
                        class="pkm-gallery-image"
                      >

                        <img
                          src="${escapeHtml(image)}"
                          alt="${escapeHtml(title)}"
                          loading="lazy"
                          onerror="this.onerror=null;this.src='images/logo-puskesmas.PNG';"
                        >


                        <div
                          class="pkm-gallery-overlay"
                        >

                          <span>
                            +
                          </span>

                        </div>

                      </div>


                      <div
                        class="pkm-gallery-body"
                      >

                        <small>
                          ${escapeHtml(album)}
                        </small>


                        <h3>
                          ${escapeHtml(title)}
                        </h3>


                        ${
                          description
                            ? `
                              <p>
                                ${escapeHtml(
                                  description.length > 120
                                    ? description.substring(0, 120) + '…'
                                    : description
                                )}
                              </p>
                            `
                            : ''
                        }


                        ${
                          date
                            ? `
                              <div
                                class="pkm-gallery-date"
                              >
                                ${escapeHtml(date)}
                              </div>
                            `
                            : ''
                        }

                      </div>


                    </article>

                  </a>

                </div>

              `;

            }
          ).join('');

      })

      .catch(
        function (error) {

          console.error(
            'GALERI:',
            error
          );


          renderError(
            galleryBox,
            'Galeri belum dapat dimuat',
            'Silakan periksa data/galeri.json.'
          );

        }
      );

  }



  /* =========================================================
     DOWNLOAD
     ========================================================= */

  const downloadBox =
    document.getElementById(
      'home-download'
    );


  if (downloadBox) {

    loadJson(
      'data/download.json'
    )

      .then(function (payload) {

        let list =
          normalizeList(
            payload
          );


        list =
          list.filter(
            isPublished
          );


        /*
          Maksimal 4 dokumen
        */

        list =
          list.slice(
            0,
            4
          );


        if (!list.length) {

          renderEmpty(
            downloadBox,
            'Belum ada dokumen',
            'Belum ada dokumen yang dapat diunduh.'
          );

          return;

        }


        downloadBox.innerHTML =
          list.map(
            function (item) {

              const category =
                pick(
                  item,
                  [
                    'kategori',
                    'category',
                    'jenis'
                  ],
                  'Dokumen'
                );


              const title =
                pick(
                  item,
                  [
                    'namaFile',
                    'nama',
                    'judul'
                  ],
                  'Dokumen Puskesmas'
                );


              const description =
                cleanText(
                  pick(
                    item,
                    [
                      'keterangan',
                      'deskripsi',
                      'description'
                    ],
                    ''
                  )
                );


              const file =
                pick(
                  item,
                  [
                    'file',
                    'url',
                    'link',
                    'href'
                  ],
                  ''
                );


              const url =
                fileUrl(
                  file
                );


              const link =
                url ||
                'download.html';


              /*
                Ambil ekstensi file
              */

              let extension =
                'FILE';


              const extensionMatch =
                String(
                  title
                ).match(
                  /\.([a-z0-9]{2,5})$/i
                );


              if (extensionMatch) {

                extension =
                  extensionMatch[1]
                    .toUpperCase();

              }


              return `

                <div class="col-lg-6">

                  <article
                    class="pkm-download-card"
                  >


                    <div
                      class="pkm-download-icon"
                    >
                      ${escapeHtml(extension)}
                    </div>


                    <div
                      class="pkm-download-content"
                    >


                      <small>
                        ${escapeHtml(category)}
                      </small>


                      <h3>
                        ${escapeHtml(title)}
                      </h3>


                      ${
                        description
                          ? `
                            <p>
                              ${escapeHtml(
                                description.length > 130
                                  ? description.substring(0, 130) + '…'
                                  : description
                              )}
                            </p>
                          `
                          : ''
                      }


                      <a
                        href="${escapeHtml(link)}"
                        class="pkm-download-btn"
                        ${
                          /^https?:\/\//i.test(link)
                            ? 'target="_blank" rel="noopener noreferrer"'
                            : ''
                        }
                      >
                        Download →
                      </a>


                    </div>


                  </article>

                </div>

              `;

            }
          ).join('');

      })

      .catch(
        function (error) {

          console.error(
            'DOWNLOAD:',
            error
          );


          renderError(
            downloadBox,
            'Dokumen belum dapat dimuat',
            'Silakan periksa data/download.json.'
          );

        }
      );

  }


})();
