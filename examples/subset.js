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
