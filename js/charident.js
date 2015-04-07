(function() {
  
  var unicodeData = null;
  var proto = location.protocol;
  
  function startup() {
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
    var lines = data.match(/[^\r\n]+/g);
    for (var i = 0; i < lines.length / 10; i++) {
      console.log(lines[i]);
    }
    displayMsg("Ready");
    buttonEnabled(true);
  }
  
  function processText() {
    var text;
    if (!(text = document.getElementById("txt").value)) {
      alert("Enter some text, stupid");
      return;
    }
    alert("insert text processing here");
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
  
  function displayMsg(msg) {
    document.getElementById("msg-line").className = "msg";
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
