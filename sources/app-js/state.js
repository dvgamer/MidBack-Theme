window.State = {
	URL: new Url,
	Caplock: function(){
		return $(window).capslockstate("state");
	},
}