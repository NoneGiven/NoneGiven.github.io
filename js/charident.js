(function() {
  
  var unicodeData = null;
  var proto = location.protocol;
  
  function startup() {
    displayMsg("Fetching <span class='good'>UnicodeData.txt</span>...")
    var xhr = new XMLHttpRequest();
    xhr.onload = getData;
    xhr.open("GET", "../res/short.txt", true);
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
      unicodeData[splits[0]] = splits.slice(1);
    }
    displayMsg("Ready");
    buttonEnabled(true);
  }
  
  function processText() {
    var ta, text;
    ta = document.getElementById("txt");
    if (!(text = ta.value)) {
      complainMsg("No text entered.");
      return;
    }
    displayMsg("Processing...")
    textareaEnabled(false);
    buttonEnabled(false);
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
  
  function textareaEnabled(yn) {
    var btn = document.getElementById("txt");
    if (yn) {
      btn.removeAttribute("readonly");
    }
    else {
      btn.setAttribute("readonly", "");
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
    processText();
  }
  
  addEventListener("DOMContentLoaded", startup);
  
}).call();
