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
        if (document.querySelector('.share-panel-wrapper')) return;

        // -------- МАССИВ СОЦСЕТЕЙ (С ИСПРАВЛЕННЫМ "МОЙ МИР") --------
        const socials = [
            {
                name: 'Telegram',
                url: (u, t) => `https://t.me/share/url?url=${u}&text=${t}`,
                color: '#26A5E4',
                viewBox: '0 0 512 512',
                content: `<path d="m173.3 274.7 30.4 84.1s3.8 7.9 7.9 7.9 64.5-62.9 64.5-62.9l67.3-129.9-169 79.1z" fill="#ffffff"/><path d="m213.6 296.3-5.8 62s-2.4 19 16.5 0c19-19 37.2-33.6 37.2-33.6" fill="#ffffff"/><path d="m173.8 277.7-62.5-20.4s-7.5-3-5.1-9.9c.5-1.4 1.5-2.6 4.5-4.7C124.6 233.1 367 146 367 146s6.8-2.3 10.9-.8c2 .6 3.6 2.3 4 4.4.4 1.8.6 3.7.5 5.5 0 1.6-.2 3.1-.4 5.4-1.5 23.8-45.7 201.6-45.7 201.6s-2.6 10.4-12.1 10.8c-4.7.2-9.3-1.6-12.6-4.9-18.6-16-82.8-59.2-97-68.6-.6-.4-1.1-1.1-1.2-1.9-.2-1 .9-2.2.9-2.2s111.8-99.4 114.8-109.8c.2-.8-.6-1.2-1.8-.9-7.4 2.7-136.2 84.1-150.4 93-.9.2-2 .3-3.1.1" fill="#ffffff"/>`
            },
            {
                name: 'Facebook',
                url: (u) => `https://www.facebook.com/sharer.php?u=${u}`,
                color: '#1877F2',
                viewBox: '0 0 512 512',
                content: `<path d="m355.8 327.7 11.5-71.7h-67.8v-49.9c0-20.5 7.7-35.8 38.4-35.8h33.3V105c-17.9-2.6-38.4-5.1-56.3-5.1-58.9 0-99.8 35.8-99.8 99.8V256h-64v71.7h64v180.5c14.1 2.6 28.2 3.8 42.2 3.8 14.1 0 28.2-1.3 42.2-3.8V327.7z" fill="#ffffff"/>`
            },
            {
                name: 'Viber',
                url: (u) => `viber://forward?text=${u}`,
                color: '#7360F2',
                viewBox: '0 0 632 667',
                transform: 'translate(316,333) scale(0.65) translate(-316,-333)',
                content: `<path d="M560.65,65C544.09,49.72,477.17,1.14,328.11.48c0,0-175.78-10.6-261.47,68C18.94,116.19,2.16,186,.39,272.55S-3.67,521.3,152.68,565.28l.15,0-.1,67.11s-1,27.17,16.89,32.71c21.64,6.72,34.34-13.93,55-36.19,11.34-12.22,27-30.17,38.8-43.89,106.93,9,189.17-11.57,198.51-14.61,21.59-7,143.76-22.66,163.63-184.84C646.07,218.4,615.64,112.66,560.65,65Zm18.12,308.58C562,509,462.91,517.51,444.64,523.37c-7.77,2.5-80,20.47-170.83,14.54,0,0-67.68,81.65-88.82,102.88-3.3,3.32-7.18,4.66-9.77,4-3.64-.89-4.64-5.2-4.6-11.5.06-9,.58-111.52.58-111.52s-.08,0,0,0C38.94,485.05,46.65,347,48.15,274.71S63.23,143.2,103.57,103.37c72.48-65.65,221.79-55.84,221.79-55.84,126.09.55,186.51,38.52,200.52,51.24C572.4,138.6,596.1,233.91,578.77,373.54Z" fill="#ffffff"/><path d="M389.47,268.77q-2.46-49.59-50.38-52.09" stroke="#ffffff" fill="none"/><path d="M432.72,283.27q1-46.2-27.37-77.2c-19-20.74-45.3-32.16-79.05-34.63" stroke="#ffffff" fill="none"/><path d="M477,300.59q-.61-80.17-47.91-126.28t-117.65-46.6" stroke="#ffffff" fill="none"/><path d="M340.76,381.68s11.85,1,18.23-6.86l12.44-15.65c6-7.76,20.48-12.71,34.66-4.81A366.67,366.67,0,0,1,437,374.1c9.41,6.92,28.68,23,28.74,23,9.18,7.75,11.3,19.13,5.05,31.13,0,.07-.05.19-.05.25a129.81,129.81,0,0,1-25.89,31.88c-.12.06-.12.12-.23.18q-13.38,11.18-26.29,12.71a17.39,17.39,0,0,1-3.84.24,35,35,0,0,1-11.18-1.72l-.28-.41c-13.26-3.74-35.4-13.1-72.27-33.44a430.39,430.39,0,0,1-60.72-40.11,318.31,318.31,0,0,1-27.31-24.22l-.92-.92-.92-.92h0l-.92-.92c-.31-.3-.61-.61-.92-.92a318.31,318.31,0,0,1-24.22-27.31,430.83,430.83,0,0,1-40.11-60.71c-20.34-36.88-29.7-59-33.44-72.28l-.41-.28a35,35,0,0,1-1.71-11.18,16.87,16.87,0,0,1,.23-3.84Q141,181.42,152.12,168c.06-.11.12-.11.18-.23a129.53,129.53,0,0,1,31.88-25.88c.06,0,.18-.06.25-.06,12-6.25,23.38-4.13,31.12,5,.06.06,16.11,19.33,23,28.74a366.67,366.67,0,0,1,19.74,30.94c7.9,14.17,2.95,28.68-4.81,34.66l-15.65,12.44c-7.9,6.38-6.86,18.23-6.86,18.23S254.15,359.57,340.76,381.68Z" fill="#ffffff"/>`
            },
            {
                name: 'WhatsApp',
                url: (u) => `https://wa.me/?text=${u}`,
                color: '#25D366',
                viewBox: '0 0 512 512',
                content: `<path d="M192.7 146.9c-4.7-10.5-9.7-10.7-14.2-10.9l-12.1-.1c-4.2 0-11 1.6-16.8 7.9s-22.1 21.6-22.1 52.6 22.6 61 25.8 65.2 43.6 69.9 107.8 95.2c53.3 21 64.1 16.8 75.7 15.8 11.6-1.1 37.3-15.3 42.6-30s5.3-27.4 3.7-30-5.8-4.2-12.1-7.4-37.3-18.4-43.1-20.5-10-3.2-14.2 3.2c-4.2 6.3-16.3 20.5-20 24.7s-7.4 4.7-13.7 1.6c-6.3-3.2-26.6-9.8-50.7-31.3-18.8-16.7-31.4-37.4-35.1-43.7s-.4-9.7 2.8-12.9c2.8-2.8 6.3-7.4 9.5-11.1s4.2-6.3 6.3-10.5 1.1-7.9-.5-11.1c-1.8-3-14-34.2-19.6-46.7" fill="#ffffff"/>`
            },
            {
                name: 'X',
                url: (u) => `https://twitter.com/intent/tweet?url=${u}`,
                color: '#000000',
                viewBox: '0 0 512 512',
                transform: 'translate(256,256) scale(0.65) translate(-256,-256)',
                content: `<path d="M304.7 216.8 495.2 0h-45.1L284.6 188.2 152.6 0H.2l199.7 284.7L.2 512h45.1L220 313.2 359.4 512h152.3M61.6 33.3h69.3l319.1 447h-69.3" fill="#ffffff"/>`
            },
            {
                name: 'LinkedIn',
                url: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
                color: '#0A66C2',
                viewBox: '0 0 512 512',
                transform: 'translate(256,256) scale(0.65) translate(-256,-256)',
                content: `<path d="M440.9 440.9h-76V311.5c0-35.5-13.5-55.3-41.6-55.3-30.5 0-46.5 20.6-46.5 55.3v129.4h-73.2V194.4h73.2v33.2s22-40.7 74.3-40.7 89.7 31.9 89.7 98v156zM116.3 162.1c-24.9 0-45.2-20.4-45.2-45.5s20.2-45.5 45.2-45.5 45.1 20.4 45.1 45.5-20.2 45.5-45.1 45.5M78.5 440.9h76.4V194.4H78.5z" fill="#ffffff"/>`
            },
            {
                name: 'Instagram',
                url: null,
                color: '#E4405F',
                viewBox: '0 0 512 512',
                content: `<path d="M256 67c-51.3 0-57.8.2-77.9 1.1s-33.9 4.1-45.9 8.8c-12.4 4.8-23 11.3-33.5 21.8s-17 21.1-21.8 33.5c-4.7 12-7.9 25.8-8.8 45.9-.9 20.2-1.1 26.6-1.1 77.9s.2 57.8 1.1 77.9 4.1 33.9 8.8 45.9c4.8 12.4 11.3 23 21.8 33.5s21 17 33.5 21.8c12 4.7 25.8 7.9 45.9 8.8 20.2.9 26.6 1.1 77.9 1.1s57.8-.2 77.9-1.1 33.9-4.1 45.9-8.8c12.4-4.8 23-11.3 33.5-21.8s17-21.1 21.8-33.5c4.6-12 7.8-25.8 8.8-45.9.9-20.2 1.1-26.6 1.1-77.9s-.2-57.8-1.1-77.9-4.1-33.9-8.8-45.9c-4.8-12.4-11.3-23-21.8-33.5s-21-17-33.5-21.8c-12-4.7-25.8-7.9-45.9-8.8-20.2-.9-26.6-1.1-77.9-1.1m-17 34.1h17c50.5 0 56.4.2 76.4 1.1 18.4.8 28.4 3.9 35.1 6.5 8.8 3.4 15.1 7.5 21.7 14.1s10.7 12.9 14.1 21.7c2.6 6.7 5.7 16.7 6.5 35.1.9 19.9 1.1 25.9 1.1 76.4s-.2 56.4-1.1 76.4c-.8 18.4-3.9 28.4-6.5 35.1-3.4 8.8-7.5 15.1-14.1 21.7s-12.9 10.7-21.7 14.1c-6.7 2.6-16.7 5.7-35.1 6.5-19.9.9-25.9 1.1-76.4 1.1s-56.5-.2-76.4-1.1c-18.4-.9-28.4-3.9-35.1-6.5-8.8-3.4-15.1-7.5-21.7-14.1s-10.7-12.9-14.1-21.7c-2.6-6.7-5.7-16.7-6.5-35.1-.9-19.9-1.1-25.9-1.1-76.4s.2-56.4 1.1-76.4c.8-18.4 3.9-28.4 6.5-35.1 3.4-8.8 7.5-15.1 14.1-21.7s12.9-10.7 21.7-14.1c6.7-2.6 16.7-5.7 35.1-6.5 17.4-.9 24.2-1.1 59.4-1.1m117.9 31.4c-12.5 0-22.7 10.1-22.7 22.7 0 12.5 10.2 22.7 22.7 22.7s22.7-10.2 22.7-22.7-10.2-22.8-22.7-22.7M256 159c-53.6 0-97.1 43.5-97.1 97.1s43.5 97 97.1 97 97-43.4 97-97-43.4-97.1-97-97.1m0 34c34.8 0 63 28.2 63 63s-28.2 63-63 63-63-28.2-63-63 28.2-63 63-63" fill="#ffffff"/>`
            },
            {
                name: 'Копировать ссылку',
                url: null,
                color: '#808080',
                viewBox: '0 0 1920 1920',
                transform: 'translate(960,960) scale(0.65) translate(-960,-960)',
                content: `<path d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z" fill="#ffffff"/>`
            },
            {
				name: 'Одноклассники',
				url: (u) => `https://connect.ok.ru/offer?url=${u}`,
				color: '#EE8208',
				viewBox: '0 0 95.481 95.481',
				transform: 'translate(47.7405, 47.7405) scale(0.7) translate(-47.7405, -47.7405)',
				content: `<path d="M43.041,67.254c-7.402-0.772-14.076-2.595-19.79-7.064c-0.709-0.556-1.441-1.092-2.088-1.713    c-2.501-2.402-2.753-5.153-0.774-7.988c1.693-2.426,4.535-3.075,7.489-1.682c0.572,0.27,1.117,0.607,1.639,0.969    c10.649,7.317,25.278,7.519,35.967,0.329c1.059-0.812,2.191-1.474,3.503-1.812c2.551-0.655,4.93,0.282,6.299,2.514    c1.564,2.549,1.544,5.037-0.383,7.016c-2.956,3.034-6.511,5.229-10.461,6.761c-3.735,1.448-7.826,2.177-11.875,2.661    c0.611,0.665,0.899,0.992,1.281,1.376c5.498,5.524,11.02,11.025,16.5,16.566c1.867,1.888,2.257,4.229,1.229,6.425    c-1.124,2.4-3.64,3.979-6.107,3.81c-1.563-0.108-2.782-0.886-3.865-1.977c-4.149-4.175-8.376-8.273-12.441-12.527    c-1.183-1.237-1.752-1.003-2.796,0.071c-4.174,4.297-8.416,8.528-12.683,12.735c-1.916,1.889-4.196,2.229-6.418,1.15    c-2.362-1.145-3.865-3.556-3.749-5.979c0.08-1.639,0.886-2.891,2.011-4.014c5.441-5.433,10.867-10.88,16.295-16.322    C42.183,68.197,42.518,67.813,43.041,67.254z" fill="#ffffff"/><path d="M47.55,48.329c-13.205-0.045-24.033-10.992-23.956-24.218C23.67,10.739,34.505-0.037,47.84,0    c13.362,0.036,24.087,10.967,24.02,24.478C71.792,37.677,60.889,48.375,47.55,48.329z M59.551,24.143    c-0.023-6.567-5.253-11.795-11.807-11.801c-6.609-0.007-11.886,5.316-11.835,11.943c0.049,6.542,5.324,11.733,11.896,11.709    C54.357,35.971,59.573,30.709,59.551,24.143z" fill="#ffffff"/>`
			},
            {
                name: 'ВКонтакте',
                url: (u) => `https://vk.com/share.php?url=${u}`,
                color: '#4C75A3',
                viewBox: '0 0 97.75 97.75',
                content: `<path d="M73.667,54.161c2.278,2.225,4.688,4.319,6.733,6.774c0.906,1.086,1.76,2.209,2.41,3.472c0.928,1.801,0.09,3.776-1.522,3.883   l-10.013-0.002c-2.586,0.214-4.644-0.829-6.379-2.597c-1.385-1.409-2.67-2.914-4.004-4.371c-0.545-0.598-1.119-1.161-1.803-1.604   c-1.365-0.888-2.551-0.616-3.333,0.81c-0.797,1.451-0.979,3.059-1.055,4.674c-0.109,2.361-0.821,2.978-3.19,3.089   c-5.062,0.237-9.865-0.531-14.329-3.083c-3.938-2.251-6.986-5.428-9.642-9.025c-5.172-7.012-9.133-14.708-12.692-22.625   c-0.801-1.783-0.215-2.737,1.752-2.774c3.268-0.063,6.536-0.055,9.804-0.003c1.33,0.021,2.21,0.782,2.721,2.037   c1.766,4.345,3.931,8.479,6.644,12.313c0.723,1.021,1.461,2.039,2.512,2.76c1.16,0.796,2.044,0.533,2.591-0.762   c0.35-0.823,0.501-1.703,0.577-2.585c0.26-3.021,0.291-6.041-0.159-9.05c-0.28-1.883-1.339-3.099-3.216-3.455   c-0.956-0.181-0.816-0.535-0.351-1.081c0.807-0.944,1.563-1.528,3.074-1.528l11.313-0.002c1.783,0.35,2.183,1.15,2.425,2.946   l0.01,12.572c-0.021,0.695,0.349,2.755,1.597,3.21c1,0.33,1.66-0.472,2.258-1.105c2.713-2.879,4.646-6.277,6.377-9.794   c0.764-1.551,1.423-3.156,2.063-4.764c0.476-1.189,1.216-1.774,2.558-1.754l10.894,0.013c0.321,0,0.647,0.003,0.965,0.058   c1.836,0.314,2.339,1.104,1.771,2.895c-0.894,2.814-2.631,5.158-4.329,7.508c-1.82,2.516-3.761,4.944-5.563,7.471   C71.48,50.992,71.611,52.155,73.667,54.161z" fill="#ffffff"/>`
            },
            {
                name: 'Мой Мир',
                url: (u) => `https://connect.mail.ru/share?url=${u}`,
                color: '#005FF9',
                viewBox: '0 0 250 250',
                transform: 'translate(125,125) scale(0.65) translate(-110,-80)',
                content: `<ellipse cx="67.9" cy="21.3" rx="21.3" ry="21.3" fill="#ffffff"/><ellipse cx="154.4" cy="21.3" rx="21.3" ry="21.3" fill="#ffffff"/><path d="M220.6 125.2L194.8 81c-3.2-5.4-10.1-7.3-15.6-4.1-5.4 3.2-7.3 10.1-4.1 15.5l3.8 6.4c-18.9 17.2-43 26.6-68.9 26.6-25.1 0-48.7-9-67.4-25.3l4.5-7.8c3.2-5.4 1.3-12.4-4.1-15.5-5.4-3.2-12.4-1.3-15.6 4.1L1.6 125.1c-3.2 5.4-1.3 12.4 4.1 15.5 1.8 1 3.8 1.5 5.7 1.5 3.9 0 7.7-2 9.8-5.6l8.2-14C52.2 141 80.3 151 110 151c30 0 59.1-10.7 82-29.7l9 15.3c2.1 3.6 5.9 5.6 9.8 5.6 1.9 0 3.9-.5 5.7-1.5 5.4-3.2 7.2-10.1 4.1-15.5z" fill="#ffffff"/>`
            }
        ];

        // -------- СОЗДАНИЕ КНОПКИ-ТРИГГЕРА --------
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'share-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Поделиться');
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M11 6C12.6569 6 14 4.65685 14 3C14 1.34315 12.6569 0 11 0C9.34315 0 8 1.34315 8 3C8 3.22371 8.02449 3.44169 8.07092 3.65143L4.86861 5.65287C4.35599 5.24423 3.70652 5 3 5C1.34315 5 0 6.34315 0 8C0 9.65685 1.34315 11 3 11C3.70652 11 4.35599 10.7558 4.86861 10.3471L8.07092 12.3486C8.02449 12.5583 8 12.7763 8 13C8 14.6569 9.34315 16 11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C10.2935 10 9.644 10.2442 9.13139 10.6529L5.92908 8.65143C5.97551 8.44169 6 8.22371 6 8C6 7.77629 5.97551 7.55831 5.92908 7.34857L9.13139 5.34713C9.644 5.75577 10.2935 6 11 6Z" fill="#FFFFFF"/>
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

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const [, , w, h] = social.viewBox.split(' ').map(Number);
            svg.setAttribute('viewBox', social.viewBox);
            svg.setAttribute('width', '44');
            svg.setAttribute('height', '44');
            svg.style.display = 'block';

            // Круг
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', w / 2);
            circle.setAttribute('cy', h / 2);
            circle.setAttribute('r', Math.min(w, h) / 2);
            circle.setAttribute('fill', 'currentColor');
            svg.appendChild(circle);

            // Группа с содержимым и трансформацией
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            if (social.transform) {
                group.setAttribute('transform', social.transform);
            }
            group.insertAdjacentHTML('beforeend', social.content);
            svg.appendChild(group);

            item.appendChild(svg);

            const label = document.createElement('span');
            label.textContent = social.name;
            label.style.cssText = 'font-size:0.75rem; opacity:0.8; margin-top:4px; display:block; text-align:center;';
            item.appendChild(label);

            item.style.color = '#00ff41';
            item.style.transition = 'color 0.3s ease';
            item.style.textDecoration = 'none';
            item.style.display = 'inline-flex';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'center';
            item.style.margin = '6px 8px';
            item.style.cursor = 'pointer';

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

        document.addEventListener('click', (e) => {
            if (isOpen && !panel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
                closePanel();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closePanel();
            }
        });

        // -------- СТИЛИ --------
        const style = document.createElement('style');
        style.textContent = `
            .share-toggle-btn {
                position: fixed;
                right: 20px;
                bottom: 90px;
                z-index: 999;
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background-color: #00ff41;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                padding: 0;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 8px rgba(0, 255, 65, 0.3);
            }
            .share-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 16px rgba(0, 255, 65, 0.5);
            }
            .share-toggle-btn:active {
                transform: scale(0.95);
            }
            .share-toggle-btn svg {
                width: 28px;
                height: 28px;
                display: block;
            }
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
                    width: 56px;
                    height: 56px;
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

// ===== PWA INSTALL BUTTON =====
(function initPwaInstall() {
    let deferredPrompt = null;
    let installBtn = null;

    function createButton() {
        if (installBtn) return;
        installBtn = document.createElement('button');
        installBtn.id = 'installPwaBtn';
        installBtn.className = 'pwa-install-btn';
        installBtn.textContent = '📲 Установить приложение';
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('[PWA] Установлено');
                } else {
                    console.log('[PWA] Отказ');
                }
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
        document.body.appendChild(installBtn);
        // По умолчанию скрыта, покажем только при событии
        installBtn.style.display = 'none';
    }

    function showButton() {
        if (installBtn) {
            installBtn.style.display = 'block';
        } else {
            createButton();
            setTimeout(() => {
                if (installBtn) installBtn.style.display = 'block';
            }, 50);
        }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showButton();
    });

    // Если уже установлено (например, после установки) — скрываем
    window.addEventListener('appinstalled', () => {
        if (installBtn) installBtn.style.display = 'none';
        deferredPrompt = null;
    });

    // На случай, если событие не сработало (iOS, или не поддерживается), можно показать кнопку для инструкции, но пока ничего не делаем.
    createButton();
})();