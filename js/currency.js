(function() {
  var conversions = null;
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    clone();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.fixer.io/latest");
    xhr.onload = (function() { x = this.response });
    xhr.send();
  }
  function clone() {
    document.getElementById("to").innerHTML = document.getElementById("from").innerHTML;
  }
  function convert(amount, from, to) {
    if (conversions === null) {
      return;
    }
    if (from in conversions.rates && to in conversions.rates) {
      return amount / conversions.rates[from] * conversions.rates[to];
    }
  }
  function submit() {
    if (conversions === null) {
      return;
    }
  }
  document.addEventListener("DOMContentLoaded", setup);
}).call();
