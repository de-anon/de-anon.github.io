// Добавляем browserconfig для Windows
const meta = document.createElement('meta');
meta.name = 'msapplication-config';
meta.content = '/browserconfig.xml';
document.head.appendChild(meta);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('button, a, input').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorRing.style.transform = 'scale(1.5)'; });
    el.addEventListener('mouseleave', () => { cursorRing.style.transform = 'scale(1)'; });
});

// i18n System
let currentLang = localStorage.getItem('lang') || 'ru';
let translations = {};

async function loadLanguage(lang) {
    try {
        const res = await fetch(`/lang/${lang}.json`);
        const data = await res.json();
        translations = data;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) el.textContent = data[key];
        });
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        const flags = {
            ru: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>',
            en: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#bd3d44" d="M0 0h640v480H0"/><path stroke="#fff" stroke-width="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/><path fill="#192f5d" d="M0 0h364.8v258.5H0"/></svg>',
            fr: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#000091" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#e1000f" d="M426.7 0H640v480H426.7z"/></svg>'
        };

        const langToggle = document.getElementById('langToggleBtn');
        if (langToggle) langToggle.innerHTML = flags[lang];

        const path = window.location.pathname;
        let pageKey = 'page_title_main';
        if (path.includes('/about/')) pageKey = 'page_title_about';
        else if (path.includes('/faq/')) pageKey = 'page_title_faq';
        else if (path.includes('/tos/')) pageKey = 'page_title_tos';
        else if (path.includes('/privacy/')) pageKey = 'page_title_privacy';
        if (data[pageKey]) {
            document.title = data[pageKey];
        }

    } catch (e) {
        console.error('Lang error', e);
    }
}

document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        loadLanguage(lang);
        const dropdown = document.querySelector('#langDropdown .dropdown-menu');
        if (dropdown) dropdown.classList.remove('active');
    });
});

// Theme System
const themeBtns = document.querySelectorAll('[data-theme]');
function applyTheme(theme) {
    if (theme === 'system') {
        const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', sysDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
}

themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        applyTheme(btn.getAttribute('data-theme'));
        const dropdown = document.querySelector('#themeDropdown .dropdown-menu');
        if (dropdown) dropdown.classList.remove('active');
    });
});
applyTheme(localStorage.getItem('theme') || 'dark');

// Dropdown toggles
const themeToggleBtn = document.getElementById('themeToggleBtn');
const langToggleBtn = document.getElementById('langToggleBtn');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeMenu = document.querySelector('#themeDropdown .dropdown-menu');
        const langMenu = document.querySelector('#langDropdown .dropdown-menu');
        if (themeMenu) themeMenu.classList.toggle('active');
        if (langMenu) langMenu.classList.remove('active');
    });
}
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const langMenu = document.querySelector('#langDropdown .dropdown-menu');
        const themeMenu = document.querySelector('#themeDropdown .dropdown-menu');
        if (langMenu) langMenu.classList.toggle('active');
        if (themeMenu) themeMenu.classList.remove('active');
    });
}
document.body.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
});

// BVI Panel — размер шрифта и UI
const bviPanel = document.getElementById('bviPanel');
const bviBtn = document.getElementById('bviBtn');
const bviClose = document.getElementById('bviClose');
if (bviBtn && bviPanel) {
    bviBtn.addEventListener('click', () => bviPanel.classList.add('active'));
}
if (bviClose && bviPanel) {
    bviClose.addEventListener('click', () => bviPanel.classList.remove('active'));
}

const bviFontSize = document.getElementById('bviFontSize');
if (bviFontSize) {
    bviFontSize.addEventListener('input', e => {
        document.documentElement.style.setProperty('--font-size-base', e.target.value + 'px');
        localStorage.setItem('bviFontSize', e.target.value);
    });
    const savedFontSize = localStorage.getItem('bviFontSize');
    if (savedFontSize) {
        bviFontSize.value = savedFontSize;
        document.documentElement.style.setProperty('--font-size-base', savedFontSize + 'px');
    }
}
const bviUiSize = document.getElementById('bviUiSize');
if (bviUiSize) {
    bviUiSize.addEventListener('input', e => {
        document.documentElement.style.setProperty('--ui-scale', e.target.value / 100);
        localStorage.setItem('bviUiSize', e.target.value);
    });
    const savedUiSize = localStorage.getItem('bviUiSize');
    if (savedUiSize) {
        bviUiSize.value = savedUiSize;
        document.documentElement.style.setProperty('--ui-scale', savedUiSize / 100);
    }
}

