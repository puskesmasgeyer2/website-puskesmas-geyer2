document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "HALAMAN BERITA SIAP"
        );

        loadSemuaBerita();

    }
);



async function loadSemuaBerita() {

    const container =
        document.getElementById(
            "berita-container"
        );


    try {

        console.log(
            "MENGAMBIL DATA BERITA..."
        );


        const data =
            await getBerita();


        console.log(
            "DATA BERITA:",
            data
        );


        // Hanya berita Publish

        const berita =
            data.filter(function (item) {

                return String(
                    item.status || ""
                ).toLowerCase()
                === "publish";

            });


        console.log(
            "BERITA PUBLISH:",
            berita.length
        );


        // Urut berdasarkan tanggal

        berita.sort(function (a, b) {

            return (
                parseTanggal(b.tanggal)
                -
                parseTanggal(a.tanggal)
            );

        });


        // Tidak ada berita

        if (berita.length === 0) {

            container.innerHTML = `

                <div class="col-12">

                    <div
                        class="alert alert-info">

                        Belum ada berita.

                    </div>

                </div>

            `;

            return;

        }


        // Tampilkan

        container.innerHTML =
            berita.map(function (item) {

                return `

                    <div
                        class="col-lg-4 col-md-6 mb-4">


                        <div
                            class="card h-100 shadow-sm">


                            ${
                                item.foto
                                ?
                                `
                                <img
                                    src="${item.foto}"
                                    class="card-img-top"
                                    style="
                                        height:230px;
                                        object-fit:cover;
                                    "
                                >
                                `
                                :
                                ""
                            }


                            <div
                                class="card-body">


                                <small
                                    class="text-muted">

                                    <i
                                        class="bi bi-calendar">
                                    </i>

                                    ${item.tanggal}

                                </small>


                                <h4
                                    class="mt-2">

                                    ${escapeHTML(
                                        item.judul
                                    )}

                                </h4>


                                <p
                                    class="text-muted">

                                    ${escapeHTML(
                                        item.ringkasan || ""
                                    )}

                                </p>


                                <a
                                    href="detail-berita.html?id=${encodeURIComponent(item.id)}"
                                    class="btn btn-success">

                                    Baca Selengkapnya

                                    <i
                                        class="bi bi-arrow-right">
                                    </i>

                                </a>


                            </div>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "ERROR BERITA:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div
                    class="alert alert-danger">

                    Gagal mengambil data berita.

                </div>

            </div>

        `;

    }

}



// =====================================================
// PARSE TANGGAL DD/MM/YYYY
// =====================================================

function parseTanggal(tanggal) {

    if (!tanggal) {

        return 0;

    }


    const bagian =
        String(tanggal).split("/");


    if (bagian.length !== 3) {

        return 0;

    }


    return new Date(

        parseInt(bagian[2]),

        parseInt(bagian[1]) - 1,

        parseInt(bagian[0])

    ).getTime();

}



// =====================================================
// SECURITY
// =====================================================

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}