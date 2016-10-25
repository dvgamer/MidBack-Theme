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