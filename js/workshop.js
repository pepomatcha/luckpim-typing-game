const STORAGE_KEY = 'speed_typing_player_vocab';
const MOD_REGISTRY_KEY = 'speed_typing_mods';

let fallbackVocab = { "ง่าย": {}, "ปานกลาง": {}, "ยาก": {} }; 
let fallbackMods = {}; 

// --- ระบบคำศัพท์ที่สร้างเอง (Workshop) ---
function getPlayerVocab() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : fallbackVocab;
    } catch (e) { return fallbackVocab; }
}

function savePlayerVocab(vocab) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vocab)); } 
    catch (e) { fallbackVocab = vocab; }
}

function addCustomWord(level, category, word) {
    const vocab = getPlayerVocab();
    if (!vocab[level]) vocab[level] = {};
    if (!vocab[level][category]) vocab[level][category] = [];
    if (!vocab[level][category].includes(word)) {
        vocab[level][category].push(word);
        savePlayerVocab(vocab);
        return true;
    }
    return false;
}

function removeCustomWord(level, category, word) {
    const vocab = getPlayerVocab();
    if (vocab[level] && vocab[level][category]) {
        vocab[level][category] = vocab[level][category].filter(w => w !== word);
        if (vocab[level][category].length === 0) delete vocab[level][category];
        savePlayerVocab(vocab);
        return true;
    }
    return false;
}

function exportModJSON() {
    let fileName = prompt("ตั้งชื่อไฟล์ม็อดของคุณ:", "my_typing_mod");
    if (!fileName) return;
    fileName = fileName.trim() + ".json";
    
    // ส่งออกเป็น JSON เพื่อให้นำเข้าได้ง่าย
    const vocab = getPlayerVocab();
    const modData = {
        modName: fileName.replace('.json', ''),
        author: "Player",
        data: vocab
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(modData, null, 4));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = fileName;
    a.click();
}

// --- ระบบบริหารจัดการม็อด (Mod Manager) ---
function getInstalledMods() {
    try {
        const data = localStorage.getItem(MOD_REGISTRY_KEY);
        return data ? JSON.parse(data) : fallbackMods;
    } catch (e) { return fallbackMods; }
}

function saveInstalledMods(mods) {
    try { localStorage.setItem(MOD_REGISTRY_KEY, JSON.stringify(mods)); } 
    catch (e) { fallbackMods = mods; }
}

function installMod(modData) {
    const mods = getInstalledMods();
    const modId = modData.modName || `mod_${Date.now()}`;
    mods[modId] = {
        name: modId,
        active: true, // เปิดใช้งานอัตโนมัติเมื่อติดตั้ง
        content: modData.data
    };
    saveInstalledMods(mods);
}

function toggleModStatus(modId, isActive) {
    const mods = getInstalledMods();
    if (mods[modId]) {
        mods[modId].active = isActive;
        saveInstalledMods(mods);
    }
}

function deleteMod(modId) {
    const mods = getInstalledMods();
    if (mods[modId]) {
        delete mods[modId];
        saveInstalledMods(mods);
    }
}

// --- การผสานคำศัพท์ทั้งหมดก่อนเริ่มเกม ---
function getMergedVocab() {
    const merged = { "ง่าย": {}, "ปานกลาง": {}, "ยาก": {} };

    // 1. นำคำศัพท์พื้นฐานมาใส่
    for (const level in baseVocab) {
        for (const cat in baseVocab[level]) {
            merged[level][cat] = [...baseVocab[level][cat]];
        }
    }

    // ฟังก์ชันเสริมสำหรับผสานข้อมูล
    const mergeData = (sourceData) => {
        for (const level in sourceData) {
            if (!merged[level]) merged[level] = {};
            for (const cat in sourceData[level]) {
                if (!merged[level][cat]) merged[level][cat] = [];
                sourceData[level][cat].forEach(word => {
                    if (!merged[level][cat].includes(word)) merged[level][cat].push(word);
                });
            }
        }
    };

    // 2. ผสานคำศัพท์จาก Workshop ส่วนตัว
    mergeData(getPlayerVocab());

    // 3. ผสานคำศัพท์จาก Mods ที่ "เปิดใช้งานอยู่"
    const mods = getInstalledMods();
    for (const modId in mods) {
        if (mods[modId].active && mods[modId].content) {
            mergeData(mods[modId].content);
        }
    }

    return merged;
}