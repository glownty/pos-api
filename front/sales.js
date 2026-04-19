// =======================
// STATE SAFE
// =======================
if (!state.sales) state.sales = [];
if (!state.selectedSale) state.selectedSale = null;

// =======================
// VIEW
// =======================
function renderSalesView() {
    return `
        <h1 class="text-xl font-bold mb-4">Vendas</h1>

        <div class="flex gap-2 mb-4">
            <input id="salesSearchInput"
                oninput="handleSalesSearchInput()"
                class="flex-1 p-2 bg-gray-800 rounded outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar venda por ID...">
        </div>

        <div id="salesList" class="space-y-2"></div>

        <!-- MODAL DETALHE VENDA -->
        <div id="saleModal" class="hidden fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div class="bg-gray-900 w-full max-w-md p-4 rounded">

                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold">Detalhe da Venda</h2>
                    <button onclick="closeSaleModal()" class="text-red-500">X</button>
                </div>

                <div id="saleModalContent"></div>
            </div>
        </div>
    `;
}

// =======================
// LOAD SALES
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
        renderSalesList([]);
    }
}

// =======================
// RENDER LIST
// =======================
function renderSalesList(list = state.sales) {
    const el = document.getElementById("salesList");

    if (!list || !list.length) {
        el.innerHTML = `<div class="text-gray-400">Nenhuma venda encontrada</div>`;
        return;
    }

    el.innerHTML = list.map(s => `
        <div class="bg-gray-800 p-3 flex justify-between items-center rounded cursor-pointer"
             onclick="openSale(${s.id})">

            <div>
                <div class="font-bold">Venda #${s.id}</div>

                <div class="text-sm text-gray-400">
                    Total: R$ ${Number(s.total || 0).toFixed(2)}
                </div>

                <div class="text-sm text-yellow-400">
                    Status: ${s.status || 'pendente'}
                </div>

                <div class="text-xs text-gray-500 mt-1">
                    ${(s.items || [])
        .slice(0, 3)
        .map(i => i.productName || 'item')
        .join(', ')}
                </div>
            </div>

            <button onclick="deleteSale(${s.id}); event.stopPropagation();"
                class="bg-red-600 px-2 rounded">
                Del
            </button>
        </div>
    `).join("");
}

// =======================
// SEARCH
// =======================
let salesTimeout;

function handleSalesSearchInput() {
    clearTimeout(salesTimeout);

    salesTimeout = setTimeout(() => {
        const value = document.getElementById("salesSearchInput").value.toLowerCase();

        if (!value) return renderSalesList();

        const filtered = state.sales.filter(s =>
            String(s.id).includes(value)
        );

        renderSalesList(filtered);
    }, 200);
}

// =======================
// OPEN SALE
// =======================
async function openSale(id) {
    try {
        const res = await fetch(BASE_URL + "/sales/" + id, {
            headers: headers()
        });

        const sale = await res.json();

        state.selectedSale = sale;

        renderSaleModal(sale);

    } catch (err) {
        console.error("OPEN SALE ERROR:", err);
    }
}

// =======================
// MODAL
// =======================
function renderSaleModal(s) {
    const el = document.getElementById("saleModalContent");

    el.innerHTML = `
        <div class="space-y-2 text-sm">

            <div class="font-bold text-lg">
                Venda #${s.id}
            </div>

            <div>Status: <span class="text-yellow-400">${s.status || 'pendente'}</span></div>

            <div>Pagamento: ${s.paymentMethod || 'N/A'}</div>

            <div class="border-t border-gray-700 my-2"></div>

            <div class="space-y-1">
                ${(s.items || []).map(i => `
                    <div class="flex justify-between text-gray-300">
                        <span>${i.productName}</span>
                        <span>x${i.quantity}</span>
                        <span>R$ ${(i.quantity * i.price).toFixed(2)}</span>
                    </div>
                `).join("")}
            </div>

            <div class="border-t border-gray-700 my-2"></div>

            <div class="text-right font-bold">
                Total: R$ ${Number(s.total || 0).toFixed(2)}
            </div>

        </div>
    `;

    document.getElementById("saleModal").classList.remove("hidden");
}

// =======================
// CLOSE MODAL
// =======================
function closeSaleModal() {
    document.getElementById("saleModal").classList.add("hidden");
}

// =======================
// DELETE
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
window.openSale = openSale;
window.handleSalesSearchInput = handleSalesSearchInput;
window.closeSaleModal = closeSaleModal;