(function () {

  'use strict';


  const list =
    document.getElementById('download-list');

  const search =
    document.getElementById('search-download');

  const empty =
    document.getElementById('download-empty');


  if (!list) return;


  let data = [];


  function escapeHtml(value) {

    return String(value ?? '').replace(
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


  function formatDate(value) {

    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
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


  function render(items) {

    if (!items.length) {

      list.innerHTML = '';

      empty.classList.remove('d-none');

      return;

    }


    empty.classList.add('d-none');


    list.innerHTML = items.map(function (item) {

      return `

        <div class="col-lg-4 col-md-6">

          <article class="pkm-download-card">


            <div class="pkm-download-icon">
              PDF
            </div>


            <div class="pkm-download-content">

              <span class="pkm-category">

                ${escapeHtml(
                  item.kategori ||
                  'Dokumen'
                )}

              </span>


              <div class="pkm-download-date">

                ${escapeHtml(
                  formatDate(item.tanggal)
                )}

              </div>


              <h3>

                ${escapeHtml(
                  item.judul ||
                  'Dokumen Puskesmas'
                )}

              </h3>


              <p>

                ${escapeHtml(
                  item.deskripsi || ''
                )}

              </p>


              <a
                href="${escapeHtml(
                  item.file || '#'
                )}"
                class="pkm-download-btn"
                target="_blank"
                rel="noopener"
              >

                ⬇ Download

              </a>

            </div>


          </article>

        </div>

      `;

    }).join('');

  }


  function filter() {

    const keyword =
      search.value
        .trim()
        .toLowerCase();


    if (!keyword) {

      render(data);

      return;

    }


    render(
      data.filter(function (item) {

        return [

          item.judul,
          item.kategori,
          item.deskripsi,
          item.format

        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);

      })
    );

  }


  fetch('data/download.json', {
    cache: 'no-store'
  })

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          'Gagal membaca download.json'
        );

      }

      return response.json();

    })

    .then(function (result) {

      if (!Array.isArray(result)) {

        throw new Error(
          'Format download tidak valid'
        );

      }


      data = result.slice();


      data.sort(function (a, b) {

        return String(
          b.tanggal || ''
        ).localeCompare(
          String(a.tanggal || '')
        );

      });


      render(data);

    })

    .catch(function (error) {

      console.error(error);


      list.innerHTML = `

        <div class="col-12">

          <div class="pkm-placeholder">

            <strong>
              Dokumen belum dapat dimuat
            </strong>

            <span>
              Silakan periksa data download.
            </span>

          </div>

        </div>

      `;

    });


  if (search) {

    search.addEventListener(
      'input',
      filter
    );

  }


})();
