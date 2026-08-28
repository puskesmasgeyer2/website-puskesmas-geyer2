(function () {

  'use strict';

  const beritaList = document.getElementById('berita-list');
  const searchInput = document.getElementById('search-berita');
  const emptyBox = document.getElementById('berita-empty');

  if (!beritaList) return;


  let beritaData = [];


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


  function imageUrl(value) {

    if (!value) {
      return 'images/logo-puskesmas.PNG';
    }

    const image = String(value).trim();

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('images/') ||
      image.startsWith('assets/')
    ) {

      return image;

    }

    return 'images/' + image;

  }


  function cleanText(value) {

    return String(value ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  }


  function render(list) {

    if (!list.length) {

      beritaList.innerHTML = '';

      emptyBox.classList.remove('d-none');

      return;

    }


    emptyBox.classList.add('d-none');


    beritaList.innerHTML = list.map(function (item) {

      const id = item.id || '';

      const title =
        item.judul ||
        'Berita Puskesmas Geyer 2';

      const category =
        item.kategori ||
        'Berita';

      const date =
        formatDate(item.tanggal);

      const summary =
        cleanText(
          item.ringkasan ||
          item.summary ||
          item.deskripsi ||
          ''
        );

      const image =
      imageUrl(item.gambar || item.foto);


      return `
        <div class="col-lg-4 col-md-6">

          <article class="pkm-news-card h-100">

            <div class="pkm-news-image-wrap">

              <img
                class="pkm-news-image"
                src="${escapeHtml(image)}"
                alt="${escapeHtml(title)}"
                loading="lazy"
                onerror="this.src='images/logo-puskesmas.PNG'"
              >

            </div>


            <div class="pkm-news-body">

              <div class="pkm-news-meta">

                <span class="pkm-category">
                  ${escapeHtml(category)}
                </span>

              </div>


              <div class="pkm-news-date">
                ${escapeHtml(date)}
              </div>


              <h3>
                ${escapeHtml(title)}
              </h3>


              <p>
                ${escapeHtml(
                  summary.length > 160
                    ? summary.substring(0, 160) + '…'
                    : summary
                )}
              </p>


              <a
                class="pkm-news-link"
                href="detail-berita.html?id=${encodeURIComponent(id)}"
              >
                Baca selengkapnya →
              </a>

            </div>

          </article>

        </div>
      `;

    }).join('');

  }


  function filterData() {

    const keyword =
      searchInput
        ? searchInput.value.trim().toLowerCase()
        : '';


    if (!keyword) {

      render(beritaData);

      return;

    }


    const filtered =
      beritaData.filter(function (item) {

        const text = [

          item.judul,
          item.kategori,
          item.ringkasan,
          item.isi

        ]
          .join(' ')
          .toLowerCase();


        return text.includes(keyword);

      });


    render(filtered);

  }


  fetch('data/berita.json', {
    cache: 'no-store'
  })

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          'Gagal membaca data/berita.json'
        );

      }

      return response.json();

    })

    .then(function (data) {

      if (!Array.isArray(data)) {

        throw new Error(
          'Format data berita tidak valid'
        );

      }


      beritaData = data.slice();


      beritaData.sort(function (a, b) {

        return String(
          b.tanggal || ''
        ).localeCompare(
          String(a.tanggal || '')
        );

      });


      render(beritaData);

    })

    .catch(function (error) {

      console.error(error);


      beritaList.innerHTML = `
        <div class="col-12">

          <div class="pkm-placeholder">

            <strong>
              Berita belum dapat dimuat
            </strong>

            <span>
              Silakan periksa data berita atau koneksi website.
            </span>

          </div>

        </div>
      `;

    });


  if (searchInput) {

    searchInput.addEventListener(
      'input',
      filterData
    );

  }

})();
