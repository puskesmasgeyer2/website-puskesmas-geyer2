const API_BASE =
    "https://raw.githubusercontent.com/USERNAME/website-puskesmas-geyer2/main/data/";


// ========================================
// AMBIL DATA JSON
// ========================================

async function getData(namaFile){

    try{

        const response = await fetch(
            API_BASE + namaFile + ".json"
        );

        if(!response.ok){

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }

        const data = await response.json();

        return data;

    }catch(error){

        console.error(
            "GAGAL MENGAMBIL DATA:",
            namaFile,
            error
        );

        return [];

    }

}
