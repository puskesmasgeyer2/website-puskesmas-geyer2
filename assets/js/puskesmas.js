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
