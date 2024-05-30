(function slickScript($, Drupal, once) {


    /**
     * SLICK SLIDESHOWS
     */
    Drupal.behaviors.slick = {

        attach: function (context) {

            once('slick', 'body', context).forEach(function () {

                $('.default-carousel').each(function(){

                    let slider = $(this);

                    if(slider.find('> .slides-wrap').length > 0){

                        let total = slider.find('.slick-count .total');
                        let current = slider.find('.slick-count .current');
                        let slidesWrap = slider.find('.slides-wrap');

                        slidesWrap
                            .on('init', function (event, slick) {
                                total.text(slick.slideCount);
                            })
                            .on('afterChange', function(event, slick, currentSlide){
                                current.text(currentSlide + 1);
                            })
                            .slick({
                                adaptiveHeight: true,
                                appendArrows: slider.find('.slick-arrows'),
                                dots: false,
                                arrows: true
                            });

                        // Remove focus when click arrows
                        $('.slick-arrow').on('click', function(){
                            $(this).blur();
                        });
                    }

                });

            });

        }

    };


})(jQuery, Drupal, once);
