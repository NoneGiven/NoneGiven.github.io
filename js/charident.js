(function() {
  
  function startup() {
    displayMsg("Fetching <i>UnicodeData.txt</i>...")
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
