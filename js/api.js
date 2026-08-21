// =====================================================
// API CONFIGURATION
// WEBSITE PUSKESMAS GEYER 2
// =====================================================

const API_BASE =
    "https://raw.githubusercontent.com/puskesmasgeyer2/website-puskesmas-geyer2/main/data/";


// =====================================================
// CACHE DATA
// =====================================================

const API_CACHE = {};


// =====================================================
// AMBIL DATA JSON
// =====================================================

async function fetchAPI(fileName) {

    // ---------------------------------------------
    // CEK CACHE
    // ---------------------------------------------

    if (API_CACHE[fileName]) {

        return API_CACHE[fileName];

    }


    // ---------------------------------------------
    // BENTUK URL
    // ---------------------------------------------

    const url =
        API_BASE + fileName;


    console.log(
        "API REQUEST:",
        url
    );


    // ---------------------------------------------
    // FETCH
    // ---------------------------------------------

    const response =
        await fetch(url);


    // ---------------------------------------------
    // CEK RESPONSE
    // ---------------------------------------------

    if (!response.ok) {

        throw new Error(
            "Gagal mengambil data: " +
            fileName +
            " (" +
            response.status +
            ")"
        );

    }


    // ---------------------------------------------
    // PARSE JSON
    // ---------------------------------------------

    const data =
        await response.json();


    // ---------------------------------------------
    // SIMPAN CACHE
    // ---------------------------------------------

    API_CACHE[fileName] =
        data;


    console.log(
        "API BERHASIL:",
        fileName,
        data
    );


    return data;

}


// =====================================================
// BERITA
// =====================================================

async function getBerita() {

    return await fetchAPI(
        "berita.json"
    );

}


// =====================================================
// GALERI
// =====================================================

async function getGaleri() {

    return await fetchAPI(
        "galeri.json"
    );

}


// =====================================================
// PENGUMUMAN
// =====================================================

async function getPengumuman() {

    return await fetchAPI(
        "pengumuman.json"
    );

}


// =====================================================
// AGENDA
// =====================================================

async function getAgenda() {

    return await fetchAPI(
        "agenda.json"
    );

}


// =====================================================
// DOWNLOAD
// =====================================================

async function getDownload() {

    return await fetchAPI(
        "download.json"
    );

}


// =====================================================
// CLEAR CACHE
// =====================================================

function clearAPICache() {

    Object.keys(API_CACHE)
        .forEach(function(key) {

            delete API_CACHE[key];

        });

    console.log(
        "API CACHE DIBERSIHKAN"
    );

}
