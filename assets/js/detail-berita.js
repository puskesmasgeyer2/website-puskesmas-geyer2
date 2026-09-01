(function () {

  'use strict';


  const box =
    document.getElementById('detail-berita');


  if (!box) return;


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


  // =====================================================
// BERSIHKAN HTML DARI RINGKASAN
// =====================================================

function stripHtml(value) {

  if (!value) return '';

  const temp = document.createElement('div');

  temp.innerHTML = String(value);

  return temp.textContent
    .replace(/\s+/g, ' ')
    .trim();

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


  function getId() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    return params.get('id');

  }


  const id = getId();


  if (!id) {

    box.innerHTML = `
      <div class="pkm-placeholder">

        <strong>
          Berita tidak ditemukan
        </strong>

        <span>
          ID berita tidak tersedia.
        </span>

        <a href="berita.html">
          Kembali ke berita →
        </a>

      </div>
    `;

    return;

  }


  fetch('data/berita.json', {
    cache: 'no-store'
  })

    .then(function (response) {

      if (!response.ok) {

        throw new Error(
          'Gagal membaca data berita'
        );

      }

      return response.json();

    })

    .then(function (data) {

      const berita =
        data.find(function (item) {

          return String(item.id) === String(id);

        });


      if (!berita) {

        throw new Error(
          'Berita tidak ditemukan'
        );

      }


      const title =
        berita.judul ||
        'Berita Puskesmas Geyer 2';


      const category =
        berita.kategori ||
        'Berita';


      const date =
        formatDate(berita.tanggal);


      const image =
        berita.gambar ||
        berita.foto ||
        'images/logo-puskesmas.PNG';


      const content =
        berita.isi ||
        `<p>${escapeHtml(
          berita.ringkasan || ''
        )}</p>`;


      document.title =
        title +
        ' - UPTD Puskesmas Geyer 2';


      box.innerHTML = `

        <article class="pkm-detail-article">


          <div class="pkm-detail-category">
            ${escapeHtml(category)}
          </div>


          <h1>
            ${escapeHtml(title)}
          </h1>


          <div class="pkm-detail-meta">

            <span>
              📅 ${escapeHtml(date)}
            </span>

            <span>
              🏥 UPTD Puskesmas Geyer 2
            </span>

          </div>


          <div class="pkm-detail-image">

            <img
              src="${escapeHtml(image)}"
              alt="${escapeHtml(title)}"
              onerror="this.src='images/logo-puskesmas.PNG'"
            >

          </div>


          <div class="pkm-detail-summary">

  <strong>Ringkasan</strong>

  <p>
    ${escapeHtml(
      stripHtml(
        berita.ringkasan || ''
      )
    )}
  </p>

</div>


          <div class="pkm-detail-content">

            ${content}

          </div>


          <div class="pkm-detail-footer">

            Informasi resmi UPTD Puskesmas Geyer 2,
            Kabupaten Grobogan.

          </div>


          <div class="mt-4">

            <a
              href="berita.html"
              class="pkm-btn"
            >
              ← Kembali ke Berita
            </a>

          </div>


        </article>

      `;

    })

    .catch(function (error) {

      console.error(error);


      box.innerHTML = `

        <div class="pkm-placeholder">

          <strong>
            Berita tidak dapat dimuat
          </strong>

          <span>
            ${escapeHtml(error.message)}
          </span>

          <a href="berita.html">
            Kembali ke berita →
          </a>

        </div>

      `;

    });

})();
