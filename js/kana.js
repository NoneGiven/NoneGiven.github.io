(function() {
    "use strict";
    var hira = ["あ", "い", "う", "え", "お", "か", "が", "き", "く", "ぐ", "け", "こ", "ご", "さ", "し", "じ", "す", "せ", "そ",
        "ぞ", "た", "だ", "ち", "つ", "て", "で", "と", "ど", "な", "に", "ぬ", "ね", "の", "は", "ば", "ぱ", "ひ", "ぶ", "ほ",
        "ぼ", "ま", "み", "む", "め", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"];
    var kata = ["ア", "イ", "ウ", "エ", "オ", "カ", "ガ", "キ", "ク", "グ", "ケ", "コ", "ゴ", "サ", "シ", "ジ", "ス", "セ", "ソ",
        "ゾ", "タ", "ダ", "チ", "ツ", "テ", "デ", "ト", "ド", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "バ", "パ", "ヒ", "ブ", "ホ",
        "ボ", "マ", "ミ", "ム", "メ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン"]
    // missing: ぎ げ ざ ず ぜ び ぴ ふ ぷ へ べ ぺ ぽ も や ゆ
    // missing: ギ ゲ ザ ズ セ ビ ピ フ プ ヘ ベ ペ ポ モ ヤ ユ
    var map = { };
    for (let i = 0; i < hira.length; i++) {
        map[hira[i]] = kata[i];
    }
    var audio = { };
    
    var todoTotal = 0;
    var doneCount = 0;
    
    var currentAudio = null;
    var currentAudioChar = null;
    
    var repsCount = null;
    var reps = [];
    var thisRep = null;
    
    var correctAudio = new Audio("sound\\e\\y.ogg");
    var incorrectAudio = new Audio("sound\\e\\n.ogg");
    
    var currentMode = 0;
    changeMode(currentMode);
    
    Array.prototype.contains = function(item) {
        return this.indexOf(item !== -1);
    }
    
    function id(sel) {
        return document.getElementById(sel);
    }
    
    function setup() {
        document.removeEventListener("DOMContentLoaded", setup);
        todoTotal = hira.length;
        doneCount = 0;
        for (let char of hira) {
            setTimeout(getAudio, 0, char);
        }
    }
    
    function getAudio(char) {
        audio[char] = new Audio("sound\\" + char + ".ogg");
        if (++doneCount >= todoTotal) {
            setupDone();
        }
    }
    
    function changeMode(newMode) {
        switch (newMode) {
        case 0:
            showRep = nop;
            buildRep = nop;
            break;
        case 1:
            showRep = showRepModeOne;
            buildRep = buildRepModeOne;
            break;
        case 2:
            showRep = showRepModeTwo;
            buildRep = buildRepModeTwo;
            break;
        case 3:
            showRep = showRepModeThree;
            buildRep = buildRepModeThree;
            break;
        default:
            changeMode(0);
            return;
        }
        answerMode = false;
        currentMode = newMode;
    }
    
    function reset() {
        stateChanging = true;
        stop();
        reps = [];
        changeMode(0);
        showMain();
    }
    
    function nop() { }
    
    function showMain() {
        changeMode(0);
        document.body.innerHTML = '<span>#:</span>&nbsp;<div id="form"><input maxlength="3" id="reps" type="text"><br>' +
            '<input data-mode="1" id="sub1" type="submit" value="!"><input data-mode="2" id="sub2" type="submit" value="?">' +
            '<br><input data-mode="3" id="sub3" type="submit" value="*"></div><div id="info">i</div>';
        id("reps").addEventListener("input", onRepChange);
        id("sub1").style.width = "72px";
        id("sub1").addEventListener("click", onFormSubmit);
        id("sub2").style.width = "72px";
        id("sub2").addEventListener("click", onFormSubmit);
        id("sub3").style.width = "144px";
        id("sub3").addEventListener("click", onFormSubmit);
        if (!isNaN(repsCount) && repsCount >= 1) {
            id("reps").value = repsCount;
        }
        id("reps").focus();
        stateChanging = false;
    }
    
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    var buildRep = nop;
    
    function buildReps() {
        for (let i = 0; i < repsCount; i++) {
            reps.push(hira[randomInt(0, hira.length)]);
        }
        thisRep = -1;
        var built = buildRep();
        document.body.innerHTML = '<div id="container"></div>' + built + '<div id="rep-disp"><span id="rep-cur">1</span> of ' + repsCount + '</div>' +
            '<div id="reset">←</div>';
        id("reset").addEventListener("click", reset);
        nextRep();
    }
    
    function buildRepModeOne() {
        return "";
    }
    
    function buildRepModeTwo() {
        return '<div id="mode-disp" class="hidden">ん</div>';
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    function buildSingleKanaButton(h) {
        var k = map[h];
        return '<div class="kana button pointer" data-h="' + h + '" data-k="' + k + '">' + (modeThreeMode === "h" ? h : k) + '</div>';
    }
    
    function buildKanaButtons() {
        var shuffled = shuffleArray(hira);
        var html = "";
        for (let h of shuffled) {
            html += buildSingleKanaButton(h);
        }
        return html;
    }
    
    function buildRepModeThree() {
        var html = buildKanaButtons(); 
        return '<div id="buttons">'+ buildKanaButtons + '</div>';
    }
    
    var stateChanging = false;
    
    function nextRep() {
        if (thisRep < repsCount - 1) {
            stateChanging = true;
            thisRep++;
            showRep();
        }
    }
    
    function prevRep() {
        if (thisRep > 0) {
            stateChanging = true;
            thisRep--;
            showRep();
        }
    }
    
    var answerMode = false;
    
    function toggleAnswerMode() {
        answerMode = !answerMode;
        if (answerMode) {
            id("mode-disp").classList.remove("hidden");
            id("answer").classList.remove("hidden");
        }
        else {
            id("mode-disp").classList.add("hidden");
        }
    }
    
    var showRep = nop;
    
    function showRepModeOne() {
        let h = reps[thisRep];
        let k = kata[hira.indexOf(h)];
        id("rep-cur").innerHTML = thisRep + 1;
        id("container").innerHTML = '<div class="kana left">' + h + '</div><div class="kana right">' + k + '</div>';
        stateChanging = false;
    }
    
    function playRep() {
        play(reps[thisRep]);
    }
    
    function showRepModeTwo() {
        playRep();
        let h = reps[thisRep];
        let k = kata[hira.indexOf(h)];
        var cls = (answerMode ? '' : ' class="hidden"');
        id("container").innerHTML = '<div id="answer"' + cls + '><div class="kana left">' + h + '</div><div class="kana right">' + k + '</div></div>';
        id("rep-cur").innerHTML = thisRep + 1;
        stateChanging = false;
    }
    
    function revealRep() {
        id("answer").classList.remove("hidden");
    }
    
    var modeThreeMode = "h";
    
    function showRepModeThree() {
        setTimeout(playRep, 250);
        let h = reps[thisRep];
        let k = kata[hira.indexOf(h)];
        id("container").innerHTML = '<div id="answer" class="hidden"><div class="kana left">' + h + '</div><div class="kana right">' + k + '</div></div>';
        id("rep-cur").innerHTML = thisRep + 1;
        id("buttons").innerHTML = buildKanaButtons();
        stateChanging = false;
    }
    
    function onFormSubmit(e) {
        var entry = +id("reps").value;
        if (!isNaN(entry) && entry >= 1) {
            stateChanging = true;
            changeMode(+e.target.getAttribute("data-mode"));
            repsCount = entry;
            e.preventDefault();
            e.stopPropagation();
            buildReps();
        }
    }
    
    function onRepChange(e) {
        this.value = this.value.replace(/[^0-9]+/g, "");
    }
    
    function setupDone() {
        document.addEventListener("keydown", keyCheck);
        document.addEventListener("click", clickCheck);
        showMain();
    }
    
    function play(char) {
        if (char !== currentAudioChar) {
            let index = kata.indexOf(char);
            if (index !== -1) {
                char = hira[index];
            }
            currentAudio = audio[char];
            currentAudioChar = char;
            currentAudio.play();
        }
        else {
            stop();
            currentAudio.play();
        }
    }
    
    function stop() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.fastSeek(0);
        }
    }
    
    function doModeThreeAnswer(h) {
        if (h === reps[thisRep]) {
            stateChanging = true;
            correctAudio.play();
            id("answer").classList.remove("hidden");
            for (let elem of document.getElementsByClassName("button")) {
                elem.classList.remove("pointer");
            }
            setTimeout(repeatAnswer, 1250);
        }
        else {
            incorrectAudio.play();
        }
    }
    
    function repeatAnswer() {
        playRep();
        setTimeout(nextRep, 1500);
    }
    
    function clickCheck(e) {
        if (!stateChanging) {
            if (currentMode === 1) {
                play(reps[thisRep]);
            }
            else if (currentMode === 2 || currentMode === 3) {
                if (currentMode === 2 && (e.target === id("container") || e.target === id("answer") ||
                    e.target.parentElement === id("answer")))
                {
                    revealRep();
                }
                else {
                    if (currentMode === 3 && e.target.classList.contains("button")) {
                        doModeThreeAnswer(e.target.getAttribute("data-h"));
                    }
                    else {
                        playRep();
                    }
                }
            }
        }
    }
    
    function keyCheck(e) {
        if (!stateChanging) {
            if (currentMode !== 0) {
                if (e.keyCode === 37) { // Left
                    prevRep();
                }
                else if (e.keyCode === 39) { // Right
                    nextRep();
                }
                else if (e.keyCode === 82) { // R
                    reset();
                }
                else if (e.keyCode === 32) { // Space
                    playRep();
                }
                else if (e.keyCode === 13) { // Enter
                    if (currentMode === 2) {
                        toggleAnswerMode();
                    }
                    else if (currentMode === 3) {
                        modeThreeMode = (modeThreeMode === "h" ? "k" : "h");
                        for (let elem of document.getElementsByClassName("button")) {
                            elem.innerHTML = elem.getAttribute("data-" + modeThreeMode);
                        }
                    }
                }
            }
        }
    }
    
    document.addEventListener("DOMContentLoaded", setup);
}).call(this);
