# LUCKPIM — Web-Based Thai & English Typing Game

**LUCKPIM** is an interactive, web-based typing practice game designed to help elementary school students and general learners improve Thai spelling accuracy and typing speed (WPM) through a colorful, accessible interface[cite: 6, 21, 22].

🎮 **[Play LUCKPIM Live on the Web](https://pepomatcha.github.io/luckpim-typing-game/LuckPim.html)**

---

## 📄 Project Documentation & Presentation
* **Canva Presentation:** [View Project Slides on Canva](https://canva.link/lvkuy012varo9z0)
* **Software Requirements Specification (SRS v5.0):** [`SRS_SF221_เมื่อคืนผมนอนไม่หลับ_final.pdf`](./SRS_SF221_เมื่อคืนผมนอนไม่หลับ_final.pdf)[cite: 2]

---

## ✨ Key Features
* **3 Difficulty Levels:** Choose between **Easy** (short words), **Medium** (long words), and **Hard** (full sentences)[cite: 6, 23].
* **Diverse Word Categories:** Practice across built-in categories including Places (สถานที่), Food (อาหาร), and Animals (สัตว์)[cite: 23].
* **Real-Time Performance Tracking:** Tracks live elapsed time, typing accuracy score, and Words Per Minute (WPM)[cite: 6, 23].
* **Vocabulary & Mod Manager:** Add or delete custom words/sentences and export or import custom word packs as `.json` mod files[cite: 25, 31].
* **Theme & Language Customization:** Switch between **Thai** and **English** UI, and customize colors (Light Mode, Dark Mode, or Custom Theme with `.json` import/export)[cite: 31, 41].
* **Local-First & Lightweight:** Runs 100% in the browser using local storage without requiring external cloud servers[cite: 44, 45].

---
## Development Team
Course: SF221 — Thammasat University
Group: เมื่อคืนผมนอนไม่หลับ
* น.ส.นฤกมล ลาภสุวรรณ์ (6810742392) — Lead & System Design
* น.ส.ฐิติกานต์ ด้วงสกุล (6810742343) — Frontend Design
* น.ส.มนพัทธ์ รักการดี (6810742442) — Dev & Backend

## 🛠️ Tech Stack & Project Structure
Built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**[cite: 1]:
```text
├── index.html          # Entry redirect to LuckPim.html
├── LuckPim.html        # Main game interface[cite: 1]
├── css/
│   └── styles.css      # Layout, responsive design & theme variables[cite: 1]
├── js/
│   ├── main.js         # Menu navigation, settings & localization[cite: 1]
│   ├── gameplay.js     # Typing validation, timer & WPM calculation[cite: 1]
│   ├── vocabulary.js   # Built-in Thai word & sentence database[cite: 1]
│   └── workshop.js     # Custom word editor & JSON mod manager[cite: 1]
└── assets/             # Visual & font assets[cite: 1]
