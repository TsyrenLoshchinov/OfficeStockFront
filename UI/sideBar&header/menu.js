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

