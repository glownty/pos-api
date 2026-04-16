const BASE_URL = 'http://localhost:3000';

// Estado global da aplicação
let token = localStorage.getItem('token');
let isLoginMode = true;
let products = [];
let sales = [];
let cart = [];

// ==========================================
// UTILITÁRIOS
// ==========================================
const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    // Importante: conforme definido, envia apenas o token puro, sem 'Bearer'
    if (token) headers['Authorization'] = token;
    return headers;
};

// Gerenciador de navegação simples
const views = ['productsView', 'pdvView', 'salesView'];
function navigate(viewId) {
    views.forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');

    // Atualiza os dados dependendo da tela acessada
    if(viewId === 'productsView') loadProducts();
    if(viewId === 'pdvView') loadProductsForPDV();
    if(viewId === 'salesView') loadSales();
}

// ==========================================
// INICIALIZAÇÃO & AUTENTICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();

    // Toggle Login/Register
    document.getElementById('toggleAuth').addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        document.getElementById('authTitle').innerText = isLoginMode ? 'Login do PDV' : 'Registrar Novo Usuário';
        document.getElementById('authBtn').innerText = isLoginMode ? 'Entrar' : 'Registrar';
        document.getElementById('toggleAuth').innerText = isLoginMode ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login';
    });

    // Form Submit Auth
    document.getElementById('authForm').addEventListener('submit', handleAuth);

    // Form Submit Products
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
});

