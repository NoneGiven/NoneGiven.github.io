"use strict";
(function() {
  var readyCount = 0;
  var tickInterval = 100;
  var tickIntervalContainer = null;
  var currentPass = "";
  var passInput = null;
  var passCount = null;
  var tripInput = null;
  var replInput = null;
  var replCount = null;
  var charDiff = null;
  
  /* stuff actually needed for tripcode generation is BELOW THIS LINE */
  // also, Javacrypt and sjisconv objects need to be set up
  
  var suffix = "H.";
  var saltTable =
  ".............................................../0123456789ABCDEF" +
  "GABCDEFGHIJKLMNOPQRSTUVWXYZabcdefabcdefghijklmnopqrstuvwxyz....." +
  "................................................................" +
  "................................................................";
  
  function sjisEncode(pass) {
    var conv = "";
    var char = null;
    for (var i = 0; i < pass.length; i++) {
      char = window.sjisconv[pass[i]];
      if (char === undefined) {
        char = "?";
      }
      conv += char;
    }
    return conv;
  }
  
  function htmlEntitiesEncode(pass) {
    return pass.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  
  function makeTripcode(pass) {
    var conv = sjisEncode(htmlEntitiesEncode(pass)); // don't replace apostrophes with HTML entities
    updatePrettyStuff(conv, pass); // not part of tripcode generation!
    var salt = "";
    for (var i = 1; i < 3; i++) {
      salt += saltTable[(conv + suffix).charCodeAt(i) % 256];
    }
    return window.Javacrypt.crypt(salt, conv)[0].substring(3);
  }
  
  /* stuff actually needed for tripcode generation is ABOVE THIS LINE */
  
  function updatePrettyStuff(conv, pass) {
    replInput.value = conv;
    replCount.innerHTML = conv.length;
    if (conv.length > 8) {
      replCount.className = "bad";
    }
    else {
      replCount.className = "";
    }
    if (conv === pass) {
      charDiff.className = "";
    }
    else {
      charDiff.className = "different";
    }
  }
  
  function listenTick() {
    currentPass = passInput.value;
    passCount.className = "";
    if (!currentPass) {
      replInput.value = "";
      tripInput.value = "";
      replCount.className = "";
      replCount.innerHTML = "0";
      passCount.innerHTML = "0";
      charDiff.className = "";
      return;
    }
    passCount.innerHTML = currentPass.length;
    if (currentPass.length > 8) { // cut off here since crypt won't be affected by any characters past 8
      passCount.className = "bad";
      currentPass = currentPass.substr(0, 8);
    }
    tripInput.value = makeTripcode(currentPass);
  }
  
  function startListening() {
    passInput = document.getElementById("pass");
    tripInput = document.getElementById("trip");
    replInput = document.getElementById("repl");
    passCount = document.getElementById("chars1");
    replCount = document.getElementById("chars2");
    charDiff = document.getElementById("diff");
    tickIntervalContainer = setInterval(listenTick, tickInterval);
    passInput.focus();
  }
  
  function onSjisconvDone() {
    document.removeEventListener("sjisconvDone", onSjisconvDone);
    if (++readyCount > 2) {
      startListening();
    }
  }
  
  function onJavacryptDone() {
    document.removeEventListener("sjisconvDone", onJavacryptDone);
    if (++readyCount > 2) {
      startListening();
    }
  }
  
  function onDOMContentLoaded() {
    document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
    if (++readyCount > 2) {
      startListening();
    }
  }
  
  document.addEventListener("sjisconvDone", onSjisconvDone);
  document.addEventListener("javacryptDone", onJavacryptDone);
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}).call(this);
