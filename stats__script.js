// wpm圓環
// wpm圓環
// wpm圓環
$(document).ready(function () {
    // 定義進度值 (42%)
    const progressValue = 0.46;

    $('#circle-wpm').circleProgress({
        value: progressValue, // 進度值 (0.42)
        size: 150,   // 圓環直徑 (稍微小於容器 200px，保持邊距)
        startAngle: -Math.PI / 2, // 從頂部 (12點鐘方向) 開始
        thickness: 12, // 圓環線條粗細 (略微增粗以匹配圖片)

        // *** 實現頭尾圓角的關鍵 ***
        lineCap: 'round',

        // *** 實現圖片中的漸層色 (從藍到紫) ***
        fill: {
            // 根據圖片的顏色趨勢設置漸層
            gradient: ['#0141AD', '#A052FF'],
        },

        // 軌道的背景色 (圖片中的淺灰色)
        emptyFill: '#E0E0E0',

        animation: {
            duration: 1000 // 動畫持續時間 (毫秒)
        }
    });

    // 如果您想讓數字動態跳動，可以將 .main-number 的內容替換為以下程式碼：
    $('#circle-wpm').on('circle-animation-progress', function (event, progress, stepValue) {
        // stepValue 是從 0 到 value (0.42) 的值
        $(this).parent().find('.main-number').text(String(Math.round(stepValue * 100)));
    });

});


// accu圓環
// accu圓環
// accu圓環
$(document).ready(function () {
    // 定義進度值 (42%)
    const progressValue = 0.75;

    $('#circle-accu').circleProgress({
        value: progressValue, // 進度值 (0.42)
        size: 150,   // 圓環直徑 (稍微小於容器 200px，保持邊距)
        startAngle: -Math.PI / 2, // 從頂部 (12點鐘方向) 開始
        thickness: 12, // 圓環線條粗細 (略微增粗以匹配圖片)

        // *** 實現頭尾圓角的關鍵 ***
        lineCap: 'round',

        // *** 實現圖片中的漸層色 (從藍到紫) ***
        fill: {
            // 根據圖片的顏色趨勢設置漸層
            gradient: ['#FFD04E', '#FF5353'],
        },

        // 軌道的背景色 (圖片中的淺灰色)
        emptyFill: '#E0E0E0',

        animation: {
            duration: 1200 // 動畫持續時間 (毫秒)
        }
    });

    // 數字動態跳動
    $('#circle-accu').on('circle-animation-progress', function (event, progress, stepValue) {
        // stepValue 是從 0 到 value (0.42) 的值
        $(this).parent().find('.main-number--2').text(String(Math.round(stepValue * 100)));
    });

});


// 練習時間
// 練習時間
// 練習時間
$(".btn").on("click", function () {

    let btn_num = $(".btn").index(this);
    $(".btn-blue").css("left", 100 * btn_num + "px");
    $(".btn").css("color", "black");
    $(this).css("color", "white");
})

$(document).ready(function displayPracticeTime() {
    // 目標時間 (時*3600 + 分*60 + 秒) 
    const targetSeconds = (34 * 3600) + (42 * 60) + 20;

    const actualProgress = 0.6; // 模擬圖中的黃色比例

    // 1. 圓餅圖動畫設定
    $('#pie_circle').circleProgress({
        value: actualProgress,             // 最終進度值 (0.7)
        size: 220,                         // 圓形大小
        startAngle: -Math.PI / 2,          // **起始角度：-90 度 (12 點方向)**
        animationStartValue: 0,            // 動畫從 0 開始
        animation: { duration: 1000, easing: "swing" }, // 動畫持續 1 秒
        // 圓的背景色 (藍色底色)
        fill: { color: "#FFD04E" },        // **前景圓顏色 (黃色)**
        // 空白區域的顏色 (藍色) - 實現底色效果
        emptyFill: "#0056b3",              // **背景圓顏色 (深藍色)**
        thickness: 20                      // 圓環厚度
    });

    // 2. 時間數字動畫設定
    const $timeDisplay = $('#time-display');
    let currentSeconds = 0;
    const duration = 1000; // 1 秒動畫
    const interval = 50; // 每 50ms 更新一次

    const steps = duration / interval;
    let currentStep = 0;

    // 設定計時器
    const timer = setInterval(() => {
        currentStep++;

        let animatedSeconds = Math.round(targetSeconds * (currentStep / steps));

        if (currentStep >= steps) {
            animatedSeconds = targetSeconds;
            clearInterval(timer); // 停止計時器
        }

        // 格式化秒數為 HH:MM:SS
        const hours = Math.floor(animatedSeconds / 3600);
        const minutes = Math.floor((animatedSeconds % 3600) / 60);
        const seconds = animatedSeconds % 60;

        const formattedTime =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        $timeDisplay.text(formattedTime);

    }, interval);
});

