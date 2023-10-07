"use strict";
(function() {
  var tickInterval = 100;
  var tickIntervalContainer = null;
  var currentSerial = "";
  var serialInput = null;
  var serialCount = null;
  
  function listenTick() {
    currentSerial = serialInput.value;
    serialCount.className = "";
    if (!currentSerial) {
      serialCount.innerHTML = "0";
      return;
    }
    serialCount.innerHTML = currentSerial.length;
    // todo: update info
  }
  
  function startListening() {
    serialInput = document.getElementById("serial");
    serialCount = document.getElementById("chars");
    tickIntervalContainer = setInterval(listenTick, tickInterval);
    passInput.focus();
  }
  
  function onDOMContentLoaded() {
    startListening();
  }
  
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}).call(this);
