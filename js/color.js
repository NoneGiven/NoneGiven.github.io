(function() {
  var e = {
    "color-box": null,
    "rgb-r": null,
    "rgb-g": null,
    "rgb-b": null,
    "hex": null,
    "int-r": null,
    "int-g": null,
    "int-b": null,
    "int-r": null,
    "int-g": null,
    "int-b": null,
    "hsv-h": null,
    "hsv-s": null,
    "hsv-v": null
  };
  
  function setup() {
    for (let elem in e) {
      e[elem] = document.getElementById(elem);
      e[elem].removeAttribute("disabled");
    }
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
