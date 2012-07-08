/**
 * Overloader
 *
 * Create a pile of twitter status according to google hot trends
 */
$(document).ready(function() {
   // unique ID counter
   var currentUID = 0;
   // list of all tweet div ID
   var uids = [];
   // list of shuffled tweets unique IDs
   var shuffled = [];
   // keep track of last tweet dropped
   var last = 0;
   // keep track of the next page to retrieve twitter results from
   var twitterPage = 1;
   // is the animation paused
   window.config = {
      paused : false,
      trends : ''
   };
   // var paused = false;

   // set the message to indicate the progress
   setMessage('Loading trends...');
   // the app object, holds the trends for us to easily reuse
   var app = {
      trends: '',
      tweets: {}
   } // end app

   // get the trends
   $.ajax({
      url: window.location + 'GoogleTrends.php',
      context: document.body,
      success: function(data, status, xhr){
         // store the trends in the app object
         app.trends = JSON.parse(data);
         // also store trends in window config
         window.config.trends = app.trends;
         // get all the tweets
         loadTweets(app.trends);
      } // end success
   }); // end $.ajax({})


   /**
    * Load Tweets from X keyword(s)
    *
    * @params  String   trends   The keywords to search for
    * @return  JSON              A JSON feed of tweets
    */
   function loadTweets(trends){

      // load tweets for each trend
      $.each(trends, function(index, value){
         $.ajax({
            url: 'http://search.twitter.com/search.json?q="' + this + '"&page=' + twitterPage + '&rpp=1',
            dataType: 'jsonp',
            context: document.body,
            success: function(data, status, xhr){
               // load the tweets inside the app object
               app.tweets[index] = data.results;
               // message needs to be set from here, $.each does not wait for 
               // an iteration to finish to start another...
               setMessage('Loading tweets for ' + value + '...');
               if(index === 19){
                  setMessage('Done! Enjoy!', true);
                  appReady();
               }
            } // end success
         }); // end $.ajax({})
      });// end $.each()

      // increment the next twitterPage variable
      twitterPage++;

   } // end loadTweets()


   /**
    * App is ready to spit out the tweets!
    *
    * @params  none
    * @return  void
    */
   function appReady()
   {

      // the app.tweets contain 1 object for each trends
      // each object then contains X objects for each tweets
      $.each(app.tweets, function(index, value){
         // for each object inside a trend object
         $.each(value, function(){
            dropTweet(this, index);
         }) // end $.each()
      }); // end $.each()

      shuffled = arrayShuffle(uids);
      runtime();
   
   }; // end appReady()


   /**
    * "Run-time engine"
    *
    * Call the drop method on a tweetDropper at a different interval
    *
    * @return  void
    */
   function runtime()
   {

      // instead of performing calculation directly with
      // .length, store it in a var -> caused problems..
      var done = shuffled.length;
      var done = done - 1;

      // before calling another execution of this function,
      // check to see that there are still tweets to output
      if(last === done){
         // re-poll for more tweets
         loadTweets(app.trends);

         console.log('about to drop that last tweet, re-polling');
         // reset some global variable
         last = 0;
      }else{
         if(!window.config.paused){
            // drop the tweet
            $(shuffled[last]).tweetDropper('drop');
            // get a random delay between 1000 and 5000 miliseconds
            // multiply by the (max value - min value) and add minimum value
            var delay = Math.random() * 2000 + 1000;
            last++;
         }
         // and set the timeout for this function to be called again
         setTimeout(function(){ runtime() }, delay);
      }
   
   } // end runtime()


   /**
    * "Drop" a tweet div in the #tweets div
    *
    * @params  info  The info to insert into the .tweet div
    * @params  i     The trend index, used to differentiate each trends with CSS
    * @return  void
    */
   function dropTweet(info, i)
   {
   
      // post contains the html for the falling tweets
      var post = '';
      // p(arent) contains the html for the overlay when a tweet is clicked
      var p = '';
      var uid = uniqid();

      // falling tweet
      post += '<div  id="'+ uid +'" class="post trend'+ i +'" data-trend="trend'+ i +'" data-trend-name="'+ encodeURIComponent(app.trends[i]) +'" title="post_'+ uid +'">';
         post += '<div class="quote inside">';
            post += '<div class="overflow">';
               post += '<span class="quote">&quot;</span>';
               post += '<span class="tweet">' + info.text + '</span>';
            post += '</div><!-- end .overflow -->';
            post += '<img class="icon" src="images/icon-quote.gif" alt="twitter_feed" />';
         post += '</div><!-- end .inside -->';
         post += '<img class="bottom" src="images/shadow-small.png" alt="bottom" />';
      post += '</div><!-- end .post -->';

      // shows when user click on a tweet
      p += '<div class="big_post trend'+ i +'" id="post_'+ uid +'">';
         p += '<img class="next" src="images/arrow.gif" alt="next page" />';
         p += '<img class="previous" src="images/previous.gif" alt="next page" />';
         p += '<span class="post_top"></span>';
         p += '<div class="post_info">';
            p += '<div class="inner-div">';
               p += '<span class="trends"></span>';
               p += '<span class="graph">Graph</span>';
               p += '<span class="regions">Regions</span>';
            p += '</div>';
         p += '</div>';

         p += '<img class="close" src="images/close.png" alt="close" />';
         p += '<span class="big_quote">'+ info.text +'.&quot;</span>';
         p += '<span class="post_bottom"></span>';
      p += '</div> <!-- end .big_post -->';
      
      // insert 'post' inside #post
      $('#posts').append(post);
      // and create an instance of tweetDropper from it
      $('#' + uid).tweetDropper();
      // // insert p(arent) into #posts_big
      // $('#posts_big').append(p);

      // add ID to id list
      uids.push('#' + uid);

   }; // end dropTweet()


   /**
    * Shuffles an array
    *
    * @param   array    a  The array to shuffle
    * @return  void
    * @author  http://www.hardcode.nl/subcategory_1/article_317-array-shuffle-function
    */
   function arrayShuffle(a)
   {

      var b = a.slice();
      var len = b.length;
      var i = len;

      while (i--){
         var p = parseInt(Math.random()*len);
         var t = b[i];
         b[i] = b[p];
         b[p] = t;
      }

      return b; 

   }; // end arrayShuffle()
   

   /**
    * Change the message in the message box
    *
    * @params  String   msg   The message to display
    * @params  bool     last  If it is the last message to display
    * @return  void
    */
   function setMessage(msg, last)
   {
   
      // if last is not defined, set it to false
      last = last || false;

      // ensure the progress div is visible
      $('#progress').show();

      // modify message
      $('#progress').text(msg);

      // if it was the last message, fade it out after 1 seconds
      if(last) $('#progress').delay(1000).fadeOut(1500);
   
   }; // end setMessage()


   /**
    * Generate a unique ID
    *
    * @params  none
    * @return  String   uid   Unique ID
    */
   function uniqid()
   {

      return 't' + currentUID++;

   }; // end uniqid()

}); // end $(document).ready(function(){});
