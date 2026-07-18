// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Состояние ---
    let currentLang = localStorage.getItem('lang') || 'ru';
    let allCards = [];
    let filteredCards = [];

    // --- DOM элементы ---
    const htmlEl = document.documentElement;
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');
    const cardsContainer = document.getElementById('cards-container');
    const noResults = document.getElementById('no-results');
    const modal = document.getElementById('card-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    const bviPanel = document.getElementById('bvi-panel');
    const bviToggle = document.querySelector('.bvi-toggle');
    const bviClose = document.querySelector('.bvi-close');
    const versionToggle = document.querySelector('.version-toggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langBtn = document.querySelector('.lang-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');

    // --- Инициализация темы ---
    const savedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(savedTheme);
    highlightThemeButton(savedTheme);

    // --- Инициализация языка ---
    applyLanguage(currentLang);
    fetchCards();

    // --- Обработчики ---
    searchInput.addEventListener('input', filterCards);
    filterSelect.addEventListener('change', filterCards);

    // Модальное окно
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // BVI панель
    bviToggle.addEventListener('click', () => bviPanel.classList.toggle('open'));
    bviClose.addEventListener('click', () => bviPanel.classList.remove('open'));
    initBVI();

    // Переключение языка
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => langDropdown.classList.remove('active'));
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.dataset.lang;
            currentLang = lang;
            localStorage.setItem('lang', lang);
            applyLanguage(lang);
            langDropdown.classList.remove('active');
        });
    });

    // Темы
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
            highlightThemeButton(theme);
        });
    });

    // Версия (mobile/desktop)
    versionToggle.addEventListener('click', () => {
        const app = document.getElementById('app');
        if (app.classList.contains('force-desktop')) {
            app.classList.replace('force-desktop', 'force-mobile');
        } else {
            app.classList.replace('force-mobile', 'force-desktop');
        }
    });

    // --- Функции ---
    async function fetchCards() {
        try {
            const listResp = await fetch('/cards/list.json');
            if (!listResp.ok) throw new Error('list.json not found');
            const list = await listResp.json();
            const cardPromises = list.map(id =>
                fetch(`/cards/${id}.json`).then(r => r.json()).catch(() => null)
            );
            const cards = await Promise.all(cardPromises);
            allCards = cards.filter(c => c !== null).map(c => ({ ...c, id: c.id || c.phone || Math.random().toString(36) }));
            filteredCards = [...allCards];
            renderCards(filteredCards);
        } catch (e) {
            console.warn('Ошибка загрузки карточек:', e);
            allCards = [];
            renderCards([]);
        }
    }

    function renderCards(cards) {
        cardsContainer.innerHTML = '';
        noResults.hidden = cards.length > 0;
        if (cards.length === 0) return;

        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card glass';
            cardEl.innerHTML = `
                <img src="${card.photo || '/assets/placeholder.svg'}" alt="${card.name}" class="card-photo" loading="lazy">
                <div class="card-info">
                    <div class="card-name">${card.name}</div>
                    <div class="card-phone">${card.phone || ''}</div>
                    <div class="card-address">${card.address || ''}</div>
                </div>
            `;
            cardEl.addEventListener('click', () => openCardModal(card));
            cardsContainer.appendChild(cardEl);
        });
    }

    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterBy = filterSelect.value;

        filteredCards = allCards.filter(card => {
            const matchesSearch = !searchTerm || 
                (card.name && card.name.toLowerCase().includes(searchTerm)) ||
                (card.phone && card.phone.includes(searchTerm)) ||
                (card.address && card.address.toLowerCase().includes(searchTerm));
            if (!matchesSearch) return false;

            if (filterBy === 'name') return card.name && card.name.toLowerCase().includes(searchTerm);
            if (filterBy === 'phone') return card.phone && card.phone.includes(searchTerm);
            if (filterBy === 'address') return card.address && card.address.toLowerCase().includes(searchTerm);
            return true; // all
        });
        renderCards(filteredCards);
    }

    function openCardModal(card) {
        modalBody.innerHTML = `
            <h2 style="font-family:var(--font-mono); color:var(--accent);">${card.name}</h2>
            ${card.photo ? `<img src="${card.photo}" alt="${card.name}" style="max-height:300px; width:100%; object-fit:cover;">` : ''}
            <p><strong data-i18n="phone_label">Телефон:</strong> ${card.phone || '-'}</p>
            <p><strong data-i18n="address_label">Адрес:</strong> ${card.address || '-'}</p>
            <p><strong data-i18n="email_label">Email:</strong> ${card.email || '-'}</p>
            ${card.socials ? `<p><strong data-i18n="socials_label">Соцсети:</strong> ${Object.entries(card.socials).map(([k,v]) => `${k}: ${v}`).join('; ')}</p>` : ''}
            ${card.description ? `<p>${card.description}</p>` : ''}
            ${card.photos ? card.photos.map(p => `<img src="${p}" loading="lazy" style="max-width:100%; margin-top:10px; border-radius:12px;">`).join('') : ''}
        `;
        modal.hidden = false;
        // обновить переводы внутри модалки
        const modalI18n = modalBody.querySelectorAll('[data-i18n]');
        modalI18n.forEach(el => {
            const key = el.dataset.i18n;
            if (translations[currentLang] && translations[currentLang][key]) {
                el.textContent = translations[currentLang][key];
            }
        });
    }

    function closeModal() {
        modal.hidden = true;
    }

    // i18n
    let translations = {};
    async function applyLanguage(lang) {
        try {
            const resp = await fetch(`/lang/${lang}.json`);
            translations[lang] = await resp.json();
        } catch (e) {
            console.error('Failed to load language', lang);
            return;
        }
        htmlEl.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        // aria-label с data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            if (translations[lang] && translations[lang][key]) {
                el.setAttribute('aria-label', translations[lang][key]);
                el.title = translations[lang][key];
            }
        });
    }

    // Тема
    function applyTheme(theme) {
        htmlEl.classList.remove('theme-light', 'theme-dark', 'theme-system');
        htmlEl.classList.add(`theme-${theme}`);
    }
    function highlightThemeButton(theme) {
        themeBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.theme-btn[data-theme="${theme}"]`)?.classList.add('active');
    }

    // BVI логика
    function initBVI() {
        const fontDec = document.querySelector('.bvi-font-dec');
        const fontInc = document.querySelector('.bvi-font-inc');
        const fontVal = document.querySelector('.bvi-font-value');
        const scaleDec = document.querySelector('.bvi-scale-dec');
        const scaleInc = document.querySelector('.bvi-scale-inc');
        const scaleVal = document.querySelector('.bvi-scale-value');
        const serifToggle = document.querySelector('.bvi-serif-toggle');

        let fontSize = parseInt(localStorage.getItem('bvi-font-size') || '100');
        let scale = parseInt(localStorage.getItem('bvi-scale') || '100');
        let serif = localStorage.getItem('bvi-serif') === 'true';

        function updateUI() {
            document.documentElement.style.fontSize = `${fontSize}%`;
            document.getElementById('app').style.transform = `scale(${scale/100})`;
            document.getElementById('app').style.transformOrigin = 'top center';
            if (serif) {
                body.style.fontFamily = 'Georgia, "Times New Roman", serif';
            } else {
                body.style.fontFamily = '';
            }
            fontVal.textContent = `${fontSize}%`;
            scaleVal.textContent = `${scale}%`;
            serifToggle.textContent = serif ? (translations[currentLang]?.on || 'Вкл') : (translations[currentLang]?.off || 'Выкл');
        }

        fontDec.addEventListener('click', () => { fontSize = Math.max(70, fontSize - 10); saveBVI(); });
        fontInc.addEventListener('click', () => { fontSize = Math.min(200, fontSize + 10); saveBVI(); });
        scaleDec.addEventListener('click', () => { scale = Math.max(70, scale - 10); saveBVI(); });
        scaleInc.addEventListener('click', () => { scale = Math.min(200, scale + 10); saveBVI(); });
        serifToggle.addEventListener('click', () => { serif = !serif; saveBVI(); });

        function saveBVI() {
            localStorage.setItem('bvi-font-size', fontSize);
            localStorage.setItem('bvi-scale', scale);
            localStorage.setItem('bvi-serif', serif);
            updateUI();
        }
        updateUI();
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            bviPanel.classList.remove('open');
        }
    });
});