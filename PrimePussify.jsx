try {
  activeDocument.activeLayer && activeDocument.activeLayer.textItem && init();
} catch (err) {
  alert(err);
}

function init() {
  var customOptionsConfig = {
    settingsName: "PrimePuss2",
    valueName: "VarianceSizes"
  };
  var historyBeforePussification = app.activeDocument.activeHistoryState;

  // UI
  var uiWindow = new Window("dialog", "Prime Pussify controls");
  // Make a big window to allow for a comfortable space for fine tuning with slider knobs
  uiWindow.preferredSize = { width: 500, height: 300 };
  uiWindow.alignChildren = "fill";

  /*
    We have two set of values based on how they obtain their initial values:
    1. OrigSize is set to whatever their values happen to be at time of the invocation
    2. SizeVariance, TrackVariance, BaselineMinimum and BaselineMaximum which are set based on the previous session stored values
  */
  var OrigSize = activeDocument.activeLayer.textItem.size.value;
  var OrigTracking = 0;
  var SizeVariance = 0;
  var TrackVariance = 0;
  var BaselineMinimum = 0;
  var BaselineMaximum = 0;
  var CompensationFactor = 100;
  try {
    var vv = app
      .getCustomOptions(customOptionsConfig.settingsName)
      .getString(app.stringIDToTypeID(customOptionsConfig.valueName))
      .split(",");
    SizeVariance = vv[0];
    TrackVariance = vv[1];
    BaselineMinimum = vv[2];
	BaselineMaximum = vv[3]
  } catch (err) {}

  // Font Size
  uiWindow.add('statictext {text: "Font Size:", justify: "center"}');
  var sizeSlider = createSlider("Size: ", 2, 256, OrigSize);
  var sizeVarianceSlider = createSlider("Size vary:", 0, 128, SizeVariance);

  // Character Tracking
  uiWindow.add('statictext {text: "Character Tracking:",justify: "center"}');
  var trackSlider = createSlider("Track: ", -150, 300, OrigTracking);
  var trackVarianceSlider = createSlider("Track vary: ", 0, 100, TrackVariance);

  // Baseline
  uiWindow.add('statictext {text: "Baseline:",justify: "center"}');
  var baselineMinimumSlider = createSlider("Baseline min:", 0, 50, BaselineMinimum);
  var baselineMaximumSlider = createSlider("Baseline max:", 0, 100, BaselineMaximum);
  uiWindow.add('statictext {text: "Tracking compensation for baseline shift, vary between fonts.",justify: "left"}');
  var baselineCompensationFactor = createSlider("Comp. factor:", 0, 300, CompensationFactor);

  // UI Buttons
  var buttons = uiWindow.add("group");
  buttons.alignment = "center";
  buttons.margins = [0, 30, 0, 0];
  buttons.add("button", undefined, "OK");
  buttons.add("button", undefined, "Cancel");

  if (uiWindow.show() === 1) // Ok
  {
    storeValues();
  } else // Cancel
  {
    app.activeDocument.activeHistoryState = historyBeforePussification;
  }

  function createSlider(label, minValue, maxValue, startValue, precision) {
    startValue = formatNumber(startValue, precision);
    var g = uiWindow.add("group");

    // Label
    g.add("statictext", [0, 0, 70, 20], label);

    // Slider track
    var slider = g.add(
      "slider",
      [0, 0, 400, 10],
      startValue,
      minValue,
      maxValue
    );
    slider.addEventListener("changing", function () {
      textValue.text = formatNumber(this.value, precision);
    });
    slider.addEventListener("change", pussify);
    function updateSlider() {
      slider.value = Number(this.text);
      pussify();
    }

    // Slider input field value
    var textValue = g.add("edittext", undefined, startValue);
    textValue.justify = "right";
    textValue.characters = 5; // width of the input field
    textValue.addEventListener("changing", updateSlider);
    // Enable keyboard arrows control
    textValue.addEventListener("keyup", function (key) {
      var step = 1;
      if (key.shiftKey) step = 10;
      if (key.altKey) step = 0.1;
      switch (key.keyName) {
        case "Up":
          this.text = String(Number(this.text) + step);
          updateSlider.apply(this);
          break;
        case "Down":
          this.text = String(Number(this.text) - step);
          updateSlider.apply(this);
      }
    });

    return slider;
  }

  function formatNumber(n, precision) {
    return Math.round(Number(n).toFixed(precision || 0) * 100) / 100;
  }

  function pussify() {
    prime_puss(
      sizeSlider.value,
      sizeVarianceSlider.value,
      trackSlider.value,
      trackVarianceSlider.value,
      baselineMinimumSlider.value,
	  baselineMaximumSlider.value,
	  baselineCompensationFactor.value
    );
  }

  function storeValues() {
    var d0 = new ActionDescriptor();
    d0.putString(
      stringIDToTypeID(customOptionsConfig.valueName),
      [
        sizeVarianceSlider.value,
        trackVarianceSlider.value,
        baselineMinimumSlider.value,
		baselineMaximumSlider.value
      ].join(",")
    );
    app.putCustomOptions(customOptionsConfig.settingsName, d0, true);
  }
}

