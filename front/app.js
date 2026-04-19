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
// SIDEBAR
// =======================
let sidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menu = document.getElementById("menuItems");

    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
        sidebar.classList.remove("w-16");
        sidebar.classList.add("w-64");
        menu.classList.remove("hidden");
    } else {
        sidebar.classList.remove("w-64");
        sidebar.classList.add("w-16");
        menu.classList.add("hidden");
    }
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
}

// =======================
// AUTH CHECK
// =======================
function checkAuth() {
    if (token) {
        document.getElementById("authView").classList.add("hidden");
        document.getElementById("appView").classList.remove("hidden");

        // inicia na HOME
        navigate("home");

        // fecha sidebar depois que renderizar
        setTimeout(() => toggleSidebar(), 0);
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
// EXPORT
// =======================
window.navigate = navigate;
window.toggleSidebar = toggleSidebar;
window.logout = logout;