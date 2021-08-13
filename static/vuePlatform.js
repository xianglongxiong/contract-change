/*!
 * vum.bundle.js is a concatenation of:
 * vum.js, angular.js, angular-animate.js,
 * angular-sanitize.js, angular-ui-router.js,
 * and vum-angular.js
 */

/*!
 * Copyright 2015 Drifty Co.
 * http://drifty.com/
 *
 * vum, v1.3.0
 * A powerful HTML5 mobile app framework.
 * http://vumframework.com/
 *
 * By @maxlynch, @benjsperry, @adamdbradley <3
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */
/* eslint-disable */
(function () {
// Create global vum obj and its namespaces
// build processes may have already created an vum obj
  window.vum = window.vum || {}
  window.vum.version = '1.3.0';

  (function (window, document, vum) {
    var readyCallbacks = []
    var isDomReady = document.readyState === 'complete' || document.readyState === 'interactive'

    function domReady () {
      isDomReady = true
      for (var x = 0; x < readyCallbacks.length; x++) {
        vum.requestAnimationFrame(readyCallbacks[x])
      }
      readyCallbacks = []
      document.removeEventListener('DOMContentLoaded', domReady)
    }

    if (!isDomReady) {
      document.addEventListener('DOMContentLoaded', domReady)
    }
  })(window, document, vum);

  (function (window, document, vum) {
    function getParameterByName (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search)
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
    }

    var IOS = 'ios'
    var ANDROID = 'android'
    var WINDOWS_PHONE = 'windowsphone'
    var EDGE = 'edge'
    var CROSSWALK = 'crosswalk'
    var requestAnimationFrame = requestAnimationFrame // eslint-disable-line
    // From the man himself, Mr. Paul Irish.
    // The requestAnimationFrame polyfill
    // Put it on window just to preserve its context
    // without having to use .call
    window._rAF = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 16)
        }
    })()

    function requestAnimationFrame (cb) {
      return window._rAF(cb)
    }

    /**
     * @ngdoc utility
     * @name vum.Platform
     * @module vum
     * @description
     * A set of utility methods that can be used to retrieve the device ready state and
     * various other information such as what kind of platform the app is currently installed on.
     *
     * @usage
     * ```js
     * angular.module('PlatformApp', ['vum'])
     * .controller('PlatformCtrl', function($scope) {
   *
   *   vum.Platform.ready(function(){
   *     // will execute when device is ready, or immediately if the device is already ready.
   *   });
   *
   *   var deviceInformation = vum.Platform.device();
   *
   *   var isWebView = vum.Platform.isWebView();
   *   var isIPad = vum.Platform.isIPad();
   *   var isIOS = vum.Platform.isIOS();
   *   var isAndroid = vum.Platform.isAndroid();
   *   var isWindowsPhone = vum.Platform.isWindowsPhone();
   *
   *   var currentPlatform = vum.Platform.platform();
   *   var currentPlatformVersion = vum.Platform.version();
   *
   *   vum.Platform.exitApp(); // stops the app
   * });
     * ```
     */
    var self = vum.Platform = {

      // Put navigator on platform so it can be mocked and set
      // the browser does not allow window.navigator to be set
      navigator: window.navigator,

      /**
       * @ngdoc property
       * @name vum.Platform#isReady
       * @returns {boolean} Whether the device is ready.
       */
      isReady: false,
      /**
       * @ngdoc property
       * @name vum.Platform#isFullScreen
       * @returns {boolean} Whether the device is fullscreen.
       */
      isFullScreen: false,
      /**
       * @ngdoc property
       * @name vum.Platform#platforms
       * @returns {Array(string)} An array of all platforms found.
       */
      platforms: null,
      /**
       * @ngdoc property
       * @name vum.Platform#grade
       * @returns {string} What grade the current platform is.
       */
      grade: null,
      /**
       * @ngdoc property
       * @name vum.Platform#ua
       * @returns {string} What User Agent is.
       */
      ua: navigator.userAgent,

      /**
       * @ngdoc method
       * @name vum.Platform#ready
       * @description
       * Trigger a callback once the device is ready, or immediately
       * if the device is already ready. This method can be run from
       * anywhere and does not need to be wrapped by any additonal methods.
       * When the app is within a WebView (Cordova), it'll fire
       * the callback once the device is ready. If the app is within
       * a web browser, it'll fire the callback after `window.load`.
       * Please remember that Cordova features (Camera, FileSystem, etc) still
       * will not work in a web browser.
       * @param {function} callback The function to call.
       */
      ready: function (cb) {
        // run through tasks to complete now that the device is ready
        if (self.isReady) {
          cb()
        } else {
          // the platform isn't ready yet, add it to this array
          // which will be called once the platform is ready
          readyCallbacks.push(cb)
        }
      },

      /**
       * @private
       */
      detect: function () {
        self._checkPlatforms()

        requestAnimationFrame(function () {
          // only add to the body class if we got platform info
          for (var i = 0; i < self.platforms.length; i++) {
            document.body.classList.add('platform-' + self.platforms[i])
          }
        })
      },

      /**
       * @ngdoc method
       * @name vum.Platform#setGrade
       * @description Set the grade of the device: 'a', 'b', or 'c'. 'a' is the best
       * (most css features enabled), 'c' is the worst.  By default, sets the grade
       * depending on the current device.
       * @param {string} grade The new grade to set.
       */
      setGrade: function (grade) {
        var oldGrade = self.grade
        self.grade = grade
        requestAnimationFrame(function () {
          if (oldGrade) {
            document.body.classList.remove('grade-' + oldGrade)
          }
          document.body.classList.add('grade-' + grade)
        })
      },

      /**
       * @ngdoc method
       * @name vum.Platform#device
       * @description Return the current device (given by cordova).
       * @returns {object} The device object.
       */
      device: function () {
        return window.device || {}
      },

      _checkPlatforms: function () {
        self.platforms = []
        var grade = 'a'

        /*if (self.isWebView()) {
          self.platforms.push('webview')
          if (!(!window.cordova && !window.PhoneGap && !window.phonegap)) {
            self.platforms.push('cordova')
          } else if (typeof window.forge === 'object') {
            self.platforms.push('trigger')
          }
        } else {
          self.platforms.push('browser')
        }
        if (self.isIPad()) self.platforms.push('ipad')*/

        var platform = self.platform()
        if (platform) {
          self.platforms.push(platform)

          /*var version = self.version()
          if (version) {
            var v = version.toString()
            if (v.indexOf('.') > 0) {
              v = v.replace('.', '_')
            } else {
              v += '_0'
            }
            self.platforms.push(platform + v.split('_')[0])
            self.platforms.push(platform + v)

            if (self.isAndroid() && version < 4.4) {
              grade = (version < 4 ? 'c' : 'b')
            } else if (self.isWindowsPhone()) {
              grade = 'b'
            }
          }*/
        }

       // self.setGrade(grade)
      },

      /**
       * @ngdoc method
       * @name vum.Platform#isWebView
       * @returns {boolean} Check if we are running within a WebView (such as Cordova).
       */
      isWebView: function () {
        return !(!window.cordova && !window.PhoneGap && !window.phonegap && window.forge !== 'object')
      },
      /**
       * @ngdoc method
       * @name vum.Platform#isIPad
       * @returns {boolean} Whether we are running on iPad.
       */
      isIPad: function () {
        if (/iPad/i.test(self.navigator.platform)) {
          return true
        }
        return /iPad/i.test(self.ua)
      },
      /**
       * @ngdoc method
       * @name vum.Platform#isIOS
       * @returns {boolean} Whether we are running on iOS.
       */
      isIOS: function () {
        return self.is(IOS)
      },
      /**
       * @ngdoc method
       * @name vum.Platform#isAndroid
       * @returns {boolean} Whether we are running on Android.
       */
      isAndroid: function () {
        return self.is(ANDROID)
      },
      /**
       * @ngdoc method
       * @name vum.Platform#isWindowsPhone
       * @returns {boolean} Whether we are running on Windows Phone.
       */
      isWindowsPhone: function () {
        return self.is(WINDOWS_PHONE)
      },
      /**
       * @ngdoc method
       * @name vum.Platform#isEdge
       * @returns {boolean} Whether we are running on MS Edge/Windows 10 (inc. Phone)
       */
      isEdge: function () {
        return self.is(EDGE)
      },

      isCrosswalk: function () {
        return self.is(CROSSWALK)
      },

      /**
       * @ngdoc method
       * @name vum.Platform#platform
       * @returns {string} The name of the current platform.
       */
      platform: function () {
        // singleton to get the platform name
        if (platformName === null) self.setPlatform(self.device().platform)
        return platformName
      },

      /**
       * @private
       */
      setPlatform: function (n) {
        if (typeof n !== 'undefined' && n !== null && n.length) {
          platformName = n.toLowerCase()
        } else if (getParameterByName('vumplatform')) {
          platformName = getParameterByName('vumplatform')
        } else if (self.ua.indexOf('Edge') > -1) {
          platformName = EDGE
        } else if (self.ua.indexOf('Windows Phone') > -1) {
          platformName = WINDOWS_PHONE
        } else if (self.ua.indexOf('Android') > 0) {
          platformName = ANDROID
        } else if (/iPhone|iPad|iPod/.test(self.ua)) {
          platformName = IOS
        } else {
          platformName = self.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || ''
        }
      },

      /**
       * @ngdoc method
       * @name vum.Platform#version
       * @returns {number} The version of the current device platform.
       */
      version: function () {
        // singleton to get the platform version
        if (platformVersion === null) self.setVersion(self.device().version)
        return platformVersion
      },

      /**
       * @private
       */
      setVersion: function (v) {
        if (typeof v !== 'undefined' && v !== null) {
          v = v.split('.')
          v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0))
          if (!isNaN(v)) {
            platformVersion = v
            return
          }
        }

        platformVersion = 0

        // fallback to user-agent checking
        var pName = self.platform()
        var versionMatch = {
          'android': /Android (\d+).(\d+)?/,
          'ios': /OS (\d+)_(\d+)?/,
          'windowsphone': /Windows Phone (\d+).(\d+)?/,
        }
        if (versionMatch[pName]) {
          v = self.ua.match(versionMatch[pName])
          if (v && v.length > 2) {
            platformVersion = parseFloat(v[1] + '.' + v[2])
          }
        }
      },

      /**
       * @ngdoc method
       * @name vum.Platform#is
       * @param {string} Platform name.
       * @returns {boolean} Whether the platform name provided is detected.
       */
      is: function (type) {
        type = type.toLowerCase()
        // check if it has an array of platforms
        if (self.platforms) {
          for (var x = 0; x < self.platforms.length; x++) {
            if (self.platforms[x] === type) return true
          }
        }
        // exact match
        var pName = self.platform()
        if (pName) {
          return pName === type.toLowerCase()
        }

        // A quick hack for to check userAgent
        return self.ua.toLowerCase().indexOf(type) >= 0
      },

      /**
       * @ngdoc method
       * @name vum.Platform#exitApp
       * @description Exit the app.
       */
      exitApp: function () {
        self.ready(function () {
          navigator.app && navigator.app.exitApp && navigator.app.exitApp()
        })
      },

      /**
       * @ngdoc method
       * @name vum.Platform#showStatusBar
       * @description Shows or hides the device status bar (in Cordova). Requires `cordova plugin add org.apache.cordova.statusbar`
       * @param {boolean} shouldShow Whether or not to show the status bar.
       */
      showStatusBar: function (val) {
        // Only useful when run within cordova
        self._showStatusBar = val
        self.ready(function () {
          // run this only when or if the platform (cordova) is ready
          requestAnimationFrame(function () {
            if (self._showStatusBar) {
              // they do not want it to be full screen
              window.StatusBar && window.StatusBar.show()
              document.body.classList.remove('status-bar-hide')
            } else {
              // it should be full screen
              window.StatusBar && window.StatusBar.hide()
              document.body.classList.add('status-bar-hide')
            }
          })
        })
      },

      /**
       * @ngdoc method
       * @name vum.Platform#fullScreen
       * @description
       * Sets whether the app is fullscreen or not (in Cordova).
       * @param {boolean=} showFullScreen Whether or not to set the app to fullscreen. Defaults to true. Requires `cordova plugin add org.apache.cordova.statusbar`
       * @param {boolean=} showStatusBar Whether or not to show the device's status bar. Defaults to false.
       */
      fullScreen: function (showFullScreen, showStatusBar) {
        // showFullScreen: default is true if no param provided
        self.isFullScreen = (showFullScreen !== false)

        // add/remove the fullscreen classname to the body
        vum.DomUtil.ready(function () {
          // run this only when or if the DOM is ready
          requestAnimationFrame(function () {
            if (self.isFullScreen) {
              document.body.classList.add('fullscreen')
            } else {
              document.body.classList.remove('fullscreen')
            }
          })
          // showStatusBar: default is false if no param provided
          self.showStatusBar((showStatusBar === true))
        })
      },

    }

    var platformName = null, // just the name, like iOS or Android
      platformVersion = null, // a float of the major and minor, like 7.1
      readyCallbacks = [],
      windowLoadListenderAttached,
      platformReadyTimer = 2000 // How long to wait for platform ready before emitting a warning

    verifyPlatformReady()

    // Warn the user if deviceready did not fire in a reasonable amount of time, and how to fix it.
    function verifyPlatformReady () {
      setTimeout(function () {
        if (!self.isReady && self.isWebView()) {
          void 0
        }
      }, platformReadyTimer)
    }

    // setup listeners to know when the device is ready to go
    function onWindowLoad () {
      if (self.isWebView()) {
        // the window and scripts are fully loaded, and a cordova/phonegap
        // object exists then let's listen for the deviceready
        document.addEventListener('deviceready', onPlatformReady, false)
      } else {
        // the window and scripts are fully loaded, but the window object doesn't have the
        // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
        onPlatformReady()
      }
      if (windowLoadListenderAttached) {
        window.removeEventListener('load', onWindowLoad, false)
      }
    }

    if (document.readyState === 'complete') {
      onWindowLoad()
    } else {
      windowLoadListenderAttached = true
      window.addEventListener('load', onWindowLoad, false)
    }

    function onPlatformReady () {
      // the device is all set to go, init our own stuff then fire off our event
      self.isReady = true
      self.detect()
      for (var x = 0; x < readyCallbacks.length; x++) {
        // fire off all the callbacks that were added before the platform was ready
        readyCallbacks[x]()
      }
      readyCallbacks = []
      vum.trigger('platformready', {target: document})

      requestAnimationFrame(function () {
        document.body.classList.add('platform-ready')
      })
    }

    // document.addEventListener('')
  })(window, document, vum);
  /**
   * ion-events.js
   *
   * Author: Max Lynch <max@drifty.com>
   *
   * Framework events handles various mobile browser events, and
   * detects special events like tap/swipe/etc. and emits them
   * as custom events that can be used in an app.
   *
   * Portions lovingly adapted from github.com/maker/ratchet and github.com/alexgibson/tap.js - thanks guys!
   */

  (function (vum) {
    // Custom event polyfill
    vum.CustomEvent = (function () {
      if (typeof window.CustomEvent === 'function') return CustomEvent

      var customEvent = function (event, params) {
        var evt
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined,
        }
        try {
          evt = document.createEvent('CustomEvent')
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        } catch (error) {
          // fallback for browsers that don't support createEvent('CustomEvent')
          evt = document.createEvent('Event')
          for (var param in params) {
            evt[param] = params[param]
          }
          evt.initEvent(event, params.bubbles, params.cancelable)
        }
        return evt
      }
      customEvent.prototype = window.Event.prototype
      return customEvent
    })()

    /**
     * @ngdoc utility
     * @name vum.EventController
     * @module vum
     */
    vum.EventController = {
      VIRTUALIZED_EVENTS: ['tap', 'swipe', 'swiperight', 'swipeleft', 'drag', 'hold', 'release'],

      /**
       * @ngdoc method
       * @name vum.EventController#trigger
       * @alias vum.trigger
       * @param {string} eventType The event to trigger.
       * @param {object} data The data for the event. Hint: pass in
       * `{target: targetElement}`
       * @param {boolean=} bubbles Whether the event should bubble up the DOM.
       * @param {boolean=} cancelable Whether the event should be cancelable.
       */
      // Trigger a new event
      trigger: function (eventType, data, bubbles, cancelable) {
        var event = new vum.CustomEvent(eventType, {
          detail: data,
          bubbles: !!bubbles,
          cancelable: !!cancelable,
        })

        // Make sure to trigger the event on the given target, or dispatch it from
        // the window if we don't have an event target
        data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event)
      },

      /**
       * @ngdoc method
       * @name vum.EventController#on
       * @alias vum.on
       * @description Listen to an event on an element.
       * @param {string} type The event to listen for.
       * @param {function} callback The listener to be called.
       * @param {DOMElement} element The element to listen for the event on.
       */
      on: function (type, callback, element) {
        var e = element || window

        // Bind a gesture if it's a virtual event
        for (var i = 0, j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
          if (type == this.VIRTUALIZED_EVENTS[i]) {
            var gesture = new vum.Gesture(element)
            gesture.on(type, callback)
            return gesture
          }
        }

        // Otherwise bind a normal event
        e.addEventListener(type, callback)
      },

      /**
       * @ngdoc method
       * @name vum.EventController#off
       * @alias vum.off
       * @description Remove an event listener.
       * @param {string} type
       * @param {function} callback
       * @param {DOMElement} element
       */
      off: function (type, callback, element) {
        element.removeEventListener(type, callback)
      },

      /**
       * @ngdoc method
       * @name vum.EventController#onGesture
       * @alias vum.onGesture
       * @description Add an event listener for a gesture on an element.
       *
       * Available eventTypes (from [hammer.js](http://eightmedia.github.io/hammer.js/)):
       *
       * `hold`, `tap`, `doubletap`, `drag`, `dragstart`, `dragend`, `dragup`, `dragdown`, <br/>
       * `dragleft`, `dragright`, `swipe`, `swipeup`, `swipedown`, `swipeleft`, `swiperight`, <br/>
       * `transform`, `transformstart`, `transformend`, `rotate`, `pinch`, `pinchin`, `pinchout`, <br/>
       * `touch`, `release`
       *
       * @param {string} eventType The gesture event to listen for.
       * @param {function(e)} callback The function to call when the gesture
       * happens.
       * @param {DOMElement} element The angular element to listen for the event on.
       * @param {object} options object.
       * @returns {vum.Gesture} The gesture object (use this to remove the gesture later on).
       */
      onGesture: function (type, callback, element, options) {
        var gesture = new vum.Gesture(element, options)
        gesture.on(type, callback)
        return gesture
      },

      /**
       * @ngdoc method
       * @name vum.EventController#offGesture
       * @alias vum.offGesture
       * @description Remove an event listener for a gesture created on an element.
       * @param {vum.Gesture} gesture The gesture that should be removed.
       * @param {string} eventType The gesture event to remove the listener for.
       * @param {function(e)} callback The listener to remove.

       */
      offGesture: function (gesture, type, callback) {
        gesture && gesture.off(type, callback)
      },

      handlePopState: function () {
      },
    }

    // Map some convenient top-level functions for event handling
    vum.on = function () {
      vum.EventController.on.apply(vum.EventController, arguments)
    }
    vum.off = function () {
      vum.EventController.off.apply(vum.EventController, arguments)
    }
    vum.trigger = vum.EventController.trigger// function() { vum.EventController.trigger.apply(vum.EventController.trigger, arguments); };
    vum.onGesture = function () {
      return vum.EventController.onGesture.apply(vum.EventController.onGesture, arguments)
    }
    vum.offGesture = function () {
      return vum.EventController.offGesture.apply(vum.EventController.offGesture, arguments)
    }
  })(window.vum);

  (function (vum) {
    vum.$vumPlatform = {

      /**
       * @ngdoc method
       * @name $vumPlatform#onHardwareBackButton
       * @description
       * Some platforms have a hardware back button, so this is one way to
       * bind to it.
       * @param {function} callback the callback to trigger when this event occurs
       */
      onHardwareBackButton: function (cb) {
        vum.Platform.ready(function () {
          document.addEventListener('backbutton', cb, false)
        })
      },

      /**
       * @ngdoc method
       * @name $vumPlatform#offHardwareBackButton
       * @description
       * Remove an event listener for the backbutton.
       * @param {function} callback The listener function that was
       * originally bound.
       */
      offHardwareBackButton: function (fn) {
        vum.Platform.ready(function () {
          document.removeEventListener('backbutton', fn)
        })
      },

      /**
       * @ngdoc method
       * @name $vumPlatform#registerBackButtonAction
       * @description
       * Register a hardware back button action. Only one action will execute
       * when the back button is clicked, so this method decides which of
       * the registered back button actions has the highest priority.
       *
       * For example, if an actionsheet is showing, the back button should
       * close the actionsheet, but it should not also go back a page view
       * or close a modal which may be open.
       *
       * The priorities for the existing back button hooks are as follows:
       *   Return to previous view = 100
       *   Close side menu = 150
       *   Dismiss modal = 200
       *   Close action sheet = 300
       *   Dismiss popup = 400
       *   Dismiss loading overlay = 500
       *
       * Your back button action will override each of the above actions
       * whose priority is less than the priority you provide. For example,
       * an action assigned a priority of 101 will override the 'return to
       * previous view' action, but not any of the other actions.
       *
       * @param {function} callback Called when the back button is pressed,
       * if this listener is the highest priority.
       * @param {number} priority Only the highest priority will execute.
       * @param {*=} actionId The id to assign this action. Default: a
       * random unique id.
       * @returns {function} A function that, when called, will deregister
       * this backButtonAction.
       */
      $backButtonActions: {},
      registerBackButtonAction: function (fn, priority, actionId) {
        if (!vum.$vumPlatform._hasBackButtonHandler) {
          // add a back button listener if one hasn't been setup yet
          vum.$vumPlatform.$backButtonActions = {}
          vum.$vumPlatform.onHardwareBackButton(vum.$vumPlatform.hardwareBackButtonClick)
          vum.$vumPlatform._hasBackButtonHandler = true
        }

        var action = {
          id: (actionId || vum.Utils.nextUid()),
          priority: (priority || 0),
          fn: fn,
        }
        vum.$vumPlatform.$backButtonActions[action.id] = action

        // return a function to de-register this back button action
        return function () {
          delete vum.$vumPlatform.$backButtonActions[action.id]
        }
      },

      /**
       * @private
       */
      hardwareBackButtonClick: function (e) {
        // loop through all the registered back button actions
        // and only run the last one of the highest priority
        var priorityAction, actionId
        for (actionId in vum.$vumPlatform.$backButtonActions) {
          if (!priorityAction || vum.$vumPlatform.$backButtonActions[actionId].priority >= priorityAction.priority) {
            priorityAction = vum.$vumPlatform.$backButtonActions[actionId]
          }
        }
        if (priorityAction) {
          priorityAction.fn(e)
          return priorityAction
        }
      },

      is: function (type) {
        return vum.Platform.is(type)
      },

      /**
       * @ngdoc method
       * @name $vumPlatform#on
       * @description
       * Add Cordova event listeners, such as `pause`, `resume`, `volumedownbutton`, `batterylow`,
       * `offline`, etc. More information about available event types can be found in
       * [Cordova's event documentation](https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events).
       * @param {string} type Cordova [event type](https://cordova.apache.org/docs/en/edge/cordova_events_events.md.html#Events).
       * @param {function} callback Called when the Cordova event is fired.
       * @returns {function} Returns a deregistration function to remove the event listener.
       */
      on: function (type, cb) {
        vum.Platform.ready(function () {
          document.addEventListener(type, cb, false)
        })
        return function () {
          vum.Platform.ready(function () {
            document.removeEventListener(type, cb)
          })
        }
      },

      /**
       * @ngdoc method
       * @name $vumPlatform#ready
       * @description
       * Trigger a callback once the device is ready,
       * or immediately if the device is already ready.
       * @param {function=} callback The function to call.
       */
      ready: function (cb) {
        vum.Platform.ready(function () {
          cb()
        })
      },

      getWinSize: function () {
        let winWidth
        let winHeight
        // 获取窗口宽度
        if (window.innerWidth) { winWidth = window.innerWidth } else if ((document.body) && (document.body.clientWidth))
        // 获取窗口高度
        { winWidth = document.body.clientWidth }
        if (window.innerHeight) { winHeight = window.innerHeight } else if ((document.body) && (document.body.clientHeight)) { winHeight = document.body.clientHeight }
        // 通过深入Document内部对body进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
          winHeight = document.documentElement.clientHeight
          winWidth = document.documentElement.clientWidth
        }
        return {'width': winWidth, 'height': winHeight}
      },

    }

    return vum.$vumPlatform
  })(window.vum);

  (function () {
    var nextId = 0
    vum.Utils = {
      nextUid: function () {
        return 'vue' + (nextId++)
      },
    }

    var jqLite // delay binding since jQuery could be loaded after us.
    var hasOwnProperty = Object.prototype.hasOwnProperty

    /**
     * @ngdoc function
     * @name angular.isUndefined
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is undefined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined.
     */
    vum.isUndefined = function (value) {
      return typeof value === 'undefined'
    }

    /**
     * @ngdoc function
     * @name angular.isDefined
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    vum.isDefined = function (value) {
      return typeof value !== 'undefined'
    }

    /**
     * @ngdoc function
     * @name angular.isObject
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    vum.isObject = function (value) {
      // http://jsperf.com/isobject4
      return value !== null && typeof value === 'object'
    }

    /**
     * Determine if a value is an object with a null prototype
     *
     * @returns {boolean} True if `value` is an `Object` with a null prototype
     */
    vum.isBlankObject = function (value) {
      return value !== null && typeof value === 'object' && !getPrototypeOf(value)
    }

    /**
     * @ngdoc function
     * @name angular.isString
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `String`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    vum.isString = function (value) {
      return typeof value === 'string'
    }

    /**
     * @ngdoc function
     * @name angular.isNumber
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `Number`.
     *
     * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
     *
     * If you wish to exclude these then you can use the native
     * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
     * method.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Number`.
     */
    vum.isNumber = function (value) {
      return typeof value === 'number'
    }

    /**
     * @ngdoc function
     * @name angular.isDate
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a value is a date.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Date`.
     */
    vum.isDate = function (value) {
      return toString.call(value) === '[object Date]'
    }

    /**
     * @ngdoc function
     * @name angular.isArray
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is an `Array`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Array`.
     */
    var isArray = Array.isArray

    /**
     * @ngdoc function
     * @name angular.isFunction
     * @module ng
     * @kind function
     *
     * @description
     * Determines if a reference is a `Function`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    vum.isFunction = function (value) {
      return typeof value === 'function'
    }

    /**
     * Determines if a value is a regular expression object.
     *
     * @private
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    vum.isRegExp = function (value) {
      return toString.call(value) === '[object RegExp]'
    }

    /**
     * Checks if `obj` is a window object.
     *
     * @private
     * @param {*} obj Object to check
     * @returns {boolean} True if `obj` is a window obj.
     */
    vum.isWindow = function (obj) {
      return obj && obj.window === obj
    }

    vum.isScope = function (obj) {
      return obj && obj.$evalAsync && obj.$watch
    }

    vum.isFile = function (obj) {
      return toString.call(obj) === '[object File]'
    }

    vum.isFormData = function (obj) {
      return toString.call(obj) === '[object FormData]'
    }

    vum.isBlob = function (obj) {
      return toString.call(obj) === '[object Blob]'
    }

    vum.isBoolean = function (value) {
      return typeof value === 'boolean'
    }

    vum.isPromiseLike = function (obj) {
      return obj && isFunction(obj.then)
    }

    var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/

    vum.isTypedArray = function (value) {
      return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value))
    }

    vum.isArrayBuffer = function (obj) {
      return toString.call(obj) === '[object ArrayBuffer]'
    }

    vum.toJsonReplacer = function (key, value) {
      var val = value

      if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
        val = undefined
      } else if (vum.isWindow(value)) {
        val = '$WINDOW'
      } else if (value && document === value) {
        val = '$DOCUMENT'
      } else if (vum.isScope(value)) {
        val = '$SCOPE'
      }

      return val
    }

    /**
     * @ngdoc function
     * @name angular.toJson
     * @module ng
     * @kind function
     *
     * @description
     * Serializes input into a JSON-formatted string. Properties with leading $$ characters will be
     * stripped since angular uses this notation internally.
     *
     * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
     * @param {boolean|number} [pretty=2] If set to true, the JSON output will contain newlines and whitespace.
     *    If set to an integer, the JSON output will contain that many spaces per indentation.
     * @returns {string|undefined} JSON-ified string representing `obj`.
     */
    vum.toJson = function (obj, pretty) {
      if (vum.isUndefined(obj)) return undefined
      if (!vum.isNumber(pretty)) {
        pretty = pretty ? 2 : null
      }
      return JSON.stringify(obj, vum.toJsonReplacer, pretty)
    }

    function isArrayLike (obj) {
      // `null`, `undefined` and `window` are not array-like
      if (obj == null || isWindow(obj)) return false

      // arrays, strings and jQuery/jqLite objects are array like
      // * jqLite is either the jQuery or jqLite constructor function
      // * we have to check the existence of jqLite first as this method is called
      //   via the forEach method when constructing the jqLite object in the first place
      if (isArray(obj) || vum.isString(obj) || (jqLite && obj instanceof jqLite)) return true

      // Support: iOS 8.2 (not reproducible in simulator)
      // "length" in obj used to prevent JIT error (gh-11508)
      var length = 'length' in Object(obj) && obj.length

      // NodeList objects (with `item` method) and
      // other objects with suitable length characteristics are array-like
      return vum.isNumber(length) &&
        (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function')
    }

    /**
     * @ngdoc function
     * @name angular.forEach
     * @module ng
     * @kind function
     *
     * @description
     * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
     * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
     * is the value of an object property or an array element, `key` is the object property key or
     * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
     *
     * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
     * using the `hasOwnProperty` method.
     *
     * Unlike ES262's
     * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
     * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
     * return the value provided.
     *
     ```js
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key) {
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender: male']);
     ```
     *
     * @param {Object|Array} obj Object to iterate over.
     * @param {Function} iterator Iterator function.
     * @param {Object=} context Object to become context (`this`) for the iterator function.
     * @returns {Object|Array} Reference to `obj`.
     */

    vum.forEach = function (obj, iterator, context) {
      var key, length
      if (obj) {
        if (vum.isFunction(obj)) {
          for (key in obj) {
            // Need to check if hasOwnProperty exists,
            // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
            if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
              iterator.call(context, obj[key], key, obj)
            }
          }
        } else if (isArray(obj) || isArrayLike(obj)) {
          var isPrimitive = typeof obj !== 'object'
          for (key = 0, length = obj.length; key < length; key++) {
            if (isPrimitive || key in obj) {
              iterator.call(context, obj[key], key, obj)
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context, obj)
        } else if (vum.isBlankObject(obj)) {
          // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
          for (key in obj) {
            iterator.call(context, obj[key], key, obj)
          }
        } else if (typeof obj.hasOwnProperty === 'function') {
          // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key, obj)
            }
          }
        } else {
          // Slow path for objects which do not have a method `hasOwnProperty`
          for (key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              iterator.call(context, obj[key], key, obj)
            }
          }
        }
      }
      return obj
    }

    vum.forEachSorted = function (obj, iterator, context) {
      var keys = Object.keys(obj).sort()
      for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i])
      }
      return keys
    }
  })(window.vum)
})()
