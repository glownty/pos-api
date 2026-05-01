let cart = [];
let discountValue = 0;
let paymentMethod = "cash";
let cashPaid = 0;

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

function updateTotals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = Math.max(0, subtotal - discountValue);

    document.getElementById("cartTotal").innerText = subtotal.toFixed(2);
    document.getElementById("finalTotal").innerText = total.toFixed(2);

    const change = Math.max(0, cashPaid - total);
    document.getElementById("changeValue").innerText = change.toFixed(2);
}

function setDiscount(value) {
    discountValue = Number(value) || 0;
    updateTotals();
}

function setCashPaid(value) {
    cashPaid = Number(value) || 0;
    updateTotals();
}

function setPaymentMethod(value) {
    paymentMethod = value;

    if (value !== "cash") {
        cashPaid = 0;
        const el = document.getElementById("cashPaidInput");
        if (el) el.value = 0;
    }

    updateTotals();
}

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
async function finishSale() {
    try {
        if (!cart.length) {
            showToast("Carrinho vazio", "error");
            return;
        }

        const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

        const products = cart.map(i => {
            if (!i.id) {
                throw new Error("Produto sem ID no carrinho");
            }

            return {
                productId: i.id,
                quantity: i.quantity,
                price: i.price
            };
        });

        const body = {
            subtotal,
            discount: discountValue,
            paymentMethod,
            status: "completed",
            products
        };

        const res = await fetch(BASE_URL + "/sales", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Erro ao finalizar venda", "error");
            return;
        }

        cancelSale();
        showToast("Venda finalizada com sucesso!", "success");

    } catch (err) {
        console.error("FINISH SALE ERROR:", err);
        showToast(err.message || "Erro inesperado", "error");
    }
}