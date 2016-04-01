(function() {
  var e = {
    box: null,
    r: null,
    g: null,
    b: null,
    hex: null,
    fr: null,
    fg: null,
    fb: null,
    h: null,
    s: null,
    v: null
  };
  
  function hex(number) {
    var hex = number.toString(16);
    while (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex.toUpperCase();
  }
  
  function rgbChange(event) {
    var red = +e.r.value;
    var green = +e.g.value;
    var blue = +e.b.value;
    if (red === red && green === green && blue === blue && red >= 0 && red <= 255 &&
      green >= 0 && green <= 255 && blue >= 0 && blue <= 255)
    {
      e.hex.value = hex(red) + hex(green) + hex(blue);
      e.fr.value = red / 255;
      e.fg.value = green / 255;
      e.fb.value = blue / 255;
      e.h.value = "";
      e.s.value = "";
      e.v.value = "";
      e.box.style.color = "rgb(" + red + "," + green + "," + blue + ")";
    }
    else {
      e.hex.value = "?";
      e.fr.value = "?";
      e.fg.value = "?";
      e.fb.value = "?";
      e.h.value = "?";
      e.s.value = "?";
      e.v.value = "?";
    }
  }
  
  function hexChange(event) {
    
  }
  
  function frgbChange(event) {
    
  }
  
  function hsvChange(event) {
    
  }
  
  function setup() {
    for (let elem in e) {
      e[elem] = document.getElementById(elem);
      e[elem].removeAttribute("disabled");
    }
    e.r.addEventListener("input", rgbChange);
    e.g.addEventListener("input", rgbChange);
    e.b.addEventListener("input", rgbChange);
    e.hex.addEventListener("input", hexChange);
    e.fr.addEventListener("input", frgbChange);
    e.fg.addEventListener("input", frgbChange);
    e.fb.addEventListener("input", frgbChange);
    e.h.addEventListener("input", hsvChange);
    e.s.addEventListener("input", hsvChange);
    e.v.addEventListener("input", hsvChange);
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
