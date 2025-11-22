document.addEventListener('DOMContentLoaded', function() {
    const details = document.querySelector('.language-switcher__details');
    const currentLang = document.querySelector('.language-switcher__current .language-switcher__code');
    const optionButton = document.querySelector('.language-switcher__option');
    const optionLang = document.querySelector('.language-switcher__code--option');
    
    if (!details || !currentLang || !optionButton || !optionLang) {
        return;
    }
    
    function updateLanguageOptions() {
        const currentLangCode = currentLang.textContent.trim();
        const availableLang = currentLangCode === 'RU' ? 'EN' : 'RU';
        
        // Обновляем кнопку в выпадающем списке
        optionButton.setAttribute('data-lang', availableLang);
        optionLang.textContent = availableLang;
    }
    
    // Инициализируем список языков
    updateLanguageOptions();
    
    optionButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const selectedLang = this.getAttribute('data-lang');
        if (selectedLang && selectedLang !== currentLang.textContent.trim()) {
            // Обновляем текущий язык
            currentLang.textContent = selectedLang;
            // Обновляем список доступных языков
            updateLanguageOptions();
            // Закрываем меню
            details.removeAttribute('open');
        }
    });
});

