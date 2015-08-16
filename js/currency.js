(function() {
  var conversions = null;
  var from = null;
  var to = null;
  var amount = null;
  var result = null;
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.fixer.io/latest");
    xhr.onload = (function() { x = JSON.parse(this.responseText); });
    xhr.send();
    (amount = document.getElementById("amt-input")) && amount.addEventListener("keydown", submit);
    amount && amount.addEventListener("keyup", submit);
    (from = document.getElementById("from")) && from.addEventListener("change", submit);
    (to = document.getElementById("to")) && to.addEventListener("change", submit);
    result = document.getElementById("amt-result");
    clone();
  }
  function clone() {
    to.innerHTML = from.innerHTML;
  }
  function convert(amount, from, to) {
    if (conversions !== null && from in conversions.rates && to in conversions.rates) {
      return amount / conversions.rates[from] * conversions.rates[to];
    }
  }
  function submit() {
    if (conversions !== null && amount.value) {
      result.innerHTML = convert(amount.value, from[from.selectedIndex].value, to[to.selectedIndex].value);
    }
  }
  document.addEventListener("DOMContentLoaded", setup);
}).call();
