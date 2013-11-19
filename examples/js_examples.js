
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


