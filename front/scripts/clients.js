import {
    getClients,
    searchClientsRequest,
    createClientRequest,
    deleteClientRequest,
    updateClientRequest
} from "../services/clientsService.js";

// ==============================================================
// EXPOSIÇÃO GLOBAL (Início do arquivo para evitar erros de undefined)
// ==============================================================
window.handleSearchInput = handleSearchInput;
window.openCreateClient = openCreateClient;
window.closeCreateClientModal = closeCreateClientModal;
window.submitCreateClient = submitCreateClient;
window.deleteClient = deleteClient;
window.openEditClient = openEditClient;
window.closeEditClientModal = closeEditClientModal;
window.submitEditClient = submitEditClient;

const state = {
    clients: []
};

// =======================
// LOAD
// =======================
export async function load() {
    await loadClients();
}

// =======================
// LOAD CLIENTS
// =======================
async function loadClients() {
    try {
        const data = await getClients();
        state.clients = data;
        renderClientsList();
    } catch (err) {
        console.error("ERRO AO CARREGAR CLIENTES:", err);
    }
}

// =======================
// RENDER LIST
// =======================
function renderClientsList() {
    const el = document.getElementById("clientsList");
    if (!el || !state.clients) return;

    el.innerHTML = state.clients.map(c => `
        <div class="bg-gray-800 p-3 flex justify-between items-center rounded">
            <div>
                <div class="font-bold">
                    ${c.name}
                </div>
                <div class="text-sm text-gray-400">
                    CPF: ${c.cpf || 'N/A'} | Tel: ${c.phone || 'N/A'} | Limite: R$ ${c.credit_limit || 0}
                </div>
            </div>
            <div class="flex gap-2">
                <button
                    onclick="deleteClient(${c.id})"
                    class="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition-colors"
                >
                    Excluir
                </button>
                <button
                    onclick="openEditClient(${c.id})"
                    class="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
                >
                    Editar
                </button>
            </div>
        </div>
    `).join("");
}

// =======================
// SEARCH
// =======================
let searchTimeout = null;

function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchClients();
    }, 300);
}

async function searchClients() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const value = searchInput.value.trim();

    if (!value) {
        await loadClients();
        return;
    }

    try {
        const data = await searchClientsRequest(value);
        const result = Array.isArray(data) ? data : (data ? [data] : []);
        renderFilteredClients(result);
    } catch (err) {
        console.error("ERRO SEARCH:", err);
    }
}

function renderFilteredClients(clients) {
    const el = document.getElementById("clientsList");
    if (!el) return;

    if (!clients.length) {
        el.innerHTML = `<div class="text-gray-400 text-center p-4">Nenhum cliente encontrado</div>`;
        return;
    }

    el.innerHTML = clients.map(c => `
        <div class="bg-blue-900/40 border border-blue-500/50 p-3 flex justify-between items-center rounded">
            <div>
                <div class="font-bold">${c.name}</div>
                <div class="text-sm text-gray-300">CPF: ${c.cpf || 'N/A'} | Tel: ${c.phone || 'N/A'}</div>
            </div>
            <div class="flex gap-2">
                <button onclick="deleteClient(${c.id})" class="bg-red-600 px-2 py-1 rounded">Del</button>
                <button onclick="openEditClient(${c.id})" class="bg-yellow-600 px-2 py-1 rounded">Edit</button>
            </div>
        </div>
    `).join("");
}

// =======================
// CREATE
// =======================
function openCreateClient() {
    document.getElementById("createClientModal")?.classList.remove("hidden");
}

function closeCreateClientModal() {
    document.getElementById("createClientModal")?.classList.add("hidden");
    clearCreateInputs();
}

function clearCreateInputs() {
    ["cc_name", "cc_cpf", "cc_phone", "cc_credit_limit"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
}

async function submitCreateClient() {
    const payload = {
        name: document.getElementById("cc_name").value.trim(),
        cpf: document.getElementById("cc_cpf").value.trim(),
        phone: document.getElementById("cc_phone").value.trim(),
        credit_limit: Number(document.getElementById("cc_credit_limit").value || 0)
    };

    if (!payload.name) {
        alert("Nome é obrigatório");
        return;
    }

    try {
        console.log("PAYLOAD:", payload);

        const res = await createClientRequest(payload);

        if (!res.ok) {
            const errorText = await res.text();

            console.error("CREATE ERROR:", errorText);

            alert(errorText);

            return;
        }

        const data = await res.json();

        console.log("CLIENT CREATED:", data);

        alert("Cliente cadastrado!");

        closeCreateClientModal();

        await loadClients();

    } catch (err) {
        console.error("ERRO CREATE:", err);
    }
}

// =======================
// DELETE
// =======================
async function deleteClient(id) {
    if(!confirm("Deseja realmente excluir este cliente?")) return;
    
    try {
        await deleteClientRequest(id);
        await loadClients();
    } catch (err) {
        console.error("ERRO DELETE:", err);
    }
}

// =======================
// EDIT
// =======================
function openEditClient(id) {
    const c = state.clients.find(x => x.id === id);
    if (!c) return;

    document.getElementById("editClientModal")?.classList.remove("hidden");

    document.getElementById("ec_id").value = c.id;
    document.getElementById("ec_name").value = c.name || "";
    document.getElementById("ec_cpf").value = c.cpf || "";
    document.getElementById("ec_phone").value = c.phone || "";
    document.getElementById("ec_credit_limit").value = c.credit_limit ?? "";
}

function closeEditClientModal() {
    document.getElementById("editClientModal")?.classList.add("hidden");
}

async function submitEditClient() {
    const id = document.getElementById("ec_id").value;
    const payload = {
        name: document.getElementById("ec_name").value.trim() || null,
        cpf: document.getElementById("ec_cpf").value.trim() || null,
        phone: document.getElementById("ec_phone").value.trim() || null,
        credit_limit: document.getElementById("ec_credit_limit").value === "" 
            ? null 
            : Number(document.getElementById("ec_credit_limit").value)
    };

    try {
        const res = await updateClientRequest(id, payload);
        if (!res.ok) throw new Error(await res.text());

        closeEditClientModal();
        await loadClients();
    } catch (err) {
        console.error("ERRO UPDATE:", err.message);
    }
}