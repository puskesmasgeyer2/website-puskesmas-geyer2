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
    document.getElementById('current-year');

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
     NORMALISASI DATA JSON
     ========================================================= */

  function normalizeList(payload) {

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

  function escapeHtml(value) {

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
     BERSIHKAN TEXT
     ========================================================= */

  function cleanText(value) {

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
     PARSE TANGGAL
     Mendukung:
     YYYY-MM-DD
     YYYY-MM-DDTHH:mm:ss
     DD/MM/YYYY
     DD-MM-YYYY
     ========================================================= */

  function parseDate(value) {

    if (!value) {

      return null;

    }


    const raw =
      String(value).trim();


    /* YYYY-MM-DD */

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


    /* DD/MM/YYYY atau DD-MM-YYYY */

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


    /* fallback native */

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
     FORMAT TANGGAL
     ========================================================= */

  function formatDate(value) {

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
     FORMAT TANGGAL PENDEK
     ========================================================= */

  function formatAgendaDate(value) {

    const date =
      parseDate(value);


    if (!date) {

      return {

        day: '--',
        month: '',
        year: ''

      };

    }


    return {

      day:
        date.toLocaleDateString(
          'id-ID',
          {
            day: '2-digit'
          }
        ),

      month:
        date.toLocaleDateString(
          'id-ID',
          {
            month: 'short'
          }
        ),

      year:
        date.toLocaleDateString(
          'id-ID',
          {
            year: 'numeric'
          }
        )

    };

  }



  /* =========================================================
     STATUS DATA
     ========================================================= */

  function isPublished(item) {

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
      data tetap ditampilkan.
    */

    if (!status) {

      return true;

    }


    const allowed = [

      'publish',
      'published',
      'aktif',
      'active',
      'ya',
      'yes',
      '1',
      'true',
      'tayang'

    ];


    return allowed.includes(
      status
    );

  }



  /* =========================================================
     IMAGE URL
     ========================================================= */

  function imageUrl(value) {

    if (!value) {

      return 'images/logo-puskesmas.PNG';

    }


    let image =
      String(value).trim();


    /* URL biasa */

    if (
      /^https?:\/\//i.test(image)
    ) {

      /*
        Google Drive file URL
        diubah menjadi thumbnail
      */

      const driveMatch =
        image.match(
          /drive\.google\.com\/file\/d\/([^/]+)/
        );


      if (driveMatch) {

        return (
          'https://drive.google.com/thumbnail?id=' +
          encodeURIComponent(
            driveMatch[1]
          ) +
          '&sz=w1200'
        );

      }


      const idMatch =
        image.match(
          /[?&]id=([^&]+)/
        );


      if (
        image.includes(
          'drive.google.com'
        ) &&
        idMatch
      ) {

        return (
          'https://drive.google.com/thumbnail?id=' +
          encodeURIComponent(
            idMatch[1]
          ) +
          '&sz=w1200'
        );

      }


      return image;

    }


    /* Root path */

    if (
      image.startsWith('/')
    ) {

      return image.substring(1);

    }


    /* Path yang sudah benar */

    if (
      image.startsWith(
        'images/'
      ) ||
      image.startsWith(
        'assets/'
      )
    ) {

      return image;

    }


    /* Path relatif */

    image =
      image.replace(
        /^\.\/+/,
        ''
      );


    return (
      'images/' +
      image
    );

  }



  /* =========================================================
     FILE URL
     ========================================================= */

  function fileUrl(value) {

    if (!value) {

      return '';

    }


    let file =
      String(value).trim();


    if (
      /^https?:\/\//i.test(file)
    ) {

      return file;

    }


    if (
      file.startsWith('/')
    ) {

      return file.substring(1);

    }


    if (
      file.startsWith(
        'files/'
      ) ||
      file.startsWith(
        'assets/'
      ) ||
      file.startsWith(
        'documents/'
      ) ||
      file.startsWith(
        'download/'
      )
    ) {

      return file;

    }


    /*
      Jika hanya nama file,
      diasumsikan berada di folder files.
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
     FETCH JSON
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
     RENDER EMPTY
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

        <div class="home-data-empty">

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
     RENDER ERROR
     ========================================================= */

  function renderError(
    element,
    title,
    message
  ) {

    if (!element) {

      return;

    }


    element.innerHTML = `

      <div class="col-12">

        <div class="home-data-empty">

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
     =========================================================
     BERITA
     =========================================================
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


        /*
          Hanya berita yang tayang
        */

        list =
          list.filter(
            isPublished
          );


        /*
          Urutkan terbaru
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


            if (
              !dateA &&
              !dateB
            ) {

              return 0;

            }


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


        /*
          Ambil 3 berita
        */

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
                      'foto',
                      'gambar',
                      'image',
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
                summary.length > 150
                  ? summary.substring(0, 150) + '…'
                  : summary;


              return `

                <div class="col-lg-4 col-md-6">

                  <article
                    class="home-data-card"
                  >

                    <div
                      class="home-news-image-wrap"
                    >

                      <img
                        class="home-news-image"
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='images/logo-puskesmas.PNG';"
                      >

                    </div>


                    <div
                      class="home-news-body"
                    >

                      <span
                        class="home-news-category"
                      >
                        ${escapeHtml(category)}
                      </span>


                      <div
                        class="home-news-date"
                      >
                        ${escapeHtml(date)}
                      </div>


                      <h3
                        class="home-news-title"
                      >
                        ${escapeHtml(title)}
                      </h3>


                      <p
                        class="home-news-summary"
                      >
                        ${escapeHtml(shortSummary)}
                      </p>


                      <a
                        class="home-data-link"
                        href="${link}"
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
            'Silakan periksa file data/berita.json.'
          );

        }
      );

  }



  /* =========================================================
     =========================================================
     AGENDA
     =========================================================
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


        const now =
          new Date();


        /*
          Pisahkan agenda mendatang
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


              /*
                Hari ini tetap dianggap
                agenda mendatang.
              */

              const today =
                new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                );


              return date >= today;

            }
          );


        /*
          Jika ada agenda mendatang,
          tampilkan yang mendatang.

          Jika tidak ada,
          tampilkan agenda terbaru.
        */

        let finalList =
          upcoming.length
            ? upcoming
            : list;


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


            if (
              !dateA &&
              !dateB
            ) {

              return 0;

            }


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


              const date =
                formatAgendaDate(
                  pick(
                    item,
                    [
                      'tanggal',
                      'date'
                    ],
                    ''
                  )
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


              const penanggungjawab =
                pick(
                  item,
                  [
                    'penanggungjawab',
                    'penanggung_jawab',
                    'pj'
                  ],
                  ''
                );


              return `

                <div class="col-lg-4 col-md-6">

                  <article
                    class="home-data-card home-agenda-card"
                  >

                    <div
                      class="home-agenda-top"
                    >

                      <div
                        class="home-agenda-date"
                      >

                        <span
                          class="home-agenda-day"
                        >
                          ${escapeHtml(date.day)}
                        </span>

                        <span
                          class="home-agenda-month"
                        >
                          ${escapeHtml(date.month)}
                        </span>

                        <span
                          class="home-agenda-year"
                        >
                          ${escapeHtml(date.year)}
                        </span>

                      </div>


                      <div
                        class="home-agenda-content"
                      >

                        <h3>
                          ${escapeHtml(title)}
                        </h3>


                        <div
                          class="home-agenda-meta"
                        >

                          ${
                            jam
                              ? `
                                <span>
                                  🕐
                                  ${escapeHtml(jam)}
                                </span>
                              `
                              : ''
                          }


                          ${
                            tempat
                              ? `
                                <span>
                                  📍
                                  ${escapeHtml(tempat)}
                                </span>
                              `
                              : ''
                          }

                        </div>


                        ${
                          penanggungjawab
                            ? `
                              <div
                                class="home-agenda-person"
                              >
                                Penanggung jawab:
                                <strong>
                                  ${escapeHtml(penanggungjawab)}
                                </strong>
                              </div>
                            `
                            : ''
                        }

                      </div>

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
            'AGENDA:',
            error
          );


          renderError(
            agendaBox,
            'Agenda belum dapat dimuat',
            'Silakan periksa file data/agenda.json.'
          );

        }
      );

  }



  /* =========================================================
     =========================================================
     GALERI
     =========================================================
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
          Terbaru dahulu
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


            if (
              !dateA &&
              !dateB
            ) {

              return 0;

            }


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


        /*
          Maksimal 6 foto
        */

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
                      class="home-gallery-card"
                      title="${escapeHtml(description || title)}"
                    >

                      <img
                        class="home-gallery-image"
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='images/logo-puskesmas.PNG';"
                      >


                      <div
                        class="home-gallery-overlay"
                      >

                        <span
                          class="home-gallery-album"
                        >
                          ${escapeHtml(album)}
                        </span>


                        <h3
                          class="home-gallery-title"
                        >
                          ${escapeHtml(title)}
                        </h3>


                        ${
                          date
                            ? `
                              <div
                                class="home-gallery-date"
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
            'Silakan periksa file data/galeri.json.'
          );

        }
      );

  }



  /* =========================================================
     =========================================================
     DOWNLOAD
     =========================================================
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
          Download tidak mempunyai tanggal
          pada struktur CMS saat ini.

          Karena itu urut berdasarkan
          nama file / kategori.
        */

        list.sort(
          function (a, b) {

            const nameA =
              String(
                pick(
                  a,
                  [
                    'namaFile',
                    'nama',
                    'judul',
                    'file'
                  ],
                  ''
                )
              ).toLowerCase();


            const nameB =
              String(
                pick(
                  b,
                  [
                    'namaFile',
                    'nama',
                    'judul',
                    'file'
                  ],
                  ''
                )
              ).toLowerCase();


            return nameA.localeCompare(
              nameB,
              'id'
            );

          }
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


              /*
                Jika file tidak tersedia,
                arahkan ke halaman download.
              */

              const link =
                url ||
                'download.html';


              return `

                <div class="col-lg-6">

                  <article
                    class="home-data-card home-download-card"
                  >

                    <div
                      class="d-flex gap-3 align-items-start"
                    >

                      <div
                        class="home-download-icon"
                      >
                        ↓
                      </div>


                      <div
                        class="home-download-content flex-grow-1"
                      >

                        <div
                          class="home-download-category"
                        >
                          ${escapeHtml(category)}
                        </div>


                        <h3
                          class="home-download-title"
                        >
                          ${escapeHtml(title)}
                        </h3>


                        ${
                          description
                            ? `
                              <p
                                class="home-download-description"
                              >
                                ${escapeHtml(
                                  description.length > 100
                                    ? description.substring(0, 100) + '…'
                                    : description
                                )}
                              </p>
                            `
                            : ''
                        }


                        <a
                          href="${escapeHtml(link)}"
                          class="home-data-link"
                          ${
                            /^https?:\/\//i.test(link)
                              ? 'target="_blank" rel="noopener noreferrer"'
                              : ''
                          }
                        >
                          ${url ? 'Download →' : 'Lihat dokumen →'}
                        </a>

                      </div>

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
            'Silakan periksa file data/download.json.'
          );

        }
      );

  }


})();
