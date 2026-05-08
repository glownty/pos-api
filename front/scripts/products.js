import {
    getProducts,
    searchProductsRequest,
    createProductRequest,
    deleteProductRequest,
    updateProductRequest
} from "../services/productsService.js";

// =======================
// LOAD
// =======================
export async function load() {

    await loadProducts();
}

// =======================
// LOAD PRODUCTS
// =======================
async function loadProducts() {

    try {

        const data = await getProducts();

        state.products = data;

        renderProductsList();

    } catch (err) {

        console.error(
            "ERRO AO CARREGAR PRODUTOS:",
            err
        );
    }
}

// =======================
// RENDER LIST
// =======================
function renderProductsList() {

    const el =
        document.getElementById(
            "productsList"
        );

    if (!state.products) return;

    el.innerHTML =
        state.products.map(p => `

        <div
            class="
                bg-gray-800
                p-3
                flex
                justify-between
                items-center
                rounded
            "
        >

            <div>

                <div class="font-bold">
                    ${p.name}
                </div>

                <div class="text-sm text-gray-400">
                    R$ ${p.price}
                    |
                    Estoque: ${p.stock}
                </div>

            </div>

            <div class="flex gap-2">

                <button
                    onclick="deleteProduct(${p.id})"
                    class="bg-red-600 px-2 rounded"
                >
                    Del
                </button>

                <button
                    onclick="openEditProduct(${p.id})"
                    class="bg-yellow-600 px-2 rounded"
                >
                    Edit
                </button>

            </div>

        </div>

    `).join("");
}

// =======================
// SEARCH
// =======================
let searchTimeout = null;

function handleSearchInput() {

    clearTimeout(searchTimeout);

    searchTimeout =
        setTimeout(() => {

            searchProducts();

        }, 300);
}

// =======================
// SEARCH REQUEST
// =======================
async function searchProducts() {

    const value =
        document
            .getElementById("searchInput")
            .value
            .trim();

    if (!value) {

        renderProductsList();

        return;
    }

    try {

        const data =
            await searchProductsRequest(value);

        const result =
            Array.isArray(data)
                ? data
                : (data ? [data] : []);

        renderFilteredProducts(result);

    } catch (err) {

        console.error(
            "ERRO SEARCH:",
            err
        );
    }
}

// =======================
// RENDER FILTERED
// =======================
function renderFilteredProducts(products) {

    const el =
        document.getElementById(
            "productsList"
        );

    if (!products.length) {

        el.innerHTML = `
            <div class="text-gray-400 text-center p-4">
                Nenhum produto encontrado
            </div>
        `;

        return;
    }

    el.innerHTML =
        products.map(p => `

        <div
            class="
                bg-blue-900
                border
                border-blue-500
                p-3
                flex
                justify-between
                items-center
                rounded
            "
        >

            <div>

                <div class="font-bold">
                    ${p.name}
                </div>

                <div class="text-sm text-gray-300">
                    R$ ${p.price}
                    |
                    Estoque: ${p.stock}
                </div>

            </div>

            <div class="flex gap-2">

                <button
                    onclick="deleteProduct(${p.id})"
                    class="bg-red-600 px-2 rounded"
                >
                    Del
                </button>

                <button
                    onclick="openEditProduct(${p.id})"
                    class="bg-yellow-600 px-2 rounded"
                >
                    Edit
                </button>

            </div>

        </div>

    `).join("");
}

// =======================
// CREATE
// =======================
function openCreateProduct() {

    document
        .getElementById("createProductModal")
        .classList
        .remove("hidden");

    document
        .getElementById("cp_active")
        .value = 1;
}

function closeCreateProductModal() {

    document
        .getElementById("createProductModal")
        .classList
        .add("hidden");
}

function clearCreateInputs() {

    document.getElementById("cp_name").value = "";

    document.getElementById("cp_barcode").value = "";

    document.getElementById("cp_price").value = "";

    document.getElementById("cp_cost").value = "";

    document.getElementById("cp_stock").value = "";

    document.getElementById("cp_category").value = "";
}

