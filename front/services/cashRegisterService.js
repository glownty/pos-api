// service.js

// Caso BASE_URL ou headers não estejam definidos globalmente,
// o navegador usará os que já estão no escopo do seu projeto.
export async function getAll(page = 1, limit = 10, filter = 'today', startDate = '', endDate = '') {
    let url = `${BASE_URL}/cashRegister/paginated?page=${page}&limit=${limit}`;

    if (filter) url += `&filter=${filter}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await fetch(url, {
        headers: headers()
    });

    return res.json();
}

export async function open(initialBalance) {
    await fetch(`${BASE_URL}/cashregister/open`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ initialBalance })
    });
}

export async function close(id, finalBalance) {
    const res = await fetch(`${BASE_URL}/cashregister/${id}`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ finalBalance })
    });

    return res.json();
}

export async function adjust(id, amount, description) {
    await fetch(`${BASE_URL}/cashregister/${id}/adjustment`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ amount, description })
    });
}