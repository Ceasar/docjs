
// bad javascript
function play(obj) {
    playTimeline = !playTimeline;
    if (playTimeline) {
      interval = setInterval(function() {
          stepForward(1)
      }, 10);
      obj.src = "img/controls/controls_pause.gif";
    } else {
      pause(obj);
    }
}
// refactored javascript
function play(obj) {
  if (playTimeline = !playTimeline) {
    interval = setInterval(function() {
      stepForward(1);
    }, 10);
    obj.src = "img/controls/controls_pause.gif";
  } else {
    pause(obj);
  }
}

// bad javascript
function calcFreq(index) {
  var start = index;
  var end = index + 1;
  var left = startTime + (lines_difference * start) / (100);
  var right = startTime + (lines_difference * end) / (100);
  lines_diff= right - left;
  for (var i = 0; i < lines_appArray.length; i++) {
    if (lines_activeArray && lines_activeArray[i]) {
       var app = lines_appArray[i];
       openings = lines_stats[app]['open'];
       closings = lines_stats[app]['close'];

       for (var j = 0; j < openings.length; j++) {
         if ((openings[j] > left) && (closings[j] < right)) {
           frequencies[index] = frequencies[index] + 1;
         }
       }
     }
  }
}

// refactored javascript
function calcFreq(index) {
  var left = startTime + (lines_difference * index) / (100),
      right = startTime + (lines_difference * (index + 1)) / (100),
  for (var i = 0; i < lines_appArray.length; i++) {
    if (lines_activeArray && lines_activeArray[i]) {
      var app = lines_appArray[i],
          openings = lines_stats[app].open,
          closings = lines_stats[app].close;

      for (var j = 0; j < openings.length; j++) {
        if (openings[j] > left && closings[j] < right) {
          frequencies[index] += 1;
        }
      }
    }
  }
}

// bad js

for (var i = 0; i < lines_appArray.length; i++) {
    var index = lines_appArray[i];
    var lengthA = lines_stats[index]['open'].length;
    var startTimeA = lines_stats[index]['open'][0];
    var endTimeA = lines_stats[index]['close'][lines_stats[index]['close'].length - 1];

    numberOfLines = numberOfLines + lengthA;

    if (startTimeA) {
      startTime = startTimeA;
    }
    if (endTimeA) {
      endTime = endTimeA;
    }
    colorArray[i] = i * (360 / lines_appArray.length);
    lines_activeArray[i] = true;
}
lines_difference = endTime - startTime;

// refactored js
for (var i = 0; i < lines_appArray.length; i++) {
    var startTime,
        index = lines_appArray[i],
        lengthA = lines_stats[index].open.length
        startTimeA = lines_stats[index].open[0]
        endTimeA = lines_stats[index].close.[lines_stats[index].close.length - 1];

    numberOfLines += lengthA;
    startTime = startTimeA || startTime;
    endTime = endTimeA || endTime;
    colorArray[i] = i * (360 / lines_appArray.length);
    lines_activeArray[i] = true;
}
lines_difference = endTime - startTime;


// bad js (module)
function removeApp(index, k) {
  index = index.replace(' ', '-');
  index = index.replace('.', '-');
  index = index.replace('.', '-');
  $("." + index).remove();
  lines_activeArray[k] = false;
}

function addAppBack(k) {
  initial loading of lines
  lines_activeArray[k] = true;
  calculateRender($("#timeline").rangeSlider("min"), $("#timeline").rangeSlider("max"), 1);
}
function myFunction(x) {
  var date = x.attributes.number.value;
  var val = new Date(date * 1000);
  console.log(val.format("dd-m-yy"));
  printThelines_stats(x.attributes.name.value, "username", $.datepicker.formatDate('MM dd, yy', val), val.toLocaleTimeString());
  show_stats();
}

function myFunction2(x) {
  hide_stats();
}
// refactored js
namespace1 = function(){
  function removeApp(index, k) {
    index = index.replace(' ', '-');
    index = index.replace('.', '-');
    index = index.replace('.', '-');
    $("." + index).remove();
    lines_activeArray[k] = false;
  }

  function addAppBack(k) {
    initial loading of lines
    lines_activeArray[k] = true;
    calculateRender($("#timeline").rangeSlider("min"), $("#timeline").rangeSlider("max"), 1);
  }
  function myFunction(x) {
    var date = x.attributes.number.value;
    var val = new Date(date * 1000);
    console.log(val.format("dd-m-yy"));
    printThelines_stats(x.attributes.name.value, "username", $.datepicker.formatDate('MM dd, yy', val), val.toLocaleTimeString());
    show_stats();
  }

  function myFunction2(x) {
    hide_stats();
  }
  return {
    removeApp: removeApp,
    addAppBack: addAppBack,
    myFunction: myFunction,
    myFunction2: myFunction2
  }
}();

// bad js (comments)
namespace1 = function(){
  // function addAppBack(k) {
  //   initial loading of lines
  //   lines_activeArray[k] = true;
  //   calculateRender($("#timeline").rangeSlider("min"), $("#timeline").rangeSlider("max"), 1);
  // }
  function myFunction(x) {
    var date = x.attributes.number.value;
    var val = new Date(date * 1000);
    console.log(val.format("dd-m-yy"));
    printThelines_stats(x.attributes.name.value, "username", $.datepicker.formatDate('MM dd, yy', val), val.toLocaleTimeString());
    show_stats();
  }

  function myFunction2(x) {
    hide_stats();
  }
  return {
    // addAppBack: addAppBack,
    myFunction: myFunction,
    myFunction2: myFunction2
  }
}();

// refactored js
namespace1 = function(){
  function myFunction(x) {
    var date = x.attributes.number.value;
    var val = new Date(date * 1000);
    console.log(val.format("dd-m-yy"));
    printThelines_stats(x.attributes.name.value, "username", $.datepicker.formatDate('MM dd, yy', val), val.toLocaleTimeString());
    show_stats();
  }

  function myFunction2(x) {
    hide_stats();
  }
  return {
    myFunction: myFunction,
    myFunction2: myFunction2
  }
}
