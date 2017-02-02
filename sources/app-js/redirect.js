window.redirect = function(url){
	request({
		url: '/',
		data: url!=='/' ? { redirect: url } : {},
		exception: true,
		callback: function(data, cb){
			var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length)
			// console.log('redirect', data.page);
			location.href = main + (data.page).replace(/^\//g, '');
		}
	})
}