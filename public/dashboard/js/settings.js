// Verifica token e cargo
const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

// Decodifica o Token JWT para saber quem está logado
const payload = JSON.parse(atob(token.split('.')[1]));
if (payload.role !== 'gerente') {
    alert('Acesso restrito a gerentes.');
    window.location.href = '/dashboard/products.html'; // Chuta o operador pros produtos
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    
    // Carrega os valores já salvos ou define os padrões atuais do sistema
    document.getElementById('cfg-critical').value = localStorage.getItem('cfg_critical_limit') || 3;
    document.getElementById('cfg-low').value = localStorage.getItem('cfg_low_limit') || 10;
    document.getElementById('cfg-refresh').value = localStorage.getItem('cfg_refresh_time') || 0;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const criticalValue = document.getElementById('cfg-critical').value;
        const lowValue = document.getElementById('cfg-low').value;
        const refreshValue = document.getElementById('cfg-refresh').value;

        // Validação simples para evitar que o crítico seja maior que o estoque baixo
        if (Number(criticalValue) >= Number(lowValue)) {
            if (typeof criarToast === 'function') {
                criarToast('⚠️ O limite crítico deve ser menor que o estoque baixo.', 'error');
            } else {
                alert('O limite crítico deve ser menor que o estoque baixo.');
            }
            return;
        }

        // Salva os dados localmente no navegador
        localStorage.setItem('cfg_critical_limit', criticalValue);
        localStorage.setItem('cfg_low_limit', lowValue);
        localStorage.setItem('cfg_refresh_time', refreshValue);

        if (typeof criarToast === 'function') {
            criarToast('⚙️ Configurações aplicadas com sucesso!', 'success');
        } else {
            alert('Configurações aplicadas com sucesso!');
        }
    });
});

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        tempPassword: document.getElementById('newUserTempPass').value,
        role: document.getElementById('newUserRole').value
    };

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Usuário criado! Entregue a senha temporária a ele.');
        e.target.reset();
    } else {
        const error = await response.json();
        alert(error.error);
    }
});