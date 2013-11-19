
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
