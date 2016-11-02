'use strict'

;(function (root, factory) {
  var appCache = (typeof applicationCache === 'undefined') ? undefined : applicationCache

  // based on https://github.com/allouis/minivents/blob/master/minivents.js
  function Events () {
    var events = {}
    var api = this

    // listen to events
    api.on = function on (type, func, ctx) {
      if (!events[type]) (events[type] = [])
      events[type].push({f: func, c: ctx})
    }

    // stop listening to event / specific callback
    api.off = function off (type, func) {
      var list = events[type] || []
      var i = list.length = func ? list.length : 0
      while (i-- > 0) {
        if (func === list[i].f) list.splice(i, 1)
      }
    }

    // send event, callbacks will be triggereds
    api.trigger = function trigger () {
      var args = Array.apply([], arguments)
      var list = events[args.shift()] || []
      var i = list.length
      var j
      for (j = 0; j < i; j++) {
        list[j].f.apply(list[j].c, args)
      }
    }

    // aliases
    api.bind = api.on
    api.unbind = api.off
    api.emit = api.trigger
  }

  if (typeof define === 'function' && define.amd) {
    define([], function () {
      root.cache = factory(appCache, Events)
      return root.cache
    })
  } else if (typeof exports === 'object') {
    module.exports = factory(appCache, Events)
  } else {
    root.cache = factory(appCache, Events)
  }
  root.cache.start();
})(this, function (applicationCache, Events) {
  var DEFAULT_MANIFEST_LOADER_PATH = '/cache.html'
  var DEFAULT_CHECK_INTERVAL = 60000

  var app = new Events()
  var nannyOptions = {
    loaderPath: DEFAULT_MANIFEST_LOADER_PATH,
    checkInterval: DEFAULT_CHECK_INTERVAL,
    offlineCheckInterval: DEFAULT_CHECK_INTERVAL
  }

  var iframe
  var setupDone = false
  var setupPending = false

  //
  //
  //
  app.isSupported = function isSupported () {
    return !!applicationCache
  }

  //
  // request the appcache.manifest file and check if there's an update
  //
  app.update = function update () {
    trigger('update')
    if (!setupDone) {
      setupCallbacks.push(app.update)
      if (!setupPending) {
        setup()
        setupPending = true
      }
      return true
    }
    if (!app.isSupported()) {
      return false
    }
    try {
      applicationCache.update()
      return true
    } catch (e) {
      // there might still be cases when ApplicationCache is not support
      // e.g. in Chrome, when returned HTML is status code 40X, or if
      // the applicationCache became obsolete
      app.update = noop
      return false
    }
  }

  //
  // start auto updating. Optionally pass interval in ms to
  // overwrite the current.
  //
  var intervalPointer
  app.start = function start (options) {
    if (options) app.set(options)

    if (!setupDone) {
      setupCallbacks.push(app.start)
      if (!setupPending) {
        setup()
        setupPending = true
      }
      return true
    }

    clearInterval(intervalPointer)

    // check with offline interval
    checkInterval = hasNetworkError ? app.get('offlineCheckInterval') : app.get('checkInterval')

    intervalPointer = setInterval(app.update, checkInterval)
    isCheckingForUpdatesFlag = true
    trigger('start')
  }

  //
  // stop auto updating
  //
  app.stop = function stop () {
    if (!isCheckingForUpdatesFlag) return
    clearInterval(intervalPointer)
    isCheckingForUpdatesFlag = false
    trigger('stop')
  }

  //
  // returns true if the nanny is checking periodically for updates
  //
  app.isCheckingForUpdates = function isCheckingForUpdates () {
    return isCheckingForUpdatesFlag
  }

  //
  // returns true if an update has been fully received, otherwise false
  //
  app.hasUpdate = function hasUpdate () {
    return hasUpdateFlag
  }

  //
  //
  //
  app.set = function setOption (key, value) {
    var property, newSettings
    if (typeof key === 'object') {
      newSettings = key
      for (property in newSettings) {
        if (newSettings.hasOwnProperty(property)) {
          nannyOptions[property] = newSettings[property]
        }
      }
      return
    }
    nannyOptions[key] = value
  }

  //
  //
  //
  app.get = function getOption (key) {
    var property
    var settings = {}
    if (key) {
      return nannyOptions[key]
    }

    for (property in nannyOptions) {
      if (nannyOptions.hasOwnProperty(property)) {
        settings[property] = nannyOptions[property]
      }
    }
    return settings
  }

  // Private
  // -------

  // this is the internal state of checkInterval.
  // It usually differs between online / offline state
  var checkInterval = DEFAULT_CHECK_INTERVAL

  // flag if there is a pending update, being applied after next page reload
  var hasUpdateFlag = false

  // flag whether the nanny is checking for updates in the background
  var isCheckingForUpdatesFlag = false

  // flag if there was an error updating the appCache, usually meaning
  // it couldn't connect, a.k.a. you're offline.
  var hasNetworkError = false

  //
  var isInitialDownload = false

  //
  // setup app
  //
  var noop = function () {}
  var APPCACHE_STORE_KEY = 'APPCACHE'
  var setupCallbacks = []
  function setup () {
    var scriptTag

    try {
      isInitialDownload = !localStorage.getItem(APPCACHE_STORE_KEY)
      localStorage.setItem(APPCACHE_STORE_KEY, '1')
    } catch (e) {}

    if (!app.isSupported()) {
      app.update = noop
      return
    }

    // https://github.com/gr2m/appcache-nanny/issues/7
    if (applicationCache.status !== applicationCache.UNCACHED) {
      subscribeToEvents()
      setupPending = false
      setupDone = true
      setupCallbacks.forEach(function (callback) {
        callback()
      })
      return
    }

    // // load the appcache-loader.html using an iframe
    // iframe = document.createElement('iframe')
    // iframe.src = nannyOptions.loaderPath
    // iframe.style.display = 'none'
    // iframe.onload = function () {
    //   // we use the iFrame's applicationCache Object now
    //   applicationCache = iframe.contentWindow.applicationCache

    //   subscribeToEvents()
    //   setupPending = false
    //   setupDone = true

    //   // adding a timeout prevented Safari 7.1.4 from throwing
    //   // a InvalidStateError on the first applicationCache.update() call
    //   setTimeout(function () {
    //     setupCallbacks.forEach(function (callback) {
    //       callback()
    //     })
    //   }, 100)
    // }
    // iframe.onerror = function () {
    //   throw new Error('/appcache-loader.html could not be loaded.')
    // }

    // scriptTag = document.getElementsByTagName('script')[0]
    // scriptTag.parentNode.insertBefore(iframe, scriptTag)
  }

  //
  //
  //
  function subscribeToEvents () {
    // Fired when the manifest resources have been downloaded.
    on('updateready', handleUpdateReady)

    // fired when manifest download request failed
    // (no connection or 5xx server response)
    on('error', handleNetworkError)

    // fired when manifest download request succeeded
    // but server returned 404 / 410
    on('obsolete', handleNetworkObsolete)

    // fired when manifest download succeeded
    on('noupdate', handleNetworkSuccess)
    on('cached', handleNetworkSuccess)
    on('progress', handleNetworkSuccess)
    on('downloading', handleNetworkSuccess)

    // when browser goes online/offline, look for updates to make sure.
    addEventListener('online', app.update, false)
    addEventListener('offline', app.update, false)
  }

  //
  // interface to bind events to cache events
  //
  function on (eventName, callback) {
    applicationCache.addEventListener(eventName, callback, false)
  }

  //
  // Trigger event on app. Once an update is ready, we
  // keep looking for another update, but we stop triggering events.
  //
  function trigger (eventName, event) {
    if (hasUpdateFlag) return
    app.trigger(eventName, event)
  }

  //
  //
  //
  var pendingUpdateReady = false
  function handleUpdateReady () {
    // Safari and Firefox (in private mode) can get into an invalid
    // applicationCache state, which throws an InvalidStateError error
    // on applicationCache.swapCache(). To workaround that, we reset
    // everything and set a flag that the next "noupdate" event, that
    // will now be triggered when the iframe gets reloadd, is actually
    // an "updateready" event.
    if (applicationCache.status !== applicationCache.UPDATEREADY) {
      pendingUpdateReady = true
      reset()
      return
    }

    if (!hasUpdateFlag) {
      hasUpdateFlag = true
      // don't use trigger here, otherwise the event wouldn't get triggered
      app.trigger('updateready')
    }
    applicationCache.swapCache()
  }

  //
  //
  //
  function handleNetworkSuccess (event) {
    var prefix = ''

    // when page gets opened for the very first time, it already has
    // the correct assets, but appCache still triggers 'downloading',
    // 'progress' and 'cached' events. Once the first 'cached' event
    // gets triggered, all assets are cached offline. We prefix these
    // initial events with 'init:'
    if (isInitialDownload) {
      prefix = 'init:'
      if (event.type === 'cached') {
        isInitialDownload = false
      }
    }

    // re-trigger event via app
    if (pendingUpdateReady) {
      trigger('updateready')
      pendingUpdateReady = false
    } else {
      trigger(prefix + event.type, event)
    }

    if (!hasNetworkError) return
    hasNetworkError = false

    app.start()
    trigger('online')
  }

  //
  //
  //
  function handleNetworkError (error) {
    // re-trigger event via app
    trigger('error', error)

    if (hasNetworkError) return
    hasNetworkError = true

    // Edge case: private mode in Safari & FF say they support applicationCache,
    // but they fail. To get arround that, we only trigger the offline event
    // when applicationCache.status != uncached
    if (applicationCache.status === applicationCache.UNCACHED) return

    app.start()

    trigger('offline')
  }

  //
  // The 'obsolete' event gets triggered if the requested *.appcache file
  // has been removed or renamed. The intent behind renaming an *.appcache
  // file is to clear all locally cached files, it's the only way to do so.
  // Therefore we don't treet it as an error, it usually means that there
  // is an update availble that becomes visible after the next page reload.
  //
  function handleNetworkObsolete () {
    // re-trigger event via app
    trigger('obsolete')

    if (hasNetworkError) {
      hasNetworkError = false
      trigger('online')
    }

    // Once applicationCache status is obsolete, calling .udate() throws
    // an error, so we stop checking here
    app.stop()
  }

  function reset () {
    if (iframe) {
      iframe.remove()
    }

    setupDone = false
    setupPending = false
    app.update()
  }

  return app
});