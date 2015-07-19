angular.module('io.controllers')
.controller('IOverloadCtrl', function($scope, $compile, trendsFactory, tweetsFactory) {
  var  trends    = {}
      ,current   = 0
      ,firstLoad = true;

  $scope.tweets = [];

  function displayTweets() {
    var tweetsLeft = $scope.tweets.length - current
        ,el        = null;

    if (tweetsLeft >= 1) {
      el = $compile('<tweet tid="' + current + '"></test>')($scope);
      angular.element(document.getElementById('tweetsContainer')).append(el);

      // When there are less than 10 tweets remaining, call for more.
      if (tweetsLeft <= 10) {
        getTweets();
      }
      current++;
    }

    // Recursively call ourselves every second
    if (tweetsLeft >= 1) {
      setTimeout(displayTweets, 1000);
    }
    else {
      console.log('Ran out of tweets');
    }
  }

  function tweetsLoaded() {
    displayTweets();
    angular.element(document.getElementById('spinner')).addClass('disabled');
  }

  function getTweets() {
    var i          = 0
        ,tmpTweets = [];
    angular.forEach(trends, function(obj, trend) {
      tweetsFactory.getTweetsForTrend(trend, obj.lastId, 20).then(function(tweets) {
        if (tweets) {
          // Add the trend to each tweets
          angular.forEach(tweets, function(tweet) {
            tweet.trend = {
               id: i
              ,name: trend
            };
          });

          tmpTweets = tmpTweets.concat(tweets);

          if (tweets.length && typeof tweets[tweets.length - 1].id !== 'undefined') {
            trends[trend].lastId = tweets[tweets.length - 1].id;
          }

          i++;
          if (i === Object.keys(trends).length) {
            // Shuffle array
            $scope.tweets = $scope.tweets.concat(tmpTweets.shuffle());

            if (firstLoad) {
              firstLoad = false;
              tweetsLoaded();
            }
          }
        }
      });
    });
  }

  trendsFactory.getAllTrends().then(function(t) {
    angular.forEach(t, function(trend, key) {
      trends[trend] = {};
      trends[trend].lastId = 1;

      if (key === t.length - 1) {
        getTweets();
      }
    });
  });
});
