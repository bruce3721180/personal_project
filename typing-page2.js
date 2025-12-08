// typing-page.js

document.addEventListener("DOMContentLoaded", () => {
    // === 注音與英文鍵盤對照 ===
    const bpmToKey = {
        "ㄅ": "1",
        "ㄆ": "q",
        "ㄇ": "a",
        "ㄈ": "z",
        "ㄉ": "2",
        "ㄊ": "w",
        "ㄋ": "s",
        "ㄌ": "x",
        "ㄍ": "e",
        "ㄎ": "d",
        "ㄏ": "c",
        "ㄐ": "r",
        "ㄑ": "f",
        "ㄒ": "v",
        "ㄓ": "5",
        "ㄔ": "t",
        "ㄕ": "g",
        "ㄖ": "b",
        "ㄗ": "y",
        "ㄘ": "h",
        "ㄙ": "n",
        "ㄚ": "8",
        "ㄛ": "i",
        "ㄜ": "k",
        "ㄝ": ",",
        "ㄞ": "9",
        "ㄟ": "o",
        "ㄠ": "l",
        "ㄡ": ".",
        "ㄢ": "0",
        "ㄣ": "p",
        "ㄤ": ";",
        "ㄥ": "/",
        "ㄦ": "-",
        "ㄧ": "u",
        "ㄨ": "j",
        "ㄩ": "m",
        "ˇ": "3",
        "ˋ": "4",
        "ˊ": "6",
        "˙": "7",
    };

    const startHintContainer = document.querySelector(".start-hint__container");
    const startHint = document.querySelector(".start-hint");

    function showStartHint() {
        if (!startHintContainer || !startHint) return;
        // 進場：先 container 再 hint（0.5s + 0.5s = 1s）
        startHintContainer.style.transitionDelay = "0s";
        startHint.style.transitionDelay = "0.2s";
        startHintContainer.style.top = "0px";
        startHint.style.top = "0px";
    }

    function hideStartHint() {
        if (!startHintContainer || !startHint) return;
        // 離場：先 hint 再 container
        startHintContainer.style.transitionDelay = "0.2s";
        startHint.style.transitionDelay = "0s";
        startHint.style.top = "-100px";
        startHintContainer.style.top = "-20px";
    }

    const keyToBpm = {};
    Object.keys(bpmToKey).forEach(bpm => {
        keyToBpm[bpmToKey[bpm]] = bpm;
    });

    // === 元件 ===
    const displayText = document.getElementById("displayText");
    const progressFill = document.querySelector(".progress-fill");
    const resumeHint = document.getElementById("resumeHint");

    const statSpeedEl = document.getElementById("stat_speed");
    const statAccuEl = document.getElementById("stat_accu");

    const keyboardHandWrapper = document.querySelector(".keyboard-hand");
    const handWrapper = document.querySelector(".hand");
    const statWrapper = document.querySelector(".stat");

    const btnRestart = document.getElementById("btn--restart");
    const btnKeyboard = document.getElementById("btn--keyboard");
    const btnHand = document.getElementById("btn--hand");
    const btnStat = document.getElementById("btn--stat");

    const resultModal = document.getElementById("resultModal");
    const resultCharSpeed = document.getElementById("result_charSpeed");
    const resultWpm = document.getElementById("result_wpm");
    const resultTime = document.getElementById("result_time");
    const resultResultAccu = document.getElementById("result_resultAccu");
    const resultScore = document.getElementById("result_score");
    const resultStars = document.getElementById("result_stars");
    const btnRetry = document.getElementById("btnRetry");
    const btnNext = document.getElementById("btnNext");

    const displayWordContainer = document.querySelector(".display__word");

    let firstLineTop = 0;
    let currentLineTop = 0;

    let statsTimerId = null;
    let isStatsActive = false;   // 只要顯示「繼續輸入」就暫停更新


    // ⭐=== 關卡內容 ===
    const levels = [
        //挑戰關卡
        // level 1
        "ㄏㄨㄢ ㄧㄥˊㄋㄧˇㄩㄥˇㄓㄜˇ\nㄍㄨㄥ ㄒㄧˇㄋㄧˇㄊㄨㄥ ㄍㄨㄛˋ\nㄐㄧ ㄔㄨˇㄒㄩㄣˋㄌㄧㄢˋ\nㄑㄧˊㄉㄞˋㄋㄧˇㄨㄟˋㄌㄞˊㄉㄜ˙\nㄅㄧㄠˇㄒㄧㄢˋ",
        // level 2
        "ㄋㄧˇㄧˇㄐㄧㄥ ㄒㄩㄝˊㄏㄨㄟˋ\nㄩㄥˋㄕˊㄍㄣ ㄕㄡˇㄓˇ\nㄉㄚˇㄗˋㄌㄜ˙\nㄐㄧㄝ ㄒㄧㄚˋㄌㄞˊㄧㄠˋㄊㄧˊㄕㄥ\nㄋㄧˇㄉㄜ˙ㄉㄚˇㄗˋㄙㄨˋㄉㄨˋ",
        // level 3
        "ㄖㄨˊㄍㄨㄛˇㄋㄧˇㄒㄧㄤˇ\nㄊㄧˊㄕㄥ ㄉㄚˇㄗˋㄙㄨˋㄉㄨˋ\nㄕㄡˇㄒㄧㄢ ㄅㄧˋㄒㄩ \nㄗㄥ ㄐㄧㄚ ㄓㄨㄣˇㄑㄩㄝˋㄌㄩˋ",
        // level 4
        "ㄌㄧㄢˋㄒㄧˊㄔㄥˊㄐㄧㄡˋㄨㄢˊㄇㄟˇ\nㄇㄟˇㄉㄤ ㄋㄧˇㄨㄢˊㄔㄥˊ\nㄓㄜˋㄒㄧㄝ ㄎㄜˋㄔㄥˊ\nㄉㄚˇㄗˋㄙㄨˋㄉㄨˋ\nㄉㄡ ㄏㄨㄟˋㄊㄧˊㄕㄥ ",
        // level 5
        "ㄕㄡˇㄒㄧㄢ ㄧㄠˋㄐㄧˋㄉㄜˊ\nㄗㄨㄟˋㄓㄨㄥˋㄧㄠˋㄉㄜ˙\nㄉㄚˇㄗˋㄍㄨㄟ ㄗㄜˊ\nㄩㄥˇㄩㄢˇㄅㄨˊㄧㄠˋ\nㄉㄧ ㄊㄡˊㄎㄢˋㄐㄧㄢˋㄆㄢˊ",
        // level 6
        "ㄔㄤˊㄕˊㄐㄧㄢ ㄉㄧㄥ ㄓㄜ˙\nㄧㄥˊㄇㄨˋㄏㄨㄟˋㄉㄠˇㄓˋ\nㄧㄢˇㄐㄧㄥ ㄍㄢ ㄙㄜˋ\nㄙㄨㄛˇㄧˇㄧㄠˋㄐㄧˋㄉㄜˊ\nㄕˋㄉㄨˋㄒㄧㄡ ㄒㄧˊ",
        // level 7
        "ㄗㄞˋㄒㄩㄣˋㄌㄧㄢˋㄊㄨˊㄓㄨㄥ\nㄩㄥˇㄓㄜˇㄐㄧㄥ ㄍㄨㄛˋ\nㄧˊㄗㄨㄛˋㄘㄨㄣ ㄓㄨㄤ \nㄇㄟˊㄒㄧㄤˇㄉㄠˋㄊㄨˊㄖㄢˊ\nㄧㄡˇㄌㄤˊㄑㄩㄣˊㄒㄧˊㄐㄧˊ\nㄩㄥˇㄓㄜˇㄐㄧㄢˋㄧˋㄩㄥˇㄨㄟˊ\nㄍㄢˇㄗㄡˇㄌㄜ˙ㄌㄤˊㄑㄩㄣˊ",
    ];

    // ⭐關卡名稱
    const levelTitles = [
        // level 1
        "歡迎你，勇者",
        // level 2
        "使用十根手指",
        // level 3
        "增加速度",
        // level 4
        "持之以恆",
        // level 5
        "別往下看",
        // level 6
        "注視前方",
        // level 7
        "擊敗狼群",
        // level 8
        "保持視野",
        // level 9
        "肌肉記憶",
        // level 10
        "維持姿勢",
        // level 11
        "相信自己",
        // level 12
        "勇往直前",
        // level 13
        "調整裝備",
        // level 14
        "擊敗狼人首領",

    ];

    function getCurrentLevelFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const levelParam = parseInt(params.get("level"), 10);
        if (Number.isNaN(levelParam) || levelParam < 1) return 1;
        if (levelParam > levels.length) return levels.length;
        return levelParam;
    }

    const currentLevel = getCurrentLevelFromUrl();     // 1-based
    const currentLevelIndex = currentLevel - 1;        // 0-based

    // === 更新 NAV 上的關卡名稱 ===
    const navLevelTitleEl = document.querySelector(".lesson-name");
    if (navLevelTitleEl) {
        // 先用陣列裡的名稱，如果沒寫就退回「第 X 關」
        navLevelTitleEl.textContent =
            levelTitles[currentLevelIndex] || `第 ${currentLevel} 關`;
    }

    // === 將顯示文字拆成 span ===
    // 依照目前關卡把對應的注音內容塞進來
    const raw = levels[currentLevelIndex] || ""; // 保留換行
    displayText.innerHTML = "";

    const chars = [];          // { el, char, isTarget, hadError }
    const targetIndices = [];  // 只記錄需要打的目標 index

    const allBpmChars = new Set(Object.keys(bpmToKey));
    // 空白也要當成目標

    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];

        if (ch === "\r") continue;

        if (ch === "\n") {
            displayText.appendChild(document.createElement("br"));
            continue;
        }

        const span = document.createElement("span");
        span.textContent = ch === " " ? " " : ch;  // 空白也佔一格

        span.classList.add("bpm-char");
        if (ch === " ") {
            span.classList.add("bpm-space");   // ⭐ 空白多掛一個 class
        }
        const index = chars.length;
        const isTarget = allBpmChars.has(ch) || ch === " ";   // 空白也是 target
        const charObj = { el: span, char: ch, isTarget, hadError: false };

        chars.push(charObj);

        if (isTarget) {
            targetIndices.push(index);
        }

        displayText.appendChild(span);
    }

    if (targetIndices.length > 0) {
        const firstObj = chars[targetIndices[0]];
        firstLineTop = firstObj.el.offsetTop;
        currentLineTop = firstLineTop;
    }

    // === 鍵盤 key 元素 map ===
    const keyboardKeyMap = {};
    document.querySelectorAll(".keyboard .key").forEach(keyEl => {
        const txt = keyEl.textContent.trim();
        if (txt) {
            if (!keyboardKeyMap[txt]) {
                keyboardKeyMap[txt] = keyEl;
            }
        }
    });

    // === hand finger 圖片 map ===
    const fingerImages = {};
    const fingerImgs = handWrapper.querySelectorAll("img");

    fingerImgs.forEach(img => {
        const src = img.getAttribute("src");
        const match = src.match(/_([^/_]+)\.png$/);
        if (match) {
            const keyName = match[1]; // 例如 "f", "k", "slash", "，", "。"... 
            fingerImages[keyName] = img;
        }
        img.style.display = "none";
    });

    const eventKeyToFingerKey = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "0": "0",
        "q": "q",
        "w": "w",
        "e": "e",
        "r": "r",
        "t": "t",
        "y": "y",
        "u": "u",
        "i": "i",
        "o": "o",
        "p": "p",
        "a": "a",
        "s": "s",
        "d": "d",
        "f": "f",
        "g": "g",
        "h": "h",
        "j": "j",
        "k": "k",
        "l": "l",
        ";": ";",
        "'": "'",
        "z": "z",
        "x": "x",
        "c": "c",
        "v": "v",
        "b": "b",
        "n": "n",
        "m": "m",
        ",": "，",
        ".": "。",
        "/": "slash",
        "-": "-",
        " ": "space"
    };

    function showFingerForKey(keyChar) {
        const mapKey = eventKeyToFingerKey[keyChar];
        if (!mapKey) return;

        // 先全部藏起來
        fingerImgs.forEach(img => (img.style.display = "none"));

        const img = fingerImages[mapKey];
        if (img) {
            img.style.display = "block";
        }
    }

    // === 狀態變數 ===
    let currentTargetPos = 0; // targetIndices 的位置
    let isFinished = false;

    let totalKeyPressed = 0;
    let correctKeyPressed = 0;

    let startTime = null; // ms
    let lastInputTime = null;
    let idleTimerId = null;

    // === 幫助函式 ===

    function getCurrentCharObj() {
        if (currentTargetPos < 0 || currentTargetPos >= targetIndices.length) return null;
        const idx = targetIndices[currentTargetPos];
        return chars[idx];
    }

    function clearKeyHighlight() {
        document.querySelectorAll(".keyboard .key").forEach(keyEl => {
            keyEl.classList.remove("key--active", "key--error");
        });
    }

    function updateCurrentHighlight() {
        // 清掉所有 current
        chars.forEach(c => c.el.classList.remove("current"));

        const cur = getCurrentCharObj();
        if (!cur) {
            clearKeyHighlight();
            if (resumeHint) resumeHint.style.display = "none";
            return;
        }

        cur.el.classList.add("current");

        clearKeyHighlight();

        const ch = cur.char;

        // 注音：鍵盤高亮 + 手指圖
        if (allBpmChars.has(ch)) {
            const keyEl = keyboardKeyMap[ch];
            if (keyEl) keyEl.classList.add("key--active");

            const keyChar = bpmToKey[ch];
            if (keyChar) showFingerForKey(keyChar);
        } else if (ch === " ") {
            // 空白：高亮 space 鍵 + 顯示空白的手指
            const spaceKeyEl = keyboardKeyMap["space"];
            if (spaceKeyEl) spaceKeyEl.classList.add("key--active");
            showFingerForKey(" ");
        }

        positionResumeHint();
    }

    function updateProgress() {
        const finishedCount = currentTargetPos; // 已完成的注音數
        const total = targetIndices.length || 1;
        const ratio = finishedCount / total;
        progressFill.style.width = (ratio * 100).toFixed(2) + "%";
    }

    function updateStats() {
        if (!startTime || totalKeyPressed === 0) {
            statSpeedEl.textContent = "0";
            statAccuEl.textContent = "0";
            return;
        }
        const now = Date.now();
        const elapsedMin = (now - startTime) / 1000 / 60;
        const charsPerMin = correctKeyPressed / elapsedMin;
        const wpm = charsPerMin / 5;
        const accu = (correctKeyPressed / totalKeyPressed) * 100;

        statSpeedEl.textContent = Math.round(wpm);
        statAccuEl.textContent = Math.round(accu);
    }

    function positionResumeHint() {
        const cur = getCurrentCharObj();
        if (!cur) return;

        const display = document.querySelector(".display");
        const displayRect = display.getBoundingClientRect();
        const rect = cur.el.getBoundingClientRect();

        const offsetX = rect.left - displayRect.left;
        const offsetY = rect.top - displayRect.top;

        resumeHint.style.left = offsetX + "px";
        resumeHint.style.top = Math.max(offsetY - 30, 0) + "px";
    }

    function resetIdleTimer() {
        if (!resumeHint) return;
        if (idleTimerId) clearTimeout(idleTimerId);

        resumeHint.style.display = "none";
        isStatsActive = true;   // 只要有輸入就啟動

        idleTimerId = setTimeout(() => {
            if (!isFinished && getCurrentCharObj()) {
                positionResumeHint();
                resumeHint.style.display = "block";
                isStatsActive = false;    // 顯示提示 → 停止更新 stat
            }
        }, 5000);
    }

    function finishLesson() {
        isFinished = true;
        if (idleTimerId) clearTimeout(idleTimerId);
        if (resumeHint) resumeHint.style.display = "none";
        clearKeyHighlight();

        const endTime = lastInputTime || Date.now();
        const elapsedSec = startTime ? (endTime - startTime) / 1000 : 0;
        const elapsedMin = elapsedSec / 60 || 1 / 60;

        const charsPerMin = correctKeyPressed / elapsedMin;
        const wpm = charsPerMin / 5;
        const accuPercent =
            totalKeyPressed === 0 ? 0 : (correctKeyPressed / totalKeyPressed) * 100;

        // 停止 stat 更新，並最後算一次
        isStatsActive = false;
        if (statsTimerId) {
            clearInterval(statsTimerId);
            statsTimerId = null;
        }
        updateStats();

        // 得分計算
        let speedScore = 0;
        if (wpm >= 40) {
            speedScore = 1000;
        } else {
            speedScore = Math.max(0, (wpm / 40) * 1000);
        }
        let accuScore = Math.max(0, (accuPercent / 100) * 1000);

        const totalScore = Math.round(speedScore + accuScore);
        const starCount = Math.min(5, Math.max(0, Math.round(totalScore / 400)));

        // 填入 modal
        resultCharSpeed.textContent = Math.round(charsPerMin);
        resultWpm.textContent = Math.round(wpm);
        resultTime.textContent = elapsedSec.toFixed(1);
        resultResultAccu.textContent = Math.round(accuPercent);
        resultScore.textContent = totalScore;

        resultStars.innerHTML = "";
        for (let i = 0; i < 5; i++) {
            const star = document.createElement("span");
            star.textContent = i < starCount ? "★" : "☆";
            star.style.color = i < starCount ? "#FFD700" : "#999999";
            star.style.fontSize = "20px";
            resultStars.appendChild(star);
        }

        resultModal.classList.remove("hidden");
    }

    function restartLesson() {
        isFinished = false;
        startTime = null;
        lastInputTime = null;
        totalKeyPressed = 0;
        correctKeyPressed = 0;
        currentTargetPos = 0;
        if (resumeHint) resumeHint.style.display = "none";
        progressFill.style.width = "0%";
        if (idleTimerId) clearTimeout(idleTimerId);
        if (statsTimerId) {
            clearInterval(statsTimerId);
            statsTimerId = null;
        }
        isStatsActive = false;

        chars.forEach(c => {
            c.el.classList.remove("current", "correct", "incorrect", "correct-after-error");
            c.hadError = false;
        });

        updateCurrentHighlight();
        updateProgress();
        updateStats();
        if (resultModal) resultModal.classList.add("hidden");

        showStartHint();
    }

    // === 一開始先設定第一個目標 ===
    if (targetIndices.length > 0) {
        updateCurrentHighlight();
        updateProgress();
    }
    showStartHint();

    // === 鍵盤輸入事件 ===
    window.addEventListener("keydown", e => {
        if (isFinished) return;

        // 只處理單字元鍵（含空白）
        if (e.key.length !== 1 && e.key !== " ") return;

        const key = e.key === " " ? " " : e.key.toLowerCase();

        // 空白：直接接受；其他按鍵：要在 keyToBpm 裡才處理
        if (key !== " " && !keyToBpm[key]) {
            return;
        }

        e.preventDefault();

        if (!startTime) {
            startTime = Date.now();
            // 啟動每秒更新 stat 的計時器
            if (!statsTimerId) {
                statsTimerId = setInterval(() => {
                    if (isStatsActive && !isFinished) {
                        updateStats();
                    }
                }, 1000);
            }
            hideStartHint();  // 第一次打字就收起提示
        }
        lastInputTime = Date.now();
        resetIdleTimer();

        totalKeyPressed++;

        const cur = getCurrentCharObj();
        if (!cur) return;

        const expectedChar = cur.char;
        let expectedKey;
        if (expectedChar === " ") {
            expectedKey = " ";
        } else {
            expectedKey = bpmToKey[expectedChar];
        }

        if (!expectedKey) {
            // 如果真的遇到沒有 mapping 的字，先跳過避免爆炸
            return;
        }

        clearKeyHighlight();

        if (key === expectedKey) {
            // 正確
            correctKeyPressed++;
            cur.el.classList.remove("incorrect");

            if (cur.hadError) {
                cur.el.classList.add("correct-after-error"); // 曾經錯過 → 橘色
            } else {
                cur.el.classList.add("correct");             // 一次就對 → 綠色
            }

            // 前進到下一個需要打的注音
            const prevObj = cur;
            currentTargetPos++;
            updateProgress();

            if (currentTargetPos >= targetIndices.length) {
                finishLesson();
                return;
            }

            // 檢查是否換行 → 若是就捲動 display__word
            const nextObj = getCurrentCharObj();
            if (nextObj) {
                const nextTop = nextObj.el.offsetTop;
                if (nextTop > currentLineTop + 5) {
                    currentLineTop = nextTop;
                    if (displayWordContainer) {
                        displayWordContainer.scrollTop = currentLineTop - firstLineTop;
                    }
                }
            }

            updateCurrentHighlight();
        } else {
            // 錯誤
            cur.hadError = true;
            cur.el.classList.add("incorrect");

            // 對應使用者實際按的 key 變紅色 (只對注音有 mapping 的做)
            const typedBpm = keyToBpm[key];
            let wrongKeyEl = null;
            if (typedBpm) {
                wrongKeyEl = keyboardKeyMap[typedBpm];
                if (wrongKeyEl) wrongKeyEl.classList.add("key--error");
            }

            // 同時顯示正解藍色 key（空白就不顯示）
            if (expectedChar !== " ") {
                const expectKeyEl = keyboardKeyMap[expectedChar];
                if (expectKeyEl) expectKeyEl.classList.add("key--active");
            }

            // 0.5 秒後把紅色淡掉（移除 class，依 transition 自然過渡）
            setTimeout(() => {
                cur.el.classList.remove("incorrect");
                if (wrongKeyEl) wrongKeyEl.classList.remove("key--error");
            }, 200);
        }
    });

    // === nav 按鈕 ===
    btnRestart.addEventListener("click", () => {
        restartLesson();
    });

    btnKeyboard.addEventListener("click", () => {
        const isHidden = keyboardHandWrapper.style.display === "none";
        if (isHidden) {
            // 目前是隱藏 → 點擊後顯示
            keyboardHandWrapper.style.display = "";
            statWrapper.classList.remove("stat-wide");
        } else {
            // 目前是顯示 → 點擊後隱藏
            keyboardHandWrapper.style.display = "none";
            statWrapper.classList.add("stat-wide");
        }
    });

    btnHand.addEventListener("click", () => {
        if (handWrapper.style.display === "none") {
            handWrapper.style.display = "";
        } else {
            handWrapper.style.display = "none";
        }
    });

    btnStat.addEventListener("click", () => {
        if (statWrapper.style.display === "none") {
            statWrapper.style.display = "";
        } else {
            statWrapper.style.display = "none";
        }
    });

    // === modal 的按鈕 ===
    btnRetry.addEventListener("click", () => {
        restartLesson();
    });

    btnNext.addEventListener("click", () => {
        const nextLevel = currentLevel + 1; // 1-based
        if (nextLevel > levels.length) {
            alert("已經是最後一關了！");
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.set("level", nextLevel);
        window.location.href = url.toString();
    });
    const btnCloseModal = document.getElementById("btnCloseModal");
    btnCloseModal.addEventListener("click", () => {
        resultModal.classList.add("hidden");
    });
});
