$(function() {

  /* Handle infinite scroll and add images to background. */

  var imageLocations = [
    'https://api.instagram.com/v1/locations/393873950/media/recent',
    'https://api.instagram.com/v1/locations/487638749/media/recent',
    'https://api.instagram.com/v1/locations/493732972/media/recent',
  ];
  var scrollPage = 0;

  function scroll() {
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 800) {
      $(window).unbind('scroll', scroll);
      addImages();
    }
  }

  function addImages(cb) {
    var images = [];
    var todo = imageLocations.length;

    ga('send', 'event', 'Load Images', ++scrollPage);

    imageLocations.forEach(function(item, index) {
      if (typeof imageLocations[index] !== 'undefined') {
        fetchImages(index, function(data) {
          images = images.concat(data);
          if (--todo <= 0) {
            done();
          }
        });
      }
      else if (--todo <= 0) {
        done();
      }
    });

    function fetchImages(index, cb) {
      $.ajax({
        dataType: 'jsonp',
        url: imageLocations[index],
        data: {
          access_token: '1090248051.1d1d36f.d24a1a83cfc14bb8b337245827769d42'
        }
      }).done(function(payload) {
        if (imageLocations[index] !== payload.pagination.next_url) {
          imageLocations[index] = payload.pagination.next_url;
          cb(payload.data);
        }
      });
    }

    function done() {
      images = images.sort(function(a, b) { return b.created_time - a.created_time; });
      images.forEach(function(item) {
          // var resolution = 'low_resolution';
        var resolution = 'standard_resolution';
        $('<div class="image"><span><a href="' + item.link + '">' + item.user.username + '</a></span><img src="' + item.images[window.devicePixelRatio > 1 ? 'standard_resolution' : resolution].url + '" width="' + item.images[resolution].width + '" height="' + item.images[resolution].height + '"></div>').appendTo('.images');
      });
      $(window).bind('scroll', scroll);
      if (cb) {
        cb();
      }
    }
  }

  addImages(function() {
    // If this is a big enough screen, load more images to fill.
    if (306 * 306 * 18 < $(window).height() * $(window).width()) {
      $(window).unbind('scroll', scroll);
      addImages();
    }
  });


  /* Show if open. */

  var currentDate = new Date();
  // var openHour = [0, 6].indexOf(currentDate.getDay()) !== -1 ? 16 : 15; // Handle weekend hours.
  var open = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9 + 8, 0, 0)); // 9am + 8 PST offset.
  var close = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 9 + 8 + 7, 0, 0)); // Currently open until 4pm, 7 hour later.
  if (open < currentDate && currentDate < close) {
    $('body').addClass('open');
    $('.answer-js').html('Yes');
  }
  else {
    $('body').addClass('closed');
    $('.answer-js').html('Closed');
  }
  
});
