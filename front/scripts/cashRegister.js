import * as service from "../services/cashRegisterService.js";

let currentOpenRegisterId = null;
let adjustmentTargetId = null;

// Estado da Paginação e Filtros
let currentPage = 1;
let limit = 10;
let totalPages = 1;

let currentFilter = 'today';
let currentStartDate = '';
let currentEndDate = '';

// =======================
// TOAST
// =======================
function showMessage(message, type = "info") {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-5 right-5 space-y-2 z-50";
        document.body.appendChild(container);
    }

    const colors = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600"
    };

    const el = document.createElement("div");
    el.className = `${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg`;
    el.innerText = message;

    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// =======================
// FORMAT
// =======================
function formatDate(dateStr) {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleString("pt-BR");
}

// =======================
// LOAD & FILTERS
// =======================
export async function loadCashRegister() {
    const res = await service.getAll(currentPage, limit, currentFilter, currentStartDate, currentEndDate);

    const list = res?.data;
    const total = res?.total || 0;

    if (!Array.isArray(list)) {
        console.error("Resposta inválida da API:", res);
        showMessage("Erro ao carregar dados", "error");
        return;
    }

    // Calcula o total de páginas
    totalPages = Math.ceil(total / limit) || 1;
    updatePaginationUI();

    const open = list.find(r => r.status === "OPEN");
    currentOpenRegisterId = open?.id || null;

    renderAction(open);
    renderHistory(list);
}

window.handleFilterChange = () => {
    const filterType = document.getElementById("filter-type").value;
    const customContainer = document.getElementById("custom-date-container");

    if (filterType === 'custom') {
        customContainer.classList.remove('hidden');
    } else {
        customContainer.classList.add('hidden');
    }
};

window.applyFilter = () => {
    currentFilter = document.getElementById("filter-type").value;

    if (currentFilter === 'custom') {
        currentStartDate = document.getElementById("filter-start").value;
        currentEndDate = document.getElementById("filter-end").value;

        if (!currentStartDate || !currentEndDate) {
            return showMessage("Selecione as datas inicial e final", "error");
        }
    } else {
        currentStartDate = '';
        currentEndDate = '';
    }

    currentPage = 1;
    loadCashRegister();
};

// =======================
// PAGINATION
// =======================
window.prevPage = () => {
    if (currentPage > 1) {
        currentPage--;
        loadCashRegister();
    }
};

window.nextPage = () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadCashRegister();
    }
};

function updatePaginationUI() {
    const pageInfo = document.getElementById("page-info");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    if (pageInfo) pageInfo.innerText = `${currentPage} de ${totalPages}`;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
}

// =======================
// ACTION (ABRIR / FECHAR)
// =======================
function renderAction(open) {
    const el = document.getElementById("cashregister-action-card");
    if (!el) return;

    if (open) {
        el.innerHTML = `
            <h2 class="text-white mb-2 text-lg font-bold">🟢 Caixa Aberto</h2>
            <p class="text-gray-300">Inicial: R$ ${Number(open.initial_balance).toFixed(2)}</p>
            <input id="input-final" type="number" placeholder="Valor de fechamento" class="bg-gray-900 text-white p-3 w-full mt-3 rounded border border-gray-700">
            <button onclick="closeCashRegister()" class="bg-red-600 hover:bg-red-700 p-3 mt-3 w-full rounded font-bold text-white transition-colors">
                Fechar Caixa
            </button>
        `;
    } else {
        el.innerHTML = `
            <h2 class="text-white mb-2 text-lg font-bold">🔴 Caixa Fechado</h2>
            <input id="input-initial" type="number" placeholder="Valor inicial (R$)" class="bg-gray-900 text-white p-3 w-full mt-3 rounded border border-gray-700">
            <button onclick="openCashRegister()" class="bg-blue-600 hover:bg-blue-700 p-3 mt-3 w-full rounded font-bold text-white transition-colors">
                Abrir Caixa
            </button>
        `;
    }
}

// =======================
// HISTORY
// =======================
function renderHistory(list) {
    const el = document.getElementById("cashregister-history-list");
    if (!el) return;

    if (list.length === 0) {
        el.innerHTML = `<p class="text-gray-500 text-center py-4">Nenhum registro encontrado.</p>`;
        return;
    }

    el.innerHTML = list.map(r => {
        const adjusted = r.original_final_balance != null &&
            r.original_final_balance !== r.final_balance;

        return `
        <div class="border border-gray-700 p-4 mb-3 rounded-xl bg-gray-900">
            <div class="flex justify-between mb-2">
                <span class="text-white font-bold">Caixa #${r.id}</span>
                <span class="${r.status === 'OPEN' ? 'text-green-400' : 'text-red-400'}">
                    ${r.status === 'OPEN' ? '🟢 Aberto' : '🔴 Fechado'}
                </span>
            </div>
            <div class="text-gray-400 text-sm">Abertura: ${formatDate(r.opened_at)}</div>
            <div class="text-gray-400 text-sm mb-2">Fechamento: ${formatDate(r.closed_at)}</div>
            <div class="text-gray-400 text-sm">
                Inicial: <span class="text-white">R$ ${(Number(r.initial_balance)||0).toFixed(2)}</span>
            </div>
            <div class="text-gray-400 text-sm flex justify-between mt-1">
                <div>
                    Final:
                    <span class="${adjusted ? 'text-yellow-400' : 'text-green-400'}">
                        ${r.final_balance != null ? `R$ ${Number(r.final_balance).toFixed(2)}` : '---'}
                    </span>
                </div>
                ${r.status !== 'OPEN' ? `
                    <button onclick="openAdjustment(${r.id}, ${r.final_balance || 0})"
                            class="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 text-xs rounded text-white font-bold transition-colors">
                        Ajustar
                    </button>` : ''}
            </div>
            ${adjusted ? `
                <div class="text-xs text-yellow-400 mt-2 italic">
                    ⚠ Ajustado (antes: R$ ${Number(r.original_final_balance).toFixed(2)})
                </div>` : ''}
        </div>`;
    }).join("");
}

// =======================
// ACTIONS
// =======================
window.openCashRegister = async () => {
    const value = Number(document.getElementById("input-initial").value);
    if (!value && value !== 0) return showMessage("Valor inválido", "error");

    await service.open(value);
    showMessage("Caixa aberto com sucesso", "success");
    loadCashRegister();
};

window.closeCashRegister = async () => {
    const value = Number(document.getElementById("input-final").value);
    if (!value && value !== 0) return showMessage("Valor inválido", "error");

    const data = await service.close(currentOpenRegisterId, value);
    const diff = value - data.expectedBalance;
    showMessage(`Caixa fechado. Diferença: R$ ${diff.toFixed(2)}`, "info");

    loadCashRegister();
};

// =======================
// ADJUST
// =======================
window.openAdjustment = (id, old) => {
    adjustmentTargetId = id;
    document.getElementById("adjustment-old-value").innerText = `Valor atual: R$ ${old.toFixed(2)}`;
    document.getElementById("adjustment-modal").classList.remove("hidden");
};

window.closeAdjustmentModal = () => {
    document.getElementById("adjustment-modal").classList.add("hidden");
};

window.confirmAdjustment = async () => {
    const value = Number(document.getElementById("adjustment-input").value);
    const desc = document.getElementById("adjustment-desc").value;

    if ((!value && value !== 0) || !desc) return showMessage("Preencha todos os campos", "error");

    await service.adjust(adjustmentTargetId, value, desc);
    showMessage("Ajuste realizado com sucesso", "success");

    closeAdjustmentModal();
    loadCashRegister();
};

export async function init() {
    await loadCashRegister();
}