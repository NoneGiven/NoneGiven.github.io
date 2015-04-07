(function() {
  function shiftImage(dir, amt) {
    var pos;
    if (dir == "lr") {
       pos = parseInt(theImg.style.left);
       pos += amt * 5;
      theImg.style.left = pos;
    }
    else {
      pos = parseInt(theImg.style.top);
      pos += amt * 5;
      theImg.style.top = pos;
    }
  }
  
  function keyCheck(e) {
    if (e.keyCode == 37) {
      shiftImg("lr", -1);
    }
    else if (e.keyCode == 39) {
      shiftImg("lr", 1);
    }
    else if (e.keyCode == 38) {
      shiftImg("ud", -1);
    }
    else if (e.keyCode == 40) {
      shiftImg("ud", 1);
    }
  }
    
  var theImg = document.getElementById("shiftyImg");
  if (theImg) {
    theImg.style.left = "0px";
    theImg.style.top = "0px";
    document.addEventListener("keydown", keyCheck);
  }
}).call();
