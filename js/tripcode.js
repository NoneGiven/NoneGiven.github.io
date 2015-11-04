"use strict";
(function() {
  var readyCount = 0;
  var tickInterval = 100;
  var tickIntervalContainer = null;
  var currentPass = "";
  var passInput = null;
  var tripInput = null;
  
  function sjisEncode(pass) {
    var conv = "";
    var char = null;
    for (var i = 0; i < pass.length; i++) {
      char = window.sjisconv[pass];
      if (char === undefined) {
        char = "?";
      }
      conv += char;
    }
    return conv;
  }
  
  function makeTripcode(pass) {
    return sjisEncode(pass);
  }
  
  function listenTick() {
    currentPass = passInput.value;
    if (!currentPass) {
      tripInput.value = "";
      return;
    }
    if (currentPass.length > 8) {
      currentPass = currentPass.substr(0, 8);
    }
    tripInput.value = "!" + makeTripcode(currentPass);
  }
  
  function startListening() {
    passInput = document.getElementById("pass");
    tripInput = document.getElementById("trip");
    tickIntervalContainer = setInterval(listenTick, tickInterval);
  }
  
  function onDOMContentLoaded() {
    document.removeEventListener("DOMContentLoaded", addListeners);
    if (++readyCount > 1) {
      startListening();
    }
  }
  
  function onSjisconvDone() {
    document.removeEventListener("sjisconvDone", setReady);
    if (++readyCount > 1) {
      startListening();
    }
  }
  
  document.addEventListener("sjisconvDone", onSjisconvDone);
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}).call(this);
