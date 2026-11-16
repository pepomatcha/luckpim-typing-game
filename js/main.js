// --- ตัวแปรหลักของเกม ---
let game;
let currentLevel = "ง่าย";
let currentDesc = "คำสั้น";
let wsCurrentLevel = "ง่าย";

// --- ระบบภาษา (UI Localization) ---
const uiDict = {
    th: {
        menuPlay: "เล่นเกม", menuVocab: "จัดการคำศัพท์", menuMod: "จัดการม็อด", menuSettings: "การตั้งค่า", menuExit: "ออกจากเกม",
        btnBackMain: "< กลับเมนูหลัก", btnBack: "< ย้อนกลับ", titleLevel: "เลือกระดับ",
        levelEasy: "> ง่าย (คำสั้น)", levelMed: "> ปานกลาง (คำยาว)", levelHard: "> ยาก (ประโยค)",
        wsEasy: "ง่าย", wsMed: "ปานกลาง", wsHard: "ยาก",
        titleGame: "เล่นเกม", titleResult: "🎉 สรุปผลการเล่น", resScoreText: "คะแนน:", resTimeText: "เวลาที่ใช้:", resSpeedText: "ความเร็ว:",
        btnRetry: "เล่นอีกครั้ง", lblLevel: "ระดับความยาก:", lblCat: "ชื่อหมวดหมู่:", lblWord: "คำศัพท์ / ประโยค:",
        btnAddWord: "เพิ่มคำศัพท์", titleCustom: "คำศัพท์ที่คุณเพิ่มเอง", btnExport: "ส่งออกเป็นไฟล์ม็อด (.json)",
        lblImport: "นำเข้าไฟล์ม็อด (.json):", titleInstalled: "รายการม็อดที่ติดตั้งแล้ว", lblLang: "เลือกภาษา (Language):", lblType: "พิมพ์:",
        msgExit: "ขอบคุณที่เข้ามาเล่น LUCKPIM ครับ!", msgModSuccess: "นำเข้าม็อดเรียบร้อย!", btnDel: "ลบ", btnDelMod: "ลบทิ้ง",
        alertFill: "❌ กรุณากรอกชื่อหมวดหมู่และคำศัพท์", alertInvalid: "❌ โครงสร้างไฟล์ม็อดไม่ถูกต้อง", alertReadFail: "❌ อ่านไฟล์ไม่สำเร็จ"
    },
    en: {
        menuPlay: "Play Game", menuVocab: "Manage Vocab", menuMod: "Mod Manager", menuSettings: "Settings", menuExit: "Exit Game",
        btnBackMain: "< Back to Menu", btnBack: "< Back", titleLevel: "Select Level",
        levelEasy: "> Easy (Short)", levelMed: "> Medium (Long)", levelHard: "> Hard (Sentences)",
        wsEasy: "Easy", wsMed: "Medium", wsHard: "Hard",
        titleGame: "Play Game", titleResult: "🎉 Results", resScoreText: "Score:", resTimeText: "Time:", resSpeedText: "Speed:",
        btnRetry: "Play Again", lblLevel: "Difficulty Level:", lblCat: "Category Name:", lblWord: "Word / Sentence:",
        btnAddWord: "Add Word", titleCustom: "Your Custom Words", btnExport: "Export Mod (.json)",
        lblImport: "Import Mod (.json):", titleInstalled: "Installed Mods", lblLang: "Select Language:", lblType: "Type:",
        msgExit: "Thank you for playing LUCKPIM!", msgModSuccess: "Mod imported successfully!", btnDel: "Delete", btnDelMod: "Delete",
        alertFill: "❌ Please fill in category and word", alertInvalid: "❌ Invalid mod file structure", alertReadFail: "❌ Failed to read file"
    }
};

// --- พจนานุกรมสำหรับหมวดหมู่พื้นฐาน ---
const catDict = {
    th: { "สถานที่": "สถานที่", "อาหาร": "อาหาร", "สัตว์": "สัตว์" },
    en: { "สถานที่": "Places", "อาหาร": "Food", "สัตว์": "Animals" }
};

