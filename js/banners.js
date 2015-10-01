(function() {
  "use strict";
  var bannerWidth = 300;
  var bannerHeight = 100;
  var content = null;
  var placeholder = '<div class="placeholder" title="T"></span>';
  var bannersPerWindow = 0;
  var bannersPerLine = 0;
  var bannersPerColumn = 0;
  var jpg = [0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 28, 29, 33, 38, 39, 43, 44, 45, 46, 47, 52, 54, 57, 59, 60, 61, 64, 66, 67, 69, 71, 72, 76, 77, 81, 82, 83, 84, 88, 90, 91, 96, 98, 99, 100, 104, 106, 116, 119, 137, 140, 148, 149, 150, 154, 156, 157, 158, 159, 161, 162, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 178, 179, 180, 181, 182, 183, 186, 189, 190, 192, 193, 194, 197, 198, 200, 201, 202, 203, 205, 206, 207, 208, 210, 213, 214, 215, 216, 218, 219, 220, 221, 222, 223, 224, 227];
  var gif = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 28, 29, 30, 33, 34, 35, 36, 37, 39, 40, 42, 44, 45, 46, 48, 50, 52, 54, 55, 57, 58, 59, 60, 61, 63, 64, 66, 67, 68, 69, 70, 72, 73, 75, 76, 77, 78, 80, 81, 82, 83, 86, 87, 88, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 109, 110, 111, 112, 113, 115, 116, 117, 118, 119, 120, 122, 123, 124, 127, 129, 130, 131, 134, 135, 136, 138, 139, 141, 144, 146, 148, 149, 153, 154, 155, 157, 158, 159, 160, 161, 162, 164, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 181, 182, 183, 185, 186, 187, 188, 189, 190, 191, 192, 193, 195, 196, 197, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 219, 220, 221, 222, 224, 225, 226, 227, 228, 230, 232, 233, 234, 235, 238, 240, 241, 243, 244, 245, 246, 247, 249, 250, 251, 253];
  var png = [0, 1, 2, 3, 5, 6, 9, 10, 11, 12, 14, 16, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 37, 39, 40, 41, 42, 43, 44, 45, 48, 49, 50, 51, 52, 53, 57, 58, 59, 64, 66, 67, 68, 69, 70, 71, 72, 76, 78, 79, 81, 82, 85, 86, 87, 89, 95, 98, 100, 101, 102, 105, 106, 107, 109, 110, 111, 112, 113, 114, 115, 116, 118, 119, 120, 121, 122, 123, 126, 128, 130, 134, 136, 138, 139, 140, 142, 145, 146, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 178, 179, 180, 181, 182, 184, 186, 188, 190, 192, 193, 194, 195, 196, 197, 198, 200, 202, 203, 205, 206, 207, 209, 212, 213, 214, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 229, 231, 232, 233, 234, 235, 237, 238, 239, 240, 241, 242, 244, 245, 246, 247, 248, 249, 250, 253, 254, 255, 256, 257, 258, 259, 260, 262, 268];
  var indexPointers = [0, 0, 0];
  var maxIndices = [jpg[jpg.length - 1], gif[gif.length - 1], png[png.length - 1]];
  var extensions = ["jpg", "gif", "png"];
  var extensionPointer = 0;
  var maxExtension = extensions.length;
  var baseUrl = "//s.4cdn.org/image/title/";
  var downCount = 0;
  var allTheWayFor = [false, false, false];
  var allTheWayDown = false;
  var okayToScroll = true;
  var scrollTimeout = 500;
  var scrollTimeoutContainer = null;
  
  function resetStuff() {
    content.innerHTML = "";
    content.style.top = 0;
    indexPointers = [0, 0, 0];
    extensionPointer = 0;
    downCount = 0;
    okayToScroll = true;
    allTheWayFor = [false, false, false];
    allTheWayDown = false;
    clearTimeout(scrollTimeoutContainer);
    scrollTimeoutContainer = null;
    computeStuff();
    doFirst();
  }
  
  function computeStuff() {
    bannersPerLine = Math.floor(window.innerWidth / bannerWidth);
    bannersPerColumn = Math.floor(window.innerHeight / bannerHeight);
    bannersPerWindow = bannersPerLine * bannersPerColumn;
  }
  
  function onKeyDown(e) {
    if (e.ctrlKey && e.keyCode === 38) {
      resetStuff();
    }
    else if (e.keyCode === 40 && okayToScroll) {
      if (!allTheWayDown) {
        scrollTimeoutContainer = setTimeout(makeScrollOkay, scrollTimeout);
      }
      okayToScroll = false;
      scrollMore();
    }
  }
  
  function makeScrollOkay() {
    okayToScroll = true;
    scrollTimeoutContainer = null;
  }
  
  function scrollMore() {
    downCount++;
    content.style.top = "-" + downCount * bannersPerColumn * bannerHeight + "px";
    var imgs = document.getElementsByTagName("img");
    for (var i = 0; i < imgs.length; i++) {
      imgs.innerHTML = placeholder;
    }
    for (var i = 0; i < bannersPerWindow; i++) {
       if (!getBanner()) {
         if (checkAllTheWayDown()) {
          break;
        }
        i--;
       }
    }
  }
  
  function onResize() {
    window.removeEventListener("resize", onResize);
    alert("Resizing the window breaks this page.");
  }
  
  function onScroll() {
    if (okayToScroll) {
      if (!allTheWayDown) {
        scrollTimeoutContainer = setTimeout(makeScrollOkay, scrollTimeout);
      }
      okayToScroll = false;
      scrollMore();
    }
  }
  
  function initialize() {
    document.removeEventListener("DOMContentLoaded", initialize);
    content = document.getElementById("content");
    computeStuff();
    doFirst();
  }
  
  function doFirst() {
    for (var i = 0; i < 2 * bannersPerWindow; i++) {
      if (!getBanner()) {
        if (checkAllTheWayDown()) {
          break;
        }
        i--;
      }
    }
  }
  
  function checkAllTheWayDown() {
    var allTheWay = true;
    for (var i = 0; i < allTheWayFor.length; i++) {
      if (!allTheWayFor[i]) {
        allTheWay = false;
        break;
      }
    }
    allTheWayDown = allTheWay;
    return allTheWayDown;
  }
  
  function getBanner() {
    if (allTheWayFor[extensionPointer]) {
      if (++extensionPointer >= maxExtension) {
        extensionPointer = 0;
      }
      return false;
    }
    var extension = extensions[extensionPointer];
    var indexPointer = indexPointers[extensionPointer]++;
    if (indexPointer > maxIndices[extensionPointer]) {
      allTheWayFor[extensionPointer] = true;
      if (++extensionPointer >= maxExtension) {
        extensionPointer = 0;
      }
      return false;
    }
    var index = 0;
    if (extension === "jpg") {
      index = jpg[indexPointer];
    }
    else if (extension === "gif") {
      index = gif[indexPointer];
    }
    else if (extension === "png") {
      index = png[indexPointer];
    }
    if (++extensionPointer >= maxExtension) {
      extensionPointer = 0;
    }
    if (index === undefined) {
      return false;
    }
    var img = document.createElement("img");
    img.className = "img";
    img.src = baseUrl + index + "." + extension;
    img.title = index + "." + extension;
    img.onerror = imgOnerror;
    content.appendChild(img);
    return true;
  }
  
  function imgOnerror() {
    var split = this.src.split("/");
    var failure = split[split.length - 1];
    this.outerHTML = placeholder.replace("T", "Failed to load " + failure);
  }
  
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onResize);
  window.addEventListener("DOMMouseScroll", onScroll);
  window.addEventListener("mousewheel", onScroll);
  document.addEventListener("DOMContentLoaded", initialize);
}).call(this);
