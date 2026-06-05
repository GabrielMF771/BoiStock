document.addEventListener('DOMContentLoaded', () =>{
    const loginForm = document.getElementById('login-form')
    const errorMessage = document.getElementById('error-message')

    login.Form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if(data.sucess) {
                // vai guardar a chave do JWT e a funçao do usuario
                localStorage.setItem('boistock_token', data.data.token)
                localStorage.setItem('boistock_role', data.data.role)

                //redireciona para a dashboard
                window.location.href = '/dashboard/products'
            } else {
                errorMsg.textContent = data.error
                errorMsg.style.display = 'block'
            }
        } catch (error) {
            console.error('Erro de conexão:', error)
            errorMsg.textContent = 'Erro ao conectar com o servidor'
            errorMsg.style.display = 'block'
        }
    })
})