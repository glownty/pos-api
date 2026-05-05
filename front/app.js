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
// NAVIGATION (PADRÃO NOVO)
// =======================
async function navigate(view) {

    // 🔥 VALIDAÇÃO REAL (via API, sem middleware import)
    if (view === "pdv") {
        try {
            const res = await fetch("/cashRegister/status", {
                headers: {
                    Authorization: token
                }
            });

            const data = await res.json();

            if (data?.trim().toUpperCase() !== "OPEN") {
                showMessage?.("Abra o caixa primeiro");
                return;
            }

        } catch (e) {
            console.error("Erro ao verificar caixa:", e);
            return;
        }
    }

    const container = document.getElementById("viewContainer");

    try {
        // carrega HTML
        const res = await fetch(`/views/${view}.html`);
        const html = await res.text();

        container.innerHTML = html;

        // carrega script da página (se existir)
        try {
            const module = await import(`/scripts/${view}.js`);

            if (module.load) module.load();
            if (module.init) module.init();

        } catch (e) {
            // página pode não ter script
        }

    } catch (err) {
        console.error("Erro ao carregar view:", err);
        container.innerHTML = "<p>Erro ao carregar página</p>";
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