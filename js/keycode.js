(function() {
  var mainSpan, shiftSpan, ctrlSpan, altSpan, metaSpan;
  
  function startup() {
    mainSpan = document.getElementById("keydisplay");
    shiftSpan = document.getElementById("shiftkey");
    ctrlSpan = document.getElementById("ctrlkey");
    altSpan = document.getElementById("altkey");
    metaSpan = document.getElementById("metakey");
    document.addEventListener("keydown", keyCheck);
  }
  
  function keyCheck(e) {
    displayKey(e.keyCode);
  }
  
  function displayKey(code) {
    mainSpan.innerHTML = code;
  }
  
  function modifier(elem, on) {
    
  }
  
  document.addEventListener("DOMContentLoaded", startup);
}).call();
