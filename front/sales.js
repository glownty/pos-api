// =======================
// STATE SAFE
// =======================
if (!state.sales) state.sales = [];

// =======================
// VIEW
// =======================
function renderSalesView() {
    return `
        <h1 class="text-xl font-bold mb-4">Vendas</h1>

        <div class="flex gap-2 mb-4">
            <input id="salesSearchInput"
                oninput="handleSalesSearchInput()"
                class="flex-1 p-2 bg-gray-800 rounded"
                placeholder="Buscar venda...">
        </div>

        <div id="salesList" class="space-y-2"></div>
    `;
}

// =======================
// LOAD SALES (USER SCOPED)
// =======================
async function loadSales() {
    try {
        const res = await fetch(BASE_URL + "/sales", {
            headers: headers()
        });

        const data = await res.json();

        state.sales = Array.isArray(data) ? data : [];

        renderSalesList();

    } catch (err) {
        console.error("LOAD SALES ERROR:", err);
        state.sales = [];
    }
}

// =======================
// RENDER LIST
// =======================
function renderSalesList(list = state.sales) {
    const el = document.getElementById("salesList");
    const safeList = list || [];

    if (!safeList.length) {
        el.innerHTML = `<div class="text-gray-400">Nenhuma venda encontrada</div>`;
        return;
    }

    el.innerHTML = safeList.map(s => `
        <div class="bg-gray-800 p-3 flex justify-between">
            <div>
                <div class="font-bold">Venda #${s.id}</div>
                <div class="text-sm text-gray-400">
                    Total: R$ ${(s.total ?? 0).toFixed(2)}
                </div>
            </div>

            <button onclick="deleteSale(${s.id})"
                class="bg-red-600 px-2">
                Del
            </button>
        </div>
    `).join("");
}

// =======================
// SEARCH (LOCAL)
// =======================
let salesTimeout;

function handleSalesSearchInput() {
    clearTimeout(salesTimeout);

    salesTimeout = setTimeout(() => {
        const value = document.getElementById("salesSearchInput").value.toLowerCase();

        if (!value) return renderSalesList();

        const filtered = (state.sales || []).filter(s =>
            String(s.id).includes(value)
        );

        renderSalesList(filtered);
    }, 200);
}

// =======================
// DELETE SALE
// =======================
async function deleteSale(id) {
    try {
        await fetch(BASE_URL + "/sales/" + id, {
            method: "DELETE",
            headers: headers()
        });

        loadSales();

    } catch (err) {
        console.error("DELETE SALE ERROR:", err);
    }
}

// =======================
// EXPORT
// =======================
window.renderSalesView = renderSalesView;
window.loadSales = loadSales;
window.deleteSale = deleteSale;