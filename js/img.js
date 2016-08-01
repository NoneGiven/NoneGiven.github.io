(function() {
  "use strict";
  var states = {
    MAIN: 0,
    VIEW: 1
  };
  
  var sequenceTypes = {
    ALPHABETICAL: 0,
    NUMERIC: 1
  };

  var casings = {
    LOWERCASE: 0,
    UPPERCASE: 1,
    MIXED: 2
  };
  
  var state = null;
  var baseUrl = null;
  var sequences = [];
  
  function byId(input) {
    return document.getElementById(input);
  }
  
  function byClass(input) {
    return document.getElementsByClassName(input);
  }
  
  function byTag(input) {
    return document.getElementsByTagName(input);
  }

  Element.prototype.byId = function(input) {
    return this.getElementById(input);
  };

  Element.prototype.byClass = function(input) {
    return this.getElementsByClassName(input);
  };

  Element.prototype.byTag = function(input) {
    return this.getElementsByTagName(input);
  };

  var casingHtml = '<select class="config"><option value="0">Lowercase</option><option value="1">Uppercase</option><option value="1">Mixed</option></select>';
  var paddingHtml = '<input class="config" type="number" value="0">';
  
  function addSequence(type, padding, casing, start) {
    var element = document.createElement("div");
    element.className = "sequence";
    element.innerHTML = '<select class="type"><option value="0">Alphabetical</option><option value="1">Numeric</option></select></div>' +
      '&nbsp;' + casingHtml +
      'Start at: <input type="text" class="start" value="a">';
    byId("sequences").appendChild(element);
    element.byClass("type")[0].addEventListener("change", onTypeChange);
  }

  function addNewSequence() {
    addSequence(sequenceTypes.ALPHABETICAL, 0, casings.LOWERCASE, "a");
  }

  function onTypeChange(e) {
      let elem = this.parentElement.byClass("config")[0];
      if (this.selectedIndex === sequenceTypes.ALPHABETICAL) {
        elem.outerHTML = casingHtml;
        this.parentElement.byClass("start")[0].value = "a";
      }
      else if (this.selectedIndex === sequenceTypes.NUMERIC) {
        elem.outerHTML = paddingHtml;
        this.parentElement.byClass("start")[0].value = "1";
      }
  }
  
  function removeSequence(index) {
    if (index > -1 && index < sequences.length) {
      sequences.splice(index, 1);
    }
  }

  function doNextSequence() {
    doSequence(++seqIndex);
  }

  function doPrevSequence() {
    doSequence(--seqIndex);
  }

  function doSequence() {
    if (sequences.length < 1) {
      alert("Error!");
    }
    if (seqIndex > sequences.length) {
      seqIndex = 0;
    }
    else if (seqIndex < 0) {
      seqIndex = sequences.length - 1;
    }
    var seq = sequences[0];
    var image = byId("image");
    var src = baseUrl;
    var name = seqIndex.toString();
    while (name.length < seq.padding) {
      name = "0" + name;
    }
    src += name + ".jpg";
    image.src = src;
    image.alt = src;
  }

  function start() {
    state = states.VIEW;
    buildSequences();
    byId("main").classList.add("hidden");
    byId("view").classList.remove("hidden");
    document.addEventListener("keydown", keyCheck);
    doSequence();
  }

  function keyCheck(e) {
    if (e.keyCode === 39) {
      doNextSequence();
    }
    else if (e.keyCode === 37) {
      doPrevSequence();
    }
  }

  var seqIndex = 0;

  function buildSequences() {
    baseUrl = byId("base-url").value;  
    sequences = [];
    seqIndex = 0;
    var elems = byClass("sequence");
    for (let i = elems.length - 1; i >= 0; i--) {
      let elem = elems[i];
      let seq = { };
      let type = elem.byClass("type")[0].selectedIndex;
      seq.type = type;
      seq.start = elem.byClass("start")[0].value;
      if (type === sequenceTypes.ALPHABETICAL) {
        seq.padding = 0;
        seq.casing = elem.byClass("config")[0].selectedIndex;
      }
      else if (type === sequenceTypes.NUMERIC) {
        seq.padding = elem.byClass("config")[0].value;
        seq.casing = casings.LOWERCASE;
        seq.start = +seq.start;
      }
      sequences.push(seq);
    }
  }
  
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    state = states.MAIN;
    byId("add-sequence").addEventListener("click", addNewSequence);
    byId("start").addEventListener("click", start);
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
