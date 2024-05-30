(function ajaxViewLoadingScript($, Drupal, once) {

    Drupal.behaviors.ajaxViewLoading = {

        xhr: null, // ajax call
        ajaxContainer: '',
        ajaxPath: '',
        params: '',
        urlParams: '',
        filterForm: $('.filterform'),
        categories: $(".filterform .categories"),


        attach: function (context) {

            once('ajaxViewLoading', '.ajax-list-container', context).forEach(function (elem) {

                let _obj = Drupal.behaviors.ajaxViewLoading;
                _obj.ajaxContainer = $(elem);
                _obj.ajaxPath = _obj.ajaxContainer.attr('data-ajax-path');
                _obj.params = _obj.ajaxContainer.data('default-params');

                // If hash has been provided, update url
                if(window.location.hash !== ''){
                    _obj.updateParamsFromHash();
                }

                // Display list
                _obj.displayList(_obj.ajaxContainer, _obj.ajaxPath, _obj.params);

                // On hash change, update params, reload list
                $(window).off('hashchange.form-fragment').on('hashchange', function() {
                    _obj.updateParamsFromHash();
                    _obj.displayList(_obj.ajaxContainer, _obj.ajaxPath, _obj.params);
                });


            });

        },


        updateParamsFromHash: function (){

            let _obj = Drupal.behaviors.ajaxViewLoading;
            let hash = window.location.hash;

            // Split hash into array of values
            let hashArray = hash.substring(2).split('/');

            $.each(hashArray, function(index, value) {
                // For each value split into key => value array
                let valueArray = value.split('=');
                // Add/override defaultParams object
                _obj.params[valueArray[0]] = valueArray[1];
            });

        },


        updateFilters: function (params){

            let _obj = Drupal.behaviors.ajaxViewLoading;

            // Handle date if exists
            let fromSelect = $(".filterform .from-date");
            let toSelect = $(".filterform .to-date");

            if(fromSelect.length > 0 && toSelect.length > 0){
                let from = params.from.split('-');
                let to = params.to.split('-');

                // Updates Filters Value on Page
                fromSelect.val(Date.parse(from[1] + '-' + from[0] + '-' + from[2]).toString('MMM d, yyyy'));
                toSelect.val(Date.parse(to[1] + '-' + to[0] + '-' + to[2]).toString('MMM d, yyyy'));
            }


            // Handle category if exists
            if(_obj.categories.length > 0){
                let category;

                if(params.category !== 'All'){
                    category = params.category;
                }else{
                    category = 'All';
                }

                // Updates Filters Value on Page
                _obj.categories.val(category).blur().dropdown("update");
            }

        },


        createUrlParams: function ($params){

            let _obj = Drupal.behaviors.ajaxViewLoading;
            _obj.urlParams = '?';

            const keys = Object.keys($params);
            const values = Object.values($params);

            $.each(keys, function(index, value){
                _obj.urlParams += value + '=' + values[index];
                if(index !== keys.length - 1){
                    _obj.urlParams += '&';
                }
            });

        },


        displayList: function ($container, $path, $params){

            let _obj = Drupal.behaviors.ajaxViewLoading;
            let html = '';

            // Handle class for loading icon
            $container.html('').removeClass('loaded');

            // Update Filters
            _obj.updateFilters($params);

            // Create URL Params
            _obj.createUrlParams($params);
            // console.log($path + _obj.urlParams);

            _obj.xhr = $.ajax({
                type: 'POST',
                url: $path + _obj.urlParams + '&response_type=ajax',
                success: function(result) {

                    if($(result).find('.view-empty').length > 0){
                        html = '<div class="no-results m-t-2">' + $(result).find('.view-empty').html() + '</div>';
                    } else {
                        html = $(result).find('.view-content').html();
                    }

                    let wrapper = $("<div/>", { class: 'wrapper' });
                    wrapper.html('<div class="block block-system block-system-main-block">' + html + '</div>');
                    $container.html(wrapper);
                    $container.addClass('loaded');
                    Drupal.attachBehaviors();

                    /*
                    console.log($path+'?response_type=ajax');
                    console.log($params);
                    console.log(result);
                    */

                }
            });

        }


    };


})(jQuery, Drupal, once);
