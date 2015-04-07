(function() {
  
  var gcStrings, ccStrings, bcStrings, unicodeData;
  
  function startup() {
    setupVerboseData();
    displayMsg("Fetching <span class='good'>UnicodeData.txt</span>...")
    var xhr = new XMLHttpRequest();
    xhr.onload = getData;
    xhr.open("GET", "../res/UnicodeData.txt", true);
    xhr.send();
  }
  
  function getData() {
    if (this.status != "200") {
      complainMsg("Error fetching the file!")
    }
    else {
      displayMsg("Fetched file successfully. Parsing...");
      parseData(this.responseText);
    }
  }
  
  function parseData(data) {
    var lines, splits;
    lines = data.match(/[^\r\n]+/g);
    unicodeData = {};
    for (var i = 0; i < lines.length; i++) {
      splits = lines[i].split(";");
      for (var j = 0; j < splits.length; j++) {
        splits[j] = splits[j].replace(/>/g, "&gt;").replace(/</g, "&lt;")
      }
      unicodeData[splits[0]] = splits.slice(1);
    }
    displayMsg("Ready");
    buttonEnabled(true);
    checkboxEnabled(true);
  }
  
  function readText() {
    var ta, text;
    displayRes("");
    ta = document.getElementById("txt");
    if (!(text = ta.value)) {
      complainMsg("No text entered.");
      return;
    }
    displayMsg("Processing...")
    textareaEnabled(false);
    buttonEnabled(false);
    if (isCheckboxTicked()) {
      processTextVerbose(text);
    }
    else {
      processText(text);
    }
  }
  
  function processText(text) {
    var hex, attr, s;
    s = "";
    for (var i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16).toUpperCase();
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      attr = unicodeData[hex];
      if (attr == null) {
        s += "<br>Could not find data for U+" + hex + ".";
        continue;
      }
      if (attr[0] == "&lt;control&gt;") {
        s += "<br>&nbsp;&nbsp;- U+" + hex + " - " + attr[9] + " &lt;control&gt;";
      }
      else {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - " + attr[0];
      }
    }
    happyMsg("Done.")
    displayRes(s);
    textareaEnabled(true);
    buttonEnabled(true);
  }
  
  function processTextVerbose(text) {
    var hex, attr, s, words;
    s = "";
    words = [];
    for (var i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16).toUpperCase();
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      attr = unicodeData[hex];
      if (attr == null) {
        s += "<br>Could not find data for U+" + hex + ".";
        continue;
      }
      if (attr[0] == "&lt;control&gt;") {
        s += "<br>&nbsp;&nbsp;- U+" + hex + " - " + attr[9] + " &lt;control&gt;";
      }
      else {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - " + attr[0];
      }
      for (var j = 1; j < 14; j++) {
        if (j == 9 || attr[j] == "") {
          continue;
        }
        switch (j) {
          case 1:
            words[0] = "General category";
            words[1] = gcStrings[attr[j]] + " [" + attr[j] + "]";
            break;
            
          case 2:
            words[0] = "Canonical combining classes";
            if (parseInt(attr[j] >= 10) && parseInt(attr[j] <= 199)) {
              words[1] = "Fixed position [" + attr[j] + "]";
            }
            else {
              words[1] = ccStrings[attr[j]] + " [" + attr[j] + "]";
            }
            break;
            
          case 3:
            words[0] = "Bidirectional category";
            words[1] = bcStrings[attr[j]] + " [" + attr[j] + "]";
            break;
            
          case 4:
            words[0] = "Character decomposition mapping";
            var a = attr[j].split(" ");
            var w = "";
            var k = 0;
            if (a[0].substring(0,4) == "&gt") {
              k = 1;
              w += a[0];
            }
            for (k; k < a.length; k++) {
              w += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" 
                + String.fromCharCode(parseInt(a[k], 16)) + " - U+" + a[k];
            }
            words[1] = w;
            break;
            
          case 5:
            words[0] = "Decimal digit value";
            words[1] = attr[j];
            break;
            
          case 6:
            words[0] = "Digit value";
            words[1] = attr[j];
            break;
            
          case 7:
            words[0] = "Numeric value";
            words[1] = attr[j];
            break;
            
          case 8:
            words[0] = "Mirrored";
            words[1] = (attr[j] == "N" ? "No" : "Yes");
            break;
            
          case 10:
            words[0] = "Comment";
            words[1] = attr[j];
            break;
          
          case 11:
            words[0] = "Uppercase mapping";
            words[1] = String.fromCharCode(parseInt(attr[j], 16)) + " - U+" + attr[j];
            break;
            
          case 12:
            words[0] = "Lowercase mapping";
            words[1] = String.fromCharCode(parseInt(attr[j], 16)) + " - U+" + attr[j];
            break;
            
          case 13:
            words[0] = "Titlecase mapping";
            words[1] = String.fromCharCode(parseInt(attr[j], 16)) + " - U+" + attr[j];
            break;
        }
        s += "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + words[0] + ": " + words[1];
      }
      s += "<br>"
    }
    happyMsg("Done.")
    displayRes(s);
    textareaEnabled(true);
    buttonEnabled(true);
  }
  
  function setupVerboseData() {
    gcStrings = {};
    gcStrings["Lu"] = "Letter, Uppercase";
    gcStrings["Ll"] = "Letter, Lowercase";
    gcStrings["Lt"] = "Letter, Titlecase";
    gcStrings["Mn"] = "Mark, Non-Spacing";
    gcStrings["Mc"] = "Mark, Spacing Combining";
    gcStrings["Me"] = "Mark, Enclosing";
    gcStrings["Nd"] = "Number, Decimal Digit";
    gcStrings["Nl"] = "Number, Letter";
    gcStrings["No"] = "Number, Other";
    gcStrings["Zs"] = "Separator, Space";
    gcStrings["Zl"] = "Separator, Line";
    gcStrings["Zp"] = "Separator, Paragraph";
    gcStrings["Cc"] = "Other, Control";
    gcStrings["Cf"] = "Other, Format";
    gcStrings["Cs"] = "Other, Surrogate";
    gcStrings["Co"] = "Other, Private Use";
    gcStrings["Lm"] = "Letter, Modifier";
    gcStrings["Lo"] = "Letter, Other";
    gcStrings["Pc"] = "Punctuation, Connector";
    gcStrings["Pd"] = "Punctuation, Dash";
    gcStrings["Ps"] = "Punctuation, Open";
    gcStrings["Pe"] = "Punctuation, Close";
    gcStrings["Pi"] = "Punctuation, Initial quote";
    gcStrings["Pf"] = "Punctuation, Final quote";
    gcStrings["Po"] = "Punctuation, Other";
    gcStrings["Sm"] = "Symbol, Math";
    gcStrings["Sc"] = "Symbol, Currency";
    gcStrings["Sk"] = "Symbol, Modifier";
    gcStrings["So"] = "Symbol, Other";
    ccStrings = {};
    ccStrings["0"] = "Not reordered";
    ccStrings["1"] = "Overlays and interior";
    ccStrings["7"] = "Nuktas";
    ccStrings["8"] = "Hiragana/Katakana voicing marks";
    ccStrings["9"] = "Viramas";
    ccStrings["200"] = "Below left attached";
    ccStrings["202"] = "Below attached";
    ccStrings["204"] = "Below right attached";
    ccStrings["208"] = "Left attached";
    ccStrings["210"] = "Right attached";
    ccStrings["212"] = "Above left attached";
    ccStrings["214"] = "Above attached";
    ccStrings["216"] = "Above right attached";
    ccStrings["218"] = "Below left";
    ccStrings["220"] = "Below";
    ccStrings["222"] = "Below right";
    ccStrings["224"] = "Left";
    ccStrings["226"] = "Right";
    ccStrings["228"] = "Above left";
    ccStrings["230"] = "Above";
    ccStrings["232"] = "Above right";
    ccStrings["233"] = "Double below";
    ccStrings["234"] = "Double above";
    ccStrings["240"] = "Below (iota subscript)";
    bcStrings = {};
    bcStrings["L"] = "Left-to-Right";
    bcStrings["LRE"] = "Left-to-Right Embedding";
    bcStrings["LRO"] = "Left-to-Right Override";
    bcStrings["R"] = "Right-to-Left";
    bcStrings["AL"] = "Right-to-Left Arabic";
    bcStrings["RLE"] = "Right-to-Left Embedding";
    bcStrings["RLO"] = "Right-to-Left Override";
    bcStrings["PDF"] = "Pop Directional Format";
    bcStrings["EN"] = "European Number";
    bcStrings["ES"] = "European Number Separator";
    bcStrings["ET"] = "European Number Terminator";
    bcStrings["AN"] = "Arabic Number";
    bcStrings["CS"] = "Common Number Separator";
    bcStrings["NSM"] = "Non-Spacing Mark";
    bcStrings["BN"] = "Boundary Neutral";
    bcStrings["B"] = "Paragraph Separator";
    bcStrings["S"] = "Segment Separator";
    bcStrings["WS"] = "Whitespace";
    bcStrings["ON"] = "Other Neutrals";
  }
  
  function isCheckboxTicked(yn) {
    return document.getElementById("chk").checked;
  }
  
  function buttonEnabled(yn) {
    var btn = document.getElementById("btn");
    if (yn) {
      btn.removeAttribute("disabled");
    }
    else {
      btn.setAttribute("disabled", "");
    }
  }
  
  function checkboxEnabled(yn) {
    var chk = document.getElementById("chk");
    if (yn) {
      chk.removeAttribute("disabled");
    }
    else {
      chk.setAttribute("disabled", "");
    }
  }
  
  function textareaEnabled(yn) {
    var txt = document.getElementById("txt");
    if (yn) {
      txt.removeAttribute("readonly");
    }
    else {
      txt.setAttribute("readonly", "");
    }
  }
  
  function displayRes(res) {
    document.getElementById("msg-res").innerHTML = res;
  }
  
  function displayMsg(msg) {
    document.getElementById("msg-line").className = "msg";
    writeMsg(msg);
  }
  
  function happyMsg(msg) {
    document.getElementById("msg-line").className = "msg good";
    writeMsg(msg); 
  }
  
  function complainMsg(msg) {
    document.getElementById("msg-line").className = "msg bad";
    writeMsg(msg); 
  }
  
  function writeMsg(msg) {
    document.getElementById("msg-line").innerHTML = msg;
  }
  
  window.submitText = function() {
    readText();
  }
  
  addEventListener("DOMContentLoaded", startup);
  
}).call();
