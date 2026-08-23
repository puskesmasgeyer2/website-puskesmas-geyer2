(function () {

  'use strict';


  const list =
    document.getElementById('galeri-list');

  const search =
    document.getElementById('search-galeri');

  const empty =
    document.getElementById('galeri-empty');


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

          <article class="pkm-gallery-card">

            <div class="pkm-gallery-image">

              <img
                src="${escapeHtml(
                  item.gambar ||
                  'images/logo-puskesmas.PNG'
                )}"
                alt="${escapeHtml(
                  item.judul ||
                  'Galeri Puskesmas'
                )}"
                loading="lazy"
                onerror="this.src='images/logo-puskesmas.PNG'"
              >

              <div class="pkm-gallery-overlay">
                <span>⊕</span>
              </div>

            </div>


            <div class="pkm-gallery-body">

              <span class="pkm-category">
                ${escapeHtml(
                  item.kategori || 'Kegiatan'
                )}
              </span>


              <div class="pkm-gallery-date">
                ${escapeHtml(
                  formatDate(item.tanggal)
                )}
              </div>


              <h3>
                ${escapeHtml(
                  item.judul ||
                  'Kegiatan Puskesmas'
                )}
              </h3>


              <p>
                ${escapeHtml(
                  item.deskripsi || ''
                )}
              </p>

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
          item.deskripsi

        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);

      })
    );

  }


  fetch('data/galeri.json', {
    cache: 'no-store'
  })

    .then(function (response) {

      if (!response.ok) {
        throw new Error(
          'Gagal membaca galeri.json'
        );
      }

      return response.json();

    })

    .then(function (result) {

      if (!Array.isArray(result)) {
        throw new Error(
          'Format galeri tidak valid'
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
              Galeri belum dapat dimuat
            </strong>

            <span>
              Silakan periksa data galeri.
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
