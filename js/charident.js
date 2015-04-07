(function() {
  
  var unicodeData = null;
  var proto = location.protocol;
  
  function startup() {
    document.getElementById("chk").setAttribute("onclick", "alert('hi')");
    displayMsg("Fetching <span class='good'>UnicodeData.txt</span>...")
    var xhr = new XMLHttpRequest();
    xhr.onload = getData;
    xhr.open("GET", "../res/UnicodeData.txt", true);
    xhr.send();
  }
  
  function getData() {
    if (this.status != "200") {
      complainMsg("Error fetching the file!")
    }
    else {
      displayMsg("Fetched file successfully. Parsing...");
      parseData(this.responseText);
    }
  }
  
  function parseData(data) {
    var lines, splits;
    lines = data.match(/[^\r\n]+/g);
    unicodeData = {};
    for (var i = 0; i < lines.length; i++) {
      splits = lines[i].split(";");
      for (var j = 0; j < splits.length; j++) {
        splits[j] = splits[j].replace(/>/g, "&gt;").replace(/</g, "&lt;")
      }
      unicodeData[splits[0]] = splits.slice(1);
    }
    displayMsg("Ready");
    buttonEnabled(true);
  }
  
  function readText() {
    var ta, text;
    document.getElementById("msg-res").innerHTML = "";
    ta = document.getElementById("txt");
    if (!(text = ta.value)) {
      complainMsg("No text entered.");
      return;
    }
    displayMsg("Processing...")
    textareaEnabled(false);
    buttonEnabled(false);
    processText(text);
  }
  
  function processText(text) {
    var hex, attr, s;
    s = "";
    for (var i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16).toUpperCase();
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      console.log(hex);
      attr = unicodeData[hex];
      if (attr[0] == "&lt;control&gt;") {
        s += "<br>&nbsp;&nbsp;- U+" + hex + " - " + attr[9] + " &lt;control&gt;";
      }
      else {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - " + attr[0];
      }
    }
    happyMsg("Done.")
    document.getElementById("msg-res").innerHTML = s;
    textareaEnabled(true);
    buttonEnabled(true);
  }
  
  function processTextVerbose(text) {
    //hi
  }
  
  function buttonEnabled(yn) {
    var btn = document.getElementById("btn");
    if (yn) {
      btn.removeAttribute("disabled");
    }
    else {
      btn.setAttribute("disabled", "");
    }
  }
  
  function checkboxEnabled(yn) {
    var chk = document.getElementById("chk");
    if (yn) {
      chk.removeAttribute("readonly");
    }
    else {
      chk.setAttribute("readonly", "");
    }
  }
  
  function textareaEnabled(yn) {
    var txt = document.getElementById("txt");
    if (yn) {
      txt.removeAttribute("readonly");
    }
    else {
      txt.setAttribute("readonly", "");
    }
  }
  
  function displayMsg(msg) {
    document.getElementById("msg-line").className = "msg";
    writeMsg(msg);
  }
  
  function happyMsg(msg) {
    document.getElementById("msg-line").className = "msg good";
    writeMsg(msg); 
  }
  
  function complainMsg(msg) {
    document.getElementById("msg-line").className = "msg bad";
    writeMsg(msg); 
  }
  
  function writeMsg(msg) {
    document.getElementById("msg-line").innerHTML = msg;
  }
  
  window.submitText = function() {
    readText();
  }
  
  addEventListener("DOMContentLoaded", startup);
  
}).call();