let currentAppLang = localStorage.getItem('luckpim_lang') || 'th';

// ฟังก์ชันช่วยแปลชื่อหมวดหมู่
function getDisplayCategory(catName) {
    if (catDict[currentAppLang] && catDict[currentAppLang][catName]) {
        return catDict[currentAppLang][catName];
    }
    return catName;
}

function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiDict[currentAppLang][key]) el.innerText = uiDict[currentAppLang][key];
    });
    
    const langBtn = document.getElementById('global-lang-btn');
    if (langBtn) langBtn.innerText = currentAppLang === 'th' ? '🇹🇭 TH' : '🇬🇧 EN';
    
    document.querySelectorAll('.btn-lang-opt').forEach(btn => {
        btn.style.background = btn.dataset.lang === currentAppLang ? '#e3fafc' : '';
    });
}

function setLanguage(lang) {
    currentAppLang = lang;
    localStorage.setItem('luckpim_lang', lang);
    applyLanguage();
    
    if (document.getElementById('workshop-screen').classList.contains('active')) renderWorkshopVocab();
    if (document.getElementById('mod-manager-screen').classList.contains('active')) renderModList();
    if (document.getElementById('category-screen').classList.contains('active')) loadCategories(currentLevel, currentDesc);
}

// --- การทำงานเมื่อโหลดหน้าเว็บเสร็จ ---
document.addEventListener('DOMContentLoaded', () => {
    game = new TypingGame(renderGameUI, showResultUI);
    applyLanguage();

    // 1. ปุ่มเมนูหลัก
    document.getElementById('btn-play-menu')?.addEventListener('click', () => showScreen('level-screen'));
    document.getElementById('btn-workshop-menu')?.addEventListener('click', () => {
        showScreen('workshop-screen');
        renderWorkshopVocab();
    });
    document.getElementById('btn-mod-manager-menu')?.addEventListener('click', () => {
        showScreen('mod-manager-screen');
        renderModList();
    });
    document.getElementById('btn-settings-menu')?.addEventListener('click', () => showScreen('settings-screen'));
    document.getElementById('btn-exit-menu')?.addEventListener('click', () => alert(uiDict[currentAppLang].msgExit));

    // 2. ปุ่มกลับและออกเกม
    document.querySelectorAll('.btn-to-main').forEach(btn => {
        btn.addEventListener('click', () => showScreen('main-menu'));
    });
    document.getElementById('btn-back-level')?.addEventListener('click', () => showScreen('level-screen'));
    document.getElementById('btn-quit-game')?.addEventListener('click', () => {
        game.reset();
        showScreen('category-screen');
    });
    
    // ปุ่มเล่นอีกครั้ง -> กลับไปที่หน้าเลือกระดับความยาก
    document.getElementById('btn-retry')?.addEventListener('click', () => {
        showScreen('level-screen');
    });

    // 3. เลือกระดับความยาก
    document.querySelectorAll('.btn-level').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLevel = e.target.dataset.level;
            currentDesc = e.target.dataset.desc;
            loadCategories(currentLevel, currentDesc);
        });
    });

    // 4. พิมพ์คีย์บอร์ดในเกม
    window.addEventListener('keydown', (e) => {
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen && gameScreen.classList.contains('active')) {
            if (e.key === 'Enter' || e.key === 'Backspace' || e.key.length === 1) {
                if (e.key === 'Enter') e.preventDefault();
                game.handleInput(e.key);
            }
        }
    });

    // 5. หน้า จัดการคำศัพท์
    document.querySelectorAll('.ws-level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.ws-level-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            wsCurrentLevel = e.target.dataset.value;
        });
    });

    document.getElementById('btn-add-word')?.addEventListener('click', () => {
        const cat = document.getElementById('ws-cat').value.trim();
        const word = document.getElementById('ws-word').value.trim();
        if (cat && word) {
            addCustomWord(wsCurrentLevel, cat, word);
            document.getElementById('ws-word').value = '';
            renderWorkshopVocab();
        } else {
            alert(uiDict[currentAppLang].alertFill);
        }
    });

    document.getElementById('btn-export-mod')?.addEventListener('click', exportModJSON);

    // 6. หน้า จัดการม็อด
    document.getElementById('mod-file-input')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const modData = JSON.parse(event.target.result);
                if (modData && modData.data) {
                    installMod(modData);
                    alert(`✅ ${uiDict[currentAppLang].msgModSuccess}`);
                    renderModList();
                } else {
                    alert(uiDict[currentAppLang].alertInvalid);
                }
            } catch (err) {
                alert(uiDict[currentAppLang].alertReadFail);
            }
            e.target.value = ''; 
        };
        reader.readAsText(file);
    });

    // 7. ปุ่มสลับภาษา
    document.getElementById('global-lang-btn')?.addEventListener('click', () => {
        setLanguage(currentAppLang === 'th' ? 'en' : 'th');
    });
    document.querySelectorAll('.btn-lang-opt').forEach(btn => {
        btn.addEventListener('click', (e) => setLanguage(e.target.dataset.lang));
    });
});

