"use strict";
(function() {
  var baseURL = "https://dl.dropboxusercontent.com/s/";
  
  var lastVolume = 1;
  var currentVolume = -1;
  var currentChapter = -1;
  var currentTitle = "";
  var currentNumber = "";
  var currentPage = -1;
  var chapterSize = -1;
  var currentExtension = "";
  
  var imageElement = null;
  var loadingElement = null;
  var leftElement = null;
  var rightElement = null;
  var titleElement = null;
  var navbarElement = null;
  
  var hashChanging = false;
  
  function changeCurrentVolume(chapterIndex) {
    var oldVolume = currentVolume;
    //if (chapterIndex <= 9) {
    currentVolume = 1;
    return oldVolume !== currentVolume;
  }
  
  function getVolumeInfo() {
    console.log("fetching volume info");
  }
  
  function switchChapter(chapterIndex, pageIndex) {
    if (chapterIndex <= lastChapter) {
      if (changeCurrentVolume(chapterIndex)) {
        getVolumeInfo();
      }
      currentChapter = chapterIndex;
      currentExtension = chapterInfo[currentChapter].extension;
      currentTitle = chapterInfo[currentChapter].title;
      currentNumber = chapterInfo[currentChapter].number;
      chapterSize = chapterInfo[currentChapter].pages.length - 1;
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
    xhr.responseType = "arraybuffer";
    xhr.onprogress = function(data) {
      var percentDisplay = (data.loaded / data.total * 100).toFixed(2);
      loadingElement.innerHTML = "Loading... " + percentDisplay + "%";
    };
    xhr.onload = function(data) {
      hashChanging = false;
      loadingElement.innerHTML = "Loading... 100.00%";
      var blob = new Blob([this.response], {type: "image/" + currentExtension});
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
    console.log(e);
  }
  
  function showNavbar() {
    navbarElement.className = "header";
  }
  
  function hideNavbar() {
    navbarElement.className = "header transparent";
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
    leftElement.addEventListener("click", pageBack);
    rightElement.addEventListener("click", pageForward);
    imageElement.addEventListener("load", stopLoading);
    navbarElement.addEventListener("mouseover", showNavbar);
    navbarElement.addEventListener("mouseout", hideNavbar);
    document.getElementById("chapterSwitcher").addEventListener("change", chapterSwitcherChange);
    document.addEventListener("keydown", keyCheck);
    if (window.location.hash === "") {
      switchChapter(1);
    }
    else {
      parseFragment();
    }
  }
  
  var chapterInfo = [{},
    {
      "number": "1",
      "title": "One Punch",
      "extension": "jpg",
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
    },
    {
      "number": "2",
      "title": "Crab & Job Hunting",
      "extension": "jpg",
      "pages": ["",
        "tq8zyif6xbqmweu/OPM_2_01.jpg",
        "upl37zdg436ona9/OPM_2_02.jpg",
        "j9f43kybqkey89k/OPM_2_03.jpg",
        "9ae9y9dhwrcwc82/OPM_2_04.jpg",
        "v3gyfcqyeaacyoy/OPM_2_05.jpg",
        "934cyuol31865a1/OPM_2_06.jpg",
        "p2g8wvcgjfv2a3n/OPM_2_07.jpg",
        "8wncqu1e4zd94p1/OPM_2_08.jpg",
        "nvtirqk2n9cvg5r/OPM_2_09.jpg",
        "5pfwt22hzb4cts3/OPM_2_10.jpg",
        "oy7hdqs0abjb4pc/OPM_2_11.jpg",
        "q5n2y5a5sjf4v86/OPM_2_12.jpg",
        "quefekggtoyuayw/OPM_2_13.jpg",
        "v8jyp2mhintzldn/OPM_2_14.jpg",
        "qpgtvdplhvksxa8/OPM_2_15.jpg",
        "w8ttwgqdb8mqe5y/OPM_2_16.jpg"
      ]
    },
    {
      "number": "3",
      "title": "A Disastrous Being",
      "extension": "jpg",
      "pages": ["",
        "iqwvj5nna8f56k2/OPM_3_01.jpg",
        "notv804xhop5e6s/OPM_3_02.jpg",
        "f31tmzc7q25zzc8/OPM_3_03.jpg",
        "txzw1brn2hl78az/OPM_3_04.jpg",
        "3zbdhcb04beozcs/OPM_3_05.jpg",
        "gmcva2ro5q7w5sg/OPM_3_06.jpg",
        "uqef0p65qajdite/OPM_3_07.jpg",
        "n7uzay58ogn6bjs/OPM_3_08.jpg",
        "mtgdbtdiap5ipdu/OPM_3_09.jpg",
        "ftze1snfnkkd5o5/OPM_3_10.jpg",
        "ipyzgu9zlwbv92f/OPM_3_11.jpg",
        "a99y686gpfr1vsu/OPM_3_12.jpg",
        "mr2gf7me7h4i6l3/OPM_3_13.jpg",
        "ooirsvbblmmgzn0/OPM_3_14.jpg",
        "cqihfz1aezfohf4/OPM_3_15.jpg",
        "3bwgkk63cvw9alz/OPM_3_16.jpg",
        "qknwoqpwax5vg9v/OPM_3_17.jpg",
        "xaz70qas27ynrm1/OPM_3_18-19.jpg",
        "utenhhuciopr3h2/OPM_3_20-21.jpg",
        "jhy2ngyxmz1v425/OPM_3_22.jpg"
      ]
    }
  ]
  
  var lastChapter = chapterInfo.length - 1;
  
  document.addEventListener("DOMContentLoaded", setup);
  var seriesTitle = "One-Punch Man";
  document.title = seriesTitle;
}).call(this);
