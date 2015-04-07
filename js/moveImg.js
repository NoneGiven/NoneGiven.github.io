(function() {
  var theImg, uInt, dInt, lInt, rInt
  theImg = null;
  function shiftImg(dir, amt) {
    var pos;
    if (dir == "lr") {
       pos = parseInt(theImg.style.left);
       pos += amt * 5;
       theImg.style.left = pos + "px";
    }
    else {
      pos = parseInt(theImg.style.top);
      pos += amt * 5;
      theImg.style.top = pos + "px";
    }
  }
  
  function keyCheck(e) {
    if (!theImg) {
      return;
    }
    if (e.keyCode == 65) { // A
      shiftImg("lr", -1);
      lInt = window.setInterval(function() { shiftImg("lr", -1); }, 500);
    }
    else if (e.keyCode == 68) { // D
      shiftImg("lr", 1);
      rInt = window.setInterval(function() { shiftImg("lr", 1); }, 500);
    }
    else if (e.keyCode == 87) { // W
      shiftImg("ud", -1);
      uInt = window.setInterval(function() { shiftImg("ud", -1); }, 500);
    }
    else if (e.keyCode == 83) { // S
      shiftImg("ud", 1);
      dInt = window.setInterval(function() { shiftImg("ud", 1); }, 500);
    }
  }
  
  function keyUpCheck(e) {
    if (e.keyCode == 65) { // A
      window.clearInterval(lInt);
    }
    else if (e.keyCode == 68) { // D
      window.clearInterval(rInt);
    }
    else if (e.keyCode == 87) { // W
      window.clearInterval(uInt);
    }
    else if (e.keyCode == 83) { // S
      window.clearInterval(dInt);
    }
  }
  
  function grabImg() {
    theImg = document.getElementById("shiftyImg");
    if (theImg) {
      theImg.style.left = "0px";
      theImg.style.top = "0px";
      return true;
    }
    return false;
  }
  
  function grabImgLoop() {
    if (!grabImg()) {
      window.setTimeout(grabImgLoop, 10);
    }
  }
  
  if (!grabImg()) {
    window.setTimeout(grabImgLoop, 10);
  }
  document.addEventListener("keydown", keyCheck);
  document.addEventListener("keyup", keyUpCheck);
  
}).call();