// --- UI Functions ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function loadCategories(level, desc) {
    const merged = getMergedVocab();
    const categories = Object.keys(merged[level] || {});
    const container = document.getElementById('category-list');
    
    let levelName = level;
    let descName = desc;
    if (currentAppLang === 'en') {
        if(level === 'ง่าย') levelName = 'Easy', descName = 'Short';
        if(level === 'ปานกลาง') levelName = 'Medium', descName = 'Long';
        if(level === 'ยาก') levelName = 'Hard', descName = 'Sentences';
    }
    document.getElementById('category-level-title').innerText = currentAppLang === 'th' 
        ? `เลือกหมวดหมู่ระดับ: ${level} (${desc})` 
        : `Select Category: ${levelName} (${descName})`;
        
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'btn-category-item';
        
        const displayCat = getDisplayCategory(cat);
        btn.innerText = `> ${displayCat}`;
        
        btn.onclick = () => {
            document.querySelectorAll('.btn-category-item').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            setTimeout(() => {
                // เริ่มเล่นเกม หากผ่านเงื่อนไข (คำศัพท์ >= 3 คำ) ถึงเปลี่ยนหน้าไปหน้าเกม
                if (game.start(level, cat)) {
                    showScreen('game-screen');
                }
            }, 150);
        };
        container.appendChild(btn);
    });
    showScreen('category-screen');
}

function renderWorkshopVocab() {
    const container = document.getElementById('custom-vocab-list');
    if (!container) return;
    const vocab = getPlayerVocab();
    container.innerHTML = '';
    let hasCustom = false;
    
    for (const level in vocab) {
        for (const cat in vocab[level]) {
            if (vocab[level][cat].length > 0) {
                hasCustom = true;
                const catTitle = document.createElement('div');
                catTitle.style.fontWeight = 'bold';
                catTitle.style.marginTop = '10px';
                
                let levelLabel = level;
                if(currentAppLang === 'en') {
                    if(level === 'ง่าย') levelLabel = 'Easy';
                    if(level === 'ปานกลาง') levelLabel = 'Medium';
                    if(level === 'ยาก') levelLabel = 'Hard';
                }
                catTitle.innerText = `[${levelLabel}] ${currentAppLang === 'th' ? 'หมวด' : 'Category'}: ${getDisplayCategory(cat)}`;
                container.appendChild(catTitle);
                
                vocab[level][cat].forEach(word => {
                    const wordRow = document.createElement('div');
                    wordRow.style.display = 'flex';
                    wordRow.style.justifyContent = 'space-between';
                    wordRow.style.padding = '4px 10px';
                    wordRow.style.background = '#f9f9f9';
                    wordRow.style.margin = '4px 0';
                    wordRow.style.borderRadius = '5px';
                    
                    const textSpan = document.createElement('span');
                    textSpan.innerText = word;
                    
                    const delBtn = document.createElement('button');
                    delBtn.innerText = uiDict[currentAppLang].btnDel;
                    delBtn.style.color = '#c92a2a';
                    delBtn.style.border = 'none';
                    delBtn.style.background = 'transparent';
                    delBtn.style.cursor = 'pointer';
                    delBtn.style.fontFamily = 'Itim, sans-serif';
                    delBtn.onclick = () => {
                        removeCustomWord(level, cat, word);
                        renderWorkshopVocab();
                    };
                    
                    wordRow.appendChild(textSpan);
                    wordRow.appendChild(delBtn);
                    container.appendChild(wordRow);
                });
            }
        }
    }
    if (!hasCustom) container.innerHTML = `<div style="color: #888; text-align: center; margin-top: 20px;">(${currentAppLang === 'th' ? 'ยังไม่มีคำศัพท์ที่คุณเพิ่มเอง' : 'No custom words yet'})</div>`;
}

