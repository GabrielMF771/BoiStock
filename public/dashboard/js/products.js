const productsList = document.getElementById("products-list");
const addProductForm = document.getElementById("add-product-form");

if (productsList) {
    loadProducts();
    // Executa a verificação de mensagens na URL sempre que a listagem carregar
    verificarNotificacoes();
}

if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;

        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, quantity })
        })
            .then(res => res.json())
            .then(data => {
                // Redireciona passando o parâmetro de cadastro feito com sucesso
                window.location.href = '/dashboard/products?notif=add';
            })
            .catch(error => console.error('Erro ao adicionar produto:', error));
    });
}

function loadProducts() {
    fetch('/api/products')
        .then(res => res.json())
        .then(products => {
            productsList.innerHTML = '';
            products.forEach(product => {
                const productItem = document.createElement('li');
                productItem.innerHTML = `
                    <div class="product-info">
                        <strong>${product.name}</strong>
                        <p>${product.description}</p>
                        <div class="product-badges">
                            <span class="badge badge-price">R$ ${Number(product.price).toFixed(2).replace('.', ',')}</span>
                            <span class="badge">Estoque: ${product.quantity} unid.</span>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btn edit-btn" onclick="editProduct(${product.id})">✎ Editar</button>
                        <button class="btn delete-btn" onclick="deleteProduct(${product.id})">✖ Excluir</button>
                    </div>
                `;
                productsList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}


let idProdutoParaDeletar = null;

function deleteProduct(id) {
    // Guarda o ID do produto selecionado
    idProdutoParaDeletar = id;

    // Abre a janela modal adicionando a classe "show"
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Modal para deletar
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('delete-modal');
    const btnCancelar = document.getElementById('btn-cancel-delete');
    const btnConfirmar = document.getElementById('btn-confirm-delete');

    if (btnCancelar && modal) {
        btnCancelar.addEventListener('click', () => {
            modal.classList.remove('show');
            idProdutoParaDeletar = null;
        });
    }

    if (btnConfirmar && modal) {
        btnConfirmar.addEventListener('click', () => {
            if (!idProdutoParaDeletar) return;

            fetch(`/api/products/${idProdutoParaDeletar}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    // Fecha a modal
                    modal.classList.remove('show');
                    idProdutoParaDeletar = null;

                    criarToast('❌ Produto removido do inventário.', 'success');

                    loadProducts();
                })
                .catch(error => {
                    console.error('Erro ao deletar produto:', error);
                    modal.classList.remove('show');
                    criarToast('Erro ao tentar excluir o produto.', 'error');
                });
        });
    }
});

function editProduct(id) {
    window.location.href = `/dashboard/products/edit/${id}`;
}

function verificarNotificacoes() {
    const params = new URLSearchParams(window.location.search);
    const acao = params.get('notif');

    if (!acao) return;

    if (acao === 'add') {
        criarToast('✅ Produto cadastrado com sucesso!', 'success');
    } else if (acao === 'edit') {
        criarToast('💾 Alterações salvas com sucesso!', 'success');
    } else if (acao === 'not_found' || acao === 'error') {
        criarToast('⚠️ Ocorreu um erro ou o produto não existe.', 'error');
    }

    // Limpa a URL para o aviso não reaparecer se o usuário atualizar a página (F5)
    window.history.replaceState({}, document.title, window.location.pathname);
}

function criarToast(mensagem, tipo) {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${tipo}`;
    toast.textContent = mensagem;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}