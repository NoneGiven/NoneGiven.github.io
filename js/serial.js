"use strict";
(function() {
  var tickInterval = 100;
  var tickIntervalContainer = null;
  var currentSerial = "";
  var serialInput = null;
  var serialCount = null;
  var infoList = null;

  var products = {
    "X": "NX",
    "H": "Ounce",
    "C": "QOL"
  };
  
  var models1 = {
    "A": "Nintendo Switch (2017)",
    "B": "Left Joy-Con",
    "C": "Right Joy-Con",
    "D": "Joy-Con Charging Grip",
    "E": "Pro Controller",
    "F": "Dock",
    "H": "Poké Ball Plus",
    "J": "Nintendo Switch Lite",
    "K": "Nintendo Switch (2019)",
    "L": "Left NES Controller",
    "M": "Right NES Controller",
    "N": "Left Famicom Controller",
    "P": "Right Famicom Controller",
    "Q": "Mario Kart Live: Home Circuit",
    "R": "SNES Controller",
    "S": "N64 Controller",
    "T": "Nintendo Switch - OLED Model",
    "V": "Dock (OLED)",
    "X": "Sega Genesis Controller",
    "Y": "Relay Box",
    "Z": "SDEV Cradle"
  };

  var models2 = {
    "A": "Nintendo Switch 2 (temp.)",
    "Y": "Relay Box"
  };

  var models3 {
    "A": "Alarmo"
  };

  var models = {
    "X": models1,
    "H": models2,
    "C": models3
  };

  var regions = {
    "C": "China",
    "E": "Europe",
    "J": "Japan",
    "K": "Korea",
    "L": "All (devkit only)",
    "M": "Malaysia",
    "W": "Worldwide"
  };

  var types1 = {
    "00": "Unspecified",
    "01": "Prototype",
    "02": "SDEV",
    "03": "EDEV",
    "04": "DPRD",
    "05": "HDEV",
    "06": "SDEV-D",
    "07": "EDEV-D",
    "08": "ADEV", // conjectural
    "10": "Retail",
    "40": "Retail",
    "50": "Retail",
    "70": "Retail",
    "80": "Retail Pro Controller",
    "90": "Refurbished",
    "14": "Retail Joy-Con",
    "17": "Retail Joy-Con"
  };

  var types2 = {
    "00": "Unspecified"
  };

  var types3 = {
    "00": "Unspecified",
    "01": "Prototype",
    "10": "Retail"
  };

  var types = {
    "X": types1,
    "H": types2,
    "C": type3
  };
  
  function listenTick() {
    currentSerial = serialInput.value;
    currentSerial = currentSerial.trim().toUpperCase();
    serialInput.value = currentSerial;
    serialCount.className = "";
    if (!currentSerial) {
      serialCount.innerHTML = "0";
      return;
    }
    serialCount.innerHTML = currentSerial.length;
    info.innerHTML = "";
    var results = [];
    var isFactory = false;
    var key = null;
    for (let i = 0; i < currentSerial.length; i++) {
      let c = currentSerial[i];
      if (i === 0) {
        let product = products[c];
        if (!product) {
          results.push("Unknown product " + c + " (must be X or H)");
          break;
        }
        results.push("[" + c + "] Product: " + product);
        key = c;
      }
      else if (i === 1) {
        let model = models[key][c];
        if (!model) {
          model = "Unknown";
        }
        results.push("[" + c + "] Model: " + model);
      }
      else if (i === 2) {
        let region = regions[c];
        if (!region) {
          region = "Unknown";
        }
        results.push("[" + c + "] Region: " + region);
      }
      else if (i === 3) {
        if (c === "F") {
          isFactory = true;
          results.push("[F] Factory model");
        }
      }
    }
    var minLength = 5 + (isFactory ? 1 : 0);
    if (currentSerial.length >= minLength) {
      let code = currentSerial[minLength - 2] + currentSerial[minLength - 1];
      let type = null;
      if (key) {
        type = types[key][code];
      }
      if (!type) {
        type = "Unknown";
      }
      results.push("[" + code + "] Type: " + type);
    }
    var fullLength = 14 + (isFactory ? 1 : 0);
    if (currentSerial.length === fullLength) {
      let serial = currentSerial.substr(minLength - 2, 10);
      results.push("Serial: " + serial.substr(2));
      let sum1 = +serial[1] + +serial[3] + +serial[5] + +serial[7] + +serial[9];
      let sum2 = +serial[0] + +serial[2] + +serial[4] + +serial[6] + +serial[8];
      let calc = (3 * sum1 + sum2) % 10;
      if (calc !== 0) {
        calc = 10 - calc;
      }
      let check = +currentSerial[fullLength - 1];
      if (!isNaN(check) && !isNaN(calc)) {
        if (check === calc) {
          results.push("Valid check digit")
        }
        else {
          results.push("Check digit failure")
        }
      }
    }
    for (let result of results) {
      let elem = document.createElement("li");
      elem.innerText = result;
      info.appendChild(elem);
    }
  }
  
  function startListening() {
    serialInput = document.getElementById("serial");
    serialCount = document.getElementById("chars");
    infoList = document.getElementById("info");
    tickIntervalContainer = setInterval(listenTick, tickInterval);
    serialInput.focus();
  }
  
  function onDOMContentLoaded() {
    startListening();
  }
  
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}).call(this);
