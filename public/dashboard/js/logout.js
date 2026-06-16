const btnLogout = document.getElementById('btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('boistock_token');
        localStorage.removeItem('boistock_role');
        window.location.href = '/';
    });
}