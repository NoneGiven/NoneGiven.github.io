"use strict";
(function() {
  var chipValue = 21;
  var transValue = 8;
  var nodeValue = "8N";
  var densityValueEight = 43.5;
  var densityValueFour = 118.9;
  
  function chipChanged(e) {
    document.getElementById("chipValue").innerText = e.target.value;
    chipValue = +e.target.value;
    update();
  }
  
  function transChanged(e) {
    document.getElementById("transValue").innerText = e.target.value;
    transValue = +e.target.value;
    update();
  }
  
  function densityInputEightChanged(e) {
    document.getElementById("densityValueEight").innerText = e.target.value;
    densityValueEight = +e.target.value;
    update();
  }
  
  function densityInputFourChanged(e) {
    document.getElementById("densityValueFour").innerText = e.target.value;
    densityValueFour = +e.target.value;
    update();
  }
  
  function radioChanged(e) {
    nodeValue = e.target.value;
    if (nodeValue === "4N") {
    	document.getElementById("densityEight").classList.add("hidden");
      document.getElementById("densityFour").classList.remove("hidden");
    }
    else {
    	document.getElementById("densityFour").classList.add("hidden");
      document.getElementById("densityEight").classList.remove("hidden");
    }
    update();
  }
  
  function update() {
  	var densityValue = nodeValue === "4N" ? densityValueFour : densityValueEight;
    var dieArea = transValue * 1000 / densityValue;
    var dieSide = Math.sqrt(dieArea);
    var chip = document.getElementById("chip");
    var die = document.getElementById("die");
    var chipSidePx = chipValue * 10;
    chip.style.width = `${chipSidePx}px`;
    chip.style.height = `${chipSidePx}px`;
    chip.style.left = `calc(50% - ${chipSidePx / 2}px)`;
    chip.style.top = `calc(50% - ${chipSidePx / 2}px)`;
    var dieSidePx = dieSide * 10;
    die.style.width = `${dieSidePx}px`;
    die.style.height = `${dieSidePx}px`;
    die.style.left = `calc(50% - ${dieSidePx / 2}px)`;
    die.style.top = `calc(50% - ${dieSidePx / 2}px)`;
    var chipArea = chipValue * chipValue;
    var chipAreaDisp = chipArea.toFixed(1);
    var info = `Chip area: ${chipAreaDisp} mm² (${chipValue} mm x ${chipValue} mm)\n`;
    var dieAreaDisp = dieArea.toFixed(1);
    var dieSideDisp = dieSide.toFixed(1);
    info += `Die area: ${dieAreaDisp} mm² (${dieSideDisp} mm x ${dieSideDisp} mm)\n`;
    var marginDisp = (chipValue - dieSide).toFixed(1);
    info += `Substrate margins: ${marginDisp} mm\n`;
    var ratioDisp = (chipArea / dieArea).toFixed(3);
    info += `Substrate area to die area ratio: ${ratioDisp}`;
    document.getElementById("info").innerText = info;
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("chipInput").addEventListener("input", chipChanged);
    document.getElementById("densityInputEight").addEventListener("input", densityInputEightChanged);
    document.getElementById("densityInputFour").addEventListener("input", densityInputFourChanged);
    document.getElementById("nodeEight").addEventListener("click", radioChanged);
    document.getElementById("nodeFour").addEventListener("click", radioChanged);
    document.getElementById("transInput").addEventListener("input", transChanged);
    update();
  });
}).call(this);
