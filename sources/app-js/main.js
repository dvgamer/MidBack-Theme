window.TitlePage = function(page){ document.title = (page?page+' • ':'Travox ') + 'Midback Office™' }
cache.preload = false;
cache.on('downloading', function(sender){
  preloader.on();
  cache.preload = true;
});
cache.on('progress', function(sender){ 
  // console.log(sender.loaded, sender.total); 
});
cache.on('cached', function(sender){ 
  if(cache.preload) {
    if(!__.req.tasks.length) preloader.off();
    cache.preload = false;
  }
  cache.stop();
});
cache.on('updateready', function(){ 
  if(cache.preload) {
    if(!__.req.tasks.length) preloader.off();
    cache.preload = false;
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


Vue.config.devtools = location.hostname === 'localhost';
$(function(){
	window.onbeforeunload = function(e) {
	  var e = e || window.event;
	  if(__.unload) {
	    if (e) e.returnValue = 'Are you sure you want to leave this page?';
	    return 'Are you sure you want to leave this page?';
    }
	}
	// $(document).on("keydown", function(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); });

  var NotificationCheck = false;
  var NotificationTitle = "Travox Midback Office™";
  var NotificationOptional = {
    icon: '/mos_V2/operation/dist/icon/mbos-Icon-72.png',
    body: 'Welcome to Web Booking Online.'
  };
  var NotificationGrant = setInterval(function() {
    if (!("Notification" in window)) {
      clearInterval(NotificationGrant);
    } else if (Notification.permission === "granted") {
      clearInterval(NotificationGrant);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(!('permission' in Notification)) Notification.permission = permission;
        if (Notification.permission !== "granted") {
          if(!NotificationCheck) {
            NotificationCheck = true;
            new Notification(NotificationTitle, NotificationOptional);
          }
        } else {
          clearInterval(NotificationGrant);
          if(!NotificationCheck) {
            NotificationCheck = true;
            new Notification(NotificationTitle, NotificationOptional);
          }
        }
      });
    }
  }, 100);

  localforage.config({
      driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name        : 'Travox-MBOS',
      version     : 1.0,
      size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
      description : 'Travox MidBack Office data warehouse.'
  });

  localforage.getItem('VERSION', function(err, data){
    if(data) {

    }
    
  });

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

