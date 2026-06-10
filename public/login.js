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
            localStorage.setItem('boistock_token', data.token);
            localStorage.setItem('boistock_role', data.role);

            if (data.isTempPassword) {
                window.location.href = '/change-password';
                return;
            }

            if (data.role === 'gerente') {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/dashboard/products';
            }
        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = data.error || 'Erro ao fazer login';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão com o servidor.');
    }
});