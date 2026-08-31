(function () {

  'use strict';


  const box =
    document.getElementById('detail-agenda');


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


  /* =========================================
     PARSE TANGGAL INDONESIA
     
     Format:
     DD/MM/YYYY
     ========================================= */

  function parseTanggalIndonesia(value) {

    if (!value) return null;

    const text =
      String(value).trim();


    /*
     * DD/MM/YYYY
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


      if (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {

        return date;

      }

    }


    /*
     * YYYY-MM-DD
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
     AMBIL ID DARI URL
     ========================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const id =
    params.get('id');


  if (!id) {

    box.innerHTML = `

      <div class="detail-error">

        <h2>
          Agenda tidak ditemukan
        </h2>

        <p>
          ID agenda tidak tersedia.
        </p>

      </div>

    `;

    return;

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
      'DETAIL AGENDA JSON:',
      payload
    );


    const list =
      normalizeList(payload);


    console.log(
      'DETAIL AGENDA ID:',
      id
    );


    const item =
      list.find(
        agenda => {

          const agendaId =
            pick(
              agenda,
              [
                'id',
                'ID',
                'kode'
              ],
              ''
            );

          return String(agendaId) ===
                 String(id);

        }
      );


    if (!item) {

      box.innerHTML = `

        <div class="detail-error">

          <h2>
            Agenda tidak ditemukan
          </h2>

          <p>
            Agenda dengan ID
            <strong>
              ${escapeHtml(id)}
            </strong>
            tidak tersedia.
          </p>

        </div>

      `;

      return;

    }


    console.log(
      'DETAIL AGENDA ITEM:',
      item
    );


    renderDetail(item);

  })


  .catch(error => {

    console.error(
      'DETAIL AGENDA ERROR:',
      error
    );


    box.innerHTML = `

      <div class="detail-error">

        <h2>
          Gagal memuat agenda
        </h2>

        <p>
          Silakan coba beberapa saat lagi.
        </p>

      </div>

    `;

  });


  /* =========================================
     RENDER DETAIL
     ========================================= */

  function renderDetail(item) {


    /*
     * JUDUL
     *
     * Data agenda.json Anda tidak memiliki
     * field "judul".
     *
     * Maka "kegiatan" menjadi judul utama.
     */

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


    /*
     * KATEGORI
     */

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


    /*
     * TANGGAL
     */

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


    /*
     * JAM
     */

    const time =
      pick(
        item,
        [
          'jam',
          'waktu',
          'time',
          'jam_mulai'
        ],
        ''
      );


    /*
     * TEMPAT
     */

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


    /*
     * KEGIATAN
     */

    const kegiatan =
      pick(
        item,
        [
          'kegiatan',
          'deskripsi',
          'description',
          'ringkasan',
          'summary',
          'isi'
        ],
        'Informasi kegiatan Puskesmas Geyer 2.'
      );


    /*
     * PIC
     */

    const pic =
      pick(
        item,
        [
          'pic',
          'PIC',
          'penanggung_jawab',
          'penanggungJawab'
        ],
        ''
      );


    /*
     * STATUS
     */

    const status =
      pick(
        item,
        [
          'status'
        ],
        'Publish'
      );


    /* =========================================
       HTML DETAIL
       ========================================= */

    box.innerHTML = `

      <article
        class="detail-agenda-card"
      >


        <!-- KATEGORI -->

        <span class="detail-category">

          ${escapeHtml(category)}

        </span>


        <!-- JUDUL / KEGIATAN -->

        <h1>

          ${escapeHtml(title)}

        </h1>


        <!-- META -->

        <div class="detail-meta">


          <!-- TANGGAL -->

          <span>

            📅

            ${escapeHtml(date)}

          </span>


          <!-- JAM -->

          ${
            time
              ? `

                <span>

                  🕐

                  ${escapeHtml(time)}

                </span>

              `
              : ''
          }


          <!-- TEMPAT -->

          ${
            place
              ? `

                <span>

                  📍

                  ${escapeHtml(place)}

                </span>

              `
              : ''
          }


        </div>


        <!-- RINGKASAN -->

        <div class="detail-summary">

          <strong>
            Informasi Agenda
          </strong>


          <p>

            ${escapeHtml(kegiatan)}

          </p>

        </div>


        <!-- INFORMASI LENGKAP -->

        <div class="detail-content">


          <p>

            <strong>
              Kegiatan:
            </strong>

            ${escapeHtml(kegiatan)}

          </p>


        </div>


        <!-- INFORMASI TAMBAHAN -->

        <div class="detail-info-box">


          ${
            time
              ? `

                <div class="detail-info-row">

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

                <div class="detail-info-row">

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


          ${
            pic
              ? `

                <div class="detail-info-row">

                  <span>👤</span>

                  <span>

                    <strong>
                      PIC:
                    </strong>

                    ${escapeHtml(pic)}

                  </span>

                </div>

              `
              : ''
          }


          <span class="detail-status">

            ${escapeHtml(status)}

          </span>


        </div>


      </article>

    `;

  }


})();
