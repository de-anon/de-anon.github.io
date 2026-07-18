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

async function loadLanguage(lang) {
    try {
        const res = await fetch(`/lang/${lang}.json`);
        const data = await res.json();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) el.textContent = data[key];
        });
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);

        // Update flag
        const flags = {
            ru: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>',
            en: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#bd3d44" d="M0 0h640v480H0"/><path stroke="#fff" stroke-width="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/><path fill="#192f5d" d="M0 0h364.8v258.5H0"/></svg>',
            fr: '<svg viewBox="0 0 640 480" style="width:20px;height:15px;"><path fill="#000091" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#e1000f" d="M426.7 0H640v480H426.7z"/></svg>'
        };

        // Обновляем флаг в кнопке
        document.getElementById('langToggleBtn').innerHTML = flags[lang];

        // Обновляем заголовок вкладки
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
        document.querySelector('#langDropdown .dropdown-menu').classList.remove('active');
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
        document.querySelector('#themeDropdown .dropdown-menu').classList.remove('active');
    });
});
applyTheme(localStorage.getItem('theme') || 'dark');

// Dropdown toggles
document.getElementById('themeToggleBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('#themeDropdown .dropdown-menu').classList.toggle('active');
    document.querySelector('#langDropdown .dropdown-menu').classList.remove('active');
});
document.getElementById('langToggleBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('#langDropdown .dropdown-menu').classList.toggle('active');
    document.querySelector('#themeDropdown .dropdown-menu').classList.remove('active');
});
document.body.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('active'));
});

// BVI Panel
const bviPanel = document.getElementById('bviPanel');
document.getElementById('bviBtn').addEventListener('click', () => bviPanel.classList.add('active'));
document.getElementById('bviClose').addEventListener('click', () => bviPanel.classList.remove('active'));

document.getElementById('bviFontSize').addEventListener('input', e => {
    document.documentElement.style.setProperty('--font-size-base', e.target.value + 'px');
});
document.getElementById('bviUiSize').addEventListener('input', e => {
    document.documentElement.style.setProperty('--ui-scale', e.target.value / 100);
});
document.getElementById('bviSerif').addEventListener('change', e => {
    document.documentElement.style.setProperty('--font-family', e.target.checked ? 'Georgia, serif' : "'Courier New', monospace");
});

// Layout Toggle
document.getElementById('layoutToggle').addEventListener('click', () => {
    document.body.classList.toggle('force-desktop');
    document.body.classList.toggle('force-mobile');
});

// Cards Autoload System
async function loadCards() {
    try {
        // ВАЖНО: Для работы автозагрузки создай файл cards/manifest.json 
        // с массивом названий файлов, например: ["card1.json", "card2.json"]
        const res = await fetch('cards/manifest.json');
        const files = await res.json();
        const grid = document.getElementById('cardsGrid');
        grid.innerHTML = '';
        
        for (const file of files) {
            const cardRes = await fetch(`cards/${file}`);
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
        document.getElementById('cardsGrid').innerHTML = '<p style="color:var(--text-color)">No cards found. Create cards/manifest.json</p>';
    }
}

function openModal(card) {
    const modal = document.getElementById('modalContent');
    modal.innerHTML = `
        <button class="modal-close" id="modalClose">&times;</button>
        <img src="${card.photo}" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
        <h2>${card.name}</h2>
        <p>Phone: ${card.phone}</p>
        <p>Address: ${card.address}</p>
        <p>Socials: ${card.socials}</p>
    `;
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalClose').addEventListener('click', closeModal);
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target.id === 'modalOverlay') closeModal(); });

// Search & Filter
document.getElementById('searchInput').addEventListener('input', filterCards);
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCards();
    });
});

function filterCards() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    document.querySelectorAll('.card').forEach(card => {
        const text = card.textContent.toLowerCase();
        const type = card.getAttribute('data-type');
        const termMatch = text.includes(term);
        const typeMatch = (activeFilter === 'all' || type === activeFilter);
        card.style.display = (termMatch && typeMatch) ? 'block' : 'none';
    });
}

// Init
loadLanguage(currentLang);
loadCards();