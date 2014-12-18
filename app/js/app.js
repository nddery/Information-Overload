// Modules & Dependencies
angular.module('io.services', []);
angular.module('io.directives', ['io.services']);
angular.module('io.controllers', ['io.services']);

// Declare app level module which depends on filters, and services
angular.module('io', [
  'ngRoute',
  'io.services',
  'io.directives',
  'io.controllers'
])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/ioverload.html',
      controller: 'IOverloadCtrl'
    })
    .otherwise('/');

  $locationProvider.hashPrefix('!');
});

// http://stackoverflow.com/a/1054862
String.prototype.slugify = function() {
  return this.toLowerCase()
             .replace(/[^\w ]+/g,'')
             .replace(/ +/g,'-');
};

Array.prototype.shuffle = function(){ //v1.0
  for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
  return this;
};
