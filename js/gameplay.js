class TypingGame {
    constructor(onUpdateUI, onShowResult) {
        this.onUpdateUI = onUpdateUI;
        this.onShowResult = onShowResult;
        this.timerInterval = null;
        this.reset();
    }

    reset() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.vocabList = [];
        this.currentIndex = 0;
        this.score = 0;
        this.targetWord = '';
        this.typedText = '';
        this.statusText = '';
        this.category = '';
        this.isWaitingForEnter = false;
        this.totalTime = 0;
    }

    start(level, cat) {
        this.reset();
        const merged = getMergedVocab();
        this.category = cat;
        
        let sourceList = [];
        if (merged[level] && merged[level][cat]) {
            sourceList = merged[level][cat];
        }

        // 1. เช็คเงื่อนไขหากมีคำศัพท์น้อยกว่า 3 คำ
        if (sourceList.length < 3) {
            const msg = currentAppLang === 'th' 
                ? 'ไม่สามารถเลือก เพราะมีคำศัพท์น้อยกว่า 3' 
                : 'Cannot select: contains fewer than 3 words';
            alert(msg);
            return false;
        }

        // 2. สุ่มลำดับคำศัพท์ทั้งหมดในลิสต์
        const shuffled = [...sourceList].sort(() => Math.random() - 0.5);

        // 3. เลือกสุ่มคำศัพท์สูงสุดไม่เกิน 5 คำ (ถ้ามี 3-4 คำจะได้ตามที่มี ถ้ามี >= 5 จะได้ 5 คำ)
        const wordCount = Math.min(shuffled.length, 5);
        this.vocabList = shuffled.slice(0, wordCount);

        // 4. เริ่มจับเวลา
        this.timerInterval = setInterval(() => {
            if (!this.isWaitingForEnter) {
                this.totalTime += 0.1;
            }
            this.updateUI();
        }, 100);

        this.nextWord();
        return true;
    }

    nextWord() {
        this.isWaitingForEnter = false;

        if (this.currentIndex >= this.vocabList.length) {
            this.endGame();
            return;
        }

        this.targetWord = this.vocabList[this.currentIndex];
        this.typedText = '';
        this.statusText = '';
        this.currentIndex++;
        this.updateUI();
    }

    handleInput(key) {
        if (this.isWaitingForEnter) {
            if (key === 'Enter') {
                this.nextWord();
            }
            return;
        }

        if (key === 'Enter') {
            this.isWaitingForEnter = true;
            this.statusText = currentAppLang === 'th' ? '❌ ข้ามคำศัพท์! (กด Enter เพื่อไปต่อ)' : '❌ Skipped! (Press Enter)';
            this.updateUI();
            return;
        }

        if (key === 'Backspace') {
            this.typedText = this.typedText.slice(0, -1);
            this.checkProgress();
            return;
        }

        if (this.typedText.length >= this.targetWord.length) {
            return;
        }

        this.typedText += key;
        this.checkProgress();
    }

    checkProgress() {
        if (this.typedText === this.targetWord) {
            this.score++;
            this.isWaitingForEnter = true;
            this.statusText = currentAppLang === 'th' ? '✅ ถูกต้อง! (กด Enter เพื่อไปต่อ)' : '✅ Correct! (Press Enter)';
        } else if (this.targetWord.startsWith(this.typedText)) {
            this.statusText = '';
        } else {
            this.isWaitingForEnter = true;
            this.statusText = currentAppLang === 'th' ? '❌ พิมพ์ผิด! (กด Enter เพื่อไปต่อ)' : '❌ Typo! (Press Enter)';
        }
        
        this.updateUI();
    }

    endGame() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const timeTaken = this.totalTime;
        let wpm = 0;
        if (timeTaken > 0) {
            wpm = Math.round((this.score / (timeTaken / 60)));
        }
        
        this.onShowResult({
            score: this.score,
            total: this.vocabList.length,
            time: timeTaken.toFixed(1),
            wpm: wpm
        });
    }

    updateUI() {
        this.onUpdateUI({
            category: this.category,
            progress: `${this.currentIndex} / ${this.vocabList.length}`,
            targetWord: this.targetWord,
            typedText: this.typedText,
            statusText: this.statusText,
            time: this.totalTime.toFixed(1)
        });
    }
}