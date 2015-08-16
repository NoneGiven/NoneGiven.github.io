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
    xhr.onload = (function() { conversions = JSON.parse(this.responseText); });
    xhr.send();
    (amount = document.getElementById("amt-input")) && amount.addEventListener("keyup", submit);
    (from = document.getElementById("from")) && from.addEventListener("change", submit);
    (to = document.getElementById("to")) && to.addEventListener("change", submit);
    result = document.getElementById("amt-result");
    clone();
    from.selectedIndex = 28;
    to.selectedIndex = 5;
    amount.focus();
  }
  function clone() {
    to.innerHTML = from.innerHTML;
  }
  function convert(amt, from, to) {
    if (conversions !== null && from in conversions.rates && to in conversions.rates) {
      return amt / parseFloat(conversions.rates[from]) * parseFloat(conversions.rates[to]);
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
    var amt = parseFloat(amount.value);
    if (!isNaN(amt)) {
      var res = trunc(convert(amt, from[from.selectedIndex].value, to[to.selectedIndex].value));
      if (!isNaN(res)) {
        result.value = res;
      }
    }
  }
  document.addEventListener("DOMContentLoaded", setup);
}).call();
