"use strict";
(function() {
  var baseURL = "https://dl.dropboxusercontent.com/s/";
  var infoURL = "https://nonegiven.github.io/res/opm/vNUM.json"
  
  var lastChapter = 3;
  
  var chapterInfo = {};
  
  var currentVolume = -1;
  var currentChapter = -1;
  var currentTitle = "";
  var currentNumber = "";
  var currentPage = -1;
  var currentPageURL = "";
  var chapterSize = -1;
  
  var imageElement = null;
  var loadingElement = null;
  var leftElement = null;
  var rightElement = null;
  var titleElement = null;
  var navbarElement = null;
  var chapterSwitcherElement = null;
  
  var hashChanging = false;
  
  function changeCurrentVolume(chapterIndex) {
    var oldVolume = currentVolume;
    //if (chapterIndex <= 9) {
    currentVolume = 1;
    return oldVolume !== currentVolume;
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
      currentTitle = chapterInfo[currentChapter].title;
      currentNumber = chapterInfo[currentChapter].number;
      chapterSize = chapterInfo[currentChapter].pages.length - 1;
      titleElement.innerHTML = "Ch " + currentNumber + ": " + currentTitle;
      hashChanging = true;
      chapterSwitcherElement.selectedIndex = currentChapter - 1;
      loadPage(pageIndex > 0 ? pageIndex : 1); // handles not-passed case too becuase lol Javascript
    }
  }
  
  function loadPage(pageIndex) {
    if (pageIndex > chapterSize) {
      pageIndex = chapterSize;
    }
    startLoading();
    currentPage = pageIndex;
    document.title = seriesTitle + " Ch " + currentNumber + ": " + currentTitle + " p" + currentPage;
    hashChanging = true;
    setFragment();
    var path = chapterInfo[currentChapter].pages[currentPage];
    currentPageURL = baseURL + path;
    var extension = path.substr(path.lastIndexOf(".") + 1);
    if (currentPage < 2 && currentChapter < 2) {
      leftElement.className = "side";
    }
    else {
      leftElement.className = "side hand";
    }
    if (currentPage >= chapterSize && currentChapter >= lastChapter) {
      rightElement.className = "side";
    }
    else {
      rightElement.className = "side hand";
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
    loadingElement.className = "header";
  }
  
  function stopLoading() {
    imageElement.className = "";
    loadingElement.className = "header hidden";
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
  
  function keyCheck(e) {
    if (e.keyCode === 37) { // Left Arrow
      pageBack();
    }
    else if (e.keyCode === 39) { // Right Arrow
      pageForward();
    }
  }
  
  function setFragment() {
    window.location.hash = currentChapter + "," + currentPage;
  }
  
  function parseFragment() {
    if (!hashChanging) {
      var split = window.location.hash.split("#")[1].split(",");
      var chapterIndex = parseInt(split[0]);
      if (isNaN(chapterIndex)) {
        chapterIndex = 1;
      }
      var pageIndex = parseInt(split[1]);
      if (isNaN(pageIndex)) {
        pageIndex = 1;
      }
      switchChapter(chapterIndex, pageIndex);
    }
  }
  
  function chapterSwitcherChange(e) {
    if (!hashChanging) {
      var chapter = parseInt(e.target[e.target.selectedIndex].value);
      if (chapter !== currentChapter) {
        switchChapter(chapter);
      }
    }
  }
  
  function showNavbar() {
    navbarElement.className = "header";
  }
  
  function hideNavbar() {
    navbarElement.className = "header transparent";
  }
  
  function downloadPage() {
    if (currentPageURL) {
      window.open(currentPageURL, "_blank");
    }
  }
  
  function toggleFit() {
    if (imageElement.className.indexOf("nofit") !== -1) {
      imageElement.className = imageElement.className.replace("nofit", "fit");
    }
    else {
      imageElement.className = imageElement.className.replace("fit", "nofit");
    }
  }
  
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    window.addEventListener("hashchange", parseFragment);
    imageElement = document.getElementById("image");
    loadingElement = document.getElementById("loading");
    leftElement = document.getElementById("left")
    rightElement = document.getElementById("right");
    titleElement = document.getElementById("title");
    navbarElement = document.getElementById("navbar");
    chapterSwitcherElement = document.getElementById("chapterSwitcher");
    leftElement.addEventListener("click", pageBack);
    rightElement.addEventListener("click", pageForward);
    imageElement.addEventListener("load", stopLoading);
    navbarElement.addEventListener("mouseover", showNavbar);
    navbarElement.addEventListener("mouseout", hideNavbar);
    chapterSwitcherElement.addEventListener("change", chapterSwitcherChange);
    document.getElementById("downloadButton").addEventListener("click", downloadPage);
    document.getElementById("fitButton").addEventListener("click", toggleFit);
    document.addEventListener("keydown", keyCheck);
    if (window.location.hash === "") {
      switchChapter(1);
    }
    else {
      parseFragment();
    }
  }
  
  document.addEventListener("DOMContentLoaded", setup);
  var seriesTitle = "One-Punch Man";
  document.title = seriesTitle;
}).call(this);
