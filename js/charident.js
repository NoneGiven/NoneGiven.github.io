(function() {
  
  var unicodeData = null;
  var proto = location.protocol;
  
  function startup() {
    displayMsg("Fetching <span class='good'>UnicodeData.txt</span>...")
    var xhr = new XMLHttpRequest();
    xhr.onload = getData();
    xhr.open("GET", "../res/UnicodeData.txt", true);
    xhr.send();
  }
  
  function getData() {
    //console.log(this);
    if (this.status != "200" && this.status != "304") {
      complainMsg("Error fetching the file!")
    }
    else {
      displayMsg("Fetched file successfully.");
    }
  }
  
  function processText() {
    var text;
    if (!(text = document.getElementById("txt").value)) {
      alert("Enter some text, stupid");
      return;
    }
    alert("text");
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
