'use strict';

// declare top-level module which depends on filters,and services
var myApp = angular.module('myApp',
    [   'ngMessages', 
        'ngRoute',
        'myApp.filters',
        'myApp.directives', // custom directives
        'ngGrid', // angular grid
        'ui', // angular ui
        'ngSanitize', // for html-bind in ckeditor
        'ui.bootstrap', // jquery ui bootstrap
        '$strap.directives',// angular strap
        'ng',
        'chart.js',
        'smart-table'
     
    ]);


var filters = angular.module('myApp.filters', []);
var directives = angular.module('myApp.directives', []);


// bootstrap angular
myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    // TODO use html5 *no hash) where possible
    // $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl:'Content/partials/home.html'
    });
    $routeProvider.when('/metodajeffersona', {
        controller: 'JeffersonController',
        templateUrl:'Content/partials/projekt-1.html'
    });
    $routeProvider.when('/metodajeffersona-dokumentacja', {
        templateUrl:'Content/partials/projekt-1-doc.html'
    });

    // note that to minimize playground impact on app.js, we
    // are including just this simple route with a parameterized 
    // partial value (see playground.js and playground.html)
    // by default, redirect to site root
    $routeProvider.otherwise({
        redirectTo:'/'
    });

}]);
