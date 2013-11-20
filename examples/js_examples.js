
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

// bad js (array construction)
var awesomeBands = new Array();
awesomeBands[0] = 'Bad Religion';
awesomeBands[1] = 'Dropkick Murphys';
awesomeBands[2] = 'Flogging Molly';
awesomeBands[3] = 'Red Hot Chili Peppers';
awesomeBands[4] = 'Pornophonique';

// refactored js
var aweSomeBands = [
  'Bad Religion',
  'Dropkick Murphys',
  'Flogging Molly',
  'Red Hot Chili Peppers',
  'Pornophonique'
];


// bad js (object construction)
var cow = new Object();
cow.colour = 'brown';
cow.commonQuestion = 'What now?';
cow.moo = function(){
  console.log('moo');
}
cow.feet = 4;
cow.accordingToLarson = 'will take over the world';

// refactored js
var cow = {
  colour:'brown',
  commonQuestion:'What now?',
  moo:function(){
  console.log('moo');
  },
  feet:4,
  accordingToLarson:'will take over the world'
};



// bad js
var direction;
if(x > 100){
  direction = 1;
} else {
  direction = -1;
}

// refactored js
var direction = (x > 100) ? 1 : -1;

// bad js (another || example)
if(v){
  var x = v;
} else {
  var x = 10;
}

// refactored j
var x = v || 10;

// bad js (nesting)
function renderProfiles(o){
  var out = document.getElementById(‘profiles’);
  for(var i=0;i<o.members.length;i++){
      var ul = document.createElement(‘ul’);
      var li = document.createElement(‘li’);
      li.appendChild(document.createTextNode(o.members[i].name));
      var nestedul = document.createElement(‘ul’);
      for(var j=0;j<o.members[i].data.length;j++){
            var datali = document.createElement(‘li’);
            datali.appendChild(
                    document.createTextNode(
                      o.members[i].data[j].label + ‘ ‘ +
                      o.members[i].data[j].value
                    )
                  );
            nestedul.appendChild(datali);
          }
      li.appendChild(nestedul);
    }
  out.appendChild(ul);
}

// refactored js
function renderProfiles(o){
  var out = document.getElementById(‘profiles’);
  for(var i=0;i<o.members.length;i++){
      var ul = document.createElement(‘ul’);
      var li = document.createElement(‘li’);
      li.appendChild(document.createTextNode(data.members[i].name));
      li.appendChild(addMemberData(o.members[i]));
    }
  out.appendChild(ul);
}
function helper(member){
  var ul = document.createElement(‘ul’);
  for(var i=0;i<member.data.length;i++){
      var li = document.createElement(‘li’);
      li.appendChild(
            document.createTextNode(
              member.data[i].label + ‘ ‘ +
              member.data[i].value
            )
          );
    }
  ul.appendChild(li);
  return ul;
}
