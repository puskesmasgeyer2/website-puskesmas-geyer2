// ======================================================
// MAIN.JS
// WEBSITE PUSKESMAS GEYER 2
// ======================================================


// ======================================================
// LOAD BERITA
// ======================================================

async function loadBerita() {

    console.log("LOAD BERITA WEBSITE");

    const container =
        document.getElementById("berita-container");

    if (!container) {

        console.warn(
            "Container #berita-container tidak ditemukan."
        );

        return;
    }

    // Loading

    container.innerHTML = `
        <div class="text-center py-5">

            <div class="spinner-border text-info"
                 role="status">

            </div>

            <p class="mt-3">
                Memuat artikel...
            </p>

        </div>
    `;


    try {

        // ==========================================
        // AMBIL DATA DARI API
        // ==========================================

        const berita =
            await getBerita();


        console.log(
            "DATA BERITA WEBSITE:",
            berita
        );


        // ==========================================
        // VALIDASI
        // ==========================================

        if (!Array.isArray(berita)) {

            throw new Error(
                "Data berita bukan array."
            );

        }


        // ==========================================
        // JIKA KOSONG
        // ==========================================

        if (berita.length === 0) {

            container.innerHTML = `

                <div class="alert alert-info text-center">

                    Belum ada artikel.

                </div>

            `;

            return;
        }


        // ==========================================
        // BATASI 3 BERITA TERBARU
        // ==========================================

        const data =
            berita.slice(0, 3);


        // ==========================================
        // RENDER
        // ==========================================

        let html = "";


        data.forEach(function(item) {

            const foto =
                item.foto ||
                "images/drill.jpg";


            const judul =
                item.judul || "";


            const ringkasan =
                item.ringkasan || "";


            const tanggal =
                item.tanggal || "";


            html += `

                <div class="row border-bottom pb-5 mb-5">

                    <div class="col-lg-4 col-12">

                        <img
                            src="${foto}"
                            class="schedule-image img-fluid"
                            alt="${escapeHTML(judul)}"
                            onerror="this.src='images/drill.jpg'"
                        >

                    </div>


                    <div class="col-lg-8 col-12 mt-3 mt-lg-0">

                        <h4 class="mb-2">

                            ${escapeHTML(judul)}

                        </h4>


                        <p>

                            ${escapeHTML(ringkasan)}

                        </p>


                        <div class="d-flex align-items-center mt-4">

                            <i class="bi-calendar me-2"></i>

                            ${escapeHTML(tanggal)}

                        </div>

                    </div>

                </div>

            `;

        });


        container.innerHTML = html;


        console.log(
            "BERITA BERHASIL DITAMPILKAN:",
            data.length
        );

    }


    catch(error) {

        console.error(
            "LOAD BERITA ERROR:",
            error
        );


        container.innerHTML = `

            <div class="alert alert-warning text-center">

                <i class="bi bi-exclamation-triangle me-2"></i>

                Artikel belum dapat dimuat.

            </div>

        `;

    }

}



// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

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



// ======================================================
// SAAT WEBSITE SELESAI DIMUAT
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "WEBSITE PUSKESMAS GEYER 2 SIAP"
        );


        loadBerita();

    }
);