function renderModList() {
    const container = document.getElementById('mod-registry-list');
    if (!container) return;
    const mods = getInstalledMods();
    container.innerHTML = '';
    
    const modKeys = Object.keys(mods);
    if (modKeys.length === 0) {
        container.innerHTML = `<div style="color: #888; text-align: center; margin-top: 50px;">(${currentAppLang === 'th' ? 'ยังไม่มีม็อดที่ติดตั้ง' : 'No mods installed'})</div>`;
        return;
    }

    modKeys.forEach(modId => {
        const mod = mods[modId];
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '10px';
        row.style.background = mod.active ? '#e3fafc' : '#f1f3f5';
        row.style.borderBottom = '1px solid #ccc';
        row.style.marginBottom = '5px';
        row.style.borderRadius = '8px';

        const leftSection = document.createElement('div');
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';
        leftSection.style.gap = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = mod.active;
        checkbox.style.transform = 'scale(1.5)';
        checkbox.onchange = (e) => {
            toggleModStatus(modId, e.target.checked);
            renderModList();
        };

        const nameSpan = document.createElement('span');
        nameSpan.innerText = mod.name;
        nameSpan.style.fontSize = '1.2rem';
        nameSpan.style.color = mod.active ? '#000' : '#888';

        leftSection.appendChild(checkbox);
        leftSection.appendChild(nameSpan);

        const delBtn = document.createElement('button');
        delBtn.innerText = uiDict[currentAppLang].btnDelMod;
        delBtn.style.color = '#fff';
        delBtn.style.background = '#c92a2a';
        delBtn.style.border = 'none';
        delBtn.style.padding = '5px 10px';
        delBtn.style.borderRadius = '5px';
        delBtn.style.cursor = 'pointer';
        delBtn.style.fontFamily = 'Itim, sans-serif';
        delBtn.onclick = () => {
            const msg = currentAppLang === 'th' ? `แน่ใจหรือไม่ที่จะลบม็อด "${mod.name}"?` : `Are you sure you want to delete mod "${mod.name}"?`;
            if (confirm(msg)) {
                deleteMod(modId);
                renderModList();
            }
        };

        row.appendChild(leftSection);
        row.appendChild(delBtn);
        container.appendChild(row);
    });
}

function renderGameUI(state) {
    document.getElementById('game-meta').innerText = getDisplayCategory(state.category);
    document.getElementById('game-progress').innerText = (currentAppLang === 'th' ? 'ข้อที่: ' : 'Item: ') + state.progress;
    
    const timerEl = document.getElementById('game-timer');
    if (timerEl) {
        timerEl.innerText = (currentAppLang === 'th' ? '⏱️ เวลา: ' : '⏱️ Time: ') + state.time + (currentAppLang === 'th' ? ' วิ' : 's');
    }
    
    document.getElementById('target-word').innerText = state.targetWord;
    document.getElementById('typed-display').innerText = state.typedText;
    document.getElementById('game-status').innerText = state.statusText;
}

function showResultUI(result) {
    showScreen('result-screen');
    document.getElementById('res-score').innerText = `${result.score} / ${result.total}`;
    document.getElementById('res-time').innerText = `${result.time} ${currentAppLang === 'th' ? 'วินาที' : 's'}`;
    document.getElementById('res-wpm').innerText = `${result.wpm} WPM`;
}