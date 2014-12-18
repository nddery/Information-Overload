angular.module('io.directives').directive('tweet', function($window) {
  return {
     templateUrl: 'partials/tweet.html'
    ,restrict: 'E'
    ,scope: {
      tid: '@'
    }
    ,link: function(scope, element, attrs) {
      var duration = null
          ,r       = 100
          ,win     = angular.element($window)
          ,ww      = win[0].innerWidth
          ,wh      = win[0].innerHeight
          ,el      = element.children();

      scope.tweet = scope.$parent.tweets[scope.tid];

      function getRandomNumber(min, max, floating) {
        floating = typeof floating !== 'undefined' ? true : false;

        if (floating) {
          return Math.random() * (max - min) + min;
        }
        else {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }

      function setInitialPosition() {
        el.css('left', getRandomNumber(0, ww - 215) + 'px');
      }

      function setAnimationDuration() {
        duration = getRandomNumber(2,8,true);
        el.css({
           '-webkit-transition': 'bottom ' + duration + 's ease-out'
                  ,'transition': 'bottom ' + duration + 's ease-out'
        });
      }

      function pauseRotation() {
        el.addClass('paused');
      }

      function animate() {
        el.css('bottom','0%');
        setTimeout(pauseRotation, duration * 1000);
      }

      setInitialPosition();
      setAnimationDuration();
      // Need to wait if we want CSS to animate... ?
      setTimeout(animate,250);
    }
  };
});
