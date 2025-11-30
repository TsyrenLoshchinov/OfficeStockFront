document.addEventListener('DOMContentLoaded', function() {
    const categoryInput = document.getElementById('category-input');
    const addButton = document.getElementById('add-button');
    
    // Функция для проверки и обновления состояния кнопки
    function updateButtonState() {
        const inputValue = categoryInput.value.trim();
        if (inputValue.length > 0) {
            addButton.disabled = false;
        } else {
            addButton.disabled = true;
        }
    }
    
    // Инициализация состояния кнопки при загрузке
    updateButtonState();
    
    // Отслеживание ввода в поле
    categoryInput.addEventListener('input', function() {
        updateButtonState();
    });
});

