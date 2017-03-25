window.redirect = function(url){
	return request({
		url: '/',
		data: url!=='/' ? { redirect: url } : {},
		exception: true
	}).then(function(res){ location.href = res.data; })
}