// ============================================
// ЗАСЕЧКИ — финальный вариант (только класс)
// ============================================
(function initSerif() {
    let serifCheckbox = document.getElementById('bviSerif');

    // Если чекбокса нет — создаём
    if (!serifCheckbox) {
        const bviPanel = document.getElementById('bviPanel');
        if (bviPanel) {
            const group = document.createElement('div');
            group.className = 'bvi-group';
            const label = document.createElement('label');
            label.setAttribute('for', 'bviSerif');
            label.setAttribute('data-i18n', 'bvi_serif');
            label.textContent = 'Засечки';
            const switchWrap = document.createElement('span');
            switchWrap.className = 'switch';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'bviSerif';
            const slider = document.createElement('span');
            slider.className = 'slider';
            switchWrap.appendChild(input);
            switchWrap.appendChild(slider);
            group.appendChild(label);
            group.appendChild(switchWrap);
            bviPanel.appendChild(group);
            serifCheckbox = input;
            console.log('[BVI] Чекбокс создан');
        } else {
            console.warn('[BVI] Нет панели');
            return;
        }
    }

    // Функция переключения класса на body
    function setSerif(on) {
        if (on) {
            document.body.classList.add('serif');
            localStorage.setItem('bviSerif', 'serif');
        } else {
            document.body.classList.remove('serif');
            localStorage.setItem('bviSerif', 'sans');
        }
        console.log('[BVI] Засечки:', on ? 'включены' : 'выключены');
    }

    // Восстанавливаем состояние
    const savedSerif = localStorage.getItem('bviSerif');
    const isSerif = savedSerif === 'serif';
    serifCheckbox.checked = isSerif;
    setSerif(isSerif);

    // Обработчики
    serifCheckbox.addEventListener('change', function(e) {
        setSerif(e.target.checked);
    });
    serifCheckbox.addEventListener('click', function(e) {
        setSerif(e.target.checked);
    });

    // Синхронизация между вкладками
    window.addEventListener('storage', function(e) {
        if (e.key === 'bviSerif') {
            const newState = e.newValue === 'serif';
            serifCheckbox.checked = newState;
            setSerif(newState);
        }
    });
})();

// Layout Toggle
const layoutToggle = document.getElementById('layoutToggle');
if (layoutToggle) {
    layoutToggle.addEventListener('click', () => {
        document.body.classList.toggle('force-desktop');
        document.body.classList.toggle('force-mobile');
    });
}

// Cards Autoload System (only on main page)
async function loadCards() {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;

    try {
        const res = await fetch('/cards/manifest.json');
        const files = await res.json();
        grid.innerHTML = '';

        for (const file of files) {
            const cardRes = await fetch(`/cards/${file}`);
            const card = await cardRes.json();

            const cardEl = document.createElement('div');
            cardEl.className = 'card glass';
            cardEl.setAttribute('data-type', card.type || 'all');
            cardEl.innerHTML = `
                <img src="${card.photo}" class="card-img" alt="${card.name}">
                <div class="card-body">
                    <div class="card-name">${card.name}</div>
                    <div class="card-info">Phone: ${card.phone}</div>
                    <div class="card-info">City: ${card.address}</div>
                </div>
            `;
            cardEl.addEventListener('click', () => openModal(card));
            grid.appendChild(cardEl);
        }
    } catch (e) {
        console.error('Failed to load cards', e);
        grid.innerHTML = '<p style="color:var(--text-color)">No cards found. Create cards/manifest.json</p>';
    }
}

function openModal(card) {
    const modal = document.getElementById('modalContent');
    if (!modal) return;

    let socialsHtml = '';
    if (card.socials) {
        if (typeof card.socials === 'object') {
            for (const [platform, username] of Object.entries(card.socials)) {
                socialsHtml += `<p><strong>${platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong> ${username}</p>`;
            }
        } else {
            socialsHtml = `<p><strong>Socials:</strong> ${card.socials}</p>`;
        }
    }

    modal.innerHTML = `
        <button class="modal-close" id="modalClose">&times;</button>
        <img src="${card.photo}" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
        <h2>${card.name}</h2>
        <p><strong>Phone:</strong> ${card.phone}</p>
        <p><strong>Address:</strong> ${card.address}</p>
        ${socialsHtml}
    `;
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalClose').addEventListener('click', closeModal);
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });
}

