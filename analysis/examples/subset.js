function testLoops() {
  var sum = 0;
  for(var i=0; i < 10; i++) {
    sum++;
    console.log('sum: ', sum);
  }

  var while_count = 0;
  while(while_count < 10) {
    console.log('while_count: ', while_count);
    while_count++;
  }
}

var func = function a(memo) {
  console.log(memo)
  if(memo === 0)
    return
  a(memo-1);
};

func(10);

var test_switch = function(num){
  switch(num) {
    case 1:
      console.log('one');
      break;
    case 2:
      console.log('two');
      break;
    case 3:
      console.log('three');
      break;
    case 4:
      console.log('four');
      break;
    case 5:
      console.log('five');
      break;
    case 6:
      console.log('six');
      break;
    case 7:
      console.log('seven');
      break;
    default:
      console.log('default');
  }
}


var ternary = function(bool){
  bool ? console.log(1) : console.log(0);
}
