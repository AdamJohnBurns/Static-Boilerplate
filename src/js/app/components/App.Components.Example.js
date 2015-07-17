/**
 * This is an example component.
 */


// Extend the component registry with this component
App.componentClasses.EXAMPLE = '.component-example';

// Only run the components code if it exists on the page
if (App.doesComponentExist(App.componentClasses.EXAMPLE)) {
	App.onDocumentReady(function () {
		'use strict';

		App.Components.Example = (function () {
			// Private methods
			App.log('example component exists on this page! code goes here');

			// Public methods
			return {

			};
		})();

	});
}