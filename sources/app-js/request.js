window.request = function(options){ // 
	var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length);
	// main = main.substring(0, main.indexOf('#') + '#'.length);

	if(options.url) { 
		options.url = main + (options.url).replace(/^\//g,''); 
		options.url = /\/$/g.test(options.url) ? options.url + 'Default.aspx' : options.url;
	}

	_.defaults(options, {
		url: /\/$/g.test(location.href) ? location.href + 'Default.aspx' : '',
		api: false,
		exception: false,
		data: { },
		callback: function(){ }
	});

	// console.log('request ', options.url);
	if(!options.api) {
	  __.req.tasks.push(function(resolve, reject) {
			__.inst.post(options.url, {
				data: options.data,
			}).then(function (response) {
				// console.warn('inst then', response);
		  	resolve({ options: options, result: response.data }); 
			}).catch(function (error) {
				// console.warn('inst catch', error.message || error)
			  reject({ options: options, result: error.message || error }); 
			})
	  });

		__.unload = true;
		if(window.preloader) window.preloader.on();
		if(__.req.stopped) { 
			__.req.stopped = false;
			__.req.run().then(function(){ 
				__.req.stopped = true; 
				__.unload = false; 
				if(!cache.preload) window.preloader.off(); 
			}); 
		}
		return __.req.tasks.length;
	} else {
		__.inst.post(options.url, {
			data: options.data,
		}).then(function (response) {
			// console.warn('inst then', response);
      var cb = new CallbackException(response.data);
		  options.callback(cb.getItems, cb);
		}).catch(function (error) {
			// console.warn('inst catch', error.message || error)
      var cb = new CallbackException("catch", error.message || error);
		  options.callback(cb.getItems, cb); 
		})
	}
}