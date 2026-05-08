const BASE_URL = "http://localhost:3000";

let token = localStorage.getItem("token");

// =======================
// STATE GLOBAL
// =======================
window.state = {
    products: [],
    pdvProducts: [],
    sales: [],
    clients: []
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
async function navigate(view) {

    // 🔥 VALIDAÇÃO REAL (CAIXA)
    if (view === "pdv") {

        try {

            const res = await fetch("/cashRegister/status", {
                headers: {
                    Authorization: token
                }
            });

            const data = await res.json();

            console.log("STATUS:", data);

            // 🔥 AQUI ESTAVA O ERRO
            // a API retorna STRING ("OPEN")
            // e não objeto { status: "OPEN" }

            if (data?.trim().toUpperCase() !== "OPEN") {

                if (window.showMessage) {
                    showMessage("Abra o caixa primeiro");
                } else {
                    alert("Abra o caixa primeiro");
                }

                return;
            }

        } catch (e) {

            console.error("Erro ao verificar caixa:", e);

            alert("Erro ao verificar status do caixa");

            return;
        }
    }

    const container = document.getElementById("viewContainer");

    try {

        // =======================
        // LOAD HTML
        // =======================
        const res = await fetch(`/views/${view}.html`);

        const html = await res.text();

        container.innerHTML = html;

        // =======================
        // LOAD SCRIPT
        // =======================
        try {

            const module = await import(`/scripts/${view}.js`);

            if (module.load) module.load();

            if (module.init) module.init();

        } catch (e) {

            // página pode não possuir JS
        }

    } catch (err) {

        console.error("Erro ao carregar view:", err);

        container.innerHTML = `
            <div class="text-red-400 p-5">
                Erro ao carregar página
            </div>
        `;
    }
}

// =======================
// AUTH CHECK
// =======================
function checkAuth() {

    if (token) {

        document
            .getElementById("authView")
            .classList
            .add("hidden");

        document
            .getElementById("appView")
            .classList
            .remove("hidden");

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