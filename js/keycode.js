(function() {
  var mainSpan, shiftSpan, ctrlSpan, altSpan, metaSpan;
  
  function startup() {
    mainSpan = document.getElementById("keydisplay");
    shiftSpan = document.getElementById("shiftkey");
    ctrlSpan = document.getElementById("ctrlkey");
    altSpan = document.getElementById("altkey");
    metaSpan = document.getElementById("metakey");
    document.addEventListener("keydown", keyCheck);
    document.addEventListener("keyup", keyUpCheck);
  }
  
  function keyCheck(e) {
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {
      displayKey(e.keyCode);
    }
    if (e.shiftKey) {
      modifier(shiftSpan, true);
    }
    if (e.ctrlKey) {
      modifier(ctrlSpan, true);
    }
    if (e.altKey) {
      modifier(altSpan, true);
    }
    if (e.metaKey) {
      modifier(metaSpan, true);
    }
  }
  
  function keyUpCheck(e) {
    if (e.shiftKey) {
      modifier(shiftSpan, false);
    }
    if (e.ctrlKey) {
      modifier(ctrlSpan, false);
    }
    if (e.altKey) {
      modifier(altSpan, false);
    }
    if (e.metaKey) {
      modifier(metaSpan, false);
    }
  }
  
  function displayKey(code) {
    mainSpan.innerHTML = code;
  }
  
  function modifier(elem, on) {
    if (on) {
      elem.className = "";
    }
    else {
      elem.className = "off";
    }
  }
  
  document.addEventListener("DOMContentLoaded", startup);
}).call();
