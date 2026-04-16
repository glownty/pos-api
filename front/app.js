const BASE_URL = "http://localhost:3000";

let token = localStorage.getItem("token");

// estado global simples
let state = {
    products: [],
    cart: [],
    sales: []
};

// =======================
// HEADERS
// =======================
function headers() {
    return {
        "Content-Type": "application/json",
        Authorization: token
    };
}

// =======================
// NAVIGATION (SPA SIMPLES)
// =======================
function navigate(view) {
    const container = document.getElementById("viewContainer");

    if (view === "products") {
        container.innerHTML = renderProductsView();
        if (window.loadProducts) loadProducts();
    }

    if (view === "pdv") {
        container.innerHTML = renderPDVView();
        if (window.loadPDV) loadPDV();
    }

    if (view === "sales") {
        container.innerHTML = renderSalesView();
        if (window.loadSales) loadSales();
    }
}

// =======================
// AUTH CHECK
// =======================
function checkAuth() {
    if (token) {
        document.getElementById("authView").classList.add("hidden");
        document.getElementById("appView").classList.remove("hidden");

        navigate("products");
    }
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// init
document.addEventListener("DOMContentLoaded", checkAuth);