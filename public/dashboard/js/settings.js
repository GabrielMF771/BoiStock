// Verifica token e cargo
const settingsToken = localStorage.getItem('boistock_token');
if (!settingsToken) window.location.href = '/login';

// Decodifica o Token JWT para saber quem está logado
const settingsPayload = JSON.parse(atob(settingsToken.split('.')[1]));
if (settingsPayload.role !== 'gerente') {
    alert('Acesso restrito a gerentes.');
    window.location.href = '/dashboard/products';
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    
    document.getElementById('cfg-critical').value = localStorage.getItem('cfg_critical_limit') || 3;
    document.getElementById('cfg-low').value = localStorage.getItem('cfg_low_limit') || 10;
    document.getElementById('cfg-refresh').value = localStorage.getItem('cfg_refresh_time') || 0;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const criticalValue = document.getElementById('cfg-critical').value;
        const lowValue = document.getElementById('cfg-low').value;
        const refreshValue = document.getElementById('cfg-refresh').value;

        if (Number(criticalValue) >= Number(lowValue)) {
            criarToast('⚠️ O limite crítico deve ser menor que o estoque baixo.', 'error');
            return;
        }

        localStorage.setItem('cfg_critical_limit', criticalValue);
        localStorage.setItem('cfg_low_limit', lowValue);
        localStorage.setItem('cfg_refresh_time', refreshValue);
        criarToast('⚙️ Configurações aplicadas com sucesso!', 'success');
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
                'Authorization': `Bearer ${settingsToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            criarToast('✅ Usuário criado! Entregue a senha temporária a ele.', 'success');
            e.target.reset();
        } else {
            const error = await response.json();
            criarToast(error.error || 'Erro ao cadastrar usuário.', 'error');
        }
    });
});