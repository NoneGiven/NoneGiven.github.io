(function() {
  function shiftImage(amt) {
    var pos = parseInt(theImg.style.left);
    pos += amt;
    theImg.style.left = pos;
  }
  
  function keyCheck(e) {
    if (e.keyCode == 37) {
      shiftImg(-1);
    }
    else if (e.keyCode == 39) {
      shiftImg(1);
    }
    
    var theImg = document.getElementById("shiftyImg");
    if (theImg) {
      document.addEventListener("keydown", keyCheck);
    }
  }
}).call();
