angular.module('io.services')
  .factory('ioCache', function($cacheFactory) {
    return $cacheFactory('data');
  })

  .factory('trendsFactory', function($http, $q, ioCache) {
    return {
      getAllTrends: function() {
        var deferred = $q.defer()
            ,baseUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q='
            ,url     = 'http%3A%2F%2Fwww.google.com%2Ftrends%2Fhottrends%2Fatom%2Fhourly&callback=JSON_CALLBACK';


        $http.jsonp(baseUrl + url, {cache: ioCache})
          .success(function(response) {
            response = response.responseData.feed.entries[0].content;

            var  re     = new RegExp('.+?<a href=".+?">(.+?)<\/a>.+?', 'g')
                ,m      = re.exec(response)
                ,trends = [];

            // Accessing regexp groups
            // http://stackoverflow.com/a/432503
            while (m !== null) {
              trends.push(m[1]);
              m = re.exec(response);
            }

            deferred.resolve(trends);
          }).error(function(){
            deferred.reject();
          });

        return deferred.promise;
      }
    };
  });