function buildCreatePayload() {

    return {

        name:
            document
                .getElementById("cp_name")
                .value
                .trim(),

        barcode:
            document
                .getElementById("cp_barcode")
                .value || null,

        price:
            Number(
                document.getElementById("cp_price").value
            ) || 0,

        cost:
            Number(
                document.getElementById("cp_cost").value
            ) || 0,

        stock:
            Number(
                document.getElementById("cp_stock").value
            ) || 0,

        categoryId:
            Number(
                document.getElementById("cp_category").value
            ) || null,

        isActive:
            Number(
                document.getElementById("cp_active").value
            )
    };
}

async function submitCreateProduct() {

    const payload = buildCreatePayload();

    if (!payload.name) {

        alert("Nome é obrigatório");

        return;
    }

    try {

        await createProductRequest(payload);

        loadProducts();

        closeCreateProductModal();

        clearCreateInputs();

    } catch (err) {

        console.error(
            "ERRO CREATE:",
            err
        );
    }
}

// =======================
// DELETE
// =======================
async function deleteProduct(id) {

    try {

        await deleteProductRequest(id);

        loadProducts();

    } catch (err) {

        console.error(
            "ERRO DELETE:",
            err
        );
    }
}

// =======================
// EDIT
// =======================
function openEditProduct(id) {

    const p =
        state.products.find(
            x => x.id === id
        );

    if (!p) return;

    document
        .getElementById("editProductModal")
        .classList
        .remove("hidden");

    document.getElementById("ep_id").value =
        p.id;

    document.getElementById("ep_name").value =
        p.name || "";

    document.getElementById("ep_barcode").value =
        p.barcode || "";

    document.getElementById("ep_price").value =
        p.price ?? "";

    document.getElementById("ep_cost").value =
        p.cost ?? "";

    document.getElementById("ep_stock").value =
        p.stock ?? "";

    document.getElementById("ep_category").value =
        p.categoryId ?? "";

    document.getElementById("ep_active").value =
        p.isActive ?? 1;
}

function closeEditProductModal() {

    document
        .getElementById("editProductModal")
        .classList
        .add("hidden");
}

function buildEditPayload() {

    return {

        name:
            document
                .getElementById("ep_name")
                .value
                .trim() || null,

        barcode:
            document
                .getElementById("ep_barcode")
                .value || null,

        price:
            document.getElementById("ep_price").value === ""
                ? null
                : Number(document.getElementById("ep_price").value),

        cost:
            document.getElementById("ep_cost").value === ""
                ? null
                : Number(document.getElementById("ep_cost").value),

        stock:
            document.getElementById("ep_stock").value === ""
                ? null
                : Number(document.getElementById("ep_stock").value),

        categoryId:
            document.getElementById("ep_category").value === ""
                ? null
                : Number(document.getElementById("ep_category").value),

        isActive:
            Number(
                document.getElementById("ep_active").value
            )
    };
}

async function submitEditProduct() {

    const id =
        document.getElementById("ep_id").value;

    const payload =
        buildEditPayload();

    try {

        const res =
            await updateProductRequest(
                id,
                payload
            );

        const data =
            await res.text();

        if (!res.ok) {

            throw new Error(data);
        }

        console.log(
            "UPDATE OK:",
            data
        );

        loadProducts();

        closeEditProductModal();

    } catch (err) {

        console.error(
            "❌ ERRO UPDATE:",
            err.message || err
        );
    }
}

// =======================
// GLOBAL
// =======================
window.handleSearchInput =
    handleSearchInput;

window.openCreateProduct =
    openCreateProduct;

window.closeCreateProductModal =
    closeCreateProductModal;

window.submitCreateProduct =
    submitCreateProduct;

window.deleteProduct =
    deleteProduct;

window.openEditProduct =
    openEditProduct;

window.closeEditProductModal =
    closeEditProductModal;

window.submitEditProduct =
    submitEditProduct;