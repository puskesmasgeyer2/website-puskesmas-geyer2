if (
  'scrollRestoration' in history
) {
  history.scrollRestoration = 'manual';
}

window.addEventListener(
  'load',
  function () {

    if (!window.location.hash) {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

    }

  }
);

(function () {

  'use strict';

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

  const year =
    document.getElementById(
      'current-year'
    );

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

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

  function parseDate(
    value
  ) {

    if (!value) {

      return null;

    }

    const raw =
      String(value).trim();

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

  function imageUrl(
    value
  ) {

    if (!value) {

      return 'images/logo-puskesmas.PNG';

    }

    let image =
      String(value).trim();

    if (
      /^https?:\/\//i.test(image)
    ) {

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

    if (
      image.startsWith('/')
    ) {

      return image.substring(1);

    }

    if (
      image.startsWith('images/') ||
      image.startsWith('assets/')
    ) {

      return image;

    }

    return (
      'images/' +
      image.replace(
        /^\.\/+/,
        ''
      )
    );

  }

  function fileUrl(
    value
  ) {

    if (!value) {

      return '';

    }

    const file =
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
      file.startsWith('files/') ||
      file.startsWith('assets/') ||
      file.startsWith('documents/') ||
      file.startsWith('download/')
    ) {

      return file;

    }

    return (
      'files/' +
      file.replace(
        /^\.\/+/,
        ''
      )
    );

  }

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

          <h3>
            ${escapeHtml(title)}
          </h3>

          <p>
            ${escapeHtml(message)}
          </p>

        </div>

      </div>

    `;

  }

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

        <div class="pkm-placeholder">

          <h3>
            ${escapeHtml(title)}
          </h3>

          <p>
            ${escapeHtml(message)}
          </p>

        </div>

      </div>

    `;

  }

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

              const category =
                pick(
                  item,
                  [
                    'kategori',
                    'category',
                    'jenis'
                  ],
                  'Informasi'
                );

              const title =
                pick(
                  item,
                  [
                    'judul',
                    'title',
                    'nama'
                  ],
                  'Berita Puskesmas'
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

              const description =
                cleanText(
                  pick(
                    item,
                    [
                      'ringkasan',
                      'deskripsi',
                      'description',
                      'isi',
                      'content'
                    ],
                    ''
                  )
                );

              const image =
                imageUrl(
                  pick(
                    item,
                    [
                      'gambar',
                      'foto',
                      'image',
                      'thumbnail'
                    ],
                    ''
                  )
                );

              const link =
                pick(
                  item,
                  [
                    'link',
                    'url',
                    'href'
                  ],
                  'berita.html'
                );

              return `

                <div class="col-lg-4 col-md-6">

                  <article
                    class="pkm-news-card h-100"
                  >

                    <div
                      class="pkm-news-image-wrap"
                    >

                      <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(title)}"
                        class="pkm-news-image"
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

                        ${
                          date
                            ? `
                              <span
                                class="pkm-news-date"
                              >
                                ${escapeHtml(date)}
                              </span>
                            `
                            : ''
                        }

                      </div>

                      <h3>
                        ${escapeHtml(title)}
                      </h3>

                      ${
                        description
                          ? `
                            <p>
                              ${escapeHtml(
                                description.length > 150
                                  ? description.substring(0, 150) + '…'
                                  : description
                              )}
                            </p>
                          `
                          : ''
                      }

                      <a
                        href="${escapeHtml(link)}"
                        class="pkm-news-link"
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
              dateA.getTime() -
              dateB.getTime()
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
            agendaBox,
            'Belum ada agenda',
            'Belum ada agenda kegiatan yang dapat ditampilkan.'
          );

          return;

        }

        agendaBox.innerHTML =
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
                  'Kegiatan'
                );

              const dateValue =
                pick(
                  item,
                  [
                    'tanggal',
                    'date'
                  ],
                  ''
                );

              const date =
                formatDate(
                  dateValue
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

              const location =
                pick(
                  item,
                  [
                    'lokasi',
                    'tempat',
                    'location'
                  ],
                  ''
                );

              const description =
                cleanText(
                  pick(
                    item,
                    [
                      'deskripsi',
                      'description',
                      'keterangan'
                    ],
                    ''
                  )
                );

              const link =
                pick(
                  item,
                  [
                    'link',
                    'url',
                    'href'
                  ],
                  'agenda.html'
                );

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
                        ${escapeHtml(
                          date
                            ? date.substring(0, 2)
                            : '--'
                        )}
                      </div>

                      <div>

                        <strong>
                          ${escapeHtml(date)}
                        </strong>

                        ${
                          time
                            ? `
                              <span>
                                ${escapeHtml(time)}
                              </span>
                            `
                            : ''
                        }

                      </div>

                    </div>

                    <div
                      class="pkm-agenda-category"
                    >
                      ${escapeHtml(category)}
                    </div>

                    <div
                      class="pkm-agenda-info"
                    >

                      <h3>
                        ${escapeHtml(title)}
                      </h3>

                      ${
                        location
                          ? `
                            <p>
                              ${escapeHtml(location)}
                            </p>
                          `
                          : ''
                      }

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
