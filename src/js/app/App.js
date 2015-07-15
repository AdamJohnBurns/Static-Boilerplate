var App = (function () {
	'use strict'

	var DEFAULT_DEBOUNCE_DELAY = 300,

		debugOn = true,
		timer = 0;

	return {
		setDebug: function (debug) {
			if (debug) {
				debugOn = true;
			} else {
				debugOn = false;
			}
		},

		onDocumentReady: function (callback) {
			if (document.readyState != 'loading'){
				callback();
			} else {
				document.addEventListener('DOMContentLoaded', callback);
			}
		},

		doesComponentExist: function (componentClass) {
			var i,
				doesExist = false;

			if (componentClass instanceof Array) {
				for (i = 0; i < componentClass.length; i++) {
					if (document.querySelectorAll(componentClass[i]).length > 0) {
						doesExist = true;
						break;
					}
				}

			} else {
				// if its not an array assume its just a string
				doesExist = document.querySelectorAll(componentClass).length > 0;
			}

			return doesExist;
		},

		log: function (message) {
			if (debugOn) {
				if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
					console.log(message);
				}
			}
		},

		warn: function (message) {
			if (debugOn) {
				if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
					console.warn(message);
				}
			}
		},

		error: function (message) {
			if (debugOn) {
				if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
					console.error(message);
				}
			}
		},

		debounce: function (func, wait, immediate) {
			var timeout;

			if (typeof wait === 'undefined') {
				wait = DEFAULT_DEBOUNCE_DELAY;
			}

			return function () {
				var context = this,
					args = arguments;

				var later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};

				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(context, args);
				}
			};
		},

		startTimer: function () {
			timer = new Date().getTime();
		},

		endTimer: function () {
			var endTime = new Date().getTime();
			return endTime - timer;
		},

		padString: function (n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		},

		componentClasses: {
			EXAMPLE_COMPONENT: '.example-component'
		},

		// these need to match the breakpoints specified in scss/config/_media-queries.scss
		breakpointWidths: {
			small: 320,
			medium:640,
			large: 768,
			xlarge: 1024,
			xxlarge: 1280,
			huge: 99999999
		},

		isBreakpointOrSmaller: function (breakpoint) {
			return window.innerWidth <= breakpoint;
		},

		isBreakpointOrLarger: function (breakpoint) {
			return window.innerWidth >= breakpoint;
		},

		isExactBreakpoint: function (breakpoint) {
			// ???
		}
	}
})();