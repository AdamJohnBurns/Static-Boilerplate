if (App.doesComponentExist(App.componentClasses.EXAMPLE_COMPONENT)) {
	'use strict';

	App.onDocumentReady(function () {

		App.ExampleComponent = (function () {
			App.log('example component exists on this page! code goes here');

			return {

			}
		})();

	});
}