const temaSalvo = localStorage.getItem('boi_theme');
if (temaSalvo === 'dark') {
    document.documentElement.classList.add('dark-theme');
} else {
    document.documentElement.classList.remove('dark-theme');
}

document.addEventListener('DOMContentLoaded', () => {
    const botaoTema = document.getElementById('theme-toggle');

    if (botaoTema) {
        botaoTema.addEventListener('click', () => {
            // Ativa o modo de transição sincronizada global
            document.documentElement.classList.add('theme-transition');
            
            const estaNoModoEscuro = document.documentElement.classList.contains('dark-theme');
            
            if (estaNoModoEscuro) {
                document.documentElement.classList.remove('dark-theme');
                localStorage.setItem('boi_theme', 'light');
            } else {
                document.documentElement.classList.add('dark-theme');
                localStorage.setItem('boi_theme', 'dark');
            }

            // Remove a classe de transição após o efeito terminar (300 milissegundos)
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
            }, 300);
        });
    }
});