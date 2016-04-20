angular.module('dashboard', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate', 'gridster', 'magicMirror', 'ngResource', 'LocalStorageModule']);

angular.module('dashboard').config(function($routeProvider) {

     $routeProvider
		.when('/home/',
		{
			templateUrl: 'dashboard/partial/home/home.html',
			resolve: {},
			reloadOnSearch: false
		});

});

