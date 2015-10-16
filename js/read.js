"use strict";
(function() {
  var baseURL = "https://dl.dropboxusercontent.com/s/";
  var chapterInfo = [{},
    {
      "number": "1",
      "title": "One Punch",
      "pages": ["",
        "cadz9o1zrnftgjd/OPM_1_01.jpg",
        "tm10u82i6fisd8c/OPM_1_02-03.jpg",
        "dnccp9idmwlbj82/OPM_1_04.jpg",
        "1ppjf2cdj708zku/OPM_1_05.jpg",
        "q46jiur8xkmtrxv/OPM_1_06.jpg",
        "yf2ch4b9m9pxtyp/OPM_1_07.jpg",
        "b8n0t27zf0ruzt7/OPM_1_08.jpg",
        "efcfbrw4jzglpyz/OPM_1_09.jpg",
        "gtowm1j5qrtbgm5/OPM_1_10.jpg",
        "r4ajxgkmfzr0xa3/OPM_1_11.jpg",
        "a6znj0s5zsp5we4/OPM_1_12.jpg",
        "trzmatbr9s1rpdm/OPM_1_13.jpg",
        "xm05vuha9g3mdo6/OPM_1_14-15.jpg",
        "ng0x19z2r740hf5/OPM_1_16.jpg",
        "41yx5va4bwyk9i4/OPM_1_17.jpg",
        "d1pc2ruexmo8box/OPM_1_18-19.jpg",
        "98rx0erbl7boqnh/OPM_1_20-21.jpg",
        "9gsjxzy85na9h0q/OPM_1_22.jpg"
      ]
    }
  ]
  
  var lastChapter = chapterInfo.length - 1;
  
  var currentChapter = -1;
  var currentPage = -1;
  var chapterSize = -1;
  
  var imageElement = null;
  var loadingElement = null;
  var leftElement = null;
  var rightElement = null;
  
  function switchChapter(chapterIndex) {
    currentChapter = chapterIndex;
    chapterSize = chapterInfo[currentChapter].pages.length - 1;
    loadPage(1);
  }
  
  function loadPage(pageIndex) {
    startLoading();
    currentPage = pageIndex;
    var newURL = baseURL + chapterInfo[currentChapter].pages[currentPage];
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
    xhr.open("GET", newURL);
    xhr.onprogress = function(data) {
      var percentDisplay = (data.loaded / data.total * 100).toFixed(2);
      loadingElement.innerHTML = "Loading..." + percentDisplay;
    };
    xhr.onload = function() {
      loadingElement.innerHTML = "Loading... 100.00%";
      imageElement.src = newURL;
      stopLoading();
    };
    xhr.setRequestHeader("Pragma", "");
    xhr.setRequestHeader("Cache-Control", "");
    xhr.send();
  }
  
  function startLoading() {
    loadingElement.className = "";
  }
  
  function stopLoading() {
    imageElement.className = "";
    loadingElement.className = "hidden";
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
  
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    imageElement = document.getElementById("image");
    loadingElement = document.getElementById("loading");
    leftElement = document.getElementById("left")
    rightElement = document.getElementById("right");
    leftElement.addEventListener("click", pageBack);
    rightElement.addEventListener("click", pageForward);
    //imageElement.addEventListener("load", stopLoading);
    document.addEventListener("keydown", keyCheck);
    switchChapter(1);
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
