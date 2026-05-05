import { getHomeData } from "../services/homeService";
import { ensureCashRegisterOpen } from "../../middlewares/ensureCashRegisterOpen";

export function loadHome() {
    console.log("Home carregada ✨");

    const data = getHomeData();

    document.getElementById("receitaHoje").innerText = data.receitaHoje;
    document.getElementById("ticketMedio").innerText = data.ticketMedio;
}

// 🔥 aqui está o controle real
export function goToPDV() {
    const allowed = ensureCashRegisterOpen();

    if (!allowed) return;

    navigate("pdv");
}

export function openSettings() {
    alert("Configurações (em construção)");
}

// global (por causa do HTML)
window.loadHome = loadHome;
window.openSettings = openSettings;
window.goToPDV = goToPDV;