function prime_puss(OrigSize, SizeVariance, OrigTracking, TrackVariance, BaselineMinimum, BaselineMaximum, CompensationFactor)
{
    var doc = app.activeDocument;
    var t = doc.activeLayer.textItem;
    var color = t.color;
    var font = t.font;
//    var OrigSize = parseFloat(t.size);
//    var OrigBaseline = parseFloat(t.baselineShift);
//    var OrigTracking = parseFloat(t.tracking);

    var OrigBaseline = 0.0;

    var d = new ActionDescriptor();
    var r = new ActionReference();
    r.putEnumerated(stringIDToTypeID("textLayer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
    d.putReference(stringIDToTypeID("null"), r);
    var d1 = new ActionDescriptor();
    var list1 = new ActionList();

    // Tracking rely on baseline from previous loop (next/right character), initiated here
	var prevBaseline = 0
	for(var i=t.contents.length; i > 0; i--)
    {
        var from = i-1;
        var len = 1;
        var size = OrigSize + (Math.random() * SizeVariance) - (SizeVariance/2);
		var PlusOrMinus = Math.random() < 0.5 ? -1 : 1;
		// Alternative in case above is not working.
		// var PlusOrMinus = Math.round(Math.random()) * 2 - 1;
		var baseline = OrigBaseline + Math.floor(Math.random() * (BaselineMaximum - BaselineMinimum + 1) + BaselineMinimum) * PlusOrMinus;
		var trackingCompensation = (baseline - prevBaseline) * CompensationFactor * 0.007;
		var tracking = OrigTracking + (Math.random() * TrackVariance) - (TrackVariance/2) + trackingCompensation;
        tracking *= 0.001;

        var d2 = new ActionDescriptor();
        d2.putInteger(stringIDToTypeID("from"), from);
        d2.putInteger(stringIDToTypeID("to"), from+len);
        var d3 = new ActionDescriptor();
        d3.putUnitDouble(stringIDToTypeID("size"), stringIDToTypeID("pointsUnit"), size);
        d3.putUnitDouble(stringIDToTypeID("baselineShift"), stringIDToTypeID("pointsUnit"), baseline);
        d3.putDouble(stringIDToTypeID("tracking"), tracking);
        d3.putString(stringIDToTypeID("fontPostScriptName"), font);
        var d4 = new ActionDescriptor();
        d4.putDouble(stringIDToTypeID("red"), color.rgb.red);
        d4.putDouble(stringIDToTypeID("green"), color.rgb.green);
        d4.putDouble(stringIDToTypeID("blue"), color.rgb.blue);
        d3.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), d4);
        d2.putObject(stringIDToTypeID("textStyle"), stringIDToTypeID("textStyle"), d3);
        list1.putObject(stringIDToTypeID("textStyleRange"), d2);

		// Calculating the tracking for next loop using current loop baseline shift
		prevBaseline = baseline
    }

    d1.putList(stringIDToTypeID("textStyleRange"), list1);
    d.putObject(stringIDToTypeID("to"), stringIDToTypeID("textLayer"), d1);
    executeAction(stringIDToTypeID("set"), d, DialogModes.NO);
    refresh();
}
