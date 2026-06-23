const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
const ICON_URL = browserAPI.runtime.getURL('icons/icon.svg');
const ATTR = 'data-flash-id';
const ICON_SIZE = 18;
const ICON_MARGIN = 6;

const FIELD_PATTERNS = [
    { field: 'fullName', tests: [/full.?name/i, /fname/i, /given.?name/i] },
    { field: 'firstName', tests: [/first.?name/i, /fname/i, /given.?name/i] },
    {
        field: 'lastName',
        tests: [/last.?name/i, /lname/i, /family.?name/i, /surname/i],
    },
    { field: 'email', tests: [/email/i] },
    { field: 'password', tests: [/password/i, /passwd/i] },
    { field: 'phone', tests: [/phone/i, /tel(ephone)?/i, /mobile/i] },
    { field: 'address', tests: [/address/i, /street/i] },
    { field: 'ssn', tests: [/ssn/i, /social.?security/i] },
    {
        field: 'bd',
        tests: [/\bdob\b/i, /birth.?date/i, /date.?of.?birth/i, /birthday/i],
    },
    { field: 'bdYear', tests: [/birth.?year/i, /\byear\b/i] },
    { field: 'bdMonth', tests: [/birth.?month/i, /\bmonth\b/i] },
    { field: 'bdDay', tests: [/birth.?day/i, /\bday\b/i] },
    { field: 'state', tests: [/\bstate\b/i] },
    { field: 'promoCode', tests: [/promo/i, /coupon/i] },
];

let profile = null;
let activePopover = null;
let iconCounter = 0;

// input → icon
const iconMap = new Map();

const sharedIntersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        const icon = iconMap.get(entry.target);
        if (!icon) continue;
        if (entry.isIntersecting) {
            positionIcon(entry.target, icon);
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    }
}, { threshold: 0 });

function repositionAll() {
    for (const [input, icon] of iconMap) {
        if (icon.style.display !== 'none') positionIcon(input, icon);
    }
}
window.addEventListener('scroll', repositionAll, { passive: true });
window.addEventListener('resize', repositionAll, { passive: true });

// Load profile from storage and inject
browserAPI.storage.local.get(STORAGE_KEY, (result) => {
    if (result[STORAGE_KEY]) {
        profile = result[STORAGE_KEY];
        injectAll();
    }
});

// Re-inject when profile changes from popup
browserAPI.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return;
    profile = changes[STORAGE_KEY].newValue ?? null;
    if (profile) injectAll();
    else removeAll();
});

// ── Injection ─────────────────────────────────────────────────────────────────

function injectAll() {
    document
    .querySelectorAll(
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea'
    )
    .forEach(injectIcon);
    observeNewInputs();
}

function removeAll() {
    document.querySelectorAll('[data-flash-icon]').forEach((el) => el.remove());
    document.querySelectorAll(`[${ATTR}]`).forEach((el) => {
        el.style.paddingRight = '';
        el.removeAttribute(ATTR);
    });
    for (const input of iconMap.keys()) sharedIntersectionObserver.unobserve(input);
    iconMap.clear();
}

let observer = null;
function observeNewInputs() {
    if (observer) return;
    observer = new MutationObserver(() => {
        if (!profile) return;
        document
        .querySelectorAll(
            `input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([${ATTR}]), textarea:not([${ATTR}])`
        )
        .forEach(injectIcon);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function injectIcon(input) {
    if (input.hasAttribute(ATTR)) return;

    const id = `flash-${++iconCounter}`;
    input.setAttribute(ATTR, id);

    const currentPadding = parseInt(getComputedStyle(input).paddingRight) || 0;
    input.style.paddingRight = `${currentPadding + ICON_SIZE + ICON_MARGIN * 2}px`;

    const icon = document.createElement('img');
    icon.src = ICON_URL;
    icon.setAttribute('data-flash-icon', id);
    icon.style.cssText = `
    position: absolute;
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    cursor: pointer;
    z-index: 2147483646;
    pointer-events: all;
    opacity: 0.7;
    transition: opacity 0.15s;
    border-radius: 3px;
  `;
    icon.addEventListener('mouseenter', () => {
        icon.style.opacity = '1';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.opacity = '0.7';
    });
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showPopover(input, icon);
    });

    positionIcon(input, icon);
    document.body.appendChild(icon);

    iconMap.set(input, icon);
    sharedIntersectionObserver.observe(input);
}

function positionIcon(input, icon) {
    const rect = input.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
        icon.style.display = 'none';
        return;
    }
    icon.style.display = 'block';
    icon.style.top = `${rect.top + window.scrollY + (rect.height - ICON_SIZE) / 2}px`;
    icon.style.left = `${rect.right + window.scrollX - ICON_SIZE - ICON_MARGIN}px`;
}

