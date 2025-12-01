const sidebar = document.querySelector('.sidebar');
const toggleButton = document.querySelector('.menu-button');
const overlay = document.querySelector('.app__overlay');
const panel = document.getElementById('sidebar-panel');

const setButtonState = (isActive) => {
    toggleButton?.setAttribute('aria-pressed', String(isActive));
    if (!toggleButton) {
        return;
    }

    if (isActive) {
        toggleButton.classList.remove('menu-button--default');
        toggleButton.classList.add('menu-button--active');
    } else {
        toggleButton.classList.remove('menu-button--active');
        toggleButton.classList.add('menu-button--default');
    }
};

const openSidebar = () => {
    sidebar?.setAttribute('data-open', 'true');
    panel?.setAttribute('aria-hidden', 'false');
    overlay?.setAttribute('data-visible', 'true');
    document.body.style.overflow = 'hidden';
    setButtonState(true);
};

const closeSidebar = () => {
    sidebar?.setAttribute('data-open', 'false');
    panel?.setAttribute('aria-hidden', 'true');
    overlay?.setAttribute('data-visible', 'false');
    document.body.style.overflow = '';
    setButtonState(false);
};

const toggleSidebar = () => {
    const isOpen = sidebar?.getAttribute('data-open') === 'true';
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
};

// Функция для извлечения даты из заголовка карточки
function extractDateFromTitle(titleElement) {
    const titleText = titleElement.textContent;
    // Ищем дату в формате DD.MM.YYYY
    const dateMatch = titleText.match(/(\d{2}\.\d{2}\.\d{4})/);
    if (dateMatch) {
        const [day, month, year] = dateMatch[0].split('.').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date();
}

// Функция сортировки чеков
function sortChecks(order) {
    const checksContainer = document.querySelector('.checks');
    if (!checksContainer) return;
    
    const checkCards = Array.from(checksContainer.querySelectorAll('.check-card'));
    
    checkCards.sort((a, b) => {
        const titleA = a.querySelector('.check-card-title');
        const titleB = b.querySelector('.check-card-title');
        
        if (!titleA || !titleB) return 0;
        
        const dateA = extractDateFromTitle(titleA);
        const dateB = extractDateFromTitle(titleB);
        
        if (order === 'new-first') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });
    
    checksContainer.innerHTML = '';
    checkCards.forEach(card => checksContainer.appendChild(card));
}

// Функция для удаления одной карточки
function removeCheckCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateX(100%)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        card.remove();
    }, 300);
}

// Функция для очистки всех чеков
function clearAllChecks() {
    const allCards = document.querySelectorAll('.check-card');
    
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(100%)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, index * 50);
    });
    
    setTimeout(() => {
        allCards.forEach(card => card.remove());
    }, allCards.length * 50 + 300);
}

// ЕДИНСТВЕННЫЙ обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация сайдбара
    toggleButton?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar?.getAttribute('data-open') === 'true') {
            closeSidebar();
        }
    });

    // Инициализация работы с чеками
    const checksContainer = document.querySelector('.checks');
    const clearAllButton = document.querySelector('.clear-all');
    const dropdownSelect = document.querySelector('.dropdown__select');
    
    // Обработка клика на крестик
    if (checksContainer) {
        checksContainer.addEventListener('click', function(e) {
            const closeButton = e.target.closest('.cross');
            
            if (closeButton) {
                const card = closeButton.closest('.check-card');
                if (card) {
                    removeCheckCard(card);
                }
            }
        });
    }
    
    // Обработка кнопки "Очистить всё"
    if (clearAllButton) {
        clearAllButton.addEventListener('click', clearAllChecks);
    }
    
    // Инициализация dropdown
    const dropdown = document.querySelector('.dropdown');
    const label = document.querySelector('.dropdown__label');
    const customUI = document.querySelector('.dropdown__custom-ui');
    const menuItems = document.querySelectorAll('.dropdown__item');

    if (dropdown && dropdownSelect && label && customUI) {
        // Обновляем кастомный label при изменении select
        dropdownSelect.addEventListener('change', function() {
            label.textContent = this.options[this.selectedIndex].text;
            updateSelectedItem();
            
            // Применяем сортировку
            const sortOrder = this.value === 'all' ? 'new-first' : 'old-first';
            sortChecks(sortOrder);
        });
        
        // Показываем/скрываем кастомное меню при клике
        customUI.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('dropdown--open');
        });
        
        // Обновляем выбранный элемент в меню
        function updateSelectedItem() {
            menuItems.forEach(item => {
                if (item.getAttribute('data-value') === dropdownSelect.value) {
                    menuItems.forEach(i => i.classList.remove('dropdown__item--selected'));
                    item.classList.add('dropdown__item--selected');
                }
            });
        }
        
        // Обработка выбора элементов меню
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                dropdownSelect.value = value;
                
                // Обновляем выбранный элемент в меню
                updateSelectedItem();
                
                // Обновляем кастомный label
                label.textContent = this.textContent;
                
                // Применяем сортировку
                const sortOrder = value === 'all' ? 'new-first' : 'old-first';
                sortChecks(sortOrder);
                
                // Триггерим событие change
                const event = new Event('change', { bubbles: true });
                dropdownSelect.dispatchEvent(event);
                
                // Закрываем меню
                dropdown.classList.remove('dropdown--open');
            });
        });
        
        // Инициализируем выбранный элемент
        updateSelectedItem();
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('dropdown--open');
            }
        });
        
        // Закрываем меню по Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdown.classList.contains('dropdown--open')) {
                dropdown.classList.remove('dropdown--open');
            }
        });
        
        // Скрываем нативный select (если нужно)
        dropdownSelect.style.position = 'absolute';
        dropdownSelect.style.opacity = '0';
        dropdownSelect.style.width = '0';
        dropdownSelect.style.height = '0';
        dropdownSelect.style.pointerEvents = 'none';
        
        // Инициализируем сортировку при загрузке
        setTimeout(() => {
            const initialSortOrder = dropdownSelect.value === 'all' ? 'new-first' : 'old-first';
            sortChecks(initialSortOrder);
        }, 100);
    }
});