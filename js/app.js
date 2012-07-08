/**
 * Author: Nicolas Duvieusart Déry
 *
 * Information Overload
 */
;(function($){
  $(function(){

    //
    // Controls the main app behavior (when to fetch stuf...)
    //
    var App =
    {

      init: function( config )
      {

        var self = this;

        // some variables we'll use
        var url;

        // the page number we'll ask Twitter
        self.page = 1;

        // initialize an empty array for the tweets
        self.tweets = [];

        // indicate what is going on in the progress bar
        self.setMessage('Loading trends...');
        // set the URL
        url = window.location + 'GoogleTrends.php';
        // and fetch Google Trends
        var trends = self.fetch( url );

        // only continue after we successfully retrieve the Google Trends
        trends.then(function( results ){
          // store the trends in this object
          self.trends = JSON.parse(results);

          // and fetch the tweets
          self.fetchTweets();
        });


      },


      fetch: function( url )
      {

        var dfd = $.Deferred();

         $.ajax({
            url: url,
            success: dfd.resolve
         }); // end $.ajax({})

         return dfd.promise();

      },


      fetchTweets: function()
      {

        var self = this

        var dfd = $.Deferred();

        // load tweets for each trend
        var done = $.each(self.trends, function(index, value){
           $.ajax({
              url: 'http://search.twitter.com/search.json?q="' + this + '"&page=' + self.page + '&rpp=1',
              dataType: 'jsonp',
              success: function(data, status, xhr){
                 // load the tweets inside the tweets object
                 self.tweets[index] = data.results;
                 // message needs to be set from here, $.each does not wait for
                 // an iteration to finish to start another...
                 self.setMessage('Loading tweets for ' + value + '...');
                 if((index === (self.trends.length - 1))){
                    self.setMessage('Done! Enjoy!', true);
                    // increment the page to retrieve next
                    self.page++;
                 }
              } // end success
           }); // end $.ajax({})
        });// end $.each()

      },


      setMessage: function( msg, last )
      {

        // if last is not defined, set it to false
        last = last || false;

        // ensure the progress div is visible
        $('#progress').show();

        // modify message
        $('#progress').text(msg);

        // if it was the last message, fade it out after 1 seconds
        if(last) $('#progress').delay(1000).fadeOut(1500);

      }

    } // end App

    App.init();



    //
    // A tweet - to be instantiated
    //
    var Tweet =
    {

      init: function( config )
      {

        //

      },


      drop: function()
      {

        //

      },


      hover: function()
      {

        //

      },


      clicked: function()
      {

        //

      }

    } // end Tweet

  }); // end .ready()
}(jQuery));
