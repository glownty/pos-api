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