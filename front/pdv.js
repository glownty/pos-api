// =======================
// SAFE STATE INIT
// =======================
if (!state.pdvProducts) state.pdvProducts = [];
let cart = [];

let discountValue = 0;
let paymentMethod = "cash";
let selectedClient = null;

// =======================
// VIEW
// =======================
function renderPDVView() {
    return `
        <h1 class="text-xl font-bold mb-4">PDV</h1>

        <!-- TOP BAR -->
        <div class="flex gap-2 mb-4">

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
            </select>

        </div>

        <!-- PRODUCTS -->
        <div id="pdvProducts" class="mb-4"></div>

        <!-- CART -->
        <div class="bg-gray-900 p-3 rounded">

            <h2 class="font-bold mb-2">Carrinho</h2>

            <div id="cartList" class="overflow-hidden rounded border border-gray-700"></div>

            <!-- TOTALS -->
            <div class="mt-4 space-y-1">

                <div class="flex justify-between font-bold">
                    <span>Subtotal:</span>
                    <span>R$ <span id="cartTotal">0.00</span></span>
                </div>

                <div class="flex justify-between items-center font-bold text-yellow-400">
                    <span>Desconto:</span>
                    <span>
                        R$ 
                        <input id="discountInput"
                            type="number"
                            value="0"
                            oninput="setDiscount(this.value)"
                            class="w-20 ml-2 p-1 bg-gray-800 rounded text-right">
                    </span>
                </div>

                <div class="flex justify-between font-bold text-green-400">
                    <span>Total:</span>
                    <span>R$ <span id="finalTotal">0.00</span></span>
                </div>

            </div>

            <!-- BUTTONS -->
            <div class="flex gap-2 mt-4">
                <button onclick="cancelSale()"
                    class="flex-1 bg-red-600 p-2 rounded">
                    Cancelar
                </button>

                <button onclick="finishSale()"
                    class="flex-1 bg-green-600 p-2 rounded">
                    Finalizar Venda
                </button>
            </div>

        </div>
    `;
}

// =======================
// SEARCH
// =======================
let pdvTimeout;

function handlePDVSearch() {
    clearTimeout(pdvTimeout);

    pdvTimeout = setTimeout(async () => {
        const value = document.getElementById("pdvSearch").value.trim();
        const el = document.getElementById("pdvProducts");

        if (!value) {
            el.innerHTML = "";
            return;
        }

        try {
            const isBarcode = /^\d+$/.test(value);

            if (isBarcode) {
                const res = await fetch(BASE_URL + "/products/barcode/" + value, {
                    headers: headers()
                });

                if (!res.ok) return;

                const product = await res.json();

                if (product) pushCart(product);

                document.getElementById("pdvSearch").value = "";
                el.innerHTML = "";
                return;
            }

            const res = await fetch(
                BASE_URL + "/products/search?name=" + encodeURIComponent(value),
                { headers: headers() }
            );

            const data = await res.json();

            const result = Array.isArray(data) ? data : (data ? [data] : []);

            renderPDVProducts(result);

        } catch (err) {
            console.error("SEARCH ERROR:", err);
        }
    }, 250);
}

// =======================
// RENDER PRODUCTS (BUSCA)
// =======================
function renderPDVProducts(list) {
    const el = document.getElementById("pdvProducts");

    if (!list || !list.length) {
        el.innerHTML = `<div class="text-gray-400 p-2">Nenhum produto</div>`;
        return;
    }

    el.innerHTML = list.map(p => `
        <div onclick='pushCart(${JSON.stringify(p)})'
            class="bg-gray-800 hover:bg-gray-700 p-2 cursor-pointer rounded mb-1">

            <div class="font-bold">${p.name}</div>
            <div class="text-sm text-gray-400">
                R$ ${Number(p.price ?? 0).toFixed(2)}
            </div>

        </div>
    `).join("");
}

// =======================
// CART
// =======================
function pushCart(product) {
    if (!product) return;

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
// CART RENDER (ZEBRA AQUI)
// =======================
function renderCart() {
    const el = document.getElementById("cartList");

    if (!cart.length) {
        el.innerHTML = `<div class="text-gray-400 p-2">Carrinho vazio</div>`;
        updateTotals();
        return;
    }

    el.innerHTML = cart.map((i, index) => `
        <div class="flex justify-between p-2
            ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}">

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

    const final = Math.max(0, subtotal - discountValue);

    document.getElementById("cartTotal").innerText = subtotal.toFixed(2);
    document.getElementById("finalTotal").innerText = final.toFixed(2);
}

// =======================
// DISCOUNT
// =======================
function setDiscount(value) {
    discountValue = Math.max(0, Number(value) || 0);
    updateTotals();
}

// =======================
// PAYMENT
// =======================
function setPaymentMethod(value) {
    paymentMethod = value;
}

// =======================
// CANCEL
// =======================
function cancelSale() {
    cart = [];
    discountValue = 0;
    paymentMethod = "cash";

    document.getElementById("discountInput").value = 0;
    document.getElementById("paymentMethod").value = "cash";

    renderCart();
}

// =======================
// CLIENT
// =======================
function selectClient() {
    alert("Seleção de cliente (a implementar)");
}

// =======================
// FINISH
// =======================
async function finishSale() {
    if (!cart.length) return alert("Carrinho vazio");

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
        const res = await fetch(BASE_URL + "/sales", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                subtotal,
                discount: discountValue,
                paymentMethod,
                status: "completed",
                products: cart
            })
        });

        if (!res.ok) throw new Error(await res.text());

        cancelSale();

        alert("Venda finalizada!");

    } catch (err) {
        console.error("FINISH SALE ERROR:", err);
    }
}

// =======================
// EXPORT
// =======================
window.renderPDVView = renderPDVView;
window.handlePDVSearch = handlePDVSearch;
window.finishSale = finishSale;
window.cancelSale = cancelSale;
window.setDiscount = setDiscount;
window.setPaymentMethod = setPaymentMethod;
window.selectClient = selectClient;