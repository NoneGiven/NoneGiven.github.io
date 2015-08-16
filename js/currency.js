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
    (from = document.getElementById("from")) && from.addEventListener("change", submit);
    (to = document.getElementById("to")) && to.addEventListener("change", submit);
    result = document.getElementById("amt-result");
    clone();
  }
  function clone() {
    to.innerHTML = from.innerHTML;
  }
  function convert(amt, from, to) {
    if (conversions !== null && from in conversions.rates && to in conversions.rates) {
      return amt / conversions.rates[from] * conversions.rates[to];
    }
  }
  function trunc(amt) {
    var trunc = Math.round(amt * 100) / 100;
    var split = trunc.toString.split(".");
    while (split[1].length < 2) {
      split[1] += "0";
    }
    return split[0] + "." + split[1];
  }
  function submit() {
    if (conversions !== null && amount.value) {
      result.value = trunc(convert(amount.value, from[from.selectedIndex].value, to[to.selectedIndex].value));
    }
  }
  document.addEventListener("DOMContentLoaded", setup);
}).call();
