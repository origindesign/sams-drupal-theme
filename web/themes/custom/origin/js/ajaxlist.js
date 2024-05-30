(function ajaxlistScript($, Drupal, once) {

    Drupal.behaviors.ajaxlist = {

        category: '',


        attach: function (context) {

            once('ajaxlist', '.ajax-list-container', context).forEach(function () {

                let _obj = Drupal.behaviors.ajaxlist;
                let $ajaxLoad = Drupal.behaviors.ajaxListLoading;

                _obj.category = $(".filterform .category");

                //  Trigger the display of the list on filter change
                $(".filter-list").on("change", function() {
                    _obj.reloadList();
                });

                // History handling
                window.onpopstate = function(event){

                    let params = '';

                    if(event.state !== null){
                        // Use data from history state
                        params = $.parseJSON(event.state.params);
                    }else{
                        // Use defaults
                        params = Drupal.behaviors.ajaxListLoading.params;
                        _obj.category.val('all').blur().dropdown("update");
                    }

                    // Animate and reload list
                    let top = $('.filter-ajax').offset().top - 200;
                    $('html, body').animate(
                        { scrollTop: top }, '500', function() {
                            $ajaxLoad.displayList($ajaxLoad.ajaxContainer, $ajaxLoad.ajaxPath, params);
                        }
                    );

                };

            });

        },


        reloadList: function(){

            let _obj = Drupal.behaviors.ajaxlist;
            let $ajaxLoad = Drupal.behaviors.ajaxListLoading;
            let entity = $ajaxLoad.ajaxContainer.data('entity-type');
            let field = $ajaxLoad.ajaxContainer.data('field');
            let entityType = (typeof entity !== 'undefined' ? entity : 'node');
            let contentType = $ajaxLoad.ajaxContainer.data('content-type');
            let viewMode = $ajaxLoad.ajaxContainer.data('view-mode');
            let categoryField = $ajaxLoad.ajaxContainer.data('category-field');
            let fieldParam = (typeof field !== 'undefined' ? field : false);
            let paged = $ajaxLoad.ajaxContainer.data('paged');
            let sort = $ajaxLoad.ajaxContainer.data('sort');

            let params = '';
            let category = _obj.category.val();

            if(category !== 'all'){
                category = 'field_' + categoryField + '--' + category.replace('.term-', '');
            }

            params = '{' +
                '"entity_type":"' + entityType + '",' +
                '"content_type":"' + contentType + '",' +
                '"view_mode":"' + viewMode + '",' +
                '"category":"' + category + '",' +
                (fieldParam ? '"field":"' + fieldParam + '",' : '') +
                '"paged":"' + paged + '",' +
                '"sort":"' + sort + '"' +
                '}';
            // console.log(params);

            // Abort any possible current ajax call
            $ajaxLoad.xhr.abort();

            // Trigger the display of the list
            $ajaxLoad.displayList($ajaxLoad.ajaxContainer, $ajaxLoad.ajaxPath, $.parseJSON(params));

            // Set history state
            window.history.pushState({ params: params }, null, window.location);

        }


    };


})(jQuery, Drupal, once);
