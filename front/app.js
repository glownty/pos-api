const BASE_URL = "http://localhost:3000";

let token = localStorage.getItem("token");

// =======================
// STATE GLOBAL
// =======================
window.state = {
    products: [],
    pdvProducts: [],
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
// NAVIGATION
// =======================
function navigate(view) {
    const container = document.getElementById("viewContainer");

    if (view === "home") {
        container.innerHTML = renderHomeView();
        if (window.loadHome) loadHome();
    }

    if (view === "products") {
        container.innerHTML = renderProductsView();
        if (window.loadProducts) loadProducts();
    }

    if (view === "pdv") {
        container.innerHTML = renderPDVView();
        if (window.loadPDVProducts) loadPDVProducts();
    }

    if (view === "sales") {
        container.innerHTML = renderSalesView();
        if (window.loadSales) loadSales();
    }

    if (view === "cashregister") {
        container.innerHTML = renderCashRegisterView();
        if (window.loadCashRegister) loadCashRegister();
    }
}

// =======================
// AUTH CHECK
// =======================
function checkAuth() {
    if (token) {
        document.getElementById("authView").classList.add("hidden");
        document.getElementById("appView").classList.remove("hidden");

        navigate("home");
    }
}

// =======================
// LOGOUT
// =======================
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", checkAuth);

// =======================
// EXPORT GLOBAL
// =======================
window.navigate = navigate;
window.logout = logout;
window.headers = headers;
window.BASE_URL = BASE_URL;