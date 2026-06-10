document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('boistock_token')
    localStorage.removeItem('boistock_role')
    window.location.href = '/'
})