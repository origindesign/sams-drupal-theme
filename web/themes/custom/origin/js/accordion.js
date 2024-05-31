(function accordionScript($, Drupal, once) {
//test
    /**
     * Accordion List
     */
    Drupal.behaviors.accordion = {
        attach: function (context) {

            once('accordion', '.accordion', context).forEach(function (elem) {

                let $elem = $(elem);
                let h3 = $elem.find('h3');
                let content = [];

                $.each(h3, function (index) {
                    let $this = $(this);
                    let text = $(this).text();

                    $this.nextUntil('h3').wrapAll('<div class="d-none p-v-1 accordion-content" aria-hidden="true" />');
                    content.push($this.next('div'));
                    content[index].hide();

                    $this.replaceWith('<div class="accordion-heading"><button class="reset pseudo-before pseudo-after h3" aria-expanded="false">' + text + '</button></div>');

                });

                let buttons = $elem.find('.accordion-heading button');

                buttons.on('click', function () {
                    let $button = $(this);

                    if ($button.attr('aria-expanded') === 'true') {
                        $button
                          .attr('aria-expanded', 'false')
                          .parent().next().slideUp(300).attr('aria-hidden', 'true');
                    } else {
                        $button.attr('aria-expanded', 'true')
                          .parent().next().slideDown(300).attr('aria-hidden', 'false');
                    }

                });

                $elem.find('.accordion-heading').each(function(){
                    $(this).nextUntil('.accordion-heading').addBack().wrapAll('<div class="p-v-1 accordion-row" />');
                });

            });

        },
    };


})(jQuery, Drupal, once);
