import { getHomeData } from "../services/homeService.js";

export function loadHome() {
    console.log("Home carregada ✨");

    const data = getHomeData();

    document.getElementById("receitaHoje").innerText = data.receitaHoje;
    document.getElementById("ticketMedio").innerText = data.ticketMedio;
}

// 🔥 valida via backend (correto)
export async function goToPDV() {
    try {
        const res = await fetch("/cashRegister/status", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        });

        const data = await res.json();
        console.log(data);

        if (data?.trim().toUpperCase() !== "OPEN") {
            showMessage("Abra o caixa primeiro");
            return;
        }

        navigate("pdv");

    } catch (err) {
        console.error("Erro ao verificar status do caixa:", err);
        alert("Erro ao verificar o caixa");
    }
}

export function openSettings() {
    alert("Configurações (em construção)");
}

function showMessage(msg) {
    const el = document.getElementById("feedback");

    el.innerText = msg;
    el.classList.remove("hidden");

    setTimeout(() => {
        el.classList.add("hidden");
    }, 3000);
}

// global (por causa do HTML)
window.loadHome = loadHome;
window.openSettings = openSettings;
window.goToPDV = goToPDV;