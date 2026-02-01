// Конфигурация переводчика
const TRANSLATOR = {
    // Используем публичные прокси для обхода CORS
    PROXY_URLS: [
        'https://api.allorigins.win/raw?url=',  // Публичный прокси
        'https://corsproxy.io/?',               // Альтернативный прокси
        'https://api.codetabs.com/v1/proxy?quest='  // Резервный прокси
    ],
    
    // Публичные API Google Translate (могут меняться)
    TRANSLATE_API: 'https://translate.googleapis.com/translate_a/single',
    
    // Список языков
    LANGUAGES: [
        { code: 'auto', name: 'Автоопределение' },
        { code: 'ru', name: 'Русский', native: 'Русский' },
        { code: 'en', name: 'Английский', native: 'English' },
        { code: 'es', name: 'Испанский', native: 'Español' },
        { code: 'fr', name: 'Французский', native: 'Français' },
        { code: 'de', name: 'Немецкий', native: 'Deutsch' },
        { code: 'it', name: 'Итальянский', native: 'Italiano' },
        { code: 'pt', name: 'Португальский', native: 'Português' },
        { code: 'ja', name: 'Японский', native: '日本語' },
        { code: 'ko', name: 'Корейский', native: '한국어' },
        { code: 'zh-CN', name: 'Китайский', native: '中文' },
        { code: 'ar', name: 'Арабский', native: 'العربية' },
        { code: 'hi', name: 'Хинди', native: 'हिन्दी' },
        { code: 'tr', name: 'Турецкий', native: 'Türkçe' },
        { code: 'pl', name: 'Польский', native: 'Polski' },
        { code: 'nl', name: 'Голландский', native: 'Nederlands' },
        { code: 'sv', name: 'Шведский', native: 'Svenska' },
        { code: 'fi', name: 'Финский', native: 'Suomi' },
        { code: 'da', name: 'Датский', native: 'Dansk' },
        { code: 'no', name: 'Норвежский', native: 'Norsk' },
        { code: 'uk', name: 'Украинский', native: 'Українська' },
        { code: 'be', name: 'Белорусский', native: 'Беларуская' },
        { code: 'bg', name: 'Болгарский', native: 'Български' },
        { code: 'cs', name: 'Чешский', native: 'Čeština' },
        { code: 'el', name: 'Греческий', native: 'Ελληνικά' },
        { code: 'hu', name: 'Венгерский', native: 'Magyar' },
        { code: 'ro', name: 'Румынский', native: 'Română' },
        { code: 'sk', name: 'Словацкий', native: 'Slovenčina' },
        { code: 'sl', name: 'Словенский', native: 'Slovenščina' },
        { code: 'sr', name: 'Сербский', native: 'Српски' },
        { code: 'hr', name: 'Хорватский', native: 'Hrvatski' },
        { code: 'bs', name: 'Боснийский', native: 'Bosanski' },
        { code: 'mk', name: 'Македонский', native: 'Македонски' },
        { code: 'sq', name: 'Албанский', native: 'Shqip' },
        { code: 'et', name: 'Эстонский', native: 'Eesti' },
        { code: 'lv', name: 'Латышский', native: 'Latviešu' },
        { code: 'lt', name: 'Литовский', native: 'Lietuvių' },
        { code: 'mt', name: 'Мальтийский', native: 'Malti' },
        { code: 'ga', name: 'Ирландский', native: 'Gaeilge' },
        { code: 'cy', name: 'Валлийский', native: 'Cymraeg' },
        { code: 'is', name: 'Исландский', native: 'Íslenska' },
        { code: 'vi', name: 'Вьетнамский', native: 'Tiếng Việt' },
        { code: 'th', name: 'Тайский', native: 'ไทย' },
        { code: 'id', name: 'Индонезийский', native: 'Bahasa Indonesia' },
        { code: 'ms', name: 'Малайский', native: 'Bahasa Melayu' },
        { code: 'fil', name: 'Филиппинский', native: 'Filipino' }
    ],
    
    // Текущий прокси
    currentProxyIndex: 0
};

