"use strict";
(function() {
  console.log("script start: " + performance.now());
  var sjisReady = false;
  
  function addListeners() {
    document.removeEventListener("DOMContentLoaded", addListeners);
  }
  
  function setReady() {
    document.removeEventListener("sjisconvDone", setReady);
    console.log("sjis ready: " + performance.now());
    sjisReady = true;
  }
  
  document.addEventListener("sjisconvDone", setReady);
  document.addEventListener("DOMContentLoaded", addListeners);
}).call(this);
