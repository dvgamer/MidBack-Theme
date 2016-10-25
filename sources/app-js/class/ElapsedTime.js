window.ElapsedTime  = function(funcName, stop) {
	stop = stop || false;
  var BeginTime = 0.0, ElapsedTime = 0.0, FinishTime = 0.0;
  var func_name = funcName || "Performance"
  this.Start = function(){
    if(typeof performance != 'undefined' && typeof console != 'undefined' && !stop) {
      var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      BeginTime = performance.now();
      ElapsedTime = BeginTime;
      console.log(func_name + "() Performance >>> Starting on " + time);
    }
  }
  this.Checkpoint = function(msg){
    if(typeof performance != 'undefined' && typeof console != 'undefined' && !stop) {
      var now = performance.now();
      console.log((msg == undefined ? func_name + "() elapsed time is" : msg) + "\n\r", (now - ElapsedTime), "ms");
      ElapsedTime = now;
    }	
  }
  this.Stop = function(msg){
    if(typeof performance != 'undefined' && typeof console != 'undefined' && !stop) {
			var time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
			var now = performance.now();
			FinishTime = now;
			console.log((msg == undefined ? func_name + "() elapsedtime is" : msg) + "\n\r", (now - ElapsedTime) , "ms (" + ((FinishTime - BeginTime) / 1000).toFixed(2) + " s)");
			console.log(func_name + "() Performan ce >>> Stoped on " + time);
			ElapsedTime = performance.now();
    }
  }
  this.toString = function(){ return  func_name + "() elapsedtime is " + ((FinishTime - BeginTime) / 1000).toFixed(2) + " s"; }
}