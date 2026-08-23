(function(){
  'use strict';

  const nav = document.getElementById('navmenu');
  const toggle = document.querySelector('.mobile-nav-toggle');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('mobile-open');
      toggle.textContent = nav.classList.contains('mobile-open') ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      toggle.textContent = '☰';
    }));
  }

  const year = document.getElementById('current-year');
  if(year) year.textContent = new Date().getFullYear();

  const newsBox = document.getElementById('home-news');
  if(!newsBox) return;

  function pick(obj, keys, fallback=''){
    for(const key of keys){
      if(obj && obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') return obj[key];
    }
    return fallback;
  }

  function normalizeList(payload){
    if(Array.isArray(payload)) return payload;
    if(payload && Array.isArray(payload.data)) return payload.data;
    if(payload && Array.isArray(payload.berita)) return payload.berita;
    if(payload && Array.isArray(payload.items)) return payload.items;
    return [];
  }

  function imageUrl(value){
    if(!value) return 'assets/img/health/facilities-9.webp';
    let s = String(value).trim();
    if(/^https?:\/\//i.test(s)) return s;
    if(s.startsWith('/')) return s.slice(1);
    if(s.startsWith('images/') || s.startsWith('assets/')) return s;
    return 'images/' + s.replace(/^\.\//,'');
  }

  function formatDate(value){
    if(!value) return '';
    const d = new Date(value);
    if(Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  }

  fetch('data/berita.json', {cache:'no-store'})
    .then(r => { if(!r.ok) throw new Error('Gagal membaca data/berita.json'); return r.json(); })
    .then(payload => {
      let list = normalizeList(payload);
      list.sort((a,b) => String(pick(b,['tanggal','date','created_at'],'')).localeCompare(String(pick(a,['tanggal','date','created_at'],''))));
      list = list.slice(0,3);

      if(!list.length){
        newsBox.innerHTML = '<div class="col-12 text-center"><p class="pkm-loading">Belum ada berita yang dapat ditampilkan.</p></div>';
        return;
      }

      newsBox.innerHTML = list.map(item => {
        const id = pick(item,['id','ID','kode'],'');
        const title = pick(item,['judul','title','nama'],'Berita Puskesmas Geyer 2');
        const summary = pick(item,['ringkasan','summary','excerpt','deskripsi','description','isi'],'Informasi terbaru dari UPTD Puskesmas Geyer 2.');
        const date = formatDate(pick(item,['tanggal','date','created_at'],''));
        const category = pick(item,['kategori','category','jenis'],'Berita');
        const image = imageUrl(pick(item,['gambar','image','foto','thumbnail'],'') );
        const link = id ? `detail-berita.html?id=${encodeURIComponent(id)}` : 'berita.html';
        return `<div class="col-lg-4 col-md-6"><article class="pkm-news-card"><img class="pkm-news-image" src="${image}" alt="${escapeHtml(title)}" onerror="this.src='assets/img/health/facilities-9.webp'"><div class="pkm-news-body"><div class="pkm-news-meta">${escapeHtml(date)} ${date?'•':''} ${escapeHtml(category)}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(String(summary).replace(/<[^>]*>/g,'').slice(0,150))}${String(summary).length>150?'…':''}</p><a class="pkm-news-link" href="${link}">Baca selengkapnya →</a></div></article></div>`;
      }).join('');
    })
    .catch(err => {
      console.error(err);
      newsBox.innerHTML = '<div class="col-12 text-center"><p class="pkm-loading">Berita belum dapat dimuat. Silakan cek koneksi API/data.</p></div>';
    });

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }
})();

/* =========================================================
   PENYEMPURNAAN HEADER & HERO
   UPTD PUSKESMAS GEYER 2
   ========================================================= */


/* ---------------------------------------------------------
   1. LOGO HEADER
   --------------------------------------------------------- */

.pkm-logo img {
    width: 58px !important;
    height: 58px !important;
    max-height: 58px !important;
    object-fit: contain;
    flex-shrink: 0;
}


/* ---------------------------------------------------------
   2. NAMA PUSKESMAS DI SAMPING LOGO
   --------------------------------------------------------- */

.pkm-logo {
    display: flex !important;
    align-items: center !important;
    gap: 14px !important;
    text-decoration: none !important;
}

.pkm-logo span {
    color: #ffffff !important;
    font-family: inherit !important;
    font-size: 17px !important;
    line-height: 1.18 !important;
    font-weight: 700 !important;
    letter-spacing: -0.2px;
}

.pkm-logo span strong {
    color: #ffffff !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: 700 !important;
}


/* ---------------------------------------------------------
   3. TULISAN KECIL DI ATAS HERO
   PEMERINTAH KABUPATEN GROBOGAN
   --------------------------------------------------------- */

.pkm-hero .pkm-badge {
    color: #53e5d0 !important;
    font-weight: 800 !important;
    letter-spacing: 2px;
}


/* ---------------------------------------------------------
   4. JUDUL UTAMA HERO
   UPTD Puskesmas Geyer 2
   --------------------------------------------------------- */

.pkm-hero h1 {
    color: #ffffff !important;
    font-weight: 800 !important;
}

.pkm-hero h1 span {
    color: #5ce1ca !important;
    font-weight: 800 !important;
}


/* ---------------------------------------------------------
   5. VISI / SUBTITLE HERO
   --------------------------------------------------------- */

.pkm-hero .lead {
    color: #ffffff !important;
    opacity: 1 !important;
    font-weight: 400;
}


/* ---------------------------------------------------------
   6. LOKASI
   Kecamatan Geyer • Kabupaten Grobogan • Jawa Tengah
   --------------------------------------------------------- */

.pkm-location {
    color: #ffffff !important;
    opacity: 1 !important;
    font-size: 14px !important;
    font-weight: 600 !important;

    display: inline-flex;
    align-items: center;

    margin-top: 22px;
    padding: 8px 14px;

    background: rgba(0, 0, 0, 0.20);
    border: 1px solid rgba(255, 255, 255, 0.20);
    border-radius: 8px;

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}


/* ---------------------------------------------------------
   7. RESPONSIVE
   --------------------------------------------------------- */

@media (max-width: 991px) {

    .pkm-logo img {
        width: 50px !important;
        height: 50px !important;
        max-height: 50px !important;
    }

    .pkm-logo span {
        font-size: 15px !important;
    }

    .pkm-location {
        font-size: 13px !important;
        line-height: 1.5;
        flex-wrap: wrap;
    }
}
