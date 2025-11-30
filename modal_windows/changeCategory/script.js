document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const dropdownList = document.getElementById('dropdown-list');
    const dropdownItems = dropdownList.querySelectorAll('.dropdown-list__item');
    const selectButton = document.getElementById('select-button');
    
    // Функция для проверки и обновления состояния кнопки
    function updateButtonState() {
        const searchValue = searchInput.value.trim();
        if (searchValue.length > 0) {
            selectButton.disabled = false;
        } else {
            selectButton.disabled = true;
        }
    }
    
    // Инициализация состояния кнопки при загрузке
    updateButtonState();
    
    // Данные для поиска (можно заменить на реальные данные)
    const allItems = Array.from(dropdownItems).map(item => item.textContent.trim());
    
    // Показываем/скрываем выпадающий список при вводе
    searchInput.addEventListener('input', function() {
        const searchValue = this.value.trim().toLowerCase();
        
        // Обновляем состояние кнопки
        updateButtonState();
        
        if (searchValue.length > 0) {
            // Фильтруем элементы
            filterItems(searchValue);
            dropdownList.classList.add('dropdown-list--visible');
        } else {
            // Показываем все элементы, если поле пустое
            showAllItems();
            // Не скрываем список, если поле в фокусе
            if (document.activeElement === searchInput) {
                dropdownList.classList.add('dropdown-list--visible');
            }
        }
    });
    
    // Показываем список при фокусе (всегда, даже если поле пустое)
    searchInput.addEventListener('focus', function() {
        showAllItems();
        dropdownList.classList.add('dropdown-list--visible');
    });
    
    // Скрываем список при потере фокуса
    searchInput.addEventListener('blur', function() {
        // Небольшая задержка, чтобы клик по элементу успел сработать
        setTimeout(() => {
            dropdownList.classList.remove('dropdown-list--visible');
        }, 200);
    });
    
    // Функция фильтрации элементов
    function filterItems(searchValue) {
        dropdownItems.forEach((item, index) => {
            const itemText = item.textContent.trim().toLowerCase();
            if (itemText.includes(searchValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Функция показа всех элементов
    function showAllItems() {
        dropdownItems.forEach(item => {
            item.style.display = 'block';
        });
    }
    
    // Обработка выбора элемента из списка
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            searchInput.value = this.textContent.trim();
            dropdownList.classList.remove('dropdown-list--visible');
            searchInput.focus();
            // Обновляем состояние кнопки после выбора
            updateButtonState();
        });
        
        // Подсветка при наведении
        item.addEventListener('mouseenter', function() {
            // Убираем выделение со всех элементов
            dropdownItems.forEach(i => i.classList.remove('dropdown-list__item--selected'));
            // Добавляем выделение текущему элементу
            this.classList.add('dropdown-list__item--selected');
        });
    });
    
    // Навигация с клавиатуры
    let selectedIndex = -1;
    
    searchInput.addEventListener('keydown', function(e) {
        const visibleItems = Array.from(dropdownItems).filter(item => 
            item.style.display !== 'none'
        );
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (visibleItems.length > 0) {
                selectedIndex = (selectedIndex + 1) % visibleItems.length;
                updateSelection(visibleItems);
                dropdownList.classList.add('dropdown-list--visible');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (visibleItems.length > 0) {
                selectedIndex = selectedIndex <= 0 ? visibleItems.length - 1 : selectedIndex - 1;
                updateSelection(visibleItems);
                dropdownList.classList.add('dropdown-list--visible');
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && visibleItems[selectedIndex]) {
                searchInput.value = visibleItems[selectedIndex].textContent.trim();
                dropdownList.classList.remove('dropdown-list--visible');
                selectedIndex = -1;
                // Обновляем состояние кнопки после выбора
                updateButtonState();
            }
        } else if (e.key === 'Escape') {
            dropdownList.classList.remove('dropdown-list--visible');
            selectedIndex = -1;
        }
    });
    
    function updateSelection(visibleItems) {
        dropdownItems.forEach(item => item.classList.remove('dropdown-list__item--selected'));
        if (selectedIndex >= 0 && visibleItems[selectedIndex]) {
            visibleItems[selectedIndex].classList.add('dropdown-list__item--selected');
            // Прокручиваем к выбранному элементу
            visibleItems[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    // Сброс выбранного индекса при вводе
    searchInput.addEventListener('input', function() {
        selectedIndex = -1;
    });
});

