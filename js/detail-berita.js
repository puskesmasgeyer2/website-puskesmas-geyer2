// =====================================================
// DETAIL BERITA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "HALAMAN DETAIL BERITA SIAP"
        );


        loadDetailBerita();

    }
);



// =====================================================
// LOAD DETAIL
// =====================================================

async function loadDetailBerita() {

    const container =
        document.getElementById(
            "detail-container"
        );


    try {


        // =================================================
        // AMBIL ID DARI URL
        // =================================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const id =
            params.get("id");


        console.log(
            "ID BERITA:",
            id
        );


        // =================================================
        // VALIDASI ID
        // =================================================

        if (!id) {

            tampilkanError(
                "ID berita tidak ditemukan."
            );

            return;

        }


        // =================================================
        // AMBIL DATA DARI API
        // =================================================

        console.log(
            "MENGAMBIL DATA BERITA..."
        );


        const data =
            await getBerita();


        console.log(
            "DATA BERITA:",
            data
        );


        // =================================================
        // CARI BERITA BERDASARKAN ID
        // =================================================

        const berita =
            data.find(function (item) {

                return String(item.id)
                    === String(id);

            });


        console.log(
            "BERITA DITEMUKAN:",
            berita
        );


        // =================================================
        // BERITA TIDAK DITEMUKAN
        // =================================================

        if (!berita) {

            tampilkanError(
                "Berita tidak ditemukan."
            );

            return;

        }


        // =================================================
        // CEK STATUS
        // =================================================

        if (
            String(
                berita.status || ""
            ).toLowerCase()
            !== "publish"
        ) {

            tampilkanError(
                "Berita ini belum dipublikasikan."
            );

            return;

        }


        // =================================================
        // TAMPILKAN DETAIL
        // =================================================

        tampilkanDetail(
            berita
        );


    } catch (error) {


        console.error(
            "ERROR DETAIL BERITA:",
            error
        );


        tampilkanError(
            "Terjadi kesalahan saat mengambil data berita."
        );

    }

}



// =====================================================
// TAMPILKAN DETAIL
// =====================================================

function tampilkanDetail(
    berita
) {


    const container =
        document.getElementById(
            "detail-container"
        );


    // =================================================
    // FOTO
    // =================================================

    let fotoHTML = "";


    if (berita.foto) {

        fotoHTML = `

            <img
                src="${escapeHTML(
                    berita.foto
                )}"
                class="article-image"
                alt="${escapeHTML(
                    berita.judul
                )}"
            >

        `;

    }


    // =================================================
    // KATEGORI
    // =================================================

    let kategoriHTML = "";


    if (berita.kategori) {

        kategoriHTML = `

            <span
                class="badge bg-success">

                ${escapeHTML(
                    berita.kategori
                )}

            </span>

        `;

    }


    // =================================================
    // ISI BERITA
    // =================================================

    let isi =
        berita.isi || "";


    // =================================================
    // RENDER
    // =================================================

    container.innerHTML = `

        ${fotoHTML}


        <div
            class="mb-3">

            ${kategoriHTML}

        </div>


        <h1
            class="article-title">

            ${escapeHTML(
                berita.judul
            )}

        </h1>


        <div
            class="article-meta">

            <i class="bi bi-calendar3"></i>

            ${escapeHTML(
                berita.tanggal || ""
            )}


            &nbsp;&nbsp;


            <i class="bi bi-person"></i>

            ${escapeHTML(
                berita.penulis || ""
            )}

        </div>


        ${
            berita.ringkasan
            ?
            `
            <div
                class="alert alert-light border mb-4">

                <strong>
                    Ringkasan:
                </strong>

                <br>

                ${escapeHTML(
                    berita.ringkasan
                )}

            </div>
            `
            :
            ""
        }


        <div
            class="article-content">

            ${formatIsi(
                isi
            )}

        </div>


        <hr
            class="my-5">


        <div
            class="text-center">

            <a
                href="berita.html"
                class="btn btn-success">

                <i class="bi bi-arrow-left"></i>

                Kembali ke Semua Berita

            </a>

        </div>

    `;


}



// =====================================================
// FORMAT ISI
// =====================================================

function formatIsi(
    isi
) {

    if (!isi) {

        return `
            <p class="text-muted">
                Isi berita belum tersedia.
            </p>
        `;

    }


    /*
     * Kita pertahankan line break
     * dari data JSON.
     */

    return escapeHTML(
        isi
    ).replace(
        /\n/g,
        "<br>"
    );

}



// =====================================================
// ERROR
// =====================================================

function tampilkanError(
    pesan
) {

    const container =
        document.getElementById(
            "detail-container"
        );


    container.innerHTML = `

        <div
            class="text-center py-5">

            <div
                style="
                    font-size:60px;
                    color:#dc3545;
                ">

                <i
                    class="bi bi-exclamation-circle">
                </i>

            </div>


            <h3
                class="mt-3">

                Berita Tidak Dapat Ditampilkan

            </h3>


            <p
                class="text-muted">

                ${escapeHTML(
                    pesan
                )}

            </p>


            <a
                href="berita.html"
                class="btn btn-success">

                <i class="bi bi-arrow-left"></i>

                Kembali ke Berita

            </a>

        </div>

    `;

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(
        value || ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}