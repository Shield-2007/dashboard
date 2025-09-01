// Ключ для отслеживания изменений
const DATA_VERSION_KEY = 'board_data_version';
let currentDataVersion = 0;

// Функция для загрузки данных из localStorage
function loadData() {
    // Загрузка данных отдела
    const deptData = JSON.parse(localStorage.getItem('departmentData')) || {
        title: "Отдел СПиСИ",
        subtitle1: "Специальная проверка технических средств",
        subtitle2: "Текущий статус работ",
        logoText: "Логотип отдела",
        statusText: "Работы выполняются в штатном режиме",
        logoUrl: "logo.png"
    };
    
    document.getElementById('dept-title').textContent = deptData.title;
    document.getElementById('dept-subtitle1').textContent = deptData.subtitle1;
    document.getElementById('dept-subtitle2').textContent = deptData.subtitle2;
    document.getElementById('logo-text').textContent = deptData.logoText;
    document.getElementById('dept-status').textContent = deptData.statusText;
    document.getElementById('logo-img').src = deptData.logoUrl;
    
    // Загрузка работ
    const worksData = JSON.parse(localStorage.getItem('worksData')) || {
        sp: [
            { id: "SP-2023-101", customer: "ОАО 'РосТехСистемы'", date: "12.05.2023" },
            { id: "SP-2023-102", customer: "ЗАО 'ИнфоТех'", date: "15.05.2023" }
        ],
        doksp: [
            { id: "DSP-2023-201", customer: "ПАО 'ГлобалСвязь'", date: "10.05.2023" },
            { id: "DSP-2023-202", customer: "ООО 'КиберБезопасность'", date: "18.05.2023" }
        ],
        doksi: [
            { id: "DSI-2023-301", customer: "АО 'Научные Решения'", date: "20.05.2023" },
            { id: "DSI-2023-302", customer: "ООО 'Цифровые Технологии'", date: "22.05.2023" }
        ]
    };
    
    renderWorks(worksData);
}

// Функция для отображения работ
function renderWorks(data) {
    renderBlock('sp', data.sp, 'status-sp');
    renderBlock('doksp', data.doksp, 'status-doksp');
    renderBlock('doksi', data.doksi, 'status-doksi');
}

function renderBlock(blockId, works, statusClass) {
    const container = document.getElementById(blockId);
    container.innerHTML = '';
    
    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'order-card';
        workElement.innerHTML = `
            <div class="order-id">
                <span class="status-indicator ${statusClass}"></span>
                Работа №${work.id}
            </div>
            <div class="order-items">${work.customer}</div>
            <div class="order-time">Создана: ${work.date}</div>
        `;
        container.appendChild(workElement);
    });
}

// Функция проверки обновлений
function checkForUpdates() {
    const newDataVersion = localStorage.getItem(DATA_VERSION_KEY) || 0;
    
    if (newDataVersion !== currentDataVersion) {
        currentDataVersion = newDataVersion;
        loadData();
        console.log('Данные обновлены!');
    }
}

// Запуск загрузки данных при загрузке страницы
window.onload = function() {
    loadData();
    
    // Установим текущую версию данных
    currentDataVersion = localStorage.getItem(DATA_VERSION_KEY) || 0;
    
    // Проверяем обновления каждые 2 секунды
    setInterval(checkForUpdates, 2000);
};

// Обработчик сообщений от админ-панели
window.addEventListener('message', function(event) {
    if (event.data === 'data_updated') {
        loadData();
    }
});
