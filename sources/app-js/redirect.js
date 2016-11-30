window.redirect = function(url){
	__.unload = false;
	var main = location.href.substring(0, location.href.indexOf('/operation/') + '/operation/'.length)
	location.href = main + (url).replace(/^\//g,'');
}