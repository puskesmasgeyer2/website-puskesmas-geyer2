const API_BASE =
    "https://raw.githubusercontent.com/puskesmasgeyer2/website-puskesmas-geyer2/main/data/";


// ========================================
// AMBIL DATA JSON
// ========================================

async function getData(namaFile){

    try{

        console.log(
            "MENGAMBIL DATA:",
            API_BASE + namaFile + ".json"
        );

        const response = await fetch(
            API_BASE + namaFile + ".json"
        );

        if(!response.ok){

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }

        const data =
            await response.json();

        console.log(
            "DATA BERHASIL:",
            data
        );

        return data;

    }catch(error){

        console.error(
            "GAGAL MENGAMBIL DATA:",
            error
        );

        return [];

    }

}
