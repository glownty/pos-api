// garante que state existe
window.state = window.state || {};

// garante pdvProducts
if (!window.state.pdvProducts) window.state.pdvProducts = [];

localStorage.setItem("activeView", "pdv");

// SEARCH
let pdvTimeout;

function handlePDVSearch() {
    clearTimeout(pdvTimeout);

    pdvTimeout = setTimeout(async () => {
        const value = document.getElementById("pdvSearch").value.trim();
        const box = document.getElementById("pdvSearchResults");

        if (!value) {
            box.classList.add("hidden");
            box.innerHTML = "";
            return;
        }

        try {
            const isBarcode = /^\d+$/.test(value);

            const url = isBarcode
                ? BASE_URL + "/products/barcode/" + value
                : BASE_URL + "/products/search?name=" + encodeURIComponent(value);

            const res = await fetch(url, { headers: headers() });
            const data = await res.json();

            const list = Array.isArray(data) ? data : (data ? [data] : []);

            renderSearchDropdown(list, box);

        } catch (err) {
            console.error("SEARCH ERROR:", err);
        }
    }, 200);
}

function renderSearchDropdown(list, box) {
    if (!list.length) {
        box.innerHTML = `<div class="p-2 text-gray-400">Nenhum produto</div>`;
        box.classList.remove("hidden");
        return;
    }

    box.innerHTML = list.map(p => `
        <div onclick='selectSearchProduct(${JSON.stringify(p)})'
            class="p-2 hover:bg-gray-800 cursor-pointer border-b border-gray-800">

            <div class="font-bold">${p.name}</div>
            <div class="text-sm text-gray-400">
                R$ ${Number(p.price || 0).toFixed(2)}
            </div>

        </div>
    `).join("");

    box.classList.remove("hidden");
}

function selectSearchProduct(product) {
    pushCart(product);

    const box = document.getElementById("pdvSearchResults");
    const input = document.getElementById("pdvSearch");

    box.classList.add("hidden");
    box.innerHTML = "";
    input.value = "";
    input.focus();
}

// CLICK OUTSIDE
document.addEventListener("click", (e) => {
    const box = document.getElementById("pdvSearchResults");
    const input = document.getElementById("pdvSearch");

    if (!box || !input) return;

    if (!box.contains(e.target) && e.target !== input) {
        box.classList.add("hidden");
    }
});

// CART UI
function renderCart() {
    const el = document.getElementById("cartList");

    if (!cart.length) {
        el.innerHTML = `<div class="text-gray-400 p-2">Carrinho vazio</div>`;
        updateTotals();
        return;
    }

    el.innerHTML = cart.map((i, index) => `
        <div class="flex justify-between p-2 ${index % 2 ? "bg-gray-700" : "bg-gray-800"}">

            <div>${i.name} x${i.quantity}</div>
            <div>R$ ${(i.price * i.quantity).toFixed(2)}</div>

        </div>
    `).join("");

    updateTotals();
}

// UTIL
function autoSelect(input) {
    input.select();
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");

    const colors = {
        success: "bg-green-600",
        error: "bg-red-600"
    };

    toast.className = `
        fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white
        ${colors[type]} animate-fade-in z-50
    `;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CLIENT
function selectClient() {
    const modal = document.createElement("div");

    modal.className =
        "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";

    modal.innerHTML = `
        <div class="bg-gray-900 p-4 rounded w-96 border border-gray-700">

            <div class="flex justify-between mb-3">
                <h2 class="font-bold">Selecionar Cliente</h2>
                <button onclick="this.closest('div').remove()" class="text-red-500">X</button>
            </div>

            <input class="w-full p-2 bg-gray-800 rounded mb-2"
                placeholder="Buscar cliente...">

            <div class="text-gray-400 text-sm">
                Cliente ainda não implementado
            </div>

        </div>
    `;

    document.body.appendChild(modal);
}

// RESTORE VIEW
window.addEventListener("load", () => {
    const view = localStorage.getItem("activeView");

    if (view === "products") renderProductsView();
    if (view === "sales") renderSalesView();
});
// EXPORT
window.handlePDVSearch = handlePDVSearch;
window.pushCart = pushCart;
window.renderCart = renderCart;
window.cancelSale = cancelSale;
window.finishSale = finishSale;
window.setDiscount = setDiscount;
window.setCashPaid = setCashPaid;
window.setPaymentMethod = setPaymentMethod;
window.selectClient = selectClient;
window.autoSelect = autoSelect;