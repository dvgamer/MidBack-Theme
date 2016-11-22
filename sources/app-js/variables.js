window.__ = {
	unload: false,
	req: {
		stopped: true,
		tasks: [],
		run: function(){
			return new Promise(function(next, stopped){
				var task = __.req.tasks.shift();
				if(typeof task == 'function') {
					return new Promise(task).then(function(obj) {
						// console.warn('Promise then', obj);
						if(!obj.result) {
							throw 'response is not JSON type CallbackException';
						} else {
	            var cb = new CallbackException(obj.result);
							obj.options.callback(cb.getItems || {}, cb); 
							next({ finish: false }); 
						}

					}).catch(function(obj) {
						if (typeof obj == 'string') {
	            var cb = new CallbackException("Exception", obj);
							next({ finish: false, error: true, msg: obj , cb: cb});
						} else if(obj.options) {
							// console.warn('Promise catch next');
							if(!obj.options.exception) {
	            	var cb = new CallbackException(obj.result);
								(obj.options.callback || function(){ })(cb.getItems, cb); 
								next({ finish: false, error: false, msg: obj.result || obj , cb: cb});
							} else {
								// console.warn('Promise catch stopped');
	            	var cb = new CallbackException("Exception", obj.result);
								stopped(cb);
							}
						} else {
							// console.warn('Promise catch stopped');
            	var cb = new CallbackException("Exception", obj.toString());
							stopped(cb);
						}
					});
				} else {
					next({ finish: true });
				}
			}).then(function(task){
				// console.warn('task then', task);
				if (task.error) { throw task.cb; }
				else if(!task.finish) { return __.req.run(); } 
			}).catch(function(reason) { 
				// console.error('Promise(run) -- run', reason);
				reason.throw();
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