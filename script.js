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

// ===== ИКОНКА TELEGRAM (БЕЗ ОБРЕЗКИ) =====
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

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 30 30');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.style.display = 'block';
        svg.style.flexShrink = '0';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '30');
        rect.setAttribute('height', '30');
        rect.setAttribute('rx', '15');
        rect.setAttribute('fill', 'currentColor');
        rect.style.transition = 'fill 0.3s ease';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M7.35253 15.4067L11.0326 16.6223L19.7703 11.4264C19.8972 11.3513 20.0269 11.5187 19.9178 11.6165L13.3029 17.5389L13.0571 20.8545C13.0531 20.91 13.0666 20.9654 13.0957 21.0133C13.1248 21.0613 13.1682 21.0995 13.2201 21.1229C13.2721 21.1463 13.3301 21.1538 13.3865 21.1443C13.4429 21.1349 13.4951 21.109 13.536 21.0701L15.5726 19.1219L19.2961 21.8633C19.6972 22.159 20.2783 21.9506 20.3863 21.4725L22.9789 10.0223C23.1269 9.36924 22.4687 8.81785 21.8269 9.05686L7.33424 14.4551C6.87938 14.6247 6.89195 15.2544 7.35253 15.4067Z');
        path.setAttribute('fill', '#ffffff');

        svg.appendChild(rect);
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
                line-height: 1;
                padding: 0;
                margin: 0;
            }
            .telegram-link:hover {
                color: #0088cc;
            }
            .telegram-link svg {
                display: block;
                margin: 0;
                padding: 0;
            }
            @media (max-width: 480px) {
                .telegram-link svg {
                    width: 28px;
                    height: 28px;
                }
            }
        `;
        document.head.appendChild(style);
    }
})();