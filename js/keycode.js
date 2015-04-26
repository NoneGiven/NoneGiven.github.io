(function() {
  var mainSpan, shiftSpan, ctrlSpan, altSpan, nameSpan; //, metaSpan
  
  function startup() {
    mainSpan = document.getElementById("keydisplay");
    nameSpan = document.getElementById("namedisplay");
    shiftSpan = document.getElementById("shiftkey");
    ctrlSpan = document.getElementById("ctrlkey");
    altSpan = document.getElementById("altkey");
    //metaSpan = document.getElementById("metakey");
    document.addEventListener("keydown", keyCheck);
    document.addEventListener("keyup", keyUpCheck);
  }
  
  function keyCheck(e) {
    if (e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {
      displayKey(e.keyCode, (e.keyCode >= 96 && e.keyCode <= 105 ? "Numpad " : "") + e.key);
    }
    modifier(shiftSpan, e.shiftKey);
    modifier(ctrlSpan, e.ctrlKey);
    modifier(altSpan, e.altKey);
    //modifier(metaSpan, e.metaKey);
    if (checkboxIsChecked()) {
      e.preventDefault();
    }
  }
  
  function keyUpCheck(e) {
    modifier(shiftSpan, e.shiftKey);
    modifier(ctrlSpan, e.ctrlKey);
    modifier(altSpan, e.altKey);
    //modifier(metaSpan, e.metaKey);
    if (checkboxIsChecked()) {
      e.preventDefault();
    }
  }
  
  function displayKey(code, name) {
    mainSpan.innerHTML = code;
    nameSpan.innerHTML = name;
  }
  
  function modifier(elem, on) {
    if (on) {
      elem.className = "";
    }
    else {
      elem.className = "off";
    }
  }
  
  function checkboxIsChecked() {
    return document.getElementById("blockCheckbox").checked;
  }
  
  document.addEventListener("DOMContentLoaded", startup);
}).call();
