$(".func-display__btn").hover(function () {

    $(".func-display__btn").removeClass("-on")
    $(this).addClass("-on")

    $(".func-display__label").removeClass("-yellow")
    $(this).find(".func-display__label").addClass("-yellow")

    let btn_num = $(".func-display__btn").index(this) + 1
    console.log(btn_num)
    $(".func-display__video").removeClass("show")
    console.log($(".func-display__video-" + btn_num))
    $(".func-display__video-" + btn_num).addClass("show")
})

//跑馬燈效果
//跑馬燈效果
//跑馬燈效果
const text = document.querySelector('#text');
const copy = document.querySelector('#text-copy');

copy.innerText = text.innerText;   // 做出一份完全相同的複製


//打字演示效果
//打字演示效果
//打字演示效果
document.addEventListener('DOMContentLoaded', function () {
    const demo = document.querySelector('.demo');
    const textEl = demo.querySelector('.demo__p');
    const valueContainers = demo.querySelectorAll('.demo__value-container');
    const replayBtn = demo.querySelector('.demo__replay-btn');
    const progressBar = demo.querySelector('.demo__progress-bar');

    const modeBtn = document.querySelector('.nav__mode-btn');
    const modeIcon = modeBtn.querySelector('img');

    const loginBtn = document.querySelector(".nav__login-btn");
    const loginOverlay = document.getElementById("loginOverlay");
    const loginClose = document.getElementById("loginClose");

    // 開啟登入視窗
    loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loginOverlay.style.display = "flex";
    });

    // 關閉登入視窗（按 X）
    loginClose.addEventListener("click", function () {
        loginOverlay.style.display = "none";
    });

    // 點背景關閉
    loginOverlay.addEventListener("click", function (e) {
        if (e.target === loginOverlay) {
            loginOverlay.style.display = "none";
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (modeIcon) modeIcon.src = './icon/moon-white.png';
    }

    modeBtn.addEventListener('click', function (e) {
        e.preventDefault();

        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // 換圖示
        if (modeIcon) {
            modeIcon.src = isDark
                ? './icon/moon-white.png'   // 深色模式圖示
                : './icon/sun-yellow.png';  // 亮色模式圖示
        }

    });

    // 專門抓「時間」那一格
    const timeContainer = demo.querySelector('.demo__value-container--time');
    const timeValueEl = timeContainer
        ? timeContainer.querySelector('.demo__value')
        : null;

    const CHAR_DELAY_START = 0; // 立即開始
    const CHAR_INTERVAL = 120;
    const NUMBER_DURATION = 1000;

    let charSpans = [];
    let timeouts = [];

    // 用來追蹤時間
    let typingStartTime = null;
    let typingTimeRafId = null;

    function prepareText() {
        if (textEl.dataset.prepared === '1') return;

        const nodes = Array.from(textEl.childNodes);
        const frag = document.createDocumentFragment();

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                for (let char of text) {
                    if (char.trim() === '') {
                        frag.appendChild(document.createTextNode(char));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.dataset.char = '1';
                        frag.appendChild(span);
                    }
                }
            } else {
                frag.appendChild(node.cloneNode(true));
            }
        });

        textEl.innerHTML = '';
        textEl.appendChild(frag);

        textEl.dataset.prepared = '1';
        charSpans = textEl.querySelectorAll('span[data-char="1"]');
    }

    function clearAllTimers() {
        timeouts.forEach(clearTimeout);
        timeouts = [];
    }

    function stopTimeTracking() {
        if (typingTimeRafId != null) {
            cancelAnimationFrame(typingTimeRafId);
            typingTimeRafId = null;
        }
    }

    function startTimeTracking() {
        if (!timeValueEl) return;

        typingStartTime = performance.now();

        function update() {
            const now = performance.now();
            const elapsedSec = (now - typingStartTime) / 1000;
            // 你可以改成保留小數，例如：elapsedSec.toFixed(1)
            timeValueEl.textContent = Math.floor(elapsedSec);
            typingTimeRafId = requestAnimationFrame(update);
        }

        update();
    }

    function resetDemo() {
        clearAllTimers();
        stopTimeTracking();
        prepareText();

        replayBtn.classList.remove('active');

        progressBar.style.width = '0%';

        // 重置注音顏色
        charSpans.forEach(span => span.classList.remove('span-color--green'));

        // 重置所有數值卡片
        valueContainers.forEach(container => {

            const valueEl = container.querySelector('.demo__value');
            if (!valueEl) return;

            // 時間那一格：不要設定 target，因為是實際經過時間
            if (container.classList.contains('demo__value-container--time')) {
                valueEl.textContent = '0';
            } else {
                // 其他兩格維持原本 0 → target 動畫
                if (!valueEl.dataset.target) {
                    valueEl.dataset.target = valueEl.textContent.trim() || '0';
                }
                valueEl.textContent = '0';
            }
        });
    }

    function animateCharacters(onComplete) {
        if (charSpans.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        // 開始計時（時間那一格同步顯示）
        startTimeTracking();

        charSpans.forEach((span, index) => {
            const id = setTimeout(() => {
                span.classList.add('span-color--green');

                // 更新進度條寬度
                const progress = ((index + 1) / charSpans.length) * 100;
                progressBar.style.width = progress + '%';

                // 最後一個字變綠
                if (index === charSpans.length - 1) {
                    // 停止時間追蹤，保留最後一個秒數
                    stopTimeTracking();

                    replayBtn.classList.add('active');

                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                }
            }, CHAR_DELAY_START + index * CHAR_INTERVAL);

            timeouts.push(id);
        });
    }

    function animateStats() {
        valueContainers.forEach(container => {
            const valueEl = container.querySelector('.demo__value');
            if (!valueEl) return;

            // 時間這一格：已經是實際時間，不需要再 0→target 動畫
            if (container.classList.contains('demo__value-container--time')) {
                return;
            }

            animateNumber(valueEl, NUMBER_DURATION);
        });
    }

    function animateNumber(el, duration) {
        const target = parseInt(el.dataset.target || '0', 10);
        if (isNaN(target)) return;

        const startTime = performance.now();

        function frame(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.round(progress * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }

        requestAnimationFrame(frame);
    }

    function playDemo() {
        resetDemo();
        animateCharacters(animateStats);
    }

    playDemo();

    replayBtn.addEventListener('click', playDemo);
});

