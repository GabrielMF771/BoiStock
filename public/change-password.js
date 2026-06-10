 document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
 
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const msgBox = document.getElementById('msgBox');
 
            if (newPassword !== confirmPassword) {
                msgBox.textContent = 'As senhas não coincidem.';
                msgBox.style.display = 'block';
                return;
            }
 
            const token = localStorage.getItem('token');
 
            try {
                const response = await fetch('/api/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newPassword })
                });
 
                if (response.ok) {
                    alert('Senha atualizada! Faça login novamente.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    msgBox.textContent = 'Erro ao atualizar a senha.';
                    msgBox.style.display = 'block';
                }
            } catch (err) {
                msgBox.textContent = 'Erro de conexão com o servidor.';
                msgBox.style.display = 'block';
            }
        });