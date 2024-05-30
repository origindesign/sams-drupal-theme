(function eventCalendarScript($, Drupal, once) {


    Drupal.behaviors.eventCalendar = {

        from: '',
        to: '',
        categories: '',


        attach: function (context) {

            once('eventCalendar', '.ajax-events', context).forEach(function () {

                let _obj = Drupal.behaviors.eventCalendar;
                let _ajaxLoad = Drupal.behaviors.ajaxViewLoading;

                _obj.from = $(".filterform .from-date");
                _obj.to = $(".filterform .to-date");
                _obj.categories = $(".filterform .categories");

                //  Trigger the display of the list on filter change
                $(".filter-list").on("change", function() {
                    _obj.reloadList();
                });

                // Datepicker setup
                let noMonths = 2;
                if($(window).width() < 740){
                    noMonths = 1;
                }
                _obj.from.datepicker({
                    dateFormat: "M d, yy",
                    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    changeMonth: true,
                    changeYear: true,
                    showAnim: "fadeIn",
                    yearRange: "c:c+1",
                    numberOfMonths: noMonths,
                    onSelect: function(selectedDate) {
                        _obj.to.datepicker("option", "minDate", selectedDate);
                        $(this).change();
                    }
                });
                _obj.to.datepicker({
                    dateFormat: "M d, yy",
                    monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    changeMonth: true,
                    changeYear: true,
                    showAnim: "fadeIn",
                    yearRange: "c:c+1",
                    numberOfMonths: noMonths
                });

                // History handling
                window.onpopstate = function(event){

                    let params = '';

                    if(event.state !== null){
                        // Use data from history state
                        params = $.parseJSON(event.state.params);
                    }else{
                        // Use defaults
                        params = _ajaxLoad.params;
                        _obj.categories.val('All').blur().dropdown("update");
                    }

                    // Animate and reload list
                    let top = $('.filter-ajax').offset().top - 200;
                    $('html, body').animate(
                        { scrollTop: top }, '500', function() {
                            _ajaxLoad.displayList(_ajaxLoad.ajaxContainer, _ajaxLoad.ajaxPath, params);
                        }
                    );

                };

            });

        },


        reloadList: function(){

            let _obj = Drupal.behaviors.eventCalendar;
            let _ajaxLoad = Drupal.behaviors.ajaxViewLoading;

            let params = '';
            let from = Date.parse(_obj.from.val()).toString('yyyy-MM-dd') + ' 00:00:01';
            let to = Date.parse(_obj.to.val()).toString('yyyy-MM-dd') + ' 23:59:59';
            let category = _obj.categories.val();

            params = '{"from":"' + from + '","to":"' + to + '","category":"' + category + '"}';

            // Abort any possible current ajax call
            _ajaxLoad.xhr.abort();

            // Trigger the display of the list
            _ajaxLoad.displayList(_ajaxLoad.ajaxContainer, _ajaxLoad.ajaxPath, $.parseJSON(params));

            // Set history state
            window.history.pushState({ params: params }, null, window.location);

        }


    };


})(jQuery, Drupal, once);
