export async function getProducts() {

    const res = await fetch(BASE_URL + "/products", {
        headers: headers()
    });

    return await res.json();
}

export async function searchProductsRequest(value) {

    const isBarcode = /^\d+$/.test(value);

    let url = "";

    if (isBarcode) {

        url = BASE_URL + "/products/barcode/" + value;

    } else {

        url =
            BASE_URL +
            "/products/search?name=" +
            encodeURIComponent(value);
    }

    const res = await fetch(url, {
        headers: headers()
    });

    return await res.json();
}

export async function createProductRequest(payload) {

    await fetch(BASE_URL + "/products", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload)
    });
}

export async function deleteProductRequest(id) {

    await fetch(BASE_URL + "/products/" + id, {
        method: "DELETE",
        headers: headers()
    });
}

export async function updateProductRequest(id, payload) {

    return await fetch(BASE_URL + "/products/" + id, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload)
    });
}