$(".btn").on("click", function displayPracticeTime() {
    // 目標時間 (時*3600 + 分*60 + 秒) 
    let btn_num = $(".btn").index(this) + 1;

    let targetSeconds;
    let actualProgress;

    switch (btn_num) {
        case 1: //今天
            targetSeconds = (1 * 3600) + (36 * 60) + 20;
            actualProgress = 0.3;
            break;
        case 2:  //本周
            targetSeconds = (8 * 3600) + (42 * 60) + 50;
            actualProgress = 0.7;
            break;
        case 3:  //本月
            targetSeconds = (34 * 3600) + (21 * 60) + 30;
            actualProgress = 0.6;
            break;
    }

    // const actualProgress = 0.6; // 模擬圖中的黃色比例

    // 1. 圓餅圖動畫設定
    $('#pie_circle').circleProgress({
        value: actualProgress,             // 最終進度值 (0.7)
        size: 220,                         // 圓形大小
        startAngle: -Math.PI / 2,          // **起始角度：-90 度 (12 點方向)**
        animationStartValue: 0,            // 動畫從 0 開始
        animation: { duration: 1000, easing: "swing" }, // 動畫持續 1 秒
        // 圓的背景色 (藍色底色)
        fill: { color: "#FFD700" },        // **前景圓顏色 (黃色)**
        // 空白區域的顏色 (藍色) - 實現底色效果
        emptyFill: "#0056b3",              // **背景圓顏色 (深藍色)**
        thickness: 20                      // 圓環厚度
    });

    // 2. 時間數字動畫設定
    const $timeDisplay = $('#time-display');
    let currentSeconds = 0;
    const duration = 1000; // 1 秒動畫
    const interval = 50; // 每 50ms 更新一次

    const steps = duration / interval;
    let currentStep = 0;

    // 設定計時器
    const timer = setInterval(() => {
        currentStep++;

        let animatedSeconds = Math.round(targetSeconds * (currentStep / steps));

        if (currentStep >= steps) {
            animatedSeconds = targetSeconds;
            clearInterval(timer); // 停止計時器
        }

        // 格式化秒數為 HH:MM:SS
        const hours = Math.floor(animatedSeconds / 3600);
        const minutes = Math.floor((animatedSeconds % 3600) / 60);
        const seconds = animatedSeconds % 60;

        const formattedTime =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        $timeDisplay.text(formattedTime);

    }, interval);
});


