import { getClientsData } from '../services/clientsService.js';
export function openCreateClientModal() {
    document
        .getElementById('createClientModal')
        .classList
        .remove('hidden');
}

export function closeCreateClientModal() {
    document
        .getElementById('createClientModal')
        .classList
        .add('hidden');
}

export function submitCreateClient() {

    const name = document.getElementById('cc_name').value.trim();
    const phone = document.getElementById('cc_phone').value.trim();
    const cpf = document.getElementById('cc_cpf').value.trim();

    const credit_limit = Number(
        document.getElementById('cc_credit_limit').value
    ) || 0;

    if (!name || !phone) {
        alert('Preencha nome e telefone');
        return;
    }

    const newClient = {
        id: Date.now(),
        name,
        phone,
        cpf: cpf || null,
        credit_limit,
        debt: 0
    };

    clients.unshift(newClient);

    filteredClients = [...clients];

    renderClients();
    updateKPIs();

    closeCreateClientModal();

    clearCreateClientForm();
}

function clearCreateClientForm() {

    document.getElementById('cc_name').value = '';
    document.getElementById('cc_phone').value = '';
    document.getElementById('cc_cpf').value = '';
    document.getElementById('cc_credit_limit').value = '';
}

function formatCurrency(value) {

    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

export function viewClient(id) {
    alert(`Cliente ID: ${id}`);
}

window.filterClients = filterClients;
window.openCreateClientModal = openCreateClientModal;
window.closeCreateClientModal = closeCreateClientMod