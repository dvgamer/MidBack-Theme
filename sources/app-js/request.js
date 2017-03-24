window.request = function(options){ // 
	return new Promise(function(next, stopped){
		if(options.url && !/^(http|https):/ig.test(options.url)) { 
			options.url = '/' + (options.url).replace(/^\//g,''); 
			options.url = /\/$/g.test(options.url) ? options.url + 'Default.aspx' : options.url;
		}

		_.defaults(options, {
			url: /\/$/g.test(location.href) ? location.href + 'Default.aspx' : '',
			api: false,
			exception: false,
			data: { }
		});

		// console.log('request ', options.url);
		if(!options.api) {
		  __.req.tasks.push(function(resolve, reject) {
				__.inst.post(options.url, {
					data: options.data,
				}).then(function (response) {
					// console.warn('inst then', response);
			  	resolve({ options: options, result: response.data, stopped: stopped, next: next }); 
				}).catch(function (error) {
					// console.warn('inst catch', error.message || error)
				  reject({ options: options, result: error.message || error, stopped: stopped, next: next }); 
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
			  if(options.exception && cb.err) stopped(cb); else next(cb);
			}).catch(function (error) {
				// console.warn('inst catch', error.message || error)
			  stopped(new CallbackException("catch", error.message || error)); 
			})
		}
	})
}