// 連續登入天數
// 連續登入天數
// 連續登入天數
document.addEventListener('DOMContentLoaded', () => {
    const ROWS = 7;
    const COLS = 10;
    const GRID_SIZE = ROWS * COLS;
    const CALENDAR_GRID = document.getElementById('calendarGrid');
    const STREAK_COUNT_ELEMENT = document.getElementById('streakCount');
    const FILL_DURATION = 1000; // 整個直行填充時間 (1.5秒)

    const colors = ['#BCDDFF', '#8FBEFF', '#6EA7FF', '#488DFF'];

    const zhuyinKeys = document.querySelectorAll('.keyboard-speed .key:not(.key-en)');

    // 只抓 .keyboard-speed 裡非 key-en 的鍵
    zhuyinKeys.forEach(key => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        key.style.backgroundColor = randomColor;
    });

    const colors2 = ['#F76D6D', '#F49898', '#F2BBBB', '#EFE1E1', '#6EA7FF'];

    // 只抓 .keyboard-accu 裡非 key-en 的鍵
    const zhuyinKeys2 = document.querySelectorAll('.keyboard-accu .key2:not(.key-en)');

    zhuyinKeys2.forEach(key => {
        const randomColor = colors2[Math.floor(Math.random() * colors2.length)];
        key.style.backgroundColor = randomColor;
    });

    //控制速度/準確率鍵盤 按鈕
    const btn1 = document.getElementById('section-2__btn1');
    const btn2 = document.getElementById('section-2__btn2');

    const kbSpeed = document.querySelector('.keyboard-speed');
    const kbAccu = document.querySelector('.keyboard-accu');

    btn1.addEventListener('click', function () {
        kbSpeed.style.display = 'flex';
        kbAccu.style.display = 'none';
    });

    btn2.addEventListener('click', function () {
        kbSpeed.style.display = 'none';
        kbAccu.style.display = 'flex';
    });
    // 1. 隨機生成日曆數據 (初始生成，包含所有方格)
    const calendarData = Array(GRID_SIZE).fill(0).map(() => Math.random() < 0.6);


    // --- 處理未來的日子 ---
    const today = new Date();
    // 獲取今天是星期幾 (0=日, 1=一, ..., 6=六)
    let todayDayOfWeek = today.getDay();

    // 將 JS 的星期索引 (0=日, 1=一) 轉換為我們日曆的 Row 索引 (0=一, ..., 6=日)
    let todayRowIndex; // 0 到 6
    if (todayDayOfWeek === 0) { // 星期日 (JS=0)
        todayRowIndex = 6;
    } else { // 星期一到星期六 (JS=1..6)
        todayRowIndex = todayDayOfWeek - 1;
    }

    // *** 修正點 1: todayCellIndex 邏輯修正 ***
    // '今天' 的單元格索引。將 col 從 0 改為 COLS - 1 (9)，使其出現在最右邊一欄。
    const todayCellIndex = (COLS - 1) * ROWS + todayRowIndex;

    // 將所有在今天之後的方格強制設為 false (灰色/未登入)
    // 由於現在 '今天' 被放在最右邊一欄 (col=9)，我們只須遍歷 col=9

    // 遍歷今天所在的最後一列 (col=9)
    for (let row = 0; row < ROWS; row++) {
        const index = (COLS - 1) * ROWS + row;

        // 判斷是否為今天之後的日子 (在同一欄中，索引大於今天的 row 索引)
        if (row > todayRowIndex) {
            // 今天之後的方格，強制設為灰色
            calendarData[index] = false;
        }
        // 今天或今天之前的方格保持隨機狀態 (歷史紀錄中的所有方格也保持隨機)
    }
    // --- END NEW LOGIC ---


    // 2. 計算連續登入天數 (保持不變 - 仍使用 Column-Major 順序計算)
    function calculateMaxStreak(data) {
        let currentStreak = 0;
        let maxStreak = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                currentStreak++;
            } else {
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
                currentStreak = 0;
            }
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }

        return maxStreak;
    }

    const finalStreak = calculateMaxStreak(calendarData);

    // 3. 生成日曆方格並設置初始樣式 (保持不變)
    function generateCalendar() {
        for (let i = 0; i < GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';

            if (calendarData[i]) {
                cell.classList.add('filled');
            }

            const row = i % ROWS;
            const col = Math.floor(i / ROWS); // 這裡 i=0 仍在左邊 (col=0)

            cell.style.gridRow = row + 1;
            cell.style.gridColumn = col + 2;

            CALENDAR_GRID.appendChild(cell);
        }
    }

    // 4. 更新月份標籤並標記當天日期 
    function updateCalendarElements() {
        const today = new Date();
        const formatter = new Intl.DateTimeFormat('zh-TW', { month: 'numeric' });

        // --- 4.1. 更新月份標籤 (修正賦值順序) ---

        const currentMonth = formatter.format(today);
        const previousMonthDate = new Date(today);
        previousMonthDate.setMonth(today.getMonth() - 1);
        const previousMonth = formatter.format(previousMonthDate);
        const twoMonthsAgoDate = new Date(today);
        twoMonthsAgoDate.setMonth(today.getMonth() - 2);
        const twoMonthsAgo = formatter.format(twoMonthsAgoDate);

        // *** 關鍵修正: 月份順序由 左➡️右 改為: 兩個月前, 上個月, 這個月 ***
        // 由於 HTML 結構是：monthLabelLeft, monthLabelMiddle, monthLabelRight
        // 月份標籤應該是：9月, 10月, 11月 (最舊到最新)
        document.getElementById('monthLabelLeft').textContent = `${twoMonthsAgo}`;
        document.getElementById('monthLabelMiddle').textContent = `${previousMonth}`;
        document.getElementById('monthLabelRight').textContent = `${currentMonth}`;


        // --- 4.2. 標記今天的方格 (黃色背景) ---

        // 直接使用前面計算的 todayCellIndex (現在它指向最右邊的格子)
        const todayIndex = todayCellIndex;

        const cells = CALENDAR_GRID.querySelectorAll('.calendar-cell');
        if (cells.length > todayIndex) {
            cells[todayIndex].classList.add('today');
        }
    }

    // 5. 實現動畫效果 (由左至右，整個直行逐漸填滿) (保持不變)
    function animateFill() {
        const cells = Array.from(CALENDAR_GRID.querySelectorAll('.calendar-cell'));

        const columnDelay = FILL_DURATION / COLS;
        const cellDelay = 50;

        for (let col = 0; col < COLS; col++) {
            const columnStartTime = col * columnDelay;

            for (let row = 0; row < ROWS; row++) {
                const index = col * ROWS + row;
                const cell = cells[index];

                const totalDelay = columnStartTime + (row * cellDelay);

                setTimeout(() => {
                    cell.classList.add('visible');
                }, totalDelay);
            }
        }
    }

    // 6. 連續登入天數漸進增加動畫 (保持不變)
    function animateStreakCount(finalCount) {
        let currentCount = 0;
        const duration = FILL_DURATION;
        const startTime = performance.now();

        function updateCount(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            currentCount = Math.round(progress * finalCount);

            STREAK_COUNT_ELEMENT.textContent = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        }

        requestAnimationFrame(updateCount);
    }


    // --- 啟動函式 ---
    generateCalendar();
    updateCalendarElements();

    setTimeout(() => {
        animateFill();
        animateStreakCount(finalStreak);
    }, 100);
});

