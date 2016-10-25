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