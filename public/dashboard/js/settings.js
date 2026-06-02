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