$(".section-2__btn").on("click", function () {
    $(".section-2__btn").removeClass("-on");
    $(this).addClass("-on")
    let btn_num = $(".section-2__btn").index(this)
    $(".section-2__btn-blue").css("left", btn_num * 100 + "px")
})

//手指圖片scroll連續載入效果
$(document).ready(function () {
    const DELAY_TIME = 100; // 0.2 秒間隔 (毫秒)
    const PARENT_SELECTOR = '.finger-data__pics';
    const CHILD_SELECTOR = '.finger-data__pic';

    // 旗標：確保動畫只執行一次
    let animationExecuted = false;

    // 步驟 3: 判斷元素是否在視窗中的函式 (isInViewport)
    function isInViewport(element) {
        const elementTop = $(element).offset().top;
        const elementBottom = elementTop + $(element).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        // 當元素的頂部進入視窗底部之前，或元素的底部離開視窗頂部之前
        // (簡單判斷元素是否部分可見)
        return elementBottom > viewportTop && elementTop < viewportBottom;
    }

    // 步驟 2: 滾動事件處理函式
    function checkScroll() {
        if (!animationExecuted && isInViewport(PARENT_SELECTOR)) {
            // 標記為已執行，防止重複觸發
            animationExecuted = true;

            // 步驟 4: 連續延遲出現
            $(PARENT_SELECTOR).find(CHILD_SELECTOR).each(function (i) {

                const delayAmount = i * DELAY_TIME;

                $(this).delay(delayAmount).animate({
                    opacity: 1, // 將透明度從 0 漸變到 1
                }, 400); // 400 毫秒完成漸變
            });

            // 一旦動畫執行完畢，移除 scroll 事件監聽以優化性能
            $(window).off('scroll', checkScroll);
        }
    }

    // 綁定滾動事件
    $(window).on('scroll', checkScroll);

    // 頁面載入時檢查一次，以防元素一開始就在視窗中
    checkScroll();
});


