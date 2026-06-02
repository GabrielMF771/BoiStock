// Pega o ID da URL
const urlSegments = window.location.pathname.split('/');
const productId = urlSegments[urlSegments.length - 1];

const editForm = document.getElementById('edit-product-form');

// Se acessar sem ID, volta para a lista com aviso de erro
if (!productId) {
    window.location.href = '/dashboard/products?notif=error';
}

// Busca os dados atuais do produto e preenche o formulário
fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        if(product.error) {
            window.location.href = '/dashboard/products?notif=not_found';
            return;
        }
        document.getElementById('name').value = product.name;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
    })
    .catch(error => console.error('Erro ao buscar os dados do produto:', error));

// Envia os dados atualizados com o PATCH
editForm.addEventListener('submit', (e) => {
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
    .then(res => res.json())
    .then(data => {
        // ESSA LINHA FOI CORRIGIDA: Remove o alert e envia o parâmetro de notificação
        window.location.href = '/dashboard/products?notif=edit'; 
    })
    .catch(error => console.error('Erro ao editar produto:', error));
});