"use strict";
(function() {
  var readyCount = 0;
  var tickInterval = 100;
  var tickIntervalContainer = null;
  var currentPass = "";
  var passInput = null;
  var tripInput = null;
  
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
    return pass.replace("&", "&amp;").replace(">", "&gt;").replace("<", "&lt;").replace('"', "&quot;");
  }
  
  function makeTripcode(pass) {
    pass = htmlEntitiesEncode(pass);
    if (pass.length > 8) {
      pass = pass.substr(0, 8);
    }
    pass = sjisEncode();
    if (!pass) {
      return "";
    }
    var salt = "";
    for (var i = 1; i < 3; i++) {
      salt += saltTable[(pass + suffix).charCodeAt(i) % 256];
    }
    return window.Javacrypt.crypt(salt, pass)[0].substring(3);
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
    tripInput.value = makeTripcode(currentPass);
  }
  
  function startListening() {
    passInput = document.getElementById("pass");
    tripInput = document.getElementById("trip");
    tickIntervalContainer = setInterval(listenTick, tickInterval);
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
