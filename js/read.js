"use strict";
(function() {
  var seriesURL = "https://nonegiven.github.io/res/SER/s.json";
  var imageURL = "";
  var infoURL = "";
  var infoURLBase = "https://nonegiven.github.io/res/SER/vNUM.json";
  
  var seriesInfo = {};
  var chapterInfo = {};
  var lastChapter = 0;
  var lastVolume = 0;
  var seriesTitle = "";
  
  var currentVolume = -1;
  var currentChapter = -1;
  var currentTitle = "";
  var currentNumber = "";
  var currentPage = -1;
  var currentPageURL = "";
  var chapterSize = -1;
  
  var imageElement = null;
  var imageContainerElement = null;
  var loadingElement = null;
  var messageElement = null;
  var leftElement = null;
  var rightElement = null;
  var titleElement = null;
  var navbarElement = null;
  var fitButtonElement = null;
  var pageSwitchBarElement = null;
  var chapterSwitcherElement = null;
  var infoPanelElement = null;
  
  var fitMode = 0; // 0 - nofit, 1 - resize, 2 - fitwidth
  var hashChanging = false;
  var messageHideTimeoutContainer = null;
  var messageHideTimeout = 4000;
  
  function changeCurrentVolume(chapterIndex) {
    var oldVolume = currentVolume;
    for (var i = 0; i < seriesInfo.index.length; i++) {
      if (chapterIndex > seriesInfo.index[i]) {
        currentVolume = lastVolume - i;
        break;
      }
    }
    return oldVolume !== currentVolume;
  }
  
  function convertHtmlEntities(str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  
  function buildChapterSwitcher() {
    var html = "";
    var vol = 0;
    var optgroup = false;
    for (var i = 0; i < seriesInfo.contents.length; i++) {
      if (seriesInfo.index.indexOf(i) !== -1) {
        if (optgroup) {
          html += '</optgroup>';
        }
        vol++;
        html += '<optgroup label="Volume ' + vol + '">'
        optgroup = true;
      }
      var ch = seriesInfo.contents[i];
      html += '<option value="' + (i + 1) + '">' + ch.num + ': ' + convertHtmlEntities(ch.title) + '</option>';
    }
    if (optgroup) {
      html += '</optgroup>';
    }
    chapterSwitcherElement.innerHTML = html;
  }
  
  function getSeriesInfo(seriesCode) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", seriesURL.replace("SER", seriesCode));
    xhr.onload = function(data) {
      seriesInfo = JSON.parse(this.responseText);
      buildChapterSwitcher();
      imageURL = seriesInfo.imageURL;
      infoURL = infoURLBase.replace("SER", seriesCode);
      lastChapter = seriesInfo.chapters
      lastVolume = seriesInfo.index.length;
      seriesTitle = seriesInfo.title;
      document.title = seriesTitle;
      if (window.location.hash === "") {
        switchChapter(1);
      }
      else {
        parseFragment();
      }
    };
    xhr.send();
  }
  
  function getVolumeInfo(chapterIndex, pageIndex) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", infoURL.replace("NUM", currentVolume));
    xhr.onload = function(data) {
      chapterInfo = JSON.parse(this.responseText);
      if (chapterIndex !== undefined) {
        switchChapter(chapterIndex, pageIndex)
      }
    };
    xhr.send();
  }
  
  function switchChapter(chapterIndex, pageIndex) {
    if (chapterIndex <= lastChapter) {
      if (changeCurrentVolume(chapterIndex)) {
        getVolumeInfo(chapterIndex, pageIndex);
        return;
      }
      currentChapter = chapterIndex;
      currentTitle = seriesInfo.contents[currentChapter - 1].title;
      currentNumber = seriesInfo.contents[currentChapter - 1].num;
      chapterSize = chapterInfo[currentChapter].pages.length - 1;
      titleElement.innerHTML = "Ch " + currentNumber + ": " + convertHtmlEntities(currentTitle);
      document.title = seriesTitle + " Ch " + currentNumber + ": " + currentTitle;
      hashChanging = true;
      chapterSwitcherElement.selectedIndex = currentChapter - 1;
      buildPageSwitchBar();
      loadPage(pageIndex > 0 ? pageIndex : 1); // handles not-passed case too because lol Javascript
    }
  }
  
  function loadPage(pageIndex) {
    if (pageIndex > chapterSize) {
      pageIndex = chapterSize;
    }
    startLoading();
    pageSwitchBarElement.children[pageSwitchBarElement.getAttribute("data-selected")].classList.remove("selected");
    pageSwitchBarElement.children[pageIndex - 1].classList.add("selected");
    pageSwitchBarElement.setAttribute("data-selected", pageIndex - 1);
    currentPage = pageIndex;
    hashChanging = true;
    setFragment();
    var path = chapterInfo[currentChapter].pages[currentPage];
    currentPageURL = imageURL + path;
    var extension = path.substr(path.lastIndexOf(".") + 1);
    if (currentPage < 2 && currentChapter < 2) {
      leftElement.classList.remove("hand");
    }
    else {
      leftElement.classList.add("hand");
    }
    if (currentPage >= chapterSize && currentChapter >= lastChapter) {
      rightElement.classList.remove("hand");
    }
    else {
      rightElement.classList.add("hand");
    }
    loadingElement.innerHTML = "Loading... 0.00%";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", currentPageURL);
    xhr.responseType = "arraybuffer";
    xhr.onprogress = function(data) {
      var percentDisplay = (data.loaded / data.total * 100).toFixed(2);
      loadingElement.innerHTML = "Loading... " + percentDisplay + "%";
    };
    xhr.onload = function(data) {
      hashChanging = false;
      loadingElement.innerHTML = "Loading... 100.00%";
      var blob = new Blob([this.response], {type: "image/" + extension});
      imageElement.src = window.URL.createObjectURL(blob);
    };
    xhr.send();
  }
  
  function startLoading() {
    loadingElement.classList.remove("hidden");
  }
  
  function stopLoading() {
    imageElement.classList.remove("hidden");
    loadingElement.classList.add("hidden");
    window.scrollTo(0, 0);
  }
  
  function pageBack() {
    if (currentPage < 2) {
      if (currentChapter > 1) {
        switchChapter(currentChapter - 1);
      }
    }
    else {
      loadPage(currentPage - 1);
    }
  }
  
  function pageForward() {
    if (currentPage >= chapterSize) {
      if (currentChapter < lastChapter) {
        switchChapter(currentChapter + 1);
      }
    }
    else {
      loadPage(currentPage + 1);
    }
  }
  
  function clickCheck(e) {
    if (e.target.id !== "infoPanel" && e.target.id !== "infoButton") {
      hideInfo();
    }
  }
  
  function keyCheck(e) {
    if (e.keyCode > 48 && e.keyCode < 52) { // 1, 2, 3
      setFit(e.keyCode - 49);
    }
    else if (e.keyCode === 27) { // Esc
      hideInfo();
    }
    else if (!e.ctrlKey) {
      if (e.keyCode === 37) { // Left Arrow
        if (e.shiftKey) {
          if (currentChapter > 1) {
            switchChapter(currentChapter - 1);
          }
        }
        else {
          pageBack();
        }
      }
      else if (e.keyCode === 39) { // Right Arrow
        if (e.shiftKey) {
          if (currentChapter < lastChapter) {
            switchChapter(currentChapter + 1);
          }
        }
        else {
          pageForward();
        }
      }
    }
  }
  
  function setFragment() {
    window.location.hash = currentChapter + "," + currentPage;
  }
  
  function parseFragment() {
    if (!hashChanging) {
      var split = window.location.hash.split("#")[1].split(",");
      var chapterIndex = +split[0];
      if (isNaN(chapterIndex)) {
        chapterIndex = 1;
      }
      var pageIndex = +split[1];
      if (isNaN(pageIndex)) {
        pageIndex = 1;
      }
      switchChapter(chapterIndex, pageIndex);
    }
  }
  
  function chapterSwitcherChange(e) {
    if (!hashChanging) {
      var chapter = +e.target[e.target.selectedIndex].value;
      if (!isNaN(chapter) && chapter !== currentChapter) {
        switchChapter(chapter);
      }
    }
  }
  
  function showMessage(msg) {
    if (messageHideTimeoutContainer !== null) {
      clearTimeout(messageHideTimeoutContainer);
    }
    if (!msg) {
      msg = "Empty message!"
    }
    messageElement.innerHTML = msg;
    messageElement.classList.remove("hidden");
    messageHideTimeoutContainer = setTimeout(hideMessage, messageHideTimeout);
  }
  
  function hideMessage() {
    messageElement.classList.add("hidden");
    messageElement.innerHTML = "";
    messageHideTimeoutContainer = null;
  }
  
  function showNavbar() {
    navbarElement.classList.remove("transparent");
  }
  
  function hideNavbar() {
    navbarElement.classList.add("transparent");
  }
  
  function buildPageSwitchBar() {
    pageSwitchBarElement.innerHTML = "";
    pageSwitchBarElement.setAttribute("data-selected", "0");
    var pageBlock, split;
    for (var i = 1; i <= chapterSize; i++) {
      pageBlock = document.createElement("span");
      pageBlock.className = "page hand";
      if (i === 1) {
        pageBlock.classList.add("selected");
      }
      pageBlock.setAttribute("data-page", i);
      split = chapterInfo[currentChapter].pages[i].split("/");
      split = split[split.length - 1].split("_");
      pageBlock.innerHTML = split[split.length - 1].split(".")[0];
      pageSwitchBarElement.appendChild(pageBlock);
    }
  }
  
  function pageSwitchClick(e) {
    if (e.target.classList.contains("selected")) {
      return;
    }
    var page = +e.target.getAttribute("data-page");
    if (!isNaN(page)) {
      loadPage(page);
    }
  }
  
  function showPageSwitchBar() {
    pageSwitchBarElement.classList.remove("transparent");
  }
  
  function hidePageSwitchBar() {
    pageSwitchBarElement.classList.add("transparent");
  }
  
  function downloadPage() {
    if (currentPageURL) {
      window.open(currentPageURL, "_blank");
    }
  }
  
  function toggleFit() {
    setFit((fitMode + 1) % 3);
  }
  
  function setFit(mode) {
    var msg;
    fitMode = mode;
    if (fitMode === 1) {
      imageElement.className = "resize";
      imageContainerElement.className = "resize";
      msg = "Resized";
    }
    else if (fitMode === 2) {
      imageElement.className = "fitwidth";
      imageContainerElement.className = "fitwidth";
      msg = "Fit width";
    }
    else {
      fitMode = 0;
      imageElement.className = "nofit";
      imageContainerElement.className = "nofit";
      msg = "Full size";
    }
    localStorage.setItem("reader-fit-mode", fitMode.toString());
    fitButtonElement.title = msg;
    fitButtonElement.innerHTML = "&lt;" + (fitMode + 1) + "&gt;";
    showMessage(msg);
  }
  
  function showInfo() {
    infoPanelElement.classList.remove("hidden");
  }
  
  function hideInfo() {
    infoPanelElement.classList.add("hidden");
  }
  
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    window.addEventListener("hashchange", parseFragment);
    imageElement = document.getElementById("image");
    imageContainerElement = document.getElementById("imageContainer");
    loadingElement = document.getElementById("loading");
    messageElement = document.getElementById("message");
    leftElement = document.getElementById("left")
    rightElement = document.getElementById("right");
    titleElement = document.getElementById("title");
    navbarElement = document.getElementById("navbar");
    pageSwitchBarElement = document.getElementById("pageSwitchBar");
    chapterSwitcherElement = document.getElementById("chapterSwitcher");
    infoPanelElement = document.getElementById("infoPanel");
    fitButtonElement = document.getElementById("fitButton");
    setFit(+localStorage.getItem("reader-fit-mode"));
    leftElement.addEventListener("click", pageBack);
    rightElement.addEventListener("click", pageForward);
    imageElement.addEventListener("load", stopLoading);
    navbarElement.addEventListener("mouseover", showNavbar);
    navbarElement.addEventListener("mouseout", hideNavbar);
    pageSwitchBarElement.addEventListener("mouseover", showPageSwitchBar);
    pageSwitchBarElement.addEventListener("mouseout", hidePageSwitchBar);
    pageSwitchBarElement.addEventListener("click", pageSwitchClick);
    chapterSwitcherElement.addEventListener("change", chapterSwitcherChange);
    fitButtonElement.addEventListener("click", toggleFit);
    document.getElementById("downloadButton").addEventListener("click", downloadPage);
    document.getElementById("infoButton").addEventListener("click", showInfo);
    document.addEventListener("keydown", keyCheck);
    document.addEventListener("click", clickCheck);
    getSeriesInfo("opm");
    if (localStorage.getItem("reader-first-visit") === null) {
      showInfo();
      localStorage.setItem("reader-first-visit", "nope");
    }
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