// Search & Filter (only on main page)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', filterCards);
}
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards();
        });
    });
}

function filterCards() {
    const term = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    document.querySelectorAll('.card').forEach(card => {
        const text = card.textContent.toLowerCase();
        const type = card.getAttribute('data-type');
        const termMatch = text.includes(term);
        const typeMatch = (activeFilter === 'all' || type === activeFilter);
        card.style.display = (termMatch && typeMatch) ? 'block' : 'none';
    });
}

// Synchronize language across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'lang') {
        const newLang = e.newValue;
        if (newLang) {
            loadLanguage(newLang);
        }
    }
});

// ===== НОВАЯ ФУНКЦИЯ: добавляем ссылку на /manifest/ в навигацию =====
function addManifestLink() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    if (nav.querySelector('a[href="/manifest/"]')) return;

    const link = document.createElement('a');
    link.href = '/manifest/';
    link.setAttribute('data-i18n', 'manifest_nav');
    link.textContent = translations['manifest_nav'] || 'Установка';
    nav.appendChild(link);
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
loadLanguage(currentLang).then(() => {
    addManifestLink();
});

loadCards();

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[SW] Зарегистрирован:', reg))
        .catch(err => console.error('[SW] Ошибка регистрации:', err));
}
// ============================================
// БУРГЕР-МЕНЮ — ДОБАВЛЯЕТСЯ АВТОМАТИЧЕСКИ НА ВСЕ СТРАНИЦЫ
// ============================================
(function initBurgerMenu() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBurger);
    } else {
        addBurger();
    }

    function addBurger() {
        const header = document.querySelector('.header');
        const nav = document.querySelector('.nav');
        const controls = document.querySelector('.controls');
        if (!header || !nav || !controls) return;
        if (header.querySelector('.burger-btn')) return;

        const burger = document.createElement('button');
        burger.className = 'burger-btn';
        burger.setAttribute('aria-label', 'Меню');
        burger.innerHTML = '<span></span><span></span><span></span>';
        header.insertBefore(burger, controls);

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header')) {
                burger.classList.remove('active');
                nav.classList.remove('open');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                burger.classList.remove('active');
                nav.classList.remove('open');
            }
        });
    }
})();

