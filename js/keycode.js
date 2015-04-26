(function() {
  var mainSpan, shiftSpan, ctrlSpan, altSpan; //, metaSpan
  
  function startup() {
    mainSpan = document.getElementById("keydisplay");
    shiftSpan = document.getElementById("shiftkey");
    ctrlSpan = document.getElementById("ctrlkey");
    altSpan = document.getElementById("altkey");
    //metaSpan = document.getElementById("metakey");
    document.addEventListener("keydown", keyCheck);
    document.addEventListener("keyup", keyUpCheck);
  }
  
  function keyCheck(e) {
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {
      displayKey(e.keyCode);
    }
    modifier(shiftSpan, e.shiftKey);
    modifier(ctrlSpan, e.ctrlKey);
    modifier(altSpan, e.altKey);
    //modifier(metaSpan, e.metaKey);
    e.preventDefault();
  }
  
  function keyUpCheck(e) {
    modifier(shiftSpan, e.shiftKey);
    modifier(ctrlSpan, e.ctrlKey);
    modifier(altSpan, e.altKey);
    //modifier(metaSpan, e.metaKey);
    e.preventDefault();
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
