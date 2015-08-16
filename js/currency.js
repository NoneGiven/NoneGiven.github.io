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
    (amount = document.getElementById("amt-input")) && amount.addEventListener("keyup", submit);
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
      window.c = conversions;
      alert(conversions.rates[from]);
      alert(conversions.rates[to]);
      alert(parseInt(conversions.rates[from]));
      alert(parseInt(conversions.rates[to]));
      return amt / parseInt(conversions.rates[from]) * parseInt(conversions.rates[to]);
    }
  }
  function trunc(amt) {
    var trunc = (Math.round(amt * 100) / 100).toString();
    if (trunc.indexOf(".") == -1) {
      return trunc;
    }
    var split = trunc.split(".");
    while (split[1].length < 2) {
      split[1] += "0";
    }
    return split[0] + "." + split[1];
  }
  function submit() {
    var amt = parseInt(amount.value);
    if (amt !== NaN) {
      result.value = trunc(convert(amt, from[from.selectedIndex].value, to[to.selectedIndex].value));
    }
  }
  document.addEventListener("DOMContentLoaded", setup);
}).call();
