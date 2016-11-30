window.TitlePage = function(page){ document.title = (page?page+' • ':'Travox ') + 'Midback Office™' }
var cache_page = false;
cache.on('downloading', function(sender){
  preloader.on();
  cache_page = true;
});
cache.on('progress', function(sender){ 
  // console.log(sender.loaded, sender.total); 
});
cache.on('cached', function(sender){ 
  if(cache_page) {
    preloader.off();
    cache_page = false;
  }
  cache.stop();
});
cache.on('updateready', function(){ 
  if(cache_page) {
    preloader.off();
    cache_page = false;
  }
  cache.stop();
});

cache.on('noupdate', function(){ 
  console.log('Cache Installed.');
  cache.stop();
});

// cache.on('start', function(){ });
// cache.on('stop', function(){ });

cache.on('update', function(){ console.log('handleUpdate'); });
cache.on('error', function(){ console.log('handleError'); });
cache.on('obsolete', function(){ console.log('handleObsolete'); });


// plus some extra ones
cache.on('init:downloading', function(){ console.log('handleInitDownloading'); });
// cache.on('init:progress', function(){ console.log('handleInitProgress'); });
cache.on('init:cached', function(){ console.log('handleInitCached'); });


Vue.config.devtools = true;
$(function(){
	window.onbeforeunload = function(e) {
	  var e = e || window.event;
	  if(__.unload) {
	    if (e) e.returnValue = 'Are you sure you want to leave this page?';
	    return 'Are you sure you want to leave this page?';
    }
	}
	// $(document).on("keydown", function(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); });

  var GrantNotificationCheck = setInterval(function() {
    if (!("Notification" in window)) {
      clearInterval(GrantNotificationCheck);
    } else if (Notification.permission === "granted") {
      clearInterval(GrantNotificationCheck);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) Notification.permission = permission;
        if (permission !== "granted") {
      		new Notification("Travox Midback Office™", {
            iconUrl: '/mos_V2/operation/dist/icon/mbos-Icon-72.png',
            message: 'Welcome to Web Booking Engine by Nippon SySits.'
          });
        } else {
          clearInterval(GrantNotificationCheck);
        }
      });
    }
  }, 100);

  window.preloader = new $.materialPreloader({
    position: 'top',
    height: '4px',
    col_1: '#159756',
    col_2: '#da4733',
    col_3: '#3b78e7',
    col_4: '#fdba2c',
    fadeIn: 250,
    fadeOut: 250
  }); 
  var getURL = new Url;
  window.location.query = getURL.query;

  $(window).capslockstate();
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-86934404-2', 'auto');
ga('send', 'pageview');

