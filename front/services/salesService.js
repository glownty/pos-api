export async function getSales() {

    const res = await fetch(BASE_URL + "/sales", {
        headers: headers()
    });

    return await res.json();
}

export async function getSaleById(id) {

    const res = await fetch(BASE_URL + "/sales/" + id, {
        headers: headers()
    });

    return await res.json();
}

export async function removeSale(id) {

    await fetch(BASE_URL + "/sales/" + id, {
        method: "DELETE",
        headers: headers()
    });
}