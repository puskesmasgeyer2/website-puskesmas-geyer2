document.addEventListener("DOMContentLoaded", function () {

    console.log("WEBSITE PUSKESMAS GEYER 2 SIAP");

    initMobileMenu();

    setTahun();

    loadBerita();

});



/* =====================================================
   MOBILE MENU
===================================================== */

function initMobileMenu() {

    const button =
        document.querySelector(".mobile-menu-btn");

    const nav =
        document.querySelector(".main-nav");


    if (!button || !nav) {
        return;
    }


    button.addEventListener("click", function () {

        nav.classList.toggle("show");

    });


    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("show");

        });

    });

}



/* =====================================================
   TAHUN FOOTER
===================================================== */

function setTahun() {

    const element =
        document.getElementById("tahun");


    if (element) {

        element.textContent =
            new Date().getFullYear();

    }

}



/* =====================================================
   BERITA
===================================================== */

async function loadBerita() {

    const container =
        document.getElementById("berita-home");


    if (!container) {
        return;
    }


    try {

        console.log("LOAD BERITA...");


        const response =
            await fetch("data/berita.json", {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "DATA BERITA:",
            data
        );


        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `

                <div class="col-12">

                    <div class="empty-info">

                        Belum ada berita.

                    </div>

                </div>

            `;

            return;

        }


        const berita =
            [...data]
                .sort(function (a, b) {

                    return new Date(
                        b.tanggal || b.date || 0
                    ) -
                    new Date(
                        a.tanggal || a.date || 0
                    );

                })
                .slice(0, 3);


        container.innerHTML = "";


        berita.forEach(function (item) {

            const id =
                item.id || "";


            const judul =
                item.judul ||
                item.title ||
                "Berita Puskesmas";


            const ringkasan =
                item.ringkasan ||
                item.deskripsi ||
                item.description ||
                "";


            const tanggal =
                item.tanggal ||
                item.date ||
                "";


            const gambar =
                item.gambar ||
                item.image ||
                item.thumbnail ||
                "";


            const imageUrl =
                gambar ||
                "assets/img/bg/abstract-bg-3.webp";


            const card = document.createElement(
                "div"
            );


            card.className =
                "col-lg-4";


            card.innerHTML = `

                <article class="news-card">

                    <div class="news-image">

                        <img
                            src="${escapeHtml(imageUrl)}"
                            alt="${escapeHtml(judul)}"
                            onerror="this.src='assets/img/bg/abstract-bg-3.webp'"
                        >

                    </div>


                    <div class="news-body">

                        <div class="news-date">

                            ${escapeHtml(tanggal)}

                        </div>


                        <h3>

                            ${escapeHtml(judul)}

                        </h3>


                        <p>

                            ${escapeHtml(ringkasan)}

                        </p>


                        <a
                            href="detail-berita.html?id=${encodeURIComponent(id)}"
                            class="news-link">

                            Baca Selengkapnya →

                        </a>

                    </div>

                </article>

            `;


            container.appendChild(card);

        });


        console.log(
            "BERITA BERHASIL DITAMPILKAN:",
            berita.length
        );


    } catch (error) {

        console.error(
            "GAGAL MEMUAT BERITA:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="empty-info">

                    Berita belum dapat dimuat.

                </div>

            </div>

        `;

    }

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
