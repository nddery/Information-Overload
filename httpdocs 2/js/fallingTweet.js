(function($){
   $.fn.extend({ 
      // plugin name - fallingTweet
      fallingTweet: function(options) {
         // var defaults = { 
            // id: 't0'
         // };

         // var options = $.extend(defaults, options);

         return this.each(function() {
            // reference to current object (this)
            var obj = $(this);                
            // has the animation completed ?
            var complete = false;
            // left or right (true or false)
            var l = false;
            // current degree angle for tweet div
            var angle = Math.random() * 7.5;
            // round it to only 1 decimal
            angle = parseFloat(angle.toFixed(1));
            // and set it
            rotate(angle);

            // window width and height
            var windowWidth  = $(window).width();
            var windowHeight = $(window).height();

            // the current tweet div height
            // and add 50 just to make sure it is above viewline
            var tweetHeight = obj.height();
            // current tweet width
            var tweetWidth = obj.width();

            // calculate a random position in the window width
            var xPos = Math.random() * (windowWidth - tweetWidth);
            // calculate random position y wise
            // var yPos = Math.random() * (windowHeight + (tweetHeight * 2));
            var yPos = (windowHeight + (tweetHeight * 2));

            // position the tweet, ready to fall
            obj.css({
               'position': 'absolute', 
               'left': xPos + 'px',
               'top': '-' + (yPos + 50) + 'px',
               'background': '#f5f5f5'
            });

            var del = Math.random() * 100000;
            // calculate duration for animation
            // if delay is small than 5000, use a minimum duration of 5000
            // else, use delay (cause it's bigger)
            var duration = Math.random() * 50000;
            var duration = (del < 5000) ? 5000 : duration;
            obj.delay(del).animate({
               top: (windowHeight - (tweetHeight*2))
            }, {
               duration: duration,
               queue: false,
               easing: 'swing',
               step: function(now, fx) {
                  // if we are at extremities
                  // just set the new angle value
                  if(angle === 7.5){
                     // set the l(eft) to true, tell the world we are going left now
                     l = true;
                     // it's fully right, start decrementing
                     angle -= 0.1;
                  }else if(angle === -7.5){
                     // set the l(eft) to false, telling the world we are going right now
                     l = false;
                     // it's fully left, start incrementing
                     angle += 0.1;
                  }else{
                     // if we are not at extremities, which way ? and rotate
                     if(l){
                        // go left
                        angle -= 0.1;
                     }else{
                        // go right
                        angle += 0.1;
                     }
                  }

                  rotate();
               },
               complete: function() {
                  // complete = true;
               }
            });


            /**
             * Rotate an element from X angle
             *
             * @params  none
             * @return  void
             */
            function rotate()
            {

               obj.css({
                 '-webkit-transform': 'rotate('+ angle +'deg)',
                    '-moz-transform': 'rotate('+ angle +'deg)',
                     '-ms-transform': 'rotate('+ angle +'deg)',
                      '-o-transform': 'rotate('+ angle +'deg)',
                         'transform': 'rotate('+ angle +'deg)'
               });
            
            } // end angle()


            // // pause the animation on mouse hover
            // // and resume it on mouse out
            // obj.mouseover(function() {
            //    obj.pause();
            //    // reset all tweets to z-index 0
            //    // $('.tweet').css('z-index', '0');
            //    // // and bring the clicked one on top
            //    // obj.css('z-index', '9999');
            // }, function() {
            //    obj.resume();
            // });

            obj.mouseover(function() {
               // reset all tweets to z-index 0
               $('.tweet').css('z-index', '0');
               // and bring the clicked one on top
               obj.css('z-index', '9999');
            });
            
         }); //end this.each()
      } // end fallingTweet
   }); // end $.fn.extend()
})(jQuery);
