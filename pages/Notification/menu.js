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

toggleButton?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar?.getAttribute('data-open') === 'true') {
        closeSidebar();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const select = document.querySelector('.dropdown__select');
    const label = document.querySelector('.dropdown__label');
    const customUI = document.querySelector('.dropdown__custom-ui');
    const menu = document.querySelector('.dropdown__menu');
    const menuItems = document.querySelectorAll('.dropdown__item');
    
    // Обновляем кастомный label при изменении select
    select.addEventListener('change', function() {
      label.textContent = this.options[this.selectedIndex].text;
      updateSelectedItem();
    });
    
    // Показываем/скрываем кастомное меню при клике
    customUI.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('dropdown--open');
    });
    
    // Функция фильтрации уведомлений
    function filterNotifications(filterValue) {
      const notificationCards = document.querySelectorAll('.notification-card');
      
      notificationCards.forEach(card => {
        const isUnread = card.classList.contains('unread');
        
        switch(filterValue) {
          case 'all':
            card.style.display = '';
            break;
          case 'read':
            card.style.display = isUnread ? 'none' : '';
            break;
          case 'unread':
            card.style.display = isUnread ? '' : 'none';
            break;
        }
      });
    }
    
    // Обновляем выбранный элемент в меню
    function updateSelectedItem() {
      menuItems.forEach(item => {
        if (item.getAttribute('data-value') === select.value) {
          menuItems.forEach(i => i.classList.remove('dropdown__item--selected'));
          item.classList.add('dropdown__item--selected');
        }
      });
    }
    
    // Обработка выбора элементов меню
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        select.value = value;
        
        // Обновляем выбранный элемент в меню
        updateSelectedItem();
        
        // Обновляем кастомный label
        label.textContent = this.textContent;
        
        // Применяем фильтрацию
        filterNotifications(value);
        
        // Триггерим событие change
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
        
        // Закрываем меню
        dropdown.classList.remove('dropdown--open');
      });
    });
    
    // Инициализируем выбранный элемент
    updateSelectedItem();
    
    // Применяем фильтрацию при загрузке страницы
    filterNotifications(select.value);
    
    // Применяем фильтрацию при изменении select (если изменяется напрямую)
    select.addEventListener('change', function() {
      filterNotifications(this.value);
      updateSelectedItem();
    });
    
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
    
    // Скрываем нативный select
    select.style.position = 'absolute';
    select.style.opacity = '0';
    select.style.width = '0';
    select.style.height = '0';
    select.style.pointerEvents = 'none';
  });
  
  // Функция для обновления бейджа с количеством непрочитанных уведомлений
  function updateNotificationBadge() {
    const badge = document.querySelector('.header__notification-badge');
    if (!badge) return;
    
    // Подсчитываем все непрочитанные уведомления (карточки с классом unread)
    const unreadCards = document.querySelectorAll('.notification-card.unread');
    const count = unreadCards.length;
    
    // Обновляем текст бейджа
    badge.textContent = count > 0 ? count : '';
    
    // Скрываем бейдж, если нет непрочитанных уведомлений
    if (count === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }

  // Обработка закрытия карточек уведомлений
  document.addEventListener('DOMContentLoaded', function() {
    // Обновляем бейдж при загрузке страницы
    updateNotificationBadge();
    
    // Используем делегирование событий для работы с динамическими элементами
    const notificationsContainer = document.querySelector('.notifications');
    
    if (notificationsContainer) {
      notificationsContainer.addEventListener('click', function(e) {
        const closeButton = e.target.closest('.notification-card__close');
        
        if (closeButton) {
          const card = closeButton.closest('.notification-card');
          if (card) {
            // Добавляем анимацию исчезновения (опционально)
            card.style.opacity = '0';
            card.style.transform = 'translateX(100%)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            // Удаляем карточку после анимации и обновляем бейдж
            setTimeout(() => {
              card.remove();
              updateNotificationBadge();
            }, 300);
          }
        }
      });
    }
    
    // Обработка кнопки "Очистить всё"
    const clearAllButton = document.querySelector('.clear-all');
    
    if (clearAllButton) {
      clearAllButton.addEventListener('click', function() {
        const allCards = document.querySelectorAll('.notification-card');
        
        // Применяем анимацию к каждой карточке
        allCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(100%)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          }, index * 50); // Небольшая задержка для последовательного удаления
        });
        
        // Удаляем все карточки после анимации и обновляем бейдж
        setTimeout(() => {
          allCards.forEach(card => {
            card.remove();
          });
          updateNotificationBadge();
        }, allCards.length * 50 + 300); // Ждем завершения всех анимаций
      });
    }
  });

