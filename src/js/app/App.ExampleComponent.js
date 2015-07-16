if (App.doesComponentExist(App.componentClasses.EXAMPLE_COMPONENT)) {
	App.onDocumentReady(function () {
		'use strict';

		App.ExampleComponent = (function () {
			App.log('example component exists on this page! code goes here');

			return {

			};
		})();

	});
}