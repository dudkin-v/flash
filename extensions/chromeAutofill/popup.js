const jsonInput = document.getElementById('json-input');
const fieldsEl = document.getElementById('fields');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');
const btnClear = document.getElementById('btn-clear');
const toast = document.getElementById('toast');

let profile = null;

chrome.storage.local.get(STORAGE_KEY, (result) => {
    const saved = result[STORAGE_KEY];
    if (saved) {
        jsonInput.value = JSON.stringify(saved, null, 2);
        parseInput(jsonInput.value);
    }
});

jsonInput.addEventListener('input', () => {
    parseInput(jsonInput.value.trim());
});

btnClear.addEventListener('click', () => {
    jsonInput.value = '';
    profile = null;
    fieldsEl.innerHTML = '';
    fieldsEl.classList.remove('visible');
    errorEl.classList.remove('visible');
    resultEl.classList.remove('visible');
    chrome.storage.local.remove(STORAGE_KEY);
});

function parseInput(text) {
    errorEl.classList.remove('visible');
    resultEl.classList.remove('visible');

    if (!text) {
        fieldsEl.innerHTML = '';
        fieldsEl.classList.remove('visible');
        profile = null;
        return;
    }

    try {
        profile = JSON.parse(text);
        chrome.storage.local.set({ [STORAGE_KEY]: profile });
        renderFields(profile);
    } catch {
        errorEl.textContent = 'Невірний JSON';
        errorEl.classList.add('visible');
        fieldsEl.innerHTML = '';
        fieldsEl.classList.remove('visible');
        profile = null;
    }
}

function renderFields(data) {
    fieldsEl.innerHTML = '';

    const entries = Object.entries(data).filter(
        ([, v]) => v !== '' && v !== null && v !== undefined
    );

    if (entries.length === 0) {
        fieldsEl.classList.remove('visible');
        return;
    }

    for (const [key, value] of entries) {
        const row = document.createElement('div');
        row.className = 'field-row';
        row.title = 'Натисніть, щоб скопіювати';

        const keyEl = document.createElement('span');
        keyEl.className = 'field-key';
        keyEl.textContent = FIELD_LABELS[key] ?? key;

        const valEl = document.createElement('span');
        valEl.className = 'field-val';
        valEl.textContent = String(value);

        const hint = document.createElement('span');
        hint.className = 'copy-hint';
        hint.textContent = 'копія';

        row.appendChild(keyEl);
        row.appendChild(valEl);
        row.appendChild(hint);

        row.addEventListener('click', () => {
            navigator.clipboard
                .writeText(String(value))
                .then(() => showToast());
        });

        fieldsEl.appendChild(row);
    }

    fieldsEl.classList.add('visible');
}

let toastTimer = null;
function showToast() {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
}
