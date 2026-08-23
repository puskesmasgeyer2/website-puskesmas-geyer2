(function () {

  'use strict';


  const box =
    document.getElementById('detail-agenda');


  if (!box) return;


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


  function formatDate(value) {

    if (!value) {
      return 'Tanggal belum tersedia';
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


  /* ===============================
     AMBIL ID DARI URL
     =============================== */

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


  /* ===============================
     LOAD DATA
     =============================== */

  fetch(
    'data/agenda.json',
    {
      cache: 'no-store'
    }
  )

  .then(response => {

    if (!response.ok) {

      throw new Error(
        'Gagal membaca agenda.json'
      );

    }

    return response.json();

  })


  .then(payload => {

    const list =
      normalizeList(payload);


    const item =
      list.find(
        agenda =>
          String(
            pick(
              agenda,
              ['id', 'ID', 'kode'],
              ''
            )
          ) === String(id)
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


    renderDetail(item);

  })


  .catch(error => {

    console.error(error);


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


  /* ===============================
     RENDER DETAIL
     =============================== */

  function renderDetail(item) {

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


    const status =
      pick(
        item,
        [
          'status'
        ],
        'Terjadwal'
      );


    box.innerHTML = `

      <article class="detail-agenda-card">


        <span class="detail-category">

          ${escapeHtml(category)}

        </span>


        <h1>

          ${escapeHtml(title)}

        </h1>


        <div class="detail-meta">

          <span>
            📅
            ${escapeHtml(date)}
          </span>


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


        <div class="detail-summary">

          <strong>
            Informasi Agenda
          </strong>

          <p>
            ${escapeHtml(description)}
          </p>

        </div>


        <div class="detail-content">

          <p>
            Kegiatan ini merupakan bagian dari
            pelaksanaan kegiatan UPTD Puskesmas
            Geyer 2.
          </p>

          <p>
            Masyarakat dan pihak terkait dapat
            memperhatikan informasi tanggal,
            waktu, serta tempat pelaksanaan
            kegiatan sebagaimana tercantum pada
            agenda ini.
          </p>

        </div>


        ${
          time || place
            ? `

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


                <span class="detail-status">

                  ${escapeHtml(status)}

                </span>

              </div>

            `
            : ''
        }


      </article>

    `;

  }


})();
