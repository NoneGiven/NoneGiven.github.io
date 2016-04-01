(function() {
  var e = {
    "box": null,
    "r": null,
    "g": null,
    "b": null,
    "hex": null,
    "fr": null,
    "fg": null,
    "fb": null,
    "h": null,
    "s": null,
    "v": null
  };
  
  function setup() {
    for (let elem in e) {
      e[elem] = document.getElementById(elem);
      e[elem].removeAttribute("disabled");
    }
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
