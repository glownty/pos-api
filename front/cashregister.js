// =======================
// UI PADRÃO (CAIXA)
// =======================
const UI_CR = {
    card: "bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col",
    input: "bg-gray-900 border border-gray-700 text-white rounded-xl p-4 w-full focus:ring-2 focus:ring-blue-500 outline-none",
    buttonPrimary: "bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl font-bold text-white w-full",
    buttonDanger: "bg-red-600 hover:bg-red-500 p-4 rounded-2xl font-bold text-white w-full"
};

let currentOpenRegisterId = null;

// =======================
// ALERT BONITO
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
// FORMAT DATE
// =======================
function formatDate(dateStr) {
    if (!dateStr) return "---";
    const d = new Date(dateStr);
    return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// =======================
// VIEW
// =======================
function renderCashRegisterView() {
    return `
        <div class="max-w-5xl mx-auto space-y-6 p-4">

            <!-- HEADER -->
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-white">Caixa</h1>
                <button onclick="navigate('home')">🏠</button>
            </div>

            <!-- RESUMO -->
            <div class="grid grid-cols-3 gap-4">
                <div class="${UI_CR.card} text-center">
                    <div class="text-gray-400 text-sm">Hoje</div>
                    <div class="text-white font-bold">R$ --</div>
                </div>
                <div class="${UI_CR.card} text-center">
                    <div class="text-gray-400 text-sm">Entradas</div>
                    <div class="text-green-400 font-bold">R$ --</div>
                </div>
                <div class="${UI_CR.card} text-center">
                    <div class="text-gray-400 text-sm">Saídas</div>
                    <div class="text-red-400 font-bold">R$ --</div>
                </div>
            </div>

            <!-- FILTRO -->
            <div class="flex gap-2">
                <button onclick="notImplemented()" class="bg-gray-700 px-3 py-1 rounded">Hoje</button>
                <button onclick="notImplemented()" class="bg-gray-700 px-3 py-1 rounded">Semana</button>
                <button onclick="notImplemented()" class="bg-gray-700 px-3 py-1 rounded">Mês</button>
            </div>

            <!-- MAIN -->
            <div class="space-y-6">

    <div id="cashregister-action-card" class="${UI_CR.card}"></div>

    <div class="${UI_CR.card}">
        <h2 class="mb-4 text-lg font-semibold">🧾 Histórico</h2>
        <div id="cashregister-history-list"></div>
    </div>

</div>
        </div>
    `;
}

// =======================
// LOAD
// =======================
async function loadCashRegister() {
    await fetchAndRenderRegisters();
}

// =======================
// FETCH
// =======================
async function fetchAndRenderRegisters() {
    try {
        const response = await fetch(`${BASE_URL}/cashregister`, {
            headers: headers()
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        const openRegister = data.find(r => r.status === "OPEN");
        currentOpenRegisterId = openRegister?.id || null;

        renderActionCard(openRegister);
        renderHistoryList(data);

    } catch (err) {
        showMessage(err.message, "error");
    }
}

// =======================
// ACTION CARD
// =======================
function renderActionCard(openRegister) {
    const el = document.getElementById("cashregister-action-card");

    if (openRegister) {
        el.innerHTML = `
            <h2 class="text-white mb-2">🟢 Caixa Aberto</h2>

            <p class="text-gray-400">Inicial:</p>
            <p class="text-white font-bold mb-4">R$ ${(Number(openRegister.initial_balance) || 0).toFixed(2)}</p>

            <input id="input-final-balance" type="number" placeholder="Saldo final" class="${UI_CR.input}">

            <button onclick="closeCashRegister()" class="${UI_CR.buttonDanger} mt-4">
                Fechar Caixa
            </button>
        `;
    } else {
        el.innerHTML = `
            <h2 class="text-white mb-2">🔴 Caixa Fechado</h2>

            <input id="input-initial-balance" type="number" placeholder="Saldo inicial" class="${UI_CR.input}">

            <button onclick="openCashRegister()" class="${UI_CR.buttonPrimary} mt-4">
                Abrir Caixa
            </button>
        `;
    }
}

// =======================
// HISTORY
// =======================
function renderHistoryList(registers) {
    const el = document.getElementById("cashregister-history-list");

    el.innerHTML = registers.map(r => `
        <div class="border border-gray-700 p-4 mb-3 rounded-xl bg-gray-900">

            <div class="flex justify-between mb-2">
                <span class="text-white font-bold">Caixa #${r.id}</span>
                <span class="${r.status === 'OPEN' ? 'text-green-400' : 'text-red-400'}">
                    ${r.status === 'OPEN' ? '🟢 Aberto' : '🔴 Fechado'}
                </span>
            </div>

            <div class="text-gray-400 text-sm">
                Abertura: ${formatDate(r.opened_at)}
            </div>

            <div class="text-gray-400 text-sm mb-2">
                Fechamento: ${formatDate(r.closed_at)}
            </div>

            <div class="text-gray-400 text-sm">
                Inicial: <span class="text-white">R$ ${(Number(r.initial_balance) || 0).toFixed(2)}</span>
            </div>

            <div class="text-gray-400 text-sm">
                Final: ${
        r.final_balance != null
            ? `<span class="text-green-400">R$ ${Number(r.final_balance).toFixed(2)}</span>`
            : '<span class="text-gray-500">---</span>'
    }
            </div>

        </div>
    `).join('');
}

// =======================
// OPEN
// =======================
async function openCashRegister() {
    const value = parseFloat(document.getElementById('input-initial-balance').value);

    if (isNaN(value)) return showMessage("Valor inicial inválido", "error");

    try {
        const response = await fetch(`${BASE_URL}/cashregister/open`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ initialBalance: value })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        showMessage("Caixa aberto com sucesso", "success");
        await fetchAndRenderRegisters();

    } catch (err) {
        showMessage(err.message, "error");
    }
}

// =======================
// CLOSE
// =======================
async function closeCashRegister() {
    const value = parseFloat(document.getElementById('input-final-balance').value);

    if (isNaN(value)) return showMessage("Valor final inválido", "error");

    try {
        const response = await fetch(`${BASE_URL}/cashregister/${currentOpenRegisterId}`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ finalBalance: value })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const diff = value - data.expectedBalance;

        showMessage(
            `Fechado. Diferença: R$ ${diff.toFixed(2)}`,
            Math.abs(diff) < 0.01 ? "success" : "error"
        );

        await fetchAndRenderRegisters();

    } catch (err) {
        showMessage(err.message, "error");
    }
}

// =======================
// NÃO IMPLEMENTADO
// =======================
function notImplemented() {
    showMessage("Função ainda não implementada", "info");
}

// =======================
// EXPORTS
// =======================
window.renderCashRegisterView = renderCashRegisterView;
window.loadCashRegister = loadCashRegister;
window.openCashRegister = openCashRegister;
window.closeCashRegister = closeCashRegister;