function checkAuthStatus() {
    if (token) {
        document.getElementById('authView').classList.add('hidden');
        document.getElementById('appView').classList.remove('hidden');
        navigate('pdvView'); // Tela inicial após logar
    } else {
        document.getElementById('appView').classList.add('hidden');
        document.getElementById('authView').classList.remove('hidden');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (isLoginMode) {
            if (data.token) {
                token = data.token;
                localStorage.setItem('token', token);
                checkAuthStatus();
            } else {
                alert('Credenciais inválidas!');
            }
        } else {
            alert('Registrado com sucesso! Agora faça login.');
            document.getElementById('toggleAuth').click(); // Volta pro login
        }
    } catch (error) {
        console.error("Erro na auth:", error);
        alert('Erro ao conectar com o servidor.');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('token');
    cart = [];
    document.getElementById('authForm').reset();
    checkAuthStatus();
}

// ==========================================
// MÓDULO: PRODUTOS (CRUD)
// ==========================================
async function loadProducts() {
    try {
        const res = await fetch(`${BASE_URL}/products`, { headers: getHeaders() });
        products = await res.json();
        renderProductsTable();
    } catch (error) {
        console.error("Erro ao buscar produtos", error);
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 border-b";
        tr.innerHTML = `
            <td class="p-3">${p.name}</td>
            <td class="p-3">${p.barcode || '-'}</td>
            <td class="p-3">R$ ${Number(p.price).toFixed(2)}</td>
            <td class="p-3">${p.stock}</td>
            <td class="p-3 space-x-2">
                <button onclick="editProduct(${p.id})" class="text-blue-600 hover:underline">Editar</button>
                <button onclick="deleteProduct(${p.id})" class="text-red-600 hover:underline">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('prodId').value;

    const payload = {
        name: document.getElementById('prodName').value,
        barcode: document.getElementById('prodBarcode').value,
        price: Number(document.getElementById('prodPrice').value),
        cost: 0, // Simplificado, ajuste se necessário
        stock: Number(document.getElementById('prodStock').value),
        categoryId: 1,
        isActive: true
    };

    try {
        if (id) {
            payload.id = Number(id); // Para o PUT
            await fetch(`${BASE_URL}/products`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        } else {
            await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
        }
        resetProductForm();
        loadProducts();
    } catch (error) {
        alert("Erro ao salvar produto.");
    }
}

function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodBarcode').value = p.barcode;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodStock').value = p.stock;

    document.getElementById('prodSubmitBtn').innerText = 'Atualizar Produto';
    document.getElementById('prodCancelBtn').classList.remove('hidden');
}

function resetProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('prodSubmitBtn').innerText = 'Adicionar Produto';
    document.getElementById('prodCancelBtn').classList.add('hidden');
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
        // Conforme sua doc, o DELETE products exige o body { id }
        await fetch(`${BASE_URL}/products`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ id })
        });
        loadProducts();
    } catch (error) {
        alert("Erro ao deletar produto.");
    }
}

// ==========================================
// MÓDULO: PDV & VENDAS
// ==========================================
async function loadProductsForPDV() {
    try {
        const res = await fetch(`${BASE_URL}/products`, { headers: getHeaders() });
        products = await res.json();
        renderPDVProducts();
    } catch (error) {}
}

function renderPDVProducts() {
    const list = document.getElementById('pdvProductsList');
    list.innerHTML = '';

    products.forEach(p => {
        const div = document.createElement('div');
        div.className = "p-4 bg-white border rounded shadow cursor-pointer hover:bg-blue-50 transition";
        div.onclick = () => addToCart(p);
        div.innerHTML = `
            <p class="font-bold text-gray-800">${p.name}</p>
            <p class="text-blue-600 font-semibold">R$ ${Number(p.price).toFixed(2)}</p>
            <p class="text-sm text-gray-500">Estq: ${p.stock}</p>
        `;
        list.appendChild(div);
    });
}

function addToCart(product) {
    if (product.stock <= 0) return alert('Produto sem estoque!');

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) return alert('Limite de estoque atingido!');
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = "flex justify-between items-center mb-2 p-3 bg-gray-50 rounded border";
        div.innerHTML = `
            <div>
                <span class="font-bold">${item.quantity}x</span> ${item.name}
            </div>
            <div class="flex items-center space-x-4">
                <span class="font-semibold text-gray-700">R$ ${itemTotal.toFixed(2)}</span>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 font-bold hover:bg-red-100 px-2 rounded">X</button>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById('cartSubtotal').innerText = subtotal.toFixed(2);
    document.getElementById('cartTotal').innerText = subtotal.toFixed(2); // Desconto pode ser add futuramente
}

async function checkout() {
    if (cart.length === 0) return alert('O carrinho está vazio!');

    const totalStr = document.getElementById('cartTotal').innerText;
    const total = parseFloat(totalStr);

    const payload = {
        subtotal: total,
        discount: 0,
        total: total,
        paymentMethod: 'PIX',
        status: 'PAID',
        products: cart.map(item => ({ id: item.id, quantity: item.quantity }))
    };

    try {
        await fetch(`${BASE_URL}/sales`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
        });

        alert('Venda finalizada com sucesso!');
        cart = [];
        updateCartUI();
        navigate('salesView'); // Redireciona para o histórico
    } catch (error) {
        alert("Erro ao finalizar venda.");
    }
}

// ==========================================
// MÓDULO: HISTÓRICO DE VENDAS
// ==========================================
async function loadSales() {
    try {
        const res = await fetch(`${BASE_URL}/sales`, { headers: getHeaders() });
        sales = await res.json();
        renderSalesTable();
    } catch (error) {
        console.error("Erro ao carregar vendas", error);
    }
}

function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">Nenhuma venda registrada.</td></tr>`;
        return;
    }

    sales.forEach(s => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 border-b";
        tr.innerHTML = `
            <td class="p-3 font-mono text-sm">#${s.id}</td>
            <td class="p-3 font-semibold text-green-700">R$ ${Number(s.total).toFixed(2)}</td>
            <td class="p-3">${s.paymentMethod}</td>
            <td class="p-3">
                <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">${s.status}</span>
            </td>
            <td class="p-3">
                <button onclick="deleteSale(${s.id})" class="text-red-600 hover:underline">Cancelar/Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteSale(id) {
    if (!confirm(`Deseja realmente cancelar a venda #${id}?`)) return;

    try {
        await fetch(`${BASE_URL}/sales/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        loadSales(); // Recarrega a tabela
    } catch (error) {
        alert("Erro ao excluir venda.");
    }
}