window.redirect = function(url){
	request({
		url: '/',
		data: url!=='/' ? { redirect: url } : {},
		exception: true
	}).then(function(res){
		// console.log('/', res)
		location.href = '/' + res.data.replace(/^\//g, '');
	})
}