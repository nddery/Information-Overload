(function($){

   var methods = {
      init : function( options ) {
         return this.each(function() {
            // set everything up
            var   $this = $(this),
                  data  = $this.data('tweetDropper'),
                  complete = false,
                  l = false,
                  angle = parseFloat((Math.random() * 7.5).toFixed(1)),
                  windowWidth = $(window).width(),
                  windowHeight = $(window).height(),
                  tweetHeight = 165,
                  tweetWidth = 165,
                  xPos = (Math.random() * ((windowWidth - (tweetWidth * 2)))) - 125,
                  yPos = (windowHeight + (tweetHeight * 2));

            // if the plugin hasn't been initialized yet
            if(!data){
               $(this).data('tweetDropper', {
                  target : $this,
                  complete : complete,
                  l : l,
                  angle : angle,
                  windowWidth : windowWidth,
                  windowHeight : windowHeight,
                  tweetHeight : tweetHeight,
                  tweetWidth : tweetWidth,
                  xPos : xPos,
                  yPos : yPos
               });
               // and re-attach it to data
               data = $this.data('tweetDropper');

            }

            // bind a click event
            $(this).bind('click.tweetDropper', methods.clicked);

            // bind a mouseover event
            $(this).bind('mouseenter.tweetDropper', methods.hovered);

            // bind a mouseout event
            $(this).bind('mouseleave.tweetDropper', methods.hoverout);

            // // event for big posts div
            // // next
            // $('#content img.next').bind('click.tweetDropper', methods.next);
            // // previous
            // $('#content img.previous').bind('click.tweetDropper', methods.previous);

            // position the tweet, ready to fall
            $this.css({
               'position': 'absolute', 
               'left': data.xPos + 'px',
               'top': '-' + (data.yPos + 50) + 'px',
               'background': '#f5f5f5',
               '-webkit-transform-origin': '50% -25%',
                  '-moz-transform-origin': '50% -25%',
                   '-ms-transform-origin': '50% -25%',
                    '-o-transform-origin': '50% -25%',
                       'transform-origin': '50% -25%'
            });

            // $this.children('img.icon').css('top', '50px');

            methods.rotate(data);
         });
      },

      rotate : function( d ) {
         /**
          * Rotate an element from X angle
          *
          * @params  object   d  data (if not passed, = undefined..)
          * @return  void
          */
         var   $this = $(this);

         // for some reason data is not always defined...
         if(d && !d.complete){
            d.target.css({
              '-webkit-transform': 'rotate('+ d.angle +'deg)',
                 '-moz-transform': 'rotate('+ d.angle +'deg)',
                  '-ms-transform': 'rotate('+ d.angle +'deg)',
                   '-o-transform': 'rotate('+ d.angle +'deg)',
                      'transform': 'rotate('+ d.angle +'deg)'
            });
         }
      },

      clicked : function() {
         var   $this = $(this),
               data  = $this.data('tweetDropper'),
               msg   = $this.find('span.tweet'),
               thisClass = $this.attr('title');

         // animate all posts outside
         $('#posts').animate({marginLeft: '-200px', opacity: 'hide'}, 400);

         // replace the big_posts content to match the clicked div
         $('#posts_big span.big_quote').html(msg);
         // replace the trend in the sidebar
         $('#posts_big span.trends').html('Trend: ' + decodeURIComponent($this.attr('data-trend-name')));
         // change the graph url
         $('#posts_big img.ggraph').attr('src', 'http://www.google.com/trends/viz?q='+ $this.attr('data-trend-name') +'&graph=hot_img');
         // add the trend attribute
         $('#posts_big').attr('data-trend', $this.attr('data-trend'));
         // and the trend name
         $('#posts_big').attr('data-trend-name', $this.attr('data-trend-name'));
         // add the tweet unique id
         $('#posts_big').attr('data-trend-id', $this.attr('title'));

         // show the big_posts div
         $('#posts_big div.big_post').animate({top: '50px', opacity: 'show'}, 600);
         $('#posts_big div.post_info').animate({top: '50px', opacity: 'show'}, 800);

         // pause all drop animation
         window.config.paused = true;

         // and discard the instance (we read it, it's time for new information)
         $this.css('display', 'none');
         // $this.remove();
      },

      hovered : function() {
         var   $this = $(this),
               data = $this.data('tweetDropper');
         
         // // pause the tweet from falling
         // $this.pause();

         // reset all tweets to z-index 0
         $('.post').css('z-index', '0');
         // and bring the clicked one on top
         $this.css('z-index', '9999');
         // move the box a bit down
         $this.animate({'margin-top': '13px'}, 250);
         // move the bottom image up (so it seems like the box go over it)
         $this.children('img.bottom').fadeOut(250);
         // animate the quote icon
         $this.find('img.icon').animate({top: '32px', opacity: 'show'}, 250);
      },

      hoverout : function() {
         var   $this = $(this),
               data = $this.data('tweetDropper');

         // // resume the tweet animation
         // $this.resume();

         $this.children('img.bottom').fadeIn(250);
         $this.find('img.icon').stop(true, true).animate({top: '50px', opacity: 'hide'}, 250);
      },

      next : function( ) {
         var   $this = $(this),
               data = $this.data('tweetDropper');

         // slide it to the right while fading it out
         $('#posts_big').animate({opacity: '0'});
         $('#posts_big').animate({opacity: '1'});
      },
      
      previous : function( ) {
         var   $this = $(this),
               data = $this.data('tweetDropper');
      },

      drop : function( ) {
         var   $this = $(this),
               data = $this.data('tweetDropper'),
               duration = Math.random() * 5000 + 3000;

         $this.animate({
            top: (data.windowHeight - (data.tweetHeight*2) - 52)
         }, {
            duration: duration,
            queue: false,
            easing: 'swing',
            step: function(now, fx) {
               // if we are at extremities
               // just set the new angle value
               if(data.angle >= 7.5){
                  // set the l(eft) to true, tell the world we are going left now
                  data.l = true;
                  // it's fully right, start decrementing
                  data.angle -= 0.3;
               }else if(data.angle <= -7.5){
                  // set the l(eft) to false, telling the world we are going right now
                  data.l = false;
                  // it's fully left, start incrementing
                  data.angle += 0.3;
               }else{
                  // if we are not at extremities, which way ? and rotate
                  if(data.l){
                     // go left
                     data.angle -= 0.3;
                  }else{
                     // go right
                     data.angle += 0.3;
                  }
               }

               methods.rotate( data );
            },
            complete: function() {
               data.complete = true;
            }
         });
      }
   };

   $.fn.tweetDropper = function( method ) {
      if ( methods[method] ) {
         return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof method === 'object' || ! method ) {
         return methods.init.apply( this, arguments );
      } else {
         $.error( 'Method ' +  method + ' does not exist on jQuery.tweetDropper' );
      }    
   };

})( jQuery );
