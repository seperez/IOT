'use strict';

// Configuring the Articles module
angular.module('devices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Equipos', 'devices', 'dropdown', '/devices(/create)?');
		Menus.addSubMenuItem('topbar', 'devices', 'Ver todos', 'devices');
		Menus.addSubMenuItem('topbar', 'devices', 'Agregar uno nuevo', 'devices/create');
	}
]);