// ── Popover ───────────────────────────────────────────────────────────────────

function showPopover(input, anchor) {
    closePopover();

    const guessed = guessField(input);
    const entries = Object.entries(FIELD_LABELS)
    .map(([field, label]) => ({ field, label, value: profile?.[field] }))
    .filter(
        ({ value }) => value !== undefined && value !== null && value !== ''
    );

    if (guessed) entries.sort((a) => (a.field === guessed ? -1 : 1));

    const pop = document.createElement('div');
    pop.setAttribute('data-flash-popover', '');
    pop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    z-index: 2147483647;
    background: #111111;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.7);
    padding: 6px;
    min-width: 200px;
    max-width: 280px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    color: #ffffff;
  `;

    if (entries.length === 0) {
        pop.innerHTML = `<div style="padding:8px 10px;color:#cacaca;font-size:11px;">Немає даних профілю</div>`;
    } else {
        entries.forEach(({ label, value, field }) => {
            const row = document.createElement('div');
            const isGuessed = field === guessed;
            row.style.cssText = `
        display:flex;align-items:center;gap:8px;
        padding:6px 10px;border-radius:6px;cursor:pointer;
        background:${isGuessed ? 'rgba(255,255,255,0.08)' : 'transparent'};
        transition:background 0.1s;
      `;
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(255,255,255,0.1)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = isGuessed
                    ? 'rgba(255,255,255,0.08)'
                    : 'transparent';
            });

            const labelEl = document.createElement('span');
            labelEl.style.cssText = `color:${isGuessed ? '#ffffff' : '#cacaca'};font-size:10px;width:68px;flex-shrink:0;`;
            labelEl.textContent = label;

            const valEl = document.createElement('span');
            valEl.style.cssText =
                'color:#ffffff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;';
            valEl.textContent = String(value);

            row.appendChild(labelEl);
            row.appendChild(valEl);
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                fillInput(input, String(value));
                closePopover();
            });
            pop.appendChild(row);
        });
    }

    document.documentElement.appendChild(pop);
    activePopover = pop;
    requestAnimationFrame(() => positionPopover(anchor, pop));

    setTimeout(() => {
        document.addEventListener('click', closePopover, { once: true });
    }, 0);
}

function positionPopover(anchor, pop) {
    const MARGIN = 8;
    const rect = anchor.getBoundingClientRect();
    const popW = pop.offsetWidth;
    const popH = pop.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + 4;
    if (top + popH + MARGIN > vh) top = rect.top - popH - 4;
    top = Math.max(MARGIN, Math.min(top, vh - popH - MARGIN));

    let left = rect.left;
    left = Math.max(MARGIN, Math.min(left, vw - popW - MARGIN));

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
    pop.style.opacity = '1';
    pop.style.pointerEvents = 'auto';
}

function closePopover() {
    if (activePopover) {
        activePopover.remove();
        activePopover = null;
    }
}

function guessField(input) {
    const attrs = [
        input.name,
        input.id,
        input.placeholder,
        input.getAttribute('autocomplete'),
        input.type,
    ]
    .filter(Boolean)
    .join(' ');
    for (const { field, tests } of FIELD_PATTERNS) {
        if (tests.some((re) => re.test(attrs))) return field;
    }
    if (input.type === 'email') return 'email';
    if (input.type === 'password') return 'password';
    if (input.type === 'tel') return 'phone';
    return null;
}

function fillInput(input, value) {
    const proto =
        input.tagName === 'TEXTAREA'
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.focus();
}