//背景鍵帽漂浮
//背景鍵帽漂浮
$(document).ready(function () {
    $(".float-key").each(function (i) {
        let delay = i * 0.3;
        $(this).css("animation-delay", delay + "s");
        $(this).addClass("float-animation");
    })
})

//輪播圖
//輪播圖
$(document).ready(function () {

    function checkVisibility() {
        let element = $(".comment__card-area");
        let elementTop = element.offset().top;
        let elementBottom = elementTop + element.outerHeight();

        let viewportTop = $(window).scrollTop();
        let viewportBottom = viewportTop + $(window).height();

        // 如果元素進入視窗範圍
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
            element.css("left", "0px");

            // 加一次就好，觸發後移除 scroll 監聽（避免重複執行）
            $(window).off("scroll", checkVisibility);
        }
    }

    $(window).on("scroll", checkVisibility);
    checkVisibility(); // 進入頁面時先檢查一次
});
let card_num = $(".comment-card").length

let i = 0;
$(".comment__btn--left").on("click", function () {
    i--;
    $(".comment__card-area").css("left", -310 * i + "px")
    if (i == 0) {
        $(".comment__btn--left").addClass("comment__btn--off")
    }
    $(".comment__btn--right").removeClass("comment__btn--off")
})
$(".comment__btn--right").on("click", function () {
    i++;
    $(".comment__card-area").css("left", -310 * i + "px")
    if (i == card_num - 3) {
        $(this).addClass("comment__btn--off")
    }
    $(".comment__btn--left").removeClass("comment__btn--off")
})

