window.MBOS = {
	Name: function(){
		return (/Name=(.*?)(;|$)/g.exec(document.cookie) || [])[1];
	},
	Code: function(){
		return (/CLIENT_STATE=\w{2}(.*?)(;|$)/g.exec(document.cookie) || [])[1];
	},
	CLIENT: function(){
		return (/CLIENT_STATE=(.*?(\w{3}))(;|$)/g.exec(document.cookie) || [])[1];
	},
	Expired: function(){
		var _demo = (/CUSTOMER_CODE=(.*?)(;|$)/g.exec(document.cookie) || [])[1], _v2 	= (/a74cf3c525a85182a1517c9758f4a245=(.*?)(;|$)/g.exec(document.cookie) || [])[1];
		return _demo == undefined && _v2 == undefined;
	},
	getItem: function(key, cb){
		return __.local.getItem((this.CLIENT()?this.CLIENT()+'->':'')+key, cb);
	},
	setItem: function(key, value, cb){
		return __.local.setItem((this.CLIENT()?this.CLIENT()+'->':'')+key, value, cb);
	},
	Permission: function(index_name){
		return __.local.getItem((this.CLIENT()?this.CLIENT()+'->':'')+'session.permission').then(function(data){
			var d = Q.defer();
			if(index_name == undefined) {
				var p = __.permission;
				d.resolve({ system: p == 'SYSTEM', admin: p == 'ADMIN' });
			} else {
				Elapsed.check('Permission' + (index_name ? ' '+index_name : ''))
				var found = (data || []).filter(function(item){ return item.index_name === index_name });
				Elapsed.end('Permission' + (index_name ? ' '+index_name : ''))
				d.resolve(found.length > 0 ? true : false);
			}
			return d.promise;
		}).catch(function(e){
			console.warn(e);
		});
	}
}

window.__ = {
	permission: Storage((MBOS.CLIENT()?MBOS.CLIENT()+'->':'')+'Permission'),
	debug: Storage('DEBUG') || false,
	local: localforage.createInstance({ name: location.hostname == 'localhost' ? 'develop' : 'production' }),
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
							next({ finish: false });
							if(obj.options.exception && cb.err) obj.stopped(cb); else obj.next(cb); 
						}
					}).catch(function(obj) {
	            var cb = new CallbackException("Exception", typeof obj == 'string' ? obj : obj.result);
							if(obj.options.exception && cb.err) {
								next({ finish: false, error: true, msg: obj.result || obj , cb: cb});
								obj.stopped(cb);
							} else {
								next({ finish: false, error: true, msg: obj.result || obj , cb: cb});
								obj.next(cb);
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
				console.error('Promise(run) -- run', reason);
				// reason.throw();
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