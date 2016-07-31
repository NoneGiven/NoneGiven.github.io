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
  
  function addAlphabeticalSequence(casing, start) {
    addSequence(sequenceTypes.ALPHABETICAL, 0, casing, start);
  }
  
  function addNumericSequence(padding, start) {
    addSequence(sequenceTypes.NUMERIC, padding, casings.MIXED, start);
  }
  
  function addSequence(type, padding, casing, start) {
    var sequence = {
      type: type,
      padding: padding,
      casing: casing,
      start: start
    };
    sequences.push(sequence);
    var element = document.createElement("div");
    element.innerHTML = '<select class="type"><option value="0">Alphabetical</option><option value="1">Numeric</option></select></div>' +
      '&nbsp;<select class="casing"><option value="0">Lowercase</option><option value="1">Uppercase</option><option value="1">Mixed</option></select>' +
      'Start at: <input type="text" class="start">';
    element.className = "sequence";
    byId("sequences").appenChild(element);
    element.byClass("type").addEventListener("change", onTypeChange);
  }

  function addNewSequence() {
    addAlphabeticalSequence(casings.LOWERCASE, "a");
  }

  function onTypeChange(e) {
      alert(this.selectedIndex);
  }
  
  function removeSequence(index) {
    if (index > -1 && index < sequences.length) {
        sequences.splice(index, 1);
    }
  }
  
  function setup() {
    document.removeEventListener("DOMContentLoaded", setup);
    state = states.MAIN;
    byId("add-sequence").addEventListener("click", addNewSequence);
  }
  
  document.addEventListener("DOMContentLoaded", setup);
}).call(this);
