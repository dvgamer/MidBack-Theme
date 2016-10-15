window.__ = {
	unload: false,
	req: {
		stopped: true,
		tasks: [],
		run: function(){
			return new Promise(function(next, stopped){
				var task = __.req.tasks.shift();
				if(typeof task == 'function') {
					return new Promise(task).then(function(options) {
						// console.log('task then', options);
						if(!options.result) {
							throw 'response is not JSON type CallbackException';
						} else {
	            var cb = new CallbackException(options.result);
							options.callback(cb.getItems || {}, cb); 
							next({ finish: false }); 
						}

					}).catch(function(reason) {
						// console.log('task catch', reason)
            var cb = new CallbackException(reason.result || reason);
						(reason.callback || function(){ })(cb.getItems, cb); 
						next({ finish: false, error: !reason.callback, msg: reason.result || reason });
					});
				} else {
					next({ finish: true });
				}
			}).then(function(task){
				if (task.error) {
					throw task.msg;
				}

				if(!task.finish) {
					return __.req.run(); 
				// } else {
				// 	return new Promise(function(reslove, reject){
				// 		if(!task.error) reslove(); else reject(task.error);
				// 	});
				} 
			}).catch(function(reason) { 
				console.warn('Promise(run) -- run', reason);
			});
		} 
	},
	inst: axios.create({
	  timeout: location.hostname == 'localhost' ? 0 : 30000,
	  headers: {
	  	'X-Requested-With': 'XMLHttpRequest',
	  	'Content-Type':'application/x-www-form-urlencoded'
	  },
	  transformRequest: [function (req) {
	    // Do whatever you want to transform the data
	    return $.param(req.data);
	  }],
	  responseType: 'json'
	})

}

window.State = {
	Caplock: function(){
		return $(window).capslockstate("state");
	}
}
window.redirect = function(url){
	var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length)
	location.href = main + (url).replace(/^\//g,'');
}

window.request = function(options){ // 
	
	_.defaults(options, {
		url : location.href + /\/$/g.test(location.href) ? 'Default.aspx' : '',
		data: { },
		callback: function(){ }
	}); 

  __.req.tasks.push(function(resolve, reject) {
		__.inst.post(options.url, {
			data: options.data,
		}).then(function (response) {
			// console.log('inst', response)
		  resolve({ callback: options.callback, result: response.data }); 
		}).catch(function (error) {
			// console.log('inst', error.message || error)
		  reject({ callback: options.callback, result: error.message || error }); 
		})
  });

	__.unload = true;
	window.preloader.on();
	if(__.req.stopped) { 
		__.req.stopped = false;
		__.req.run().then(function(){ 
			__.req.stopped = true; 
			__.unload = false; 
			window.preloader.off(); 
		}); 
	}
	return __.req.tasks.length;


}

window.Storage = function(KEY, setValue) {
	KEY = KEY.toUpperCase();
	if(window.localStorage != undefined) {
  	var getValue = null;

  	var CODE = (function() {
  		var CLIENT_STATE = (/CLIENT_STATE=(.*?)(;|$)/g.exec(document.cookie) || [])[1];
			if(window.localStorage && CLIENT_STATE) { return '<<-'+CLIENT_STATE; } else { return ''; }
		})();

    if(typeof setValue == 'undefined') {
      getValue = window.localStorage.getItem(KEY+CODE);
      try {
      	getValue = JSON.parse(getValue); 
      } catch(e) {
    		if(!getValue) getValue = {};
      }  
    } else {
      window.localStorage.setItem(KEY+CODE, (typeof setValue == "object" ? JSON.stringify(setValue) : setValue));
    }
  	return getValue || {};
	}
}
// window.StorageClear: function(key){

//     try {
//         if(key == undefined) {
//             $.each(window.localStorage, function(key,value){ window.localStorage.removeItem(key); }); 
//         } else {
//             localStorage.removeItem(key);
//         }
//     } catch (e) { /* Browser not support localStorage function. */ }
// },

window.TitlePage = function(page){ document.title = (page?page+' • ':'Travox ') + 'Midback Office™' }
window.Exception = null;
window.CallbackException = function(m1, m2) {
	try { m1.getItems = JSON.parse(m1.getItems); } catch(ex) { m1 = m1 || {}; }
  this.exError = m1.exError == false ? false : true;
  this.exTitle = m1.exTitle || (m2!=undefined ? m1 : "Exception");
  this.exMessage = m1.exMessage || m2 || "";
  this.getItems = m1.getItems || {};
  this.toString = function(){ return this.exTitle + ' >>> ' + this.exMessage; }

  this.throw = function(){
  	if(!window.Exception) {
  		console.error(this.exTitle, this.exMessage);
  	} else {
  		window.Exception.options.request = m2 || {};
  		window.Exception.options.response = this.getItems;
  		window.Exception.exError = this.exError;
  		window.Exception.exTitle = this.exTitle;
  		window.Exception.exMessage = this.exMessage;
  	}

  }
}
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

Number.prototype.toMoney = function () {
  var n = this, c = 2, d = ".", t = ",", s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
Number.prototype.toRate = function () {
  var n = this, c = 6, d = ".", t = ",", s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

String.prototype.toNumber = function (d) {
	var n = this, c = Math.pow(10,(d||2)), f = n != undefined ? (Math.round(parseFloat(n.replace(/[^0-9.-]/g, '')) * c) / c) : 0 ; return (!isNaN(f)) ? f : 0; 
}

String.prototype.toBoolean = function () {
  var m = { 'n': false, 'N': false, 'no': false, 'NO': false, 'FALSE': false, 'y': true, 'Y': true, 'false': false, 'yes': true, 'YES': true, 'TRUE': true, 'true': true };
  return (m.hasOwnProperty(this)) ? m[this] : false;
}

$(function(){

	window.onbeforeunload = function(e) {
	  var e = e || window.event;
		e.defaultPrevented = true;
	  if(__.unload) {
	    if (e) e.returnValue = 'You want leaving the page';
	    return 'You want leaving the page';
	  }
	}

	// $(document).on("keydown", function(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); });

  let checkNotify = setInterval(function() {
  	let noti = {

  	}
    if (!("Notification" in window)) {
      new Notification("Hi there!", noti);
    } else if (Notification.permission === "granted") {
      clearInterval(checkNotify);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) Notification.permission = permission;
        if (permission !== "granted") {
      		new Notification("Hi there!", noti);
        } else {
          clearInterval(checkNotify);
        }
      });
    }
  }, 100);

  window.preloader = new $.materialPreloader({
    position: 'top',
    height: '4px',
    col_1: '#159756',
    col_2: '#da4733',
    col_3: '#3b78e7',
    col_4: '#fdba2c',
    fadeIn: 250,
    fadeOut: 250
  });
  preloader.on();
  setTimeout(function(){ preloader.off(); }, 400)

  $(window).capslockstate();

});