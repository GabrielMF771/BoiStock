const productsList = document.getElementById("products-list");
const addProductForm = document.getElementById("add-product-form");
const token = localStorage.getItem('boistock_token');
const userRole = localStorage.getItem('boistock_role');

//Bloquear o frint-end
if(!token) window.location.href = '/login';

document.addEventListener('DOMContentLoaded', () => {
    if (userRole === 'operador') {
        //Remove o botão de adicionar
        const addBtn = document.querySelector('.add-product-btn')
        if (addBtn) addBtn.remove()

            //esconde o menu e as configuraçoes da sidebar
            document.querySelector('a[href="/dashboard"]').style.display = 'none'
            document.querySelector('a[href="/dashboard/settings"]').style.display = 'none'
    }
})

if (productsList) {
    loadProducts();
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, price, quantity })
        })
            .then(res => {
                if (!res.ok) {
                    // Se o back-end rejeitar (status 400, por exemplo), captura o erro dele
                    return res.json().then(err => { throw new Error(err.error); });
                }
                return res.json();
            })
            .then(resposta => {
                // Cadastro com sucesso redireciona para a listagem
                window.location.href = '/dashboard/products?notif=add';
            })
            .catch(error => {
                console.error('Erro ao adicionar produto:', error);
                criarToast(error.message || 'Erro ao tentar cadastrar o produto.', 'error');
            });
    });
}

function loadProducts() {
    fetch('/api/products', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => { throw new Error(err.error); });
            }
            return res.json();
        })
        .then(resposta => {
            const products = resposta.data;
            
            productsList.innerHTML = '';
            
            if (!products || !Array.isArray(products)) return;

            products.forEach(product => {
                const productItem = document.createElement('li');
                
                let botoesHtml = `<button class="btn edit-btn" onclick="editProduct(${product.id})">✎ Editar</button>`;

                if (userRole === 'gerente') {
                    botoesHtml += `<button class="btn delete-btn" onclick="deleteProduct(${product.id})">✖ Excluir</button>`;
                }

                productItem.innerHTML = `
                    <div class="product-info">
                        <strong>${product.name}</strong>
                        <p>${product.description || 'Sem descrição'}</p>
                        <div class="product-badges">
                            <span class="badge badge-price">R$ ${Number(product.price).toFixed(2).replace('.', ',')}</span>
                            <span class="badge">Estoque: ${product.quantity} unid.</span>
                        </div>
                    </div>
                    <div class="actions">
                        ${botoesHtml}
                    </div>
                `;
                productsList.appendChild(productItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            criarToast('Não foi possível carregar a listagem de produtos.', 'error');
        });
}

let idProdutoParaDeletar = null;

function deleteProduct(id) {
    idProdutoParaDeletar = id;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

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
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) {
                        // Captura erros como 404 (não encontrado) ou 500 (banco)
                        return res.json().then(err => { throw new Error(err.error); });
                    }
                    return res.json();
                })
                .then(resposta => {
                    modal.classList.remove('show');
                    idProdutoParaDeletar = null;

                    // Usa a mensagem de sucesso que veio direto do servidor
                    criarToast(`✖ ${resposta.data.message}`, 'success');

                    loadProducts();
                })
                .catch(error => {
                    console.error('Erro ao deletar produto:', error);
                    modal.classList.remove('show');
                    criarToast(error.message || 'Erro ao tentar excluir o produto.', 'error');
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