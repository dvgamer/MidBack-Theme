window.redirect = function(url){
	var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length)
	location.href = main + (url).replace(/^\//g,'');
}