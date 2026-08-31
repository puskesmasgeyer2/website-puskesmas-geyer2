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


  /* =========================================
     PARSE TANGGAL INDONESIA
     
     Format sumber:
     DD/MM/YYYY
     
     Contoh:
     01/09/2026
     02/09/2026
     03/09/2026
     ========================================= */

  function parseTanggalIndonesia(value) {

    if (!value) return null;

    const text =
      String(value).trim();

    /*
     * Format DD/MM/YYYY
     */
    const match =
      text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (match) {

      const day =
        Number(match[1]);

      const month =
        Number(match[2]);

      const year =
        Number(match[3]);

      const date =
        new Date(
          year,
          month - 1,
          day
        );

      /*
       * Validasi agar tanggal tidak
       * berubah secara otomatis oleh JS
       */
      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        return date;
      }

    }


    /*
     * Jika suatu saat sumber data memakai
     * format ISO YYYY-MM-DD
     */
    const iso =
      text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (iso) {

      const year =
        Number(iso[1]);

      const month =
        Number(iso[2]);

      const day =
        Number(iso[3]);

      return new Date(
        year,
        month - 1,
        day
      );

    }


    return null;

  }


  /* =========================================
     FORMAT TANGGAL
     ========================================= */

  function formatDate(value) {

    if (!value) {
      return 'Tanggal belum tersedia';
    }

    const d =
      parseTanggalIndonesia(value);

    /*
     * Jika gagal diparse,
     * tampilkan nilai asli.
     */
    if (!d) {
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


  /* =========================================
     NORMALIZE DATA
     ========================================= */

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


  /* =========================================
     SORT AGENDA
     
     Urutan:
     tanggal terdekat → paling awal
     ========================================= */

  function sortAgenda(data) {

    return data.sort(
      (a, b) => {

        const valueA =
          pick(
            a,
            [
              'tanggal',
              'date',
              'tanggal_mulai',
              'start_date'
            ],
            ''
          );

        const valueB =
          pick(
            b,
            [
              'tanggal',
              'date',
              'tanggal_mulai',
              'start_date'
            ],
            ''
          );


        const dateA =
          parseTanggalIndonesia(valueA);

        const dateB =
          parseTanggalIndonesia(valueB);


        /*
         * Jika tanggal tidak valid,
         * jangan membuat urutan kacau.
         */
        if (!dateA && !dateB) {
          return 0;
        }

        if (!dateA) {
          return 1;
        }

        if (!dateB) {
          return -1;
        }


        return dateA.getTime() -
               dateB.getTime();

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


        /* =====================================
           ID
           ===================================== */

        const id =
          pick(
            item,
            ['id', 'ID', 'kode'],
            ''
          );


        /* =====================================
           JUDUL
           
           PRIORITAS UTAMA:
           kegiatan
           
           Karena agenda.json Anda memang
           menggunakan field "kegiatan".
           ===================================== */

        const title =
          pick(
            item,
            [
              'kegiatan',
              'judul',
              'title',
              'nama',
              'nama_agenda'
            ],
            'Agenda Puskesmas Geyer 2'
          );


        /* =====================================
           KATEGORI
           ===================================== */

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


        /* =====================================
           TANGGAL
           ===================================== */

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


        /* =====================================
           JAM
           ===================================== */

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


        /* =====================================
           TEMPAT
           ===================================== */

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


        /* =====================================
           DESKRIPSI
           
           PRIORITAS:
           kegiatan
           ===================================== */

        const description =
          pick(
            item,
            [
              'deskripsi',
              'description',
              'ringkasan',
              'summary',
              'isi',
              'kegiatan'
            ],
            'Informasi kegiatan Puskesmas Geyer 2.'
          );


        /* =====================================
           DETAIL LINK
           ===================================== */

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


              <!-- TANGGAL -->

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


              <!-- KATEGORI -->

              <span
                class="agenda-category"
              >
                ${escapeHtml(category)}
              </span>


              <!-- JUDUL -->

              <h2>
                ${escapeHtml(title)}
              </h2>


              <!-- DESKRIPSI -->

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


              <!-- INFORMASI -->

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


              <!-- DETAIL -->

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

    console.log(
      'AGENDA JSON:',
      payload
    );

    agendaData =
      normalizeList(payload);


    console.log(
      'AGENDA DATA:',
      agendaData
    );


    agendaData =
      sortAgenda(agendaData);


    renderAgenda(
      agendaData
    );

  })


  .catch(error => {

    console.error(
      'AGENDA ERROR:',
      error
    );


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
