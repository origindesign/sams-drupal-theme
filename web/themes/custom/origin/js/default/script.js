(function globalScript($, Drupal, once) {

    /**
     * GLOBAL
     * @type {{attach: attach}}
     */
    Drupal.behaviors.global = {


        attach: function (context) {

            // Global call only triggered once
            once('global', 'body', context).forEach(function () {

                // Tables
                $('.node--view-mode-full table').wrap('<div class="table-wrap" />');
                $('.node--view-mode-full .table-wrap').each(function() {
                    $(this).before('<span class="f-icon scroll-indicator">Scroll</span>');
                });
                Drupal.behaviors.global.checkTables();

                $(window).resize(function(){
                    Drupal.behaviors.global.checkTables();
                });

                // PDF new window
                $('a[href*="pdf"]').attr('target', '_blank');

                // Sitemap
                // $('.sitemap-item--menu-main > ul.menu > li.menu-item--expanded > a, .sitemap-item--menu-main > ul.menu > li.menu-item--expanded > ul.menu > li.menu-item--expanded > a').removeAttr('href');

            });

            // Remove video from mobile
            // $('.media--type-video.media--view-mode-url video').each(function(){
            //    if($(window).width() >= 740){
            //        $(this).attr('autoplay', 'true').removeAttr('preload').attr('playsinline', 'true');
            //    }
            // });

            // InView Animations
            $('.fade-in')
                .one('inview', function (event, isInView) {
                    let $this = $(this);
                    if (isInView) {
                        $this.addClass('in-view');
                    }
                });

            // Images objectFit aspect ratio
            $('img[data-x][data-y]').each(function(){
                let $this = $(this);
                $this.siblings('source').attr('data-aspectratio', $this.attr('data-aspectratio'));
            });

        },


        checkTables: function(){

            $('.node--view-mode-full .table-wrap').each(function() {

                let wrap = $(this);
                let indicator = wrap.prev('.scroll-indicator');

                if($(this).find('table').width() > wrap.width()){
                    wrap.addClass('scroll');
                    indicator.show();
                }else{
                    wrap.removeClass('scroll');
                    indicator.hide();
                }

            });

        }


    };


})(jQuery, Drupal, once);
