import {
    getSales,
    getSaleById,
    removeSale
} from "../services/salesService.js";

// =======================
// STATE SAFE
// =======================
if (!state.sales) {
    state.sales = [];
}

if (!state.selectedSale) {
    state.selectedSale = null;
}

// =======================
// LOAD
// =======================
export async function load() {

    await loadSales();
}

// =======================
// LOAD SALES
// =======================
async function loadSales() {

    try {

        const data = await getSales();

        state.sales = Array.isArray(data)
            ? data
            : [];

        renderSalesList();

    } catch (err) {

        console.error(
            "LOAD SALES ERROR:",
            err
        );

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

        el.innerHTML = `
            <div class="text-gray-400">
                Nenhuma venda encontrada
            </div>
        `;

        return;
    }

    el.innerHTML = list.map(s => `

        <div
            class="
                bg-gray-800
                p-3
                flex
                justify-between
                items-center
                rounded
                cursor-pointer
            "

            onclick="openSale(${s.id})"
        >

            <div>

                <div class="font-bold">
                    Venda #${s.id}
                </div>

                <div class="text-sm text-gray-400">
                    Total:
                    R$ ${Number(s.total || 0).toFixed(2)}
                </div>

                <div class="text-sm text-yellow-400">
                    Status:
                    ${s.status || 'pendente'}
                </div>

                <div class="text-xs text-gray-500 mt-1">

                    ${(s.items || [])
                        .slice(0, 3)
                        .map(i => i.productName || 'item')
                        .join(', ')}

                </div>

            </div>

            <button
                onclick="deleteSale(${s.id}); event.stopPropagation();"
                class="bg-red-600 px-2 rounded"
            >
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

        const value =
            document
                .getElementById("salesSearchInput")
                .value
                .toLowerCase();

        if (!value) {

            return renderSalesList();
        }

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

        const sale = await getSaleById(id);

        state.selectedSale = sale;

        renderSaleModal(sale);

    } catch (err) {

        console.error(
            "OPEN SALE ERROR:",
            err
        );
    }
}

// =======================
// MODAL
// =======================
function renderSaleModal(s) {

    const el =
        document.getElementById(
            "saleModalContent"
        );

    el.innerHTML = `

        <div class="space-y-2 text-sm">

            <div class="font-bold text-lg">
                Venda #${s.id}
            </div>

            <div>
                Status:
                <span class="text-yellow-400">
                    ${s.status || 'pendente'}
                </span>
            </div>

            <div>
                Pagamento:
                ${s.paymentMethod || 'N/A'}
            </div>

            <div class="border-t border-gray-700 my-2"></div>

            <div class="space-y-1">

                ${(s.items || []).map(i => `

                    <div class="flex justify-between text-gray-300">

                        <span>
                            ${i.productName}
                        </span>

                        <span>
                            x${i.quantity}
                        </span>

                        <span>
                            R$ ${(i.quantity * i.price).toFixed(2)}
                        </span>

                    </div>

                `).join("")}

            </div>

            <div class="border-t border-gray-700 my-2"></div>

            <div class="text-right font-bold">

                Total:
                R$ ${Number(s.total || 0).toFixed(2)}

            </div>

        </div>
    `;

    document
        .getElementById("saleModal")
        .classList
        .remove("hidden");
}

// =======================
// CLOSE MODAL
// =======================
function closeSaleModal() {

    document
        .getElementById("saleModal")
        .classList
        .add("hidden");
}

// =======================
// DELETE
// =======================
async function deleteSale(id) {

    try {

        await removeSale(id);

        loadSales();

    } catch (err) {

        console.error(
            "DELETE SALE ERROR:",
            err
        );
    }
}

// =======================
// GLOBAL
// =======================
window.openSale = openSale;

window.deleteSale = deleteSale;

window.handleSalesSearchInput =
    handleSalesSearchInput;

window.closeSaleModal =
    closeSaleModal;