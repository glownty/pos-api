// =======================
// VIEW (HTML)
// =======================
function renderProductsView() {
    return `
        <h1 class="text-xl font-bold mb-4">Produtos</h1>

        <div class="flex gap-2 mb-4">
            <button onclick="openCreateProduct()" 
                class="bg-green-600 px-3">
                + Adicionar Produto
            </button>

            <input id="searchInput"
                oninput="handleSearchInput()"
                class="flex-1 p-2 bg-gray-800 rounded outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pesquisar produto...">
        </div>

        <div id="productsList" class="space-y-2"></div>
    `;
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {
    try {
        const res = await fetch(BASE_URL + "/products", {
            headers: headers()
        });

        const data = await res.json();

        // NÃO sobrescreve o state global
        state.products = data;

        renderProductsList();

    } catch (err) {
        console.error("ERRO AO CARREGAR PRODUTOS:", err);
    }
}

// =======================
// RENDER LIST NORMAL
// =======================
function renderProductsList() {
    const el = document.getElementById("productsList");

    if (!state.products) return;

    el.innerHTML = state.products.map(p => `
        <div class="bg-gray-800 p-3 flex justify-between items-center">
            <div>
                <div class="font-bold">${p.name}</div>
                <div class="text-sm text-gray-400">
                    R$ ${p.price} | Estoque: ${p.stock}
                </div>
            </div>

            <div class="flex gap-2">
                <button onclick="deleteProduct(${p.id})" class="bg-red-600 px-2">Del</button>
                <button onclick="openEditProduct(${p.id})" class="bg-yellow-600 px-2">Edit</button>
            </div>
        </div>
    `).join("");
}

// =======================
// SEARCH (DEBOUNCE)
// =======================
let searchTimeout = null;

function handleSearchInput() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchProducts();
    }, 300);
}

// =======================
// SEARCH REQUEST (POST + BODY)
// =======================
async function searchProducts() {
    const value = document.getElementById("searchInput").value.trim();

    if (!value) {
        renderProductsList();
        return;
    }

    const isBarcode = /^\d+$/.test(value); // só números = barcode

    try {
        let url = "";

        if (isBarcode) {
            url = BASE_URL + "/products/barcode/" + value;
        } else {
            url = BASE_URL + "/products/search?name=" + encodeURIComponent(value);
        }

        const res = await fetch(url, {
            headers: headers()
        });

        const data = await res.json();

        // normaliza resposta (barcode pode vir objeto)
        const result = Array.isArray(data)
            ? data
            : (data ? [data] : []);

        renderFilteredProducts(result);

    } catch (err) {
        console.error("ERRO SEARCH:", err);
    }
}
// =======================
// RENDER RESULTADO DESTACADO
// =======================
function renderFilteredProducts(products) {
    const el = document.getElementById("productsList");

    if (!products.length) {
        el.innerHTML = `
            <div class="text-gray-400 text-center p-4">
                Nenhum produto encontrado
            </div>
        `;
        return;
    }

    el.innerHTML = products.map(p => `
        <div class="bg-blue-900 border border-blue-500 p-3 flex justify-between items-center">
            <div>
                <div class="font-bold">${p.name}</div>
                <div class="text-sm text-gray-300">
                    R$ ${p.price} | Estoque: ${p.stock}
                </div>
            </div>

            <div class="flex gap-2">
                <button onclick="deleteProduct(${p.id})" class="bg-red-600 px-2">Del</button>
                <button onclick="openEditProduct(${p.id})" class="bg-yellow-600 px-2">Edit</button>
            </div>
        </div>
    `).join("");
}

// =======================
// CREATE
// =======================
function openCreateProduct() {
    document.getElementById("createProductModal").classList.remove("hidden");
    document.getElementById("cp_active").value = 1;
}

function closeCreateProductModal() {
    document.getElementById("createProductModal").classList.add("hidden");
}

function submitCreateProduct() {
    const payload = {
        name: document.getElementById("cp_name").value.trim(),
        barcode: document.getElementById("cp_barcode").value || null,
        price: Number(document.getElementById("cp_price").value) || 0,
        cost: Number(document.getElementById("cp_cost").value) || 0,
        stock: Number(document.getElementById("cp_stock").value) || 0,
        categoryId: Number(document.getElementById("cp_category").value) || null,
        isActive: Number(document.getElementById("cp_active").value)
    };

    if (!payload.name) {
        alert("Nome é obrigatório");
        return;
    }

    createProduct(payload);
    closeCreateProductModal();

    // limpar
    document.getElementById("cp_name").value = "";
    document.getElementById("cp_barcode").value = "";
    document.getElementById("cp_price").value = "";
    document.getElementById("cp_cost").value = "";
    document.getElementById("cp_stock").value = "";
    document.getElementById("cp_category").value = "";
}

async function createProduct(payload) {
    try {
        await fetch(BASE_URL + "/products", {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(payload)
        });

        loadProducts();

    } catch (err) {
        console.error("ERRO CREATE:", err);
    }
}

// =======================
// DELETE
// =======================
async function deleteProduct(id) {
    try {
        await fetch(BASE_URL + "/products/" + id, {
            method: "DELETE",
            headers: headers()
        });

        loadProducts();

    } catch (err) {
        console.error("ERRO DELETE:", err);
    }
}

// =======================
// EDIT
// =======================
function openEditProduct(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;

    document.getElementById("editProductModal").classList.remove("hidden");

    document.getElementById("ep_id").value = p.id;
    document.getElementById("ep_name").value = p.name || "";
    document.getElementById("ep_barcode").value = p.barcode || "";
    document.getElementById("ep_price").value = p.price ?? "";
    document.getElementById("ep_cost").value = p.cost ?? "";
    document.getElementById("ep_stock").value = p.stock ?? "";
    document.getElementById("ep_category").value = p.categoryId ?? "";
    document.getElementById("ep_active").value = p.isActive ?? 1;
}

function closeEditProductModal() {
    document.getElementById("editProductModal").classList.add("hidden");
}

async function submitEditProduct() {
    const id = document.getElementById("ep_id").value;

    const payload = {
        name: document.getElementById("ep_name").value.trim() || null,
        barcode: document.getElementById("ep_barcode").value || null,
        price: document.getElementById("ep_price").value === ""
            ? null
            : Number(document.getElementById("ep_price").value),
        cost: document.getElementById("ep_cost").value === ""
            ? null
            : Number(document.getElementById("ep_cost").value),
        stock: document.getElementById("ep_stock").value === ""
            ? null
            : Number(document.getElementById("ep_stock").value),
        categoryId: document.getElementById("ep_category").value === ""
            ? null
            : Number(document.getElementById("ep_category").value),
        isActive: Number(document.getElementById("ep_active").value)
    };

    try {
        const res = await fetch(BASE_URL + "/products/" + id, {
            method: "PUT",
            headers: headers(),
            body: JSON.stringify(payload)
        });

        const data = await res.text();

        if (!res.ok) {
            throw new Error(data);
        }

        console.log("UPDATE OK:", data);

        loadProducts();
        closeEditProductModal();

    } catch (err) {
        console.error("❌ ERRO UPDATE:", err.message || err);
    }
}

// =======================
// EXPORT
// =======================
window.renderProductsView = renderProductsView;
window.loadProducts = loadProducts;
window.deleteProduct = deleteProduct;
window.openEditProduct = openEditProduct;
window.openCreateProduct = openCreateProduct;