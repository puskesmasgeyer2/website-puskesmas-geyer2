(function () {

  'use strict';


  const listBox =
    document.getElementById('agenda-list');

  const searchBox =
    document.getElementById('agenda-search');


  if (!listBox) return;


  let agendaData = [];


  /* =========================================
     HELPER
     ========================================= */

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
      Array.isArray(payload.agenda)
    ) {

      return payload.agenda;

    }


    if (
      payload &&
      Array.isArray(payload.items)
    ) {

      return payload.items;

    }


    return [];

  }


  function formatDate(value) {

    if (!value) return 'Tanggal belum tersedia';


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


  function sortAgenda(data) {

    return data.sort(
      (a, b) => {

        const dateA =
          new Date(
            pick(
              a,
              [
                'tanggal',
                'date',
                'tanggal_mulai',
                'start_date'
              ],
              ''
            )
          ).getTime();


        const dateB =
          new Date(
            pick(
              b,
              [
                'tanggal',
                'date',
                'tanggal_mulai',
                'start_date'
              ],
              ''
            )
          ).getTime();


        if (
          Number.isNaN(dateA) ||
          Number.isNaN(dateB)
        ) {

          return 0;

        }


        return dateA - dateB;

      }
    );

  }


  /* =========================================
     RENDER
     ========================================= */

  function renderAgenda(data) {

    if (!data.length) {

      listBox.innerHTML = `

        <div class="col-12">

          <div class="agenda-empty">

            <div class="agenda-empty-icon">
              ✓
            </div>

            <h2>
              Belum ada agenda
            </h2>

            <p>
              Belum terdapat agenda kegiatan
              yang dapat ditampilkan.
            </p>

          </div>

        </div>

      `;

      return;

    }


    listBox.innerHTML =
      data.map(item => {


        const id =
          pick(
            item,
            ['id', 'ID', 'kode'],
            ''
          );


        const title =
          pick(
            item,
            [
              'judul',
              'title',
              'nama',
              'nama_agenda'
            ],
            'Agenda Puskesmas Geyer 2'
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


        const date =
          formatDate(
            pick(
              item,
              [
                'tanggal',
                'date',
                'tanggal_mulai',
                'start_date'
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
              'time',
              'jam_mulai'
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
              'ringkasan',
              'summary',
              'isi'
            ],
            'Informasi kegiatan Puskesmas Geyer 2.'
          );


        const detailLink =
          id
            ? `detail-agenda.html?id=${encodeURIComponent(id)}`
            : '#';


        return `

          <div
            class="col-lg-4 col-md-6"
          >

            <article
              class="agenda-card"
            >


              <div class="agenda-date-box">

                <div
                  class="agenda-date-icon"
                >
                  📅
                </div>

                <div
                  class="agenda-date-text"
                >

                  <small>
                    Tanggal kegiatan
                  </small>

                  <strong>
                    ${escapeHtml(date)}
                  </strong>

                </div>

              </div>


              <span
                class="agenda-category"
              >
                ${escapeHtml(category)}
              </span>


              <h2>
                ${escapeHtml(title)}
              </h2>


              <p>
                ${escapeHtml(
                  String(description)
                    .replace(/<[^>]*>/g, '')
                    .slice(0, 180)
                )}
                ${
                  String(description).length > 180
                    ? '…'
                    : ''
                }
              </p>


              ${
                time || place
                  ? `

                    <div
                      class="agenda-info"
                    >

                      ${
                        time
                          ? `
                            <div>
                              <span>🕐</span>
                              <span>
                                <strong>
                                  Waktu:
                                </strong>
                                ${escapeHtml(time)}
                              </span>
                            </div>
                          `
                          : ''
                      }


                      ${
                        place
                          ? `
                            <div>
                              <span>📍</span>
                              <span>
                                <strong>
                                  Tempat:
                                </strong>
                                ${escapeHtml(place)}
                              </span>
                            </div>
                          `
                          : ''
                      }

                    </div>

                  `
                  : ''
              }


              ${
                id
                  ? `
                    <a
                      href="${detailLink}"
                      class="agenda-link"
                    >
                      Lihat selengkapnya →
                    </a>
                  `
                  : ''
              }


            </article>

          </div>

        `;

      }).join('');

  }


  /* =========================================
     LOAD DATA
     ========================================= */

  fetch(
    'data/agenda.json',
    {
      cache: 'no-store'
    }
  )

  .then(response => {

    if (!response.ok) {

      throw new Error(
        'Gagal membaca data/agenda.json'
      );

    }

    return response.json();

  })


  .then(payload => {

    agendaData =
      normalizeList(payload);


    agendaData =
      sortAgenda(agendaData);


    renderAgenda(
      agendaData
    );

  })


  .catch(error => {

    console.error(error);


    listBox.innerHTML = `

      <div class="col-12">

        <div class="agenda-empty">

          <div class="agenda-empty-icon">
            !
          </div>

          <h2>
            Agenda belum dapat dimuat
          </h2>

          <p>
            Silakan periksa
            data/agenda.json.
          </p>

        </div>

      </div>

    `;

  });


  /* =========================================
     SEARCH
     ========================================= */

  if (searchBox) {

    searchBox.addEventListener(
      'input',
      function () {

        const keyword =
          this.value
            .trim()
            .toLowerCase();


        if (!keyword) {

          renderAgenda(
            agendaData
          );

          return;

        }


        const filtered =
          agendaData.filter(
            item => {

              return JSON.stringify(item)
                .toLowerCase()
                .includes(keyword);

            }
          );


        renderAgenda(
          filtered
        );

      }
    );

  }


})();
