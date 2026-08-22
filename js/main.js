// =====================================================
// MAIN WEBSITE
// PUSKESMAS GEYER 2
// =====================================================


// =====================================================
// SAAT WEBSITE SELESAI DIMUAT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "WEBSITE SIAP"
        );

        loadBerita();

    }
);


// =====================================================
// LOAD BERITA
// =====================================================

async function loadBerita() {

    console.log(
        "LOAD BERITA..."
    );


    const container =
        document.getElementById(
            "berita-container"
        );


    // -------------------------------------------------
    // Pastikan container tersedia
    // -------------------------------------------------

    if (!container) {

        console.warn(
            "Container berita tidak ditemukan."
        );

        return;

    }


    // -------------------------------------------------
    // Loading
    // -------------------------------------------------

    container.innerHTML = `

        <div class="col-12 text-center py-5">

            <div
                class="spinner-border text-info"
                role="status">
            </div>

            <p class="mt-3">
                Memuat artikel...
            </p>

        </div>

    `;


    try {

        // -------------------------------------------------
        // Ambil data dari GitHub
        // -------------------------------------------------

        const data =
            await getBerita();


        console.log(
            "DATA BERITA:",
            data
        );


        // -------------------------------------------------
        // Pastikan array
        // -------------------------------------------------

        if (!Array.isArray(data)) {

            throw new Error(
                "Format data berita bukan array."
            );

        }


        // -------------------------------------------------
        // Hanya berita Publish
        // -------------------------------------------------

        let berita =
            data.filter(function (item) {

                return (
                    String(item.status || "")
                        .toLowerCase()
                        === "publish"
                );

            });


        // -------------------------------------------------
        // Urutkan berdasarkan tanggal terbaru
        // -------------------------------------------------

        berita.sort(function (a, b) {

            return (
                parseTanggal(b.tanggal)
                -
                parseTanggal(a.tanggal)
            );

        });


        // -------------------------------------------------
        // Ambil 3 berita terbaru
        // -------------------------------------------------

        berita =
            berita.slice(0, 3);


        // -------------------------------------------------
        // Jika tidak ada berita
        // -------------------------------------------------

        if (berita.length === 0) {

            container.innerHTML = `

                <div class="col-12 text-center">

                    <p>
                        Belum ada artikel yang dipublikasikan.
                    </p>

                </div>

            `;

            return;

        }


        // -------------------------------------------------
        // Render berita
        // -------------------------------------------------

        container.innerHTML =
            berita
                .map(function (item) {

                    return renderBerita(
                        item
                    );

                })
                .join("");


        console.log(
            "BERITA BERHASIL DITAMPILKAN:",
            berita.length
        );


    } catch (error) {

        console.error(
            "ERROR LOAD BERITA:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger">

                    <strong>
                        Gagal memuat artikel.
                    </strong>

                    <br>

                    Silakan coba beberapa saat lagi.

                </div>

            </div>

        `;

    }

}


// =====================================================
// RENDER 1 BERITA
// =====================================================

function renderBerita(item) {


    const foto =
        item.foto &&
        String(item.foto).trim() !== ""
            ?
            item.foto
            :
            "images/drill.jpg";


    const judul =
        escapeHTML(
            item.judul || ""
        );


    const ringkasan =
        escapeHTML(
            item.ringkasan || ""
        );


    const tanggal =
        escapeHTML(
            item.tanggal || ""
        );


    return `

        <div class="row border-bottom pb-5 mb-5">


            <div class="col-lg-4 col-12">

                <img
                    src="${foto}"
                    class="schedule-image img-fluid"
                    alt="${judul}"
                    loading="lazy"
                    onerror="this.src='images/drill.jpg'"
                >

            </div>


            <div
                class="col-lg-8 col-12
                       mt-3 mt-lg-0">


                <h4 class="mb-2">

                    ${judul}

                </h4>


                <p>

                    ${ringkasan}

                </p>


                <div
                    class="d-flex
                           align-items-center
                           mt-4">


                    <i
                        class="bi-calendar3
                               me-2">
                    </i>


                    ${tanggal}


                    <span
                        class="mx-1 mx-lg-5">

                        <i
                            class="bi-person
                                   me-2">
                        </i>

                        ${escapeHTML(
                            item.penulis || ""
                        )}

                    </span>


                </div>


            </div>


        </div>

    `;

}


// =====================================================
// PARSE TANGGAL DD/MM/YYYY
// =====================================================

function parseTanggal(tanggal) {

    if (!tanggal) {

        return 0;

    }


    const parts =
        String(tanggal).split("/");


    if (parts.length !== 3) {

        return 0;

    }


    const hari =
        parseInt(parts[0], 10);

    const bulan =
        parseInt(parts[1], 10) - 1;

    const tahun =
        parseInt(parts[2], 10);


    return new Date(
        tahun,
        bulan,
        hari
    ).getTime();

}


// =====================================================
// ESCAPE HTML
// Mencegah karakter HTML masuk langsung ke halaman
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}