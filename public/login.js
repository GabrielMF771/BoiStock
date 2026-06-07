document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token
            localStorage.setItem('token', data.token);

            // Verifica se a senha é temporária
            if (data.isTempPassword) {
                alert('Você está usando uma senha temporária. Por favor, crie uma nova senha.');
                window.location.href = '/change-password.html';
                return;
            }

            // Redirecionamento com base no cargo
            if (data.role === 'gerente') {
                window.location.href = '/dashboard/dashboard.html';
            } else {
                // Operador vai direto para a aba de produtos
                window.location.href = '/dashboard/products.html';
            }
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor.');
    }
});