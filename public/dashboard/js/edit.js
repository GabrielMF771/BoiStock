const urlSegments = window.location.pathname.split('/');
const productId = urlSegments[urlSegments.length - 1];
const editToken = localStorage.getItem('boistock_token');
const editRole = localStorage.getItem('boistock_role');

const editProductForm = document.getElementById("edit-product-form");

// Esconde Dashboard e Configurações da sidebar pro operador
document.addEventListener('DOMContentLoaded', () => {
    if (editRole === 'operador') {
        const linkDashboard = document.getElementById('link-dashboard');
        const linkSettings = document.getElementById('link-settings');
        if (linkDashboard) linkDashboard.style.display = 'none';
        if (linkSettings) linkSettings.style.display = 'none';

        // Deixa nome, descrição e preço somente leitura
        document.getElementById('name').readOnly = true;
        document.getElementById('description').readOnly = true;
        document.getElementById('price').readOnly = true;
    }
});

if (productId && !isNaN(productId)) {
    carregarDadosDoProduto(productId);
} else {
    window.location.href = '/dashboard/products?notif=error';
}

if (editProductForm) {
    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Operador só envia quantidade, gerente envia tudo
        let body;
        if (editRole === 'operador') {
            body = { quantity: document.getElementById('quantity').value };
        } else {
            body = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                quantity: document.getElementById('quantity').value
            };
        }

        fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${editToken}`
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error); });
                }
                return res.json();
            })
            .then(() => {
                window.location.href = '/dashboard/products?notif=edit';
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
                alert(error.message || 'Erro ao salvar alterações.');
            });
    });
}

function carregarDadosDoProduto(id) {
    fetch(`/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${editToken}` }
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error); });
            }
            return res.json();
        })
        .then(resposta => {
            const produto = resposta.data;

            if (!produto) {
                window.location.href = '/dashboard/products?notif=not_found';
                return;
            }

            document.getElementById('name').value = produto.name || '';
            document.getElementById('description').value = produto.description || '';
            document.getElementById('price').value = produto.price || '';
            document.getElementById('quantity').value = produto.quantity || '';
        })
        .catch(error => {
            console.error('Erro ao buscar dados do produto:', error);
            window.location.href = '/dashboard/products?notif=not_found';
        });
}