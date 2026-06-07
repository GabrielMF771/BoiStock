// Verifica token e cargo
const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// Decodifica o Token JWT para saber quem está logado
const payload = JSON.parse(atob(token.split('.')[1]));
if (payload.role !== 'gerente') {
    alert('Acesso restrito a gerentes.');
    window.location.href = '/dashboard/products.html'; // Chuta o operador pros produtos
}

async function carregarDashboard() {
    try {
        const response = await fetch('/api/products');

        if (!response.ok) {
            throw new Error('Erro ao carregar dados do servidor');
        }

        const resposta = await response.json();
        
        // Extrai o array de produtos envelopado pelo back-end
        const produtos = resposta.data;

        // Evita erros de execução caso o banco de dados venha vazio ou nulo
        if (!produtos || !Array.isArray(produtos)) return;

        atualizarCards(produtos);
        atualizarDisponibilidade(produtos);
        atualizarAtividades(produtos);

    } catch (erro) {
        console.error('Erro na sincronização do painel:', erro);
    }
}

function atualizarCards(produtos) {
    const totalProdutos = produtos.length;
    const limiteEstoqueBaixo = Number(localStorage.getItem('cfg_low_limit')) || 10;
    const limiteCritico = Number(localStorage.getItem('cfg_critical_limit')) || 3;

    const estoqueBaixo = produtos.filter(
        produto => Number(produto.quantity) <= limiteEstoqueBaixo
    ).length;

    const criticos = produtos.filter(
        produto => Number(produto.quantity) <= limiteCritico
    );

    document.getElementById('total-products').textContent = totalProdutos;
    document.getElementById('low-stock').textContent = estoqueBaixo;
    document.getElementById('critical-stock').textContent = criticos.length;

    const listaCriticos = document.getElementById('critical-products');
    if (listaCriticos) {
        listaCriticos.innerHTML = '';

        if (criticos.length > 0) {
            criticos.forEach(produto => {
                const li = document.createElement('li');
                li.textContent = `${produto.name} - (${produto.quantity} un.)`;
                listaCriticos.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhum produto crítico';
            listaCriticos.appendChild(li);
        }
    }

    const valorEstoque = produtos.reduce(
        (total, produto) => total + (Number(produto.price) * Number(produto.quantity)),
        0
    );

    document.getElementById('stock-value').textContent = valorEstoque.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function atualizarDisponibilidade(produtos) {
    const produtosDisponiveis = produtos.filter(
        produto => Number(produto.quantity) > 0
    ).length;

    const percentual = produtos.length === 0
        ? 0
        : Math.round((produtosDisponiveis / produtos.length) * 100);

    const circulo = document.querySelector('.progress-circle');
    const span = document.querySelector('.progress-circle span');

    if (span) span.textContent = percentual + '%';
    if (circulo) circulo.style.setProperty('--percentual', percentual + '%');
}

function atualizarAtividades(produtos) {
    const lista = document.getElementById('activity-list');
    if (!lista) return;

    lista.innerHTML = '';
    const limiteEstoqueBaixo = Number(localStorage.getItem('cfg_low_limit')) || 10;

    produtos
        .slice(-5)
        .reverse()
        .forEach(produto => {
            const li = document.createElement('li');

            if (Number(produto.quantity) <= limiteEstoqueBaixo) {
                li.innerHTML = `⚠️ ${produto.name} com estoque baixo (${produto.quantity} unidades)`;
            } else {
                li.innerHTML = `📦 ${produto.name} - ${produto.quantity} unidades`;
            }

            lista.appendChild(li);
        });
}

document.addEventListener('DOMContentLoaded', carregarDashboard);

const tempoAtualizacao = Number(localStorage.getItem('cfg_refresh_time')) || 0;
if (tempoAtualizacao > 0) {
    setInterval(carregarDashboard, tempoAtualizacao);
}