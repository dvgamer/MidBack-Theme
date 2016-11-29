window.request = function(options){ // 
	var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length)
	if(options.url) { options.url = main + (options.url).replace(/^\//g,''); }

	_.defaults(options, {
		url : /\/$/g.test(location.href) ? location.href + 'Default.aspx' : '',
		api: false,
		exception: false,
		data: { },
		callback: function(){ }
	}); 

	if(!options.api) {
	  __.req.tasks.push(function(resolve, reject) {
			__.inst.post(options.url, {
				data: options.data,
			}).then(function (response) {
				// console.wran('inst then', response);
		  	resolve({ options: options, result: response.data }); 
			}).catch(function (error) {
				// console.wran('inst catch', error.message || error)
			  reject({ options: options, result: error.message || error }); 
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
	} else {
		__.inst.post(options.url, {
			data: options.data,
		}).then(function (response) {
			// console.wran('inst then', response);
      var cb = new CallbackException(response.data);
		  options.callback(cb.getItems, cb);
		}).catch(function (error) {
			// console.wran('inst catch', error.message || error)
      var cb = new CallbackException(error.message || error);
		  options.callback(cb.getItems, cb); 
		})
	}
}