// =======================
// UI PADRÃO (PREMIUM)
// =======================
const UI = {
    card: "bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-gray-600 flex flex-col",
    title: "text-lg font-semibold mb-4 text-gray-200",
    kpiValue: "text-4xl font-extrabold mt-2 text-white tracking-tight",
    buttonPrimary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 p-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group",
    buttonSecondary: "bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 p-5 rounded-2xl text-left group transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-4",
    buttonDanger: "text-red-400 hover:text-white bg-transparent hover:bg-red-600 px-6 py-2 rounded-xl transition-all duration-300 font-medium border border-red-900/50 hover:border-red-600"
};

// =======================
// VIEW
// =======================
function renderHomeView() {
    return `
        <div class="max-w-5xl mx-auto space-y-8 p-4">

            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p class="text-gray-400 text-sm mt-1">Visão geral do sistema</p>
                </div>
                <button onclick="logout()"
    class="bg-gray-800 p-2 rounded-full border border-gray-700 shadow-sm 
           hover:bg-red-600 hover:border-red-500 transition-all duration-300 group">

    <div class="bg-gray-700 group-hover:bg-red-500 
                w-10 h-10 rounded-full flex items-center justify-center text-xl 
                transition-all duration-300">
        🚪
    </div>
</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div class="${UI.card}">
                    <div class="text-gray-400 text-sm font-medium uppercase tracking-wider">Receita de Hoje</div>
                    <div class="${UI.kpiValue}">R$ 0,00</div>
                </div>

                <div class="${UI.card}">
                    <div class="text-gray-400 text-sm font-medium uppercase tracking-wider">Ticket Médio</div>
                    <div class="${UI.kpiValue}">R$ 0,00</div>
                </div>

            </div>

            <div>
                <button onclick="navigate('pdv')" class="${UI.buttonPrimary} w-full">
                    <span class="text-2xl group-hover:scale-110 transition-transform duration-300">🛒</span>
                    Abrir PDV
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                <button onclick="navigate('products')" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        📦
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Produtos</div>
                        <div class="text-xs text-gray-400 mt-0.5">Gerenciar catálogo</div>
                    </div>
                </button>

                <button onclick="navigate('sales')" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        💰
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Vendas</div>
                        <div class="text-xs text-gray-400 mt-0.5">Histórico de vendas</div>
                    </div>
                </button>

                <button onclick="navigate('clients')" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        👤
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Clientes</div>
                        <div class="text-xs text-gray-400 mt-0.5">Base de clientes</div>
                    </div>
                </button>

                <button onclick="navigate('cashregister')" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        🧾
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Caixa</div>
                        <div class="text-xs text-gray-400 mt-0.5">Controle de caixa</div>
                    </div>
                </button>

                <button onclick="navigate('statistics')" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        📊
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Estatísticas</div>
                        <div class="text-xs text-gray-400 mt-0.5">Relatórios e métricas</div>
                    </div>
                </button>

                <button onclick="openSettings()" class="${UI.buttonSecondary}">
                    <div class="bg-gray-700/50 p-3 rounded-xl group-hover:bg-gray-600 group-hover:scale-110 transition-all duration-300 text-xl shadow-inner border border-gray-600/30">
                        ⚙️
                    </div>
                    <div>
                        <div class="font-semibold text-gray-100 text-lg">Configurações</div>
                        <div class="text-xs text-gray-400 mt-0.5">Preferências do sistema</div>
                    </div>
                </button>

            </div>

            <div class="flex justify-end pt-4 border-t border-gray-800">
                <button onclick="logout()" class="${UI.buttonDanger}">
                    Sair
                </button>
            </div>

        </div>
    `;
}

// =======================
// LOAD
// =======================
function loadHome() {
    console.log("Home carregada com estilo! ✨");
}

// =======================
// SETTINGS
// =======================
function openSettings() {
    alert("Configurações (em construção)");
}

// =======================
// EXPORT
// =======================
window.renderHomeView = renderHomeView;
window.loadHome = loadHome;
window.openSettings = openSettings;