const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const fileInfo = document.getElementById('file-info');

// Обработчик клика на кнопку загрузки
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

// Обработчик выбора файла
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (file) {
        // Проверка формата файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
        
        if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
            alert('Недопустимый формат файла. Разрешены только: JPG, JPEG, PNG, PDF');
            fileInput.value = '';
            return;
        }
        
        // Проверка размера файла (10 МБ = 10 * 1024 * 1024 байт)
        const maxSize = 10 * 1024 * 1024; // 10 МБ в байтах
        if (file.size > maxSize) {
            alert('Размер файла превышает 10 МБ. Пожалуйста, выберите файл меньшего размера.');
            fileInput.value = '';
            return;
        }
        
        // Отображение информации о файле
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.style.display = 'block';
        fileInfo.innerHTML = `
            <div style="margin-top: 10px; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 4px;">
                <strong>Выбранный файл:</strong> ${file.name}<br>
                <strong>Размер:</strong> ${fileSizeMB} МБ<br>
                <strong>Тип:</strong> ${file.type || fileExtension.toUpperCase()}
            </div>
        `;
        
        // Здесь можно добавить логику для отправки файла на сервер
        console.log('Файл выбран:', file);
        
        // Пример отправки на сервер (раскомментируйте при необходимости):
        // uploadFile(file);
    }
});

// Функция для отправки файла на сервер (пример)
function uploadFile(file) {
    const formData = new FormData();
    formData.append('receipt', file);
    
    // Пример использования fetch API
    /*
    fetch('/api/upload-receipt', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Файл успешно загружен:', data);
        alert('Файл успешно загружен!');
    })
    .catch(error => {
        console.error('Ошибка при загрузке файла:', error);
        alert('Ошибка при загрузке файла. Попробуйте еще раз.');
    });
    */
}