// DOM элементы
const elements = {
    inputText: document.getElementById('inputText'),
    outputText: document.getElementById('outputText'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    swapBtn: document.getElementById('swapBtn'),
    translateBtn: document.getElementById('translateBtn'),
    charCount: document.getElementById('charCount'),
    detectedLang: document.getElementById('detectedLang'),
    speakOutput: document.getElementById('speakOutput'),
    copyOutput: document.getElementById('copyOutput')
};

// Инициализация
function init() {
    populateLanguageSelects();
    setupEventListeners();
    loadFromLocalStorage();
}

// Заполнение выпадающих списков языков
function populateLanguageSelects() {
    const sourceSelect = elements.sourceLang;
    const targetSelect = elements.targetLang;
    
    // Очищаем списки
    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    
    // Заполняем списки
    TRANSLATOR.LANGUAGES.forEach(lang => {
        const sourceOption = document.createElement('option');
        sourceOption.value = lang.code;
        sourceOption.textContent = lang.name;
        if (lang.code === 'auto') sourceOption.selected = true;
        sourceSelect.appendChild(sourceOption);
        
        if (lang.code !== 'auto') {
            const targetOption = document.createElement('option');
            targetOption.value = lang.code;
            targetOption.textContent = lang.name;
            if (lang.code === 'ru') targetOption.selected = true;
            targetSelect.appendChild(targetOption);
        }
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Перевод по клику
    elements.translateBtn.addEventListener('click', translateText);
    
    // Перевод по Enter (Ctrl+Enter)
    elements.inputText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            translateText();
        }
    });
    
    // Счетчик символов
    elements.inputText.addEventListener('input', updateCharCount);
    
    // Смена языков местами
    elements.swapBtn.addEventListener('click', swapLanguages);
    
    // Прослушивание перевода
    elements.speakOutput.addEventListener('click', speakTranslation);
    
    // Копирование перевода
    elements.copyOutput.addEventListener('click', copyTranslation);
    
    // Автосохранение в localStorage
    elements.inputText.addEventListener('input', debounce(saveToLocalStorage, 1000));
}

// Функция перевода
async function translateText() {
    const text = elements.inputText.value.trim();
    const sourceLang = elements.sourceLang.value;
    const targetLang = elements.targetLang.value;
    
    if (!text) {
        showNotification('Введите текст для перевода', 'error');
        return;
    }
    
    if (text.length > 5000) {
        showNotification('Текст слишком длинный (максимум 5000 символов)', 'error');
        return;
    }
    
    // Показываем индикатор загрузки
    elements.translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Перевод...';
    elements.translateBtn.disabled = true;
    
    try {
        // Пробуем разные методы перевода
        let translatedText = await tryTranslateMethods(text, sourceLang, targetLang);
        
        // Если перевод успешен
        elements.outputText.innerHTML = `<p>${translatedText}</p>`;
        
        // Если язык был определен автоматически
        if (sourceLang === 'auto') {
            const detected = await detectLanguage(text);
            if (detected) {
                const langInfo = TRANSLATOR.LANGUAGES.find(l => l.code === detected);
                elements.detectedLang.textContent = `Определен: ${langInfo?.name || detected}`;
                elements.detectedLang.style.display = 'inline-block';
            }
        } else {
            elements.detectedLang.style.display = 'none';
        }
        
        showNotification('Перевод выполнен успешно!', 'success');
        
        // Сохраняем историю
        saveToHistory(text, translatedText, sourceLang, targetLang);
        
    } catch (error) {
        console.error('Translation error:', error);
        elements.outputText.innerHTML = `
            <p style="color: #e53e3e;">
                <i class="fas fa-exclamation-triangle"></i> 
                Ошибка перевода. Попробуйте снова.
            </p>
            <p style="font-size: 0.9rem; color: #718096;">
                ${error.message || 'Проверьте соединение с интернетом'}
            </p>
        `;
        showNotification('Ошибка при переводе', 'error');
    } finally {
        // Восстанавливаем кнопку
        elements.translateBtn.innerHTML = '<i class="fas fa-language"></i> Перевести';
        elements.translateBtn.disabled = false;
    }
}

// Пробуем разные методы перевода
async function tryTranslateMethods(text, sourceLang, targetLang) {
    const methods = [
        translateWithGoogleAPI,
        translateWithPublicProxy
    ];
    
    for (let i = 0; i < methods.length; i++) {
        try {
            const result = await methods[i](text, sourceLang, targetLang);
            if (result) return result;
        } catch (error) {
            console.log(`Method ${i} failed:`, error.message);
        }
    }
    
    throw new Error('Все методы перевода недоступны');
}

