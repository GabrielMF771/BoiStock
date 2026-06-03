const urlSegments = window.location.pathname.split('/');
const productId = urlSegments[urlSegments.length - 1];

const editProductForm = document.getElementById("edit-product-form");

if (productId && !isNaN(productId)) {
    carregarDadosDoProduto(productId);
} else {
    window.location.href = '/dashboard/products?notif=error';
}

if (editProductForm) {
    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;

        fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, quantity })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error); });
                }
                return res.json();
            })
            .then(resposta => {
                window.location.href = '/dashboard/products?notif=edit';
            })
            .catch(error => {
                console.error('Erro ao atualizar produto:', error);
                if (typeof criarToast === 'function') {
                    criarToast(error.message || 'Erro ao salvar alterações.', 'error');
                } else {
                    alert(error.message || 'Erro ao salvar alterações.');
                }
            });
    });
}

function carregarDadosDoProduto(id) {
    fetch(`/api/products/${id}`)
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