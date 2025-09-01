// Ключ для отслеживания изменений
const DATA_VERSION_KEY = 'board_data_version';

// Загрузка данных при открытии админки
document.addEventListener('DOMContentLoaded', () => {
    loadDepartmentData();
    loadWorksData();
    setupEventListeners();
});

// Загрузка данных отдела
function loadDepartmentData() {
    const deptData = JSON.parse(localStorage.getItem('departmentData')) || {
        title: "ОТДЕЛ СПИСИ",
        subtitle1: "Системы поддержки и сопровождения информации",
        subtitle2: "Текущий статус работ",
        logoText: "Логотип отдела",
        statusText: "Работы выполняются в штатном режиме",
        logoUrl: "logo.png"
    };
    
    document.getElementById('dept-title').value = deptData.title;
    document.getElementById('dept-subtitle1').value = deptData.subtitle1;
    document.getElementById('dept-subtitle2').value = deptData.subtitle2;
    document.getElementById('dept-status').value = deptData.statusText;
    document.getElementById('logo-text').value = deptData.logoText;
    document.getElementById('logo-url').value = deptData.logoUrl;
    document.getElementById('logo-preview').src = deptData.logoUrl;
}

// Загрузка данных работ
function loadWorksData() {
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
    
    renderWorkList('sp', worksData.sp);
    renderWorkList('doksp', worksData.doksp);
    renderWorkList('doksi', worksData.doksi);
}

// Отображение списка работ
function renderWorkList(type, works) {
    const container = document.getElementById(`${type}-list`);
    container.innerHTML = '';
    
    works.forEach((work, index) => {
        const workItem = document.createElement('div');
        workItem.className = 'work-item';
        workItem.innerHTML = `
            <div class="work-header">
                <div class="work-id">
                    <span class="status-indicator status-${type}"></span>
                    ${work.id}
                </div>
                <div class="work-date">${work.date}</div>
            </div>
            <div class="work-customer">${work.customer}</div>
            <div class="btn-group">
                <button class="btn-edit" data-type="${type}" data-index="${index}">Изменить</button>
                <button class="btn-delete" data-type="${type}" data-index="${index}">Удалить</button>
            </div>
        `;
        container.appendChild(workItem);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки добавления работ
    document.getElementById('add-sp').addEventListener('click', () => addWork('sp'));
    document.getElementById('add-doksp').addEventListener('click', () => addWork('doksp'));
    document.getElementById('add-doksi').addEventListener('click', () => addWork('doksi'));
    
    // Предпросмотр логотипа
    document.getElementById('logo-url').addEventListener('input', function() {
        document.getElementById('logo-preview').src = this.value;
    });
    
    // Сохранение данных
    document.getElementById('save-all').addEventListener('click', saveAllData);
    
    // Возврат на табло
    document.getElementById('back-to-board').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Обработчики для динамических кнопок
    document.addEventListener('click', function(e) {
        // Удаление работы
        if (e.target.classList.contains('btn-delete')) {
            const type = e.target.dataset.type;
            const index = parseInt(e.target.dataset.index);
            deleteWork(type, index);
        }
        
        // Редактирование работы
        if (e.target.classList.contains('btn-edit')) {
            const type = e.target.dataset.type;
            const index = parseInt(e.target.dataset.index);
            editWork(type, index);
        }
    });
}

// Добавление новой работы
function addWork(type) {
    const id = document.getElementById(`${type}-id`).value;
    const customer = document.getElementById(`${type}-customer`).value;
    const date = document.getElementById(`${type}-date`).value;
    
    if (!id || !customer || !date) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    
    const worksData = JSON.parse(localStorage.getItem('worksData')) || { sp: [], doksp: [], doksi: [] };
    worksData[type].push({ id, customer, date });
    localStorage.setItem('worksData', JSON.stringify(worksData));
    
    // Обновление списка
    renderWorkList(type, worksData[type]);
    
    // Очистка полей
    document.getElementById(`${type}-id`).value = '';
    document.getElementById(`${type}-customer`).value = '';
    document.getElementById(`${type}-date`).value = '';
}

// Удаление работы
function deleteWork(type, index) {
    const worksData = JSON.parse(localStorage.getItem('worksData'));
    if (worksData && worksData[type] && worksData[type][index]) {
        worksData[type].splice(index, 1);
        localStorage.setItem('worksData', JSON.stringify(worksData));
        renderWorkList(type, worksData[type]);
    }
}

// Редактирование работы
function editWork(type, index) {
    const worksData = JSON.parse(localStorage.getItem('worksData'));
    if (worksData && worksData[type] && worksData[type][index]) {
        const work = worksData[type][index];
        
        // Заполнение формы для редактирования
        document.getElementById(`${type}-id`).value = work.id;
        document.getElementById(`${type}-customer`).value = work.customer;
        document.getElementById(`${type}-date`).value = work.date;
        
        // Удаление старой записи
        worksData[type].splice(index, 1);
        localStorage.setItem('worksData', JSON.stringify(worksData));
        
        // Обновление списка
        renderWorkList(type, worksData[type]);
    }
}

// Сохранение всех данных
function saveAllData() {
    // Сохранение данных отдела
    const deptData = {
        title: document.getElementById('dept-title').value,
        subtitle1: document.getElementById('dept-subtitle1').value,
        subtitle2: document.getElementById('dept-subtitle2').value,
        statusText: document.getElementById('dept-status').value,
        logoText: document.getElementById('logo-text').value,
        logoUrl: document.getElementById('logo-url').value
    };
    
    localStorage.setItem('departmentData', JSON.stringify(deptData));
    
    // Увеличиваем версию данных для оповещения об изменении
    const currentVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || 0);
    localStorage.setItem(DATA_VERSION_KEY, currentVersion + 1);
    
    alert('Все изменения сохранены!');
    window.location.href = 'index.html';
}
