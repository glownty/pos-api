export async function getClients() {
    const res = await fetch(BASE_URL + "/clients", {
        method: "GET",
        headers: headers()
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function searchClientsRequest(value) {
    const isCpf = /^\d+$/.test(value.replace(/\D/g, ""));
    let url = "";

    if (isCpf) {
        url = BASE_URL + "/clients/cpf/" + value.replace(/\D/g, "");
    } else {
        url = BASE_URL + "/clients/search?name=" + encodeURIComponent(value);
    }

    const res = await fetch(url, {
        method: "GET",
        headers: headers()
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return await res.json();
}

export async function createClientRequest(payload) {
    const res = await fetch(BASE_URL + "/clients", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload)
    });

    return res;
}

export async function deleteClientRequest(id) {
    const res = await fetch(BASE_URL + "/clients/" + id, {
        method: "DELETE",
        headers: headers()
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res;
}

export async function updateClientRequest(id, payload) {
    const res = await fetch(BASE_URL + "/clients/" + id, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload)
    });

    return res;
}