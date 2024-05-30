(function videoScript($, Drupal, once) {


    /**
     * MEDIA VIDEO
     *
     */
    Drupal.behaviors.mediaVideo = {
        attach: function(context) {

            once('mediaVideo', '.video-poster-frame', context).forEach(function (elem) {

                let $this = $(elem);
                let $video = $this.find('.field--name-field-media-oembed-video').html();

                $this.find('.field--name-field-media-oembed-video').remove();

                $this.on('click', function(event) {
                    event.preventDefault();

                    $this.addClass('playing')
                      .append('<div class="field--name-field-media-oembed-video">' + $video + '</div>');

                    $('.video-poster-frame')
                      .not($this).removeClass('playing')
                      .find('.field--name-field-media-oembed-video')
                      .remove();

                });


            });

        },

    };


})(jQuery, Drupal, once);
