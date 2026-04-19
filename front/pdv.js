
// =======================
// SAFE STATE
// =======================
if (!state.pdvProducts) state.pdvProducts = [];

let cart = [];
let discountValue = 0;
let paymentMethod = "cash";
let cashPaid = 0;

// salva tela ativa
localStorage.setItem("activeView", "pdv");

// =======================
// VIEW
// =======================
function renderPDVView() {
    return `
        <div class="fixed inset-0 bg-gray-900 text-white flex flex-col">

            <!-- TOP BAR -->
            <div class="flex gap-2 p-3 bg-gray-950 border-b border-gray-800 relative">

                <input id="pdvSearch"
                    oninput="handlePDVSearch()"
                    class="flex-1 p-2 bg-gray-800 rounded"
                    placeholder="Buscar produto (barcode ou nome)">

                <button onclick="selectClient()"
                    class="bg-blue-600 px-3 rounded">
                    Cliente
                </button>

                <select id="paymentMethod"
                    onchange="setPaymentMethod(this.value)"
                    class="bg-gray-800 px-2 rounded">

                    <option value="cash">Dinheiro</option>
                    <option value="debit">Débito</option>
                    <option value="credit">Crédito</option>
                    <option value="pix">Pix</option>

                </select>

                <!-- DROPDOWN FLUTUANTE -->
                <div id="pdvSearchResults"
                    class="absolute top-[52px] left-3 right-[400px] bg-gray-900 border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto hidden z-50">
                </div>

            </div>

            <!-- CONTEÚDO -->
            <div class="flex flex-1 overflow-hidden">

                <!-- CARRINHO -->
                <div class="flex-1 flex flex-col p-3 overflow-hidden">

                    <h2 class="font-bold mb-2">Carrinho</h2>

                    <div id="cartList"
                        class="flex-1 overflow-y-auto border border-gray-700 rounded">
                    </div>

                    <!-- TOTAIS -->
                    <div class="mt-3 space-y-2">

                        <div class="flex justify-between text-sm text-gray-300">
                            <span>Subtotal:</span>
                            <span>R$ <span id="cartTotal">0.00</span></span>
                        </div>

                        <div class="flex justify-between items-center text-sm text-yellow-400">
                            <span>Desconto:</span>
                            <input id="discountInput"
                                type="number"
                                value="0"
                                onfocus="autoSelect(this)"
                                oninput="setDiscount(this.value)"
                                class="w-24 p-1 bg-gray-800 rounded text-right">
                        </div>

                        <div class="flex justify-between font-bold text-xl text-green-400">
                            <span>Total:</span>
                            <span>R$ <span id="finalTotal">0.00</span></span>
                        </div>

                        <div class="flex justify-between items-center text-sm text-blue-300">
                            <span>Valor Pago:</span>
                            <input id="cashPaidInput"
                                type="number"
                                value="0"
                                onfocus="autoSelect(this)"
                                oninput="setCashPaid(this.value)"
                                class="w-24 p-1 bg-gray-800 rounded text-right">
                        </div>

                        <div class="flex justify-between font-bold text-xl text-blue-400">
                            <span>Troco:</span>
                            <span>R$ <span id="changeValue">0.00</span></span>
                        </div>

                    </div>

                    <!-- BOTÕES -->
                    <div class="flex gap-2 mt-3">

                        <button onclick="cancelSale()"
                            class="flex-1 bg-red-600 py-1 rounded text-sm">
                            Cancelar
                        </button>

                        <button onclick="finishSale()"
                            class="flex-1 bg-green-600 py-1 rounded text-sm">
                            Finalizar
                        </button>

                    </div>

                </div>

            </div>
        </div>
    `;
}

// =======================
// SEARCH (DROPDOOWN FLUTUANTE)
// =======================
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

// =======================
// RENDER DROPDOWN
// =======================
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

// =======================
// SELECT PRODUCT FROM SEARCH
// =======================
function selectSearchProduct(product) {
    pushCart(product);

    const box = document.getElementById("pdvSearchResults");
    const input = document.getElementById("pdvSearch");

    box.classList.add("hidden");
    box.innerHTML = "";
    input.value = "";
    input.focus();
}

// =======================
// CLICK OUTSIDE DROPDOWN
// =======================
document.addEventListener("click", (e) => {
    const box = document.getElementById("pdvSearchResults");
    const input = document.getElementById("pdvSearch");

    if (!box || !input) return;

    if (!box.contains(e.target) && e.target !== input) {
        box.classList.add("hidden");
    }
});

// =======================
// CART
// =======================
function pushCart(product) {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            quantity: 1
        });
    }

    renderCart();
}

// =======================
// CART RENDER
// =======================
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

// =======================
// TOTALS
// =======================
function updateTotals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = Math.max(0, subtotal - discountValue);

    document.getElementById("cartTotal").innerText = subtotal.toFixed(2);
    document.getElementById("finalTotal").innerText = total.toFixed(2);

    const change = Math.max(0, cashPaid - total);
    document.getElementById("changeValue").innerText = change.toFixed(2);
}

// =======================
// DISCOUNT
// =======================
function setDiscount(value) {
    discountValue = Number(value) || 0;
    updateTotals();
}

// =======================
// CASH PAID
// =======================
function setCashPaid(value) {
    cashPaid = Number(value) || 0;
    updateTotals();
}

// =======================
// PAYMENT METHOD
// =======================
function setPaymentMethod(value) {
    paymentMethod = value;

    if (value !== "cash") {
        cashPaid = 0;
        const el = document.getElementById("cashPaidInput");
        if (el) el.value = 0;
    }

    updateTotals();
}

// =======================
// CANCEL
// =======================
function cancelSale() {
    cart = [];
    discountValue = 0;
    cashPaid = 0;
    paymentMethod = "cash";

    document.getElementById("discountInput").value = 0;
    document.getElementById("cashPaidInput").value = 0;
    document.getElementById("paymentMethod").value = "cash";

    renderCart();
}

// =======================
// CLIENT
// =======================
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

// =======================
// RESTORE VIEW (F5)
// =======================
window.addEventListener("load", () => {
    const view = localStorage.getItem("activeView");

    if (view === "pdv") renderPDVView();
    if (view === "products") renderProductsView();
    if (view === "sales") renderSalesView();
});

// =======================
// EXPORT
// =======================
window.renderPDVView = renderPDVView;
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