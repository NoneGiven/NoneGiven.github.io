(function() {
  
  var gcStrings, ccStrings, bcStrings, hsStrings, unicodeData, ticker, storedValue, processing;
  
  function startup() {
    setupVerboseData();
    displayMsg("Fetching <span class='good'>UnicodeData.txt</span>...")
    var xhr = new XMLHttpRequest();
    xhr.onload = getData;
    xhr.open("GET", "/res/UnicodeData.txt", true);
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
    processing = false;
    if (isAutoboxTicked()) {
      ticker = setInterval(tickText, 100);
    }
  }
  
  function tickText() {
    var ta, text;
    ta = document.getElementById("txt");
    if (!(ta == document.activeElement)) {
      return;
    }
    text = ta.value;
    if (!processing && text && text != storedValue) {
      readText();
    }
    storedValue = text;
  }
  
  function readText() {
    if (processing) {
      return;
    }
    var text;
    displayRes("");
    if (!(text = document.getElementById("txt").value)) {
      complainMsg("No text entered.");
      return;
    }
    displayMsg("Processing...")
    textareaEnabled(false);
    buttonEnabled(false);
    processing = true;
    clearInterval(ticker);
    if (isCheckboxTicked()) {
      processTextVerbose(text);
    }
    else {
      processText(text);
    }
  }
  
  function processText(text) {
    var hex, attr, s, pa;
    s = "";
    for (var i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16).toUpperCase();
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      pa = parseInt(hex, 16);
      if ((pa >= 13312 && pa <= 19893) || (pa >= 19968 && pa <= 40908) || (pa >= 131072 && pa <= 173782) || (pa >= 173824 && pa <= 177972) || (pa >= 177984 && pa <= 178205)) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - CJK UNIFIED IDEOGRAPH-" + hex;
        continue;
      }
      if (pa >= 44032 && pa <= 55203) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - HANGUL SYLLABLE" + (hsStrings[hex] ? " " + hsStrings[hex] : "")
        continue;
      }
      if ((pa >= 55296 && pa <= 63743) || (pa >= 983040 && pa <= 1114109)) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - SURROGATE/PRIVATE USE" + hex;
        continue;
      }
      attr = unicodeData[hex];
      if (attr == null) {
        s += "<br>Could not find data for U+" + hex + ".";
        continue;
      }
      if (parseInt(hex, 16) >= 13312 && parseInt(hex, 16) <= 19893) {
        
      }
      if (attr[0] == "&lt;control&gt;") {
        s += "<br>&nbsp;&nbsp;- U+" + hex + " - " + attr[9] + " &lt;control&gt;";
      }
      else {
        s += "<br>" + buildCodeString(hex) + " - " + attr[0];
      }
    }
    happyMsg("Done.")
    displayRes(s);
    textareaEnabled(true);
    buttonEnabled(true);
    processing = false;
    if (isAutoboxTicked()) {
      ticker = setInterval(tickText, 100);
    }
  }
  
  function processTextVerbose(text) {
    var hex, attr, s, words, pa, pa2;
    s = "";
    words = [];
    for (var i = 0; i < text.length; i++) {
      hex = text.charCodeAt(i).toString(16).toUpperCase();
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      pa = parseInt(hex, 16);
      if ((pa >= 13312 && pa <= 19893) || (pa >= 19968 && pa <= 40908) || (pa >= 131072 && pa <= 173782) || (pa >= 173824 && pa <= 177972) || (pa >= 177984 && pa <= 178205)) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - CJK UNIFIED IDEOGRAPH-" + hex +
          "<br>&nbsp;&nbsp;&nbsp;&nbsp; General category: " + gcStrings["Lo"] + " [Lo]" +
          "<br>&nbsp;&nbsp;&nbsp;&nbsp; Bidirectional category: " + bcStrings["L"] + " [L]<br>";
        continue;
      }
      if (pa >= 44032 && pa <= 55203) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - HANGUL SYLLABLE" + (hsStrings[hex] ? " " + hsStrings[hex] : "");
          "<br>&nbsp;&nbsp;&nbsp;&nbsp; General category: " + gcStrings["Lo"] + " [Lo]" +
          "<br>&nbsp;&nbsp;&nbsp;&nbsp; Bidirectional category: " + bcStrings["L"] + " [L]<br>";
        continue;
      }
      if ((pa >= 55296 && pa <= 63743) || (pa >= 983040 && pa <= 1114109)) {
        s += "<br>" + text.charAt(i) + " - U+" + hex + " - SURROGATE/PRIVATE USE" + hex +
          "<br>No further data available<br>";
        continue;
      }
      attr = unicodeData[hex];
      if (attr == null) {
        s += "<br>Could not find data for U+" + hex + ".<br>";
        continue;
      }
      if (attr[0] == "&lt;control&gt;") {
        s += "<br>&nbsp;&nbsp;- U+" + hex + " - " + attr[9] + " &lt;control&gt;";
      }
      else {
        s += "<br>" + buildCodeString(hex) + " - " + attr[0];
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
            pa2 = parseInt(attr[j]);
            if (pa2 == 0) {
              continue;
            }
            else if (pa2 >= 10 && pa2 <= 199) {
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
              w += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + buildCodeString(a[k]);
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
            if (attr[j] == "N") {
              continue;
            }
            words[0] = "Mirrored";
            words[1] = "Yes";
            break;
            
          case 10:
            words[0] = "Comment";
            words[1] = attr[j];
            break;
          
          case 11:
            words[0] = "Uppercase mapping";
            words[1] = buildCodeString(attr[j]);
            break;
            
          case 12:
            words[0] = "Lowercase mapping";
            words[1] = buildCodeString(attr[j]);
            break;
            
          case 13:
            words[0] = "Titlecase mapping";
            words[1] = buildCodeString(attr[j]);
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
    processing = false;
    if (isAutoboxTicked()) {
      ticker = setInterval(tickText, 100);
    }
  }
  
  function buildCodeString(code) {
    var part = "";
    if (unicodeData[code][2] != "0") {
      part = "&nbsp;"
    }
    return String.fromCharCode(parseInt(code, 16)) + part + "&nbsp;- U+" + code;
  }
  
  function isCheckboxTicked() {
    return document.getElementById("chk").checked;
  }
  
  function isAutoboxTicked() {
    return document.getElementById("auto").checked;
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
  
  function displayRes(msg) {
    document.getElementById("msg-res").innerHTML = msg;
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
  
  window.checkboxToggle = function() {
    if (document.getElementById("txt").value) {
      readText();
    }
  }
  
  window.autoboxToggle = function() {
    clearInterval(ticker);
    if (isAutoboxTicked()) {
      ticker = setInterval(tickText, 100);
    }
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
    hsStrings = {};
    hsStrings["CE90"] = "KAE"
    hsStrings["B4C0"] = "DYU"
    hsStrings["CC0C"] = "JJI"
    hsStrings["B46C"] = "DWEO"
    hsStrings["C4D4"] = "SSYU"
    hsStrings["B0B4"] = "NAE"
    hsStrings["AF80"] = "GGOE"
    hsStrings["ACA8"] = "GYEO"
    hsStrings["B85C"] = "RO"
    hsStrings["C42C"] = "SSOE"
    hsStrings["C4F0"] = "SSEU"
    hsStrings["D4B0"] = "PWE"
    hsStrings["D0C0"] = "TA"
    hsStrings["B2AC"] = "NYI"
    hsStrings["B060"] = "GGYI"
    hsStrings["ADC0"] = "GWI"
    hsStrings["BF94"] = "BBOE"
    hsStrings["CB9C"] = "JJWI"
    hsStrings["BD2C"] = "BWAE"
    hsStrings["BD80"] = "BU"
    hsStrings["B450"] = "DU"
    hsStrings["BB18"] = "MYO"
    hsStrings["BCBC"] = "BYEO"
    hsStrings["AE84"] = "GGYA"
    hsStrings["C73C"] = "EU"
    hsStrings["B434"] = "DYO"
    hsStrings["CC28"] = "CA"
    hsStrings["D61C"] = "HYE"
    hsStrings["BCF4"] = "BO"
    hsStrings["B54C"] = "DDAE"
    hsStrings["B610"] = "DDO"
    hsStrings["C074"] = "BBYI"
    hsStrings["B584"] = "DDYAE"
    hsStrings["CD40"] = "CWAE"
    hsStrings["B098"] = "NA"
    hsStrings["B3C4"] = "DO"
    hsStrings["C448"] = "SSYO"
    hsStrings["BF40"] = "BBO"
    hsStrings["C0E4"] = "SYA"
    hsStrings["AF2C"] = "GGO"
    hsStrings["D718"] = "HWI"
    hsStrings["C8C4"] = "JOE"
    hsStrings["BC14"] = "BA"
    hsStrings["BE98"] = "BBYA"
    hsStrings["AE68"] = "GGAE"
    hsStrings["BE0C"] = "BEU"
    hsStrings["CFA8"] = "KOE"
    hsStrings["BDF0"] = "BYU"
    hsStrings["CAF4"] = "JJWAE"
    hsStrings["BA8C"] = "MYE"
    hsStrings["BA54"] = "ME"
    hsStrings["C11C"] = "SEO"
    hsStrings["D440"] = "POE"
    hsStrings["D478"] = "PU"
    hsStrings["B140"] = "NYEO"
    hsStrings["C464"] = "SSU"
    hsStrings["C2A4"] = "SEU"
    hsStrings["D37C"] = "PEO"
    hsStrings["AC00"] = "GA"
    hsStrings["AC8C"] = "GE"
    hsStrings["AEBC"] = "GGEO"
    hsStrings["CEE4"] = "KEO"
    hsStrings["D034"] = "KWI"
    hsStrings["B8E8"] = "RU"
    hsStrings["CA30"] = "JJYAE"
    hsStrings["D3D0"] = "PYE"
    hsStrings["CFE0"] = "KU"
    hsStrings["B3A8"] = "DYE"
    hsStrings["BD9C"] = "BWEO"
    hsStrings["B2C8"] = "NI"
    hsStrings["D6A8"] = "HYO"
    hsStrings["C934"] = "JWE"
    hsStrings["D360"] = "PYAE"
    hsStrings["CAA0"] = "JJYE"
    hsStrings["C2DC"] = "SI"
    hsStrings["D22C"] = "TU"
    hsStrings["B194"] = "NWA"
    hsStrings["BBF8"] = "MI"
    hsStrings["CE04"] = "CYU"
    hsStrings["B878"] = "RWA"
    hsStrings["C9A4"] = "JYI"
    hsStrings["B418"] = "DOE"
    hsStrings["D06C"] = "KEU"
    hsStrings["D168"] = "TYEO"
    hsStrings["C9C0"] = "JI"
    hsStrings["C800"] = "JEO"
    hsStrings["C598"] = "YAE"
    hsStrings["ADDC"] = "GYU"
    hsStrings["D750"] = "HEU"
    hsStrings["C49C"] = "SSWE"
    hsStrings["C950"] = "JWI"
    hsStrings["D344"] = "PYA"
    hsStrings["C1E0"] = "SOE"
    hsStrings["C8A8"] = "JWAE"
    hsStrings["B824"] = "RYEO"
    hsStrings["B044"] = "GGEU"
    hsStrings["B6F0"] = "DDWI"
    hsStrings["CDB0"] = "CWEO"
    hsStrings["B7D0"] = "RYAE"
    hsStrings["B6B8"] = "DDWEO"
    hsStrings["AF64"] = "GGWAE"
    hsStrings["BED0"] = "BBEO"
    hsStrings["CC7C"] = "CYAE"
    hsStrings["B258"] = "NWI"
    hsStrings["D0F8"] = "TYA"
    hsStrings["CBF0"] = "JJYI"
    hsStrings["C8E0"] = "JYO"
    hsStrings["D5E4"] = "HE"
    hsStrings["D184"] = "TYE"
    hsStrings["BD48"] = "BOE"
    hsStrings["D1A0"] = "TO"
    hsStrings["B4F8"] = "DYI"
    hsStrings["C090"] = "BBI"
    hsStrings["CF38"] = "KYE"
    hsStrings["B77C"] = "RA"
    hsStrings["D2F0"] = "TI"
    hsStrings["CA68"] = "JJE"
    hsStrings["C720"] = "YU"
    hsStrings["B568"] = "DDYA"
    hsStrings["C03C"] = "BBYU"
    hsStrings["CB80"] = "JJWE"
    hsStrings["B744"] = "DDYI"
    hsStrings["C020"] = "BBWI"
    hsStrings["C3F4"] = "SSWA"
    hsStrings["D328"] = "PAE"
    hsStrings["D734"] = "HYU"
    hsStrings["C410"] = "SSWAE"
    hsStrings["D29C"] = "TYU"
    hsStrings["D76C"] = "HYI"
    hsStrings["BA70"] = "MYEO"
    hsStrings["B664"] = "DDOE"
    hsStrings["B0D0"] = "NYA"
    hsStrings["C314"] = "SSAE"
    hsStrings["C57C"] = "YA"
    hsStrings["BC68"] = "BYAE"
    hsStrings["C7AC"] = "JAE"
    hsStrings["D53C"] = "PI"
    hsStrings["C640"] = "WA"
    hsStrings["B62C"] = "DDWA"
    hsStrings["C790"] = "JA"
    hsStrings["B4A4"] = "DWI"
    hsStrings["D3EC"] = "PO"
    hsStrings["D590"] = "HYA"
    hsStrings["B5BC"] = "DDE"
    hsStrings["C9F8"] = "JJAE"
    hsStrings["C0C8"] = "SAE"
    hsStrings["C1A8"] = "SWA"
    hsStrings["B0EC"] = "NYAE"
    hsStrings["C608"] = "YE"
    hsStrings["D558"] = "HA"
    hsStrings["B9AC"] = "RI"
    hsStrings["CCB4"] = "CE"
    hsStrings["B7B4"] = "RYA"
    hsStrings["D280"] = "TWI"
    hsStrings["B894"] = "RWAE"
    hsStrings["CEC8"] = "KYAE"
    hsStrings["D050"] = "KYU"
    hsStrings["B70C"] = "DDYU"
    hsStrings["CFFC"] = "KWEO"
    hsStrings["C480"] = "SSWEO"
    hsStrings["CA4C"] = "JJEO"
    hsStrings["BEB4"] = "BBYAE"
    hsStrings["D574"] = "HAE"
    hsStrings["D0A4"] = "KI"
    hsStrings["B2E4"] = "DA"
    hsStrings["BBC0"] = "MEU"
    hsStrings["C96C"] = "JYU"
    hsStrings["B9C8"] = "MA"
    hsStrings["B514"] = "DI"
    hsStrings["C26C"] = "SWI"
    hsStrings["C3A0"] = "SSYEO"
    hsStrings["BFE8"] = "BBWEO"
    hsStrings["CE3C"] = "CYI"
    hsStrings["AD34"] = "GOE"
    hsStrings["C918"] = "JWEO"
    hsStrings["AC54"] = "GYAE"
    hsStrings["BD64"] = "BYO"
    hsStrings["B4DC"] = "DEU"
    hsStrings["C5B4"] = "EO"
    hsStrings["AFB8"] = "GGU"
    hsStrings["D14C"] = "TE"
    hsStrings["BFCC"] = "BBU"
    hsStrings["CBD4"] = "JJEU"
    hsStrings["B530"] = "DDA"
    hsStrings["CBB8"] = "JJYU"
    hsStrings["ACC4"] = "GYE"
    hsStrings["B338"] = "DYAE"
    hsStrings["C88C"] = "JWA"
    hsStrings["AD88"] = "GWEO"
    hsStrings["BFB0"] = "BBYO"
    hsStrings["CB2C"] = "JJYO"
    hsStrings["C3BC"] = "SSYE"
    hsStrings["C624"] = "O"
    hsStrings["C18C"] = "SO"
    hsStrings["B07C"] = "GGI"
    hsStrings["D504"] = "PEU"
    hsStrings["B488"] = "DWE"
    hsStrings["C65C"] = "WAE"
    hsStrings["B93C"] = "RWI"
    hsStrings["C774"] = "I"
    hsStrings["CDCC"] = "CWE"
    hsStrings["D30C"] = "PA"
    hsStrings["B1B0"] = "NWAE"
    hsStrings["D2D4"] = "TYI"
    hsStrings["ADF8"] = "GEU"
    hsStrings["BF78"] = "BBWAE"
    hsStrings["D398"] = "PE"
    hsStrings["C50C"] = "SSYI"
    hsStrings["BB34"] = "MU"
    hsStrings["B300"] = "DAE"
    hsStrings["BB50"] = "MWEO"
    hsStrings["C3D8"] = "SSO"
    hsStrings["C544"] = "A"
    hsStrings["B680"] = "DDYO"
    hsStrings["D45C"] = "PYO"
    hsStrings["C704"] = "WI"
    hsStrings["B23C"] = "NWE"
    hsStrings["AD50"] = "GYO"
    hsStrings["BE7C"] = "BBAE"
    hsStrings["B8B0"] = "ROE"
    hsStrings["B31C"] = "DYA"
    hsStrings["B354"] = "DEO"
    hsStrings["D68C"] = "HOE"
    hsStrings["BF5C"] = "BBWA"
    hsStrings["B1CC"] = "NOE"
    hsStrings["BBA4"] = "MYU"
    hsStrings["B840"] = "RYE"
    hsStrings["B760"] = "DDI"
    hsStrings["D670"] = "HWAE"
    hsStrings["BB88"] = "MWI"
    hsStrings["D1D8"] = "TWAE"
    hsStrings["AED8"] = "GGE"
    hsStrings["C154"] = "SYEO"
    hsStrings["CA14"] = "JJYA"
    hsStrings["BAA8"] = "MO"
    hsStrings["CD78"] = "CYO"
    hsStrings["C870"] = "JO"
    hsStrings["CE20"] = "CEU"
    hsStrings["D114"] = "TYAE"
    hsStrings["AD6C"] = "GU"
    hsStrings["B990"] = "RYI"
    hsStrings["C250"] = "SWE"
    hsStrings["C81C"] = "JE"
    hsStrings["BDB8"] = "BWE"
    hsStrings["AD18"] = "GWAE"
    hsStrings["BE28"] = "BYI"
    hsStrings["CFC4"] = "KYO"
    hsStrings["C4B8"] = "SSWI"
    hsStrings["D018"] = "KWE"
    hsStrings["CCD0"] = "CYEO"
    hsStrings["CE74"] = "KA"
    hsStrings["B5F4"] = "DDYE"
    hsStrings["B69C"] = "DDU"
    hsStrings["BA1C"] = "MYAE"
    hsStrings["C368"] = "SSEO"
    hsStrings["D4E8"] = "PYU"
    hsStrings["C6B0"] = "U"
    hsStrings["BE60"] = "BBA"
    hsStrings["D0DC"] = "TAE"
    hsStrings["C6E8"] = "WE"
    hsStrings["BCA0"] = "BE"
    hsStrings["CB10"] = "JJOE"
    hsStrings["CF8C"] = "KWAE"
    hsStrings["B798"] = "RAE"
    hsStrings["B370"] = "DE"
    hsStrings["D088"] = "KYI"
    hsStrings["CF00"] = "KE"
    hsStrings["BC30"] = "BAE"
    hsStrings["D520"] = "PYI"
    hsStrings["BC84"] = "BEO"
    hsStrings["B920"] = "RWE"
    hsStrings["CF54"] = "KO"
    hsStrings["C528"] = "SSI"
    hsStrings["CD94"] = "CU"
    hsStrings["C0AC"] = "SA"
    hsStrings["C1FC"] = "SYO"
    hsStrings["D5C8"] = "HEO"
    hsStrings["D6FC"] = "HWE"
    hsStrings["CE58"] = "CI"
    hsStrings["BDD4"] = "BWI"
    hsStrings["C560"] = "AE"
    hsStrings["AE30"] = "GI"
    hsStrings["D5AC"] = "HYAE"
    hsStrings["ACFC"] = "GWA"
    hsStrings["B9E4"] = "MAE"
    hsStrings["AF48"] = "GGWA"
    hsStrings["C678"] = "OE"
    hsStrings["BEEC"] = "BBE"
    hsStrings["CB64"] = "JJWEO"
    hsStrings["CF70"] = "KWA"
    hsStrings["BC4C"] = "BYA"
    hsStrings["AC70"] = "GEO"
    hsStrings["CABC"] = "JJO"
    hsStrings["CD08"] = "CO"
    hsStrings["B204"] = "NU"
    hsStrings["B1E8"] = "NYO"
    hsStrings["C2F8"] = "SSA"
    hsStrings["AEF4"] = "GGYEO"
    hsStrings["B290"] = "NEU"
    hsStrings["B178"] = "NO"
    hsStrings["BB6C"] = "MWE"
    hsStrings["BD10"] = "BWA"
    hsStrings["D408"] = "PWA"
    hsStrings["AC38"] = "GYA"
    hsStrings["C5EC"] = "YEO"
    hsStrings["BCD8"] = "BYE"
    hsStrings["BAC4"] = "MWA"
    hsStrings["B274"] = "NYU"
    hsStrings["D654"] = "HWA"
    hsStrings["ACE0"] = "GO"
    hsStrings["AC1C"] = "GAE"
    hsStrings["D4CC"] = "PWI"
    hsStrings["CEAC"] = "KYA"
    hsStrings["C988"] = "JEU"
    hsStrings["B15C"] = "NYE"
    hsStrings["C9DC"] = "JJA"
    hsStrings["B8CC"] = "RYO"
    hsStrings["AEA0"] = "GGYAE"
    hsStrings["AFF0"] = "GGWE"
    hsStrings["D494"] = "PWEO"
    hsStrings["B38C"] = "DYEO"
    hsStrings["CB48"] = "JJU"
    hsStrings["D210"] = "TYO"
    hsStrings["C8FC"] = "JU"
    hsStrings["C218"] = "SU"
    hsStrings["CF1C"] = "KYEO"
    hsStrings["AFD4"] = "GGWEO"
    hsStrings["D788"] = "HI"
    hsStrings["BA00"] = "MYA"
    hsStrings["C5D0"] = "E"
    hsStrings["B974"] = "REU"
    hsStrings["D130"] = "TEO"
    hsStrings["C7C8"] = "JYA"
    hsStrings["C838"] = "JYEO"
    hsStrings["D1F4"] = "TOE"
    hsStrings["C058"] = "BBEU"
    hsStrings["B00C"] = "GGWI"
    hsStrings["C694"] = "YO"
    hsStrings["D248"] = "TWEO"
    hsStrings["B5D8"] = "DDYEO"
    hsStrings["C004"] = "BBWE"
    hsStrings["D424"] = "PWAE"
    hsStrings["AF9C"] = "GGYO"
    hsStrings["D6E0"] = "HWEO"
    hsStrings["BAFC"] = "MOE"
    hsStrings["CAD8"] = "JJWA"
    hsStrings["B3E0"] = "DWA"
    hsStrings["D1BC"] = "TWA"
    hsStrings["CCEC"] = "CYE"
    hsStrings["C330"] = "SSYA"
    hsStrings["AE14"] = "GYI"
    hsStrings["AF10"] = "GGYE"
    hsStrings["C6CC"] = "WEO"
    hsStrings["B220"] = "NWEO"
    hsStrings["B728"] = "DDEU"
    hsStrings["B904"] = "RWEO"
    hsStrings["B028"] = "GGYU"
    hsStrings["CA84"] = "JJYEO"
    hsStrings["C854"] = "JYE"
    hsStrings["CC44"] = "CAE"
    hsStrings["B648"] = "DDWAE"
    hsStrings["C288"] = "SYU"
    hsStrings["D638"] = "HO"
    hsStrings["D600"] = "HYEO"
    hsStrings["B7EC"] = "REO"
    hsStrings["C234"] = "SWEO"
    hsStrings["B6D4"] = "DDWE"
    hsStrings["D2B8"] = "TEU"
    hsStrings["BA38"] = "MEO"
    hsStrings["C138"] = "SE"
    hsStrings["C100"] = "SYAE"
    hsStrings["C34C"] = "SSYAE"
    hsStrings["B958"] = "RYU"
    hsStrings["C758"] = "YI"
    hsStrings["CC60"] = "CYA"
    hsStrings["B108"] = "NEO"
    hsStrings["C2C0"] = "SYI"
    hsStrings["BF08"] = "BBYEO"
    hsStrings["ADA4"] = "GWE"
    hsStrings["C1C4"] = "SWAE"
    hsStrings["B808"] = "RE"
    hsStrings["BF24"] = "BBYE"
    hsStrings["D264"] = "TWE"
    hsStrings["B3FC"] = "DWAE"
    hsStrings["BE44"] = "BI"
    hsStrings["BBDC"] = "MYI"
    hsStrings["CC98"] = "CEO"
    hsStrings["C384"] = "SSE"
    hsStrings["B5A0"] = "DDEO"
    hsStrings["D3B4"] = "PYEO"
    hsStrings["CDE8"] = "CWI"
    hsStrings["D6C4"] = "HU"
    hsStrings["CD5C"] = "COE"
    hsStrings["CD24"] = "CWA"
    hsStrings["AE4C"] = "GGA"
    hsStrings["B124"] = "NE"
    hsStrings["BAE0"] = "MWAE"
    hsStrings["C7E4"] = "JYAE"
    hsStrings["C170"] = "SYE"
  }
  
  storedValue = "";
  processing = true;
  addEventListener("DOMContentLoaded", startup);
  
}).call();
