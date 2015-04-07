(function() {
  
  function processText() {
    var text;
    if (!text = document.getElementById("txt").value) {
      alert("Enter some text, stupid");
      return;
    }
    alert("text");
  }
  
  window.submitText = function() {
    processText();
  }
  
}).call();
