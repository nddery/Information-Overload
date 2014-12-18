angular.module('io.services')
  .factory('ioCache', function($cacheFactory) {
    return $cacheFactory('data');
  })

  .factory('tweetsFactory', function($http, $q, $filter, ioCache) {
    var  cb = new Codebird;
    cb.setConsumerKey('AHUM7fCOE6XmHF96e4LpYg', 'XYRBRKOID30BoHfJFZmAAV8CJBSRs1jVii0tQlHYg');
    cb.setToken('268838449-JyiHBRiH94mfLnNoYzv5E0UBjvbzCvzHzAHHMJxM', 'tRPUKbTZubwlJTC2mSUcbwjky54J13KIJNOsAkUgsuizz');

    var getTweetsForTrend = function(trend, lastId, count) {
      var deferred = $q.defer();

      count = typeof count !== 'undefined' ? count : 20;

      cb.__call(
         'search_tweets'
        ,'q=' + trend + '&since_id=' + lastId + '&count=' + count
        ,function (reply) {
          deferred.resolve(reply.statuses);
        },
        true
      );

      return deferred.promise;
    };

    return {
      getTweetsForTrend: getTweetsForTrend
    };
  });