// Метод 1: Прямой запрос к Google Translate API
async function translateWithGoogleAPI(text, sourceLang, targetLang) {
    const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang === 'auto' ? '' : sourceLang,
        tl: targetLang,
        dt: 't',
        q: text
    });
    
    const url = `${TRANSLATOR.TRANSLATE_API}?${params}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Google API недоступен');
        
        const data = await response.json();
        
        // Google API возвращает массив массивов
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0].map(item => item[0]).join(' ');
        }
        throw new Error('Неверный формат ответа');
    } catch (error) {
        throw error;
    }
}

// Метод 2: Через публичный прокси
async function translateWithPublicProxy(text, sourceLang, targetLang) {
    const proxyUrl = TRANSLATOR.PROXY_URLS[TRANSLATOR.currentProxyIndex];
    const params = new URLSearchParams({
        client: 'gtx',
        sl: sourceLang === 'auto' ? '' : sourceLang,
        tl: targetLang,
        dt: 't',
        q: text
    });
    
    const googleUrl = `${TRANSLATOR.TRANSLATE_API}?${params}`;
    const url = proxyUrl + encodeURIComponent(googleUrl);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Пробуем следующий прокси
            TRANSLATOR.currentProxyIndex = 
                (TRANSLATOR.currentProxyIndex + 1) % TRANSLATOR.PROXY_URLS.length;
            throw new Error('Прокси недоступен');
        }
        
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0].map(item => item[0]).join(' ');
        }
        throw new Error('Неверный формат ответа');
    } catch (error) {
        throw error;
    }
}

// Определение языка текста
async function detectLanguage(text) {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text.slice(0, 100))}`
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data[2] || null; // Google API возвращает код языка в этом поле
    } catch (error) {
        return null;
    }
}

// Вспомогательные функции
function updateCharCount() {
    const count = elements.inputText.value.length;
    elements.charCount.textContent = count;
    
    if (count > 4500) {
        elements.charCount.style.color = '#e53e3e';
    } else if (count > 4000) {
        elements.charCount.style.color = '#ed8936';
    } else {
        elements.charCount.style.color = '#718096';
    }
}

function swapLanguages() {
    const source = elements.sourceLang;
    const target = elements.targetLang;
    
    // Не меняем, если source = auto
    if (source.value === 'auto') {
        showNotification('Нельзя поменять автоопределение', 'warning');
        return;
    }
    
    const temp = source.value;
    source.value = target.value;
    target.value = temp;
    
    // Если есть текст, сразу переводим
    if (elements.inputText.value.trim()) {
        translateText();
    }
}

function speakTranslation() {
    const text = elements.outputText.textContent.trim();
    if (!text || text.includes('Здесь появится перевод')) {
        showNotification('Нет текста для озвучивания', 'warning');
        return;
    }
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = elements.targetLang.value;
        utterance.rate = 1;
        utterance.pitch = 1;
        
        // Находим голос для выбранного языка
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(elements.targetLang.value)) || voices[0];
        if (voice) utterance.voice = voice;
        
        speechSynthesis.speak(utterance);
        showNotification('Озвучивание началось', 'info');
    } else {
        showNotification('Ваш браузер не поддерживает озвучивание', 'error');
    }
}

function copyTranslation() {
    const text = elements.outputText.textContent.trim();
    if (!text || text.includes('Здесь появится перевод')) {
        showNotification('Нет текста для копирования', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Текст скопирован в буфер', 'success'))
        .catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Текст скопирован', 'success');
        });
}

// Локальное хранилище
function saveToLocalStorage() {
    const data = {
        text: elements.inputText.value,
        sourceLang: elements.sourceLang.value,
        targetLang: elements.targetLang.value
    };
    localStorage.setItem('translatorData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('translatorData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            elements.inputText.value = data.text || '';
            elements.sourceLang.value = data.sourceLang || 'auto';
            elements.targetLang.value = data.targetLang || 'ru';
            updateCharCount();
        } catch (error) {
            console.log('Failed to load saved data');
        }
    }
}

function saveToHistory(original, translated, sourceLang, targetLang) {
    try {
        const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
        
        history.unshift({
            original,
            translated,
            sourceLang,
            targetLang,
            timestamp: new Date().toISOString()
        });
        
        // Храним только последние 50 переводов
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('translationHistory', JSON.stringify(history));
    } catch (error) {
        console.log('Failed to save history');
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    notification.textContent = message;
    notification.className = 'notification';
    
    switch (type) {
        case 'success':
            notification.style.background = '#48bb78';
            break;
        case 'error':
            notification.style.background = '#e53e3e';
            break;
        case 'warning':
            notification.style.background = '#ed8936';
            break;
        default:
            notification.style.background = '#2d3748';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Вспомогательная функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Загружаем голоса для озвучивания
if ('speechSynthesis' in window) {
    speechSynthesis.getVoices(); // Инициализируем
}

// Инициализируем приложение
document.addEventListener('DOMContentLoaded', init);