// ===== ИКОНКА TELEGRAM (БЕЗ ОБРЕЗКИ, С ОТСТУПОМ) =====
(function addTelegramIcon() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insert);
    } else {
        insert();
    }

    function insert() {
        const footer = document.querySelector('footer.footer');
        if (!footer || footer.querySelector('.telegram-link')) return;

        footer.style.display = 'flex';
        footer.style.justifyContent = 'space-between';
        footer.style.alignItems = 'center';
        footer.style.flexWrap = 'wrap';
        footer.style.gap = '10px';
        const p = footer.querySelector('p');
        if (p) p.style.margin = '0';

        const link = document.createElement('a');
        link.href = 'https://t.me/deanonproject';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'telegram-link';
        link.setAttribute('aria-label', 'Telegram');

        // SVG с увеличенным размером и viewBox для отступа
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 128 128');
        svg.setAttribute('width', '34');
        svg.setAttribute('height', '34');
        svg.style.display = 'block';
        svg.style.overflow = 'visible'; // чтобы ничего не обрезалось

        // Круг (фон) — чуть меньше, чтобы был запас
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '64');
        circle.setAttribute('cy', '64');
        circle.setAttribute('r', '62'); // на 2px меньше, чтобы не касаться краёв
        circle.setAttribute('fill', 'currentColor');
        circle.style.transition = 'fill 0.3s ease';

        // Самолётик — без изменений
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M28.9700376,63.3244248 C47.6273373,55.1957357 60.0684594,49.8368063 66.2934036,47.2476366 C84.0668845,39.855031 87.7600616,38.5708563 90.1672227,38.528 C90.6966555,38.5191258 91.8804274,38.6503351 92.6472251,39.2725385 C93.294694,39.7979149 93.4728387,40.5076237 93.5580865,41.0057381 C93.6433345,41.5038525 93.7494885,42.63857 93.6651041,43.5252052 C92.7019529,53.6451182 88.5344133,78.2034783 86.4142057,89.5379542 C85.5170662,94.3339958 83.750571,95.9420841 82.0403991,96.0994568 C78.3237996,96.4414641 75.5015827,93.6432685 71.9018743,91.2836143 C66.2690414,87.5912212 63.0868492,85.2926952 57.6192095,81.6896017 C51.3004058,77.5256038 55.3966232,75.2369981 58.9976911,71.4967761 C59.9401076,70.5179421 76.3155302,55.6232293 76.6324771,54.2720454 C76.6721165,54.1030573 76.7089039,53.4731496 76.3346867,53.1405352 C75.9604695,52.8079208 75.4081573,52.921662 75.0095933,53.0121213 C74.444641,53.1403447 65.4461175,59.0880351 48.0140228,70.8551922 C45.4598218,72.6091037 43.1463059,73.4636682 41.0734751,73.4188859 C38.7883453,73.3695169 34.3926725,72.1268388 31.1249416,71.0646282 C27.1169366,69.7617838 23.931454,69.0729605 24.208838,66.8603276 C24.3533167,65.7078514 25.9403832,64.5292172 28.9700376,63.3244248 Z');
        path.setAttribute('fill', '#ffffff');

        svg.appendChild(circle);
        svg.appendChild(path);
        link.appendChild(svg);
        footer.appendChild(link);

        const style = document.createElement('style');
        style.textContent = `
            .telegram-link {
                text-decoration: none;
                flex-shrink: 0;
                display: inline-block;
                color: #00ff41;
                transition: color 0.3s ease;
                line-height: 0;
                padding: 0;
                margin: 0;
            }
            .telegram-link:hover {
                color: #2AABEE;
            }
            .telegram-link svg {
                display: block;
                margin: 0;
                padding: 0;
                overflow: visible;
            }
            @media (max-width: 480px) {
                .telegram-link svg {
                    width: 30px;
                    height: 30px;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();

// ===== ПАНЕЛЬ РЕПОСТА (ВЫДВИЖНАЯ СПРАВА) =====
(function initSharePanel() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', build);
    } else {
        build();
    }

    function build() {
        // Проверка, чтобы не дублировать
        if (document.querySelector('.share-panel-wrapper')) return;

        // -------- КОНФИГУРАЦИЯ СОЦСЕТЕЙ --------
        const socials = [
            {
                name: 'Facebook',
                url: (u) => `https://www.facebook.com/sharer.php?u=${u}`,
                color: '#1877F2',
                path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
            },
            {
                name: 'Одноклассники',
                url: (u) => `https://connect.ok.ru/offer?url=${u}`,
                color: '#EE8208',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm3.25 7.53c.66.5 1.06 1.1 1.06 1.8 0 .9-.8 1.7-2.1 2.3l1.2 1.2c.3.3.3.8 0 1.1-.3.3-.8.3-1.1 0l-1.3-1.3-1.3 1.3c-.3.3-.8.3-1.1 0-.3-.3-.3-.8 0-1.1l1.2-1.2c-1.3-.6-2.1-1.4-2.1-2.3 0-.7.4-1.3 1.1-1.8.3-.2.7-.1.9.2.2.3.1.7-.2.9-.4.3-.7.6-.7 1.1 0 .7.9 1.4 2.5 1.4s2.5-.7 2.5-1.4c0-.5-.3-.8-.7-1.1-.3-.2-.4-.6-.2-.9.2-.3.6-.4.9-.2z'
            },
            {
                name: 'Telegram',
                url: (u, t) => `https://t.me/share/url?url=${u}&text=${t}`,
                color: '#26A5E4',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.74 6.64l-1.72 8.08c-.12.56-.46.7-.93.44l-2.57-1.9-1.24 1.2c-.14.13-.25.25-.52.25l.18-2.64 4.82-4.35c.21-.18-.04-.28-.32-.1l-5.96 3.77-2.57-.8c-.56-.18-.57-.56.12-.83l10.04-3.87c.47-.17.9.1.74.73z'
            },
            {
                name: 'ВКонтакте',
                url: (u) => `https://vk.com/share.php?url=${u}`,
                color: '#4C75A3',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.48 14.14c-.25.27-.65.38-1.06.38-.26 0-.52-.06-.78-.19-.58-.27-1.13-.72-1.59-1.14-.35.43-.73.87-1.19 1.19-.42.29-.93.44-1.45.44-.19 0-.38-.02-.57-.07-.15-.04-.3-.1-.44-.17-.57-.29-1.02-.8-1.34-1.4-.33-.63-.5-1.38-.5-2.16V12.27c.01-.58.14-1.14.39-1.64.29-.57.72-1.01 1.22-1.28.39-.22.81-.33 1.24-.33.31 0 .62.06.9.18.58.24 1.05.68 1.38 1.26.24.42.38.91.39 1.42v.12c-.01.35-.07.7-.16 1.03-.14.52-.41.99-.77 1.37.19.24.4.46.62.65.33.28.7.49 1.08.63.41.15.83.19 1.24.11.36-.07.68-.27.88-.56.11-.16.17-.35.17-.55 0-.23-.07-.45-.19-.63-.29-.43-.8-.73-1.31-.94-.58-.24-1.05-.54-1.36-.86-.38-.4-.56-.89-.55-1.38-.01-.46.16-.88.45-1.22.31-.36.73-.55 1.18-.56.27 0 .54.05.8.16.79.31 1.42.89 1.79 1.62.41.82.55 1.8.31 2.72-.15.58-.49 1.09-.94 1.47z'
            },
            {
                name: 'Viber',
                url: (u) => `viber://forward?text=${u}`,
                color: '#7360F2',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.35 13.24c-.43.43-1.16.65-1.86.65-.99 0-1.93-.37-2.64-1.08-.71-.71-1.08-1.65-1.08-2.64 0-.7.22-1.43.65-1.86.23-.23.59-.23.82 0l.79.79c.23.23.23.59 0 .82-.13.13-.2.3-.2.49 0 .38.16.73.43.99.27.27.62.43.99.43.19 0 .36-.07.49-.2.23-.23.59-.23.82 0l.79.79c.23.23.23.59 0 .82z'
            },
            {
                name: 'WhatsApp',
                url: (u) => `https://wa.me/?text=${u}`,
                color: '#25D366',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.04 14.76c-.62.3-1.28.45-1.95.45-1.67 0-3.24-.84-4.16-2.25-1.48-2.28-.92-5.33 1.24-6.88.43-.31.97-.44 1.47-.37.38.06.73.27.95.59l.2.31c.22.34.13.8-.2 1.04l-.28.21c-.24.18-.31.52-.17.78.44.78 1.24 1.56 2.02 1.99.25.14.57.09.76-.14l.21-.28c.24-.32.7-.41 1.04-.19l.31.2c.33.21.53.56.56.94.04.48-.14.96-.51 1.31z'
            },
            {
                name: 'X',
                url: (u) => `https://twitter.com/intent/tweet?url=${u}`,
                color: '#000000',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.64 14.08l-2.76-3.62-3.22 3.62h-1.1l3.86-4.34-4.08-5.34h1.1l2.92 3.84 3.34-3.84h1.1l-3.78 4.25 4.28 5.39h-1.1z'
            },
            {
                name: 'LinkedIn',
                url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
                color: '#0A66C2',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.54 12.85h-1.92V9.77h1.92v5.08zm-.96-5.77c-.62 0-1.12-.51-1.12-1.13s.5-1.13 1.12-1.13c.62 0 1.12.51 1.12 1.13s-.5 1.13-1.12 1.13zm7.96 5.77h-1.92v-3.04c0-.74-.58-1.34-1.3-1.34-.73 0-1.3.6-1.3 1.34v3.04h-1.92V9.77h1.92v.91c.37-.53.97-.91 1.69-.91 1.38 0 2.5 1.16 2.5 2.58v3.22z'
            },
            {
                name: 'Мой Мир',
                url: (u) => `https://connect.mail.ru/share?url=${u}`,
                color: '#005FF9',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 10.38 9.5 9 10.62 6.5 12 6.5zm3.25 10.53c-.87.66-2.04 1.09-3.25 1.09s-2.38-.43-3.25-1.09c-.16-.12-.22-.32-.14-.48.27-.47 1.04-.62 1.59-.62.07 0 .14.01.21.02.42.09.85.16 1.3.16.45 0 .88-.07 1.3-.16.07-.01.14-.02.21-.02.55 0 1.32.15 1.59.62.08.16.02.36-.14.48z'
            },
            {
                name: 'Instagram',
                url: null, // копирование ссылки
                color: '#E4405F',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4.5c2.05 0 3.71 1.66 3.71 3.71 0 2.05-1.66 3.71-3.71 3.71S8.29 12.26 8.29 10.21 9.95 6.5 12 6.5zm0 10.71c-2.42 0-4.56-1.28-5.78-3.21.47-1.48 1.85-2.53 3.47-2.53.72 0 1.38.24 1.91.63.53-.39 1.19-.63 1.91-.63 1.62 0 3.01 1.05 3.47 2.53-1.22 1.93-3.36 3.21-5.78 3.21z'
            },
            {
                name: 'Копировать ссылку',
                url: null,
                color: '#FFFFFF',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z'
            }
        ];

        // -------- СОЗДАНИЕ КНОПКИ-ТРИГГЕРА --------
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'share-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Поделиться');
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <circle cx="12" cy="5" r="2.5" />
                <circle cx="12" cy="19" r="2.5" />
                <circle cx="19" cy="12" r="2.5" />
                <line x1="14.5" y1="6.5" x2="19.5" y2="10.5" stroke="currentColor" stroke-width="1.5" />
                <line x1="14.5" y1="17.5" x2="19.5" y2="13.5" stroke="currentColor" stroke-width="1.5" />
                <line x1="9.5" y1="6.5" x2="4.5" y2="10.5" stroke="currentColor" stroke-width="1.5" />
                <line x1="9.5" y1="17.5" x2="4.5" y2="13.5" stroke="currentColor" stroke-width="1.5" />
            </svg>
        `;
        document.body.appendChild(toggleBtn);

        // -------- СОЗДАНИЕ ПАНЕЛИ --------
        const panel = document.createElement('div');
        panel.className = 'share-panel-wrapper';
        panel.innerHTML = `
            <div class="share-panel glass">
                <button class="share-close-btn" aria-label="Закрыть">&times;</button>
                <div class="share-icons"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const iconsContainer = panel.querySelector('.share-icons');
        const closeBtn = panel.querySelector('.share-close-btn');

        // -------- ГЕНЕРАЦИЯ ИКОНОК --------
        socials.forEach(social => {
            const item = document.createElement('a');
            item.className = 'share-item';
            item.setAttribute('data-color', social.color);
            item.setAttribute('href', '#');
            item.setAttribute('aria-label', social.name);
            if (social.url) {
                item.href = social.url(encodeURIComponent(window.location.href), encodeURIComponent(document.title));
                item.target = '_blank';
                item.rel = 'noopener noreferrer';
            } else {
                // для Instagram и копирования ссылки обрабатываем клик отдельно
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (social.name === 'Instagram') {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            alert('Ссылка скопирована! Откройте Instagram и вставьте её в сообщение.');
                        }).catch(() => {
                            prompt('Скопируйте ссылку вручную:', window.location.href);
                        });
                    } else if (social.name === 'Копировать ссылку') {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            alert('Ссылка скопирована в буфер обмена!');
                        }).catch(() => {
                            prompt('Скопируйте ссылку вручную:', window.location.href);
                        });
                    }
                });
            }

            // SVG иконка (круг + белый path)
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '36');
            svg.setAttribute('height', '36');
            svg.style.display = 'block';

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '12');
            circle.setAttribute('cy', '12');
            circle.setAttribute('r', '12');
            circle.setAttribute('fill', 'currentColor');
            circle.style.transition = 'fill 0.3s ease';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', social.path);
            path.setAttribute('fill', '#ffffff');

            svg.appendChild(circle);
            svg.appendChild(path);
            item.appendChild(svg);

            // Подпись
            const label = document.createElement('span');
            label.textContent = social.name;
            label.style.cssText = 'font-size:0.75rem; opacity:0.8; margin-top:4px; display:block; text-align:center;';
            item.appendChild(label);

            // Стиль для иконки: цвет = зелёный (currentColor)
            item.style.color = '#00ff41';
            item.style.transition = 'color 0.3s ease';
            item.style.textDecoration = 'none';
            item.style.display = 'inline-flex';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'center';
            item.style.margin = '6px 8px';
            item.style.cursor = 'pointer';

            // При наведении меняем цвет на оригинальный
            item.addEventListener('mouseenter', function() {
                this.style.color = this.getAttribute('data-color');
            });
            item.addEventListener('mouseleave', function() {
                this.style.color = '#00ff41';
            });

            iconsContainer.appendChild(item);
        });

        // -------- ОБРАБОТЧИКИ ОТКРЫТИЯ/ЗАКРЫТИЯ --------
        let isOpen = false;

        function openPanel() {
            panel.classList.add('active');
            isOpen = true;
        }

        function closePanel() {
            panel.classList.remove('active');
            isOpen = false;
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen) {
                closePanel();
            } else {
                openPanel();
            }
        });

        closeBtn.addEventListener('click', closePanel);

        // Закрытие по клику вне панели
        document.addEventListener('click', (e) => {
            if (isOpen && !panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
                closePanel();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closePanel();
            }
        });

        // -------- СТИЛИ (добавляем в head) --------
        const style = document.createElement('style');
        style.textContent = `
            /* Кнопка-триггер */
            .share-toggle-btn {
                position: fixed;
                right: 20px;
                bottom: 90px;
                z-index: 999;
                background: var(--glass-bg, rgba(10,10,10,0.8));
                backdrop-filter: blur(10px);
                border: 1px solid var(--glass-border, rgba(0,255,65,0.3));
                border-radius: 50%;
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-color, #00ff41);
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }
            .share-toggle-btn:hover {
                transform: scale(1.08);
                border-color: var(--text-color, #00ff41);
            }
            .share-toggle-btn svg {
                width: 28px;
                height: 28px;
            }

            /* Панель */
            .share-panel-wrapper {
                position: fixed;
                top: 0;
                right: -420px;
                width: 400px;
                height: 100vh;
                z-index: 1000;
                transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: none;
            }
            .share-panel-wrapper.active {
                right: 0;
                pointer-events: auto;
            }
            .share-panel {
                width: 100%;
                height: 100%;
                max-width: 400px;
                background: var(--glass-bg, rgba(10,10,10,0.92));
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                border-left: 1px solid var(--glass-border, rgba(0,255,65,0.2));
                box-shadow: -8px 0 30px rgba(0,0,0,0.6);
                padding: 30px 20px 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                position: relative;
                pointer-events: auto;
            }
            .share-close-btn {
                position: absolute;
                top: 16px;
                right: 20px;
                background: none;
                border: none;
                color: var(--text-color, #00ff41);
                font-size: 2rem;
                line-height: 1;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .share-close-btn:hover {
                transform: rotate(90deg);
            }
            .share-icons {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: flex-start;
                gap: 4px 10px;
                margin-top: 30px;
                padding: 10px 0;
            }
            .share-item {
                flex: 0 0 calc(33.33% - 20px);
                max-width: 100px;
                margin: 6px 0;
                text-align: center;
                color: #00ff41;
                transition: color 0.3s ease;
                text-decoration: none;
            }
            .share-item svg {
                width: 44px;
                height: 44px;
                margin: 0 auto;
                display: block;
            }
            .share-item span {
                display: block;
                font-size: 0.7rem;
                opacity: 0.8;
                margin-top: 4px;
                white-space: nowrap;
            }

            @media (max-width: 480px) {
                .share-panel-wrapper {
                    width: 100%;
                    right: -100%;
                }
                .share-panel-wrapper.active {
                    right: 0;
                }
                .share-panel {
                    max-width: 100%;
                    border-left: none;
                    border-radius: 0;
                }
                .share-item {
                    flex: 0 0 calc(25% - 10px);
                    max-width: 70px;
                }
                .share-item svg {
                    width: 38px;
                    height: 38px;
                }
                .share-toggle-btn {
                    right: 16px;
                    bottom: 80px;
                    width: 48px;
                    height: 48px;
                }
                .share-toggle-btn svg {
                    width: 24px;
                    height: 24px;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();