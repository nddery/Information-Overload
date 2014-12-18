angular.module('io.directives')
  .directive('colophon', function() {
    return {
      restrict: 'E'
      ,replace: true
      ,transclude: true
      ,templateUrl: 'partials/colophon.html'
    };
  });
