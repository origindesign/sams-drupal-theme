(function listingScript($, Drupal, once) {

    Drupal.behaviors.listing = {

        resizeTimer: null,
        filterArr: {}, // Object/ array Where we store filters and their group
        isotope: '', // Isotope element created by library
        isoContainer: $(".isotope"),
        isoGrid: $(".isotope .isoGrid"),
        linkFilter: $(".isotope .link-filter"), // When filters are button link label
        selectFilter: $(".isotope .filter-isotope select"), // When filters are select dropdown


        attach: function (context) {

            let _obj = Drupal.behaviors.listing;

            // Match card heights
            _obj.cardHeight();


            once('listing', '.isotope', context).forEach(function () {

                // Resize matchHeight
                $(window).resize(function() {
                    setTimeout(function() {
                        _obj.cardHeight();
                    }, 500);
                });

                _obj.isoContainer.each(function () {

                    // Adding gutter element in the iso grid
                    _obj.isoGrid.append('<div class="iso-gutter"></div>');

                    // Setting up Isotope listing
                    _obj.isotope = _obj.isoGrid.isotope({
                        masonry: {
                            columnWidth: '.iso-item',
                            gutter: '.iso-gutter'
                        },
                        itemSelector: '.iso-item',
                        percentPosition: true
                    });

                    // Layout list once images are loaded
                    _obj.isotope.imagesLoaded(Drupal.behaviors.listing.isotope, function(){
                        _obj.isotope.isotope('layout');
                    });

                    // Change filter select
                    _obj.selectFilter.on('change', function(){

                        let that = $(this);
                        let filter = that.val();
                        let filterGroup = that.attr('data-filter-group');

                        if (filter !== 'all'){
                            _obj.filterArr[filterGroup] = filter;
                        }else{
                            delete _obj.filterArr[filterGroup];
                        }

                        _obj.onChangeFilters();

                    });


                    // Click on filter link on isotope
                    _obj.linkFilter.on('click', function(event) {

                        event.preventDefault();
                        event.stopPropagation();

                        let that = $(this);
                        let filter = that.attr('data-filter');
                        let filterGroup = that.attr('data-filter-group');

                        that.addClass("active").parent('li').siblings().find('a').removeClass('active');

                        if (filter !== 'all'){
                            _obj.filterArr[filterGroup] = filter;
                        }else{
                            delete _obj.filterArr[filterGroup];
                        }

                        _obj.onChangeFilters();

                    });

                });


                // If hash has been provided, set filter
                if(window.location.hash !== ''){
                    _obj.updateList();
                }


                // On hash change, change filters (disable form.js event first as it conflicts with #)
                $(window).off('hashchange.form-fragment').on('hashchange', function() {
                    _obj.updateList();
                });


            });

        },


        onChangeFilters: function(){

            let _obj = Drupal.behaviors.listing;

            // Set Hash that will trigger updateList method
            window.location.hash = _obj.createHashFilters(_obj.filterArr);

            // Drupal.attachBehaviors();

        },


        filterList: function(){

            let _obj = Drupal.behaviors.listing;
            let filterValue = _obj.concatValues(_obj.filterArr);

            // Update Isotope
            _obj.isotope.isotope({ filter: filterValue });

            // No results
            if (!_obj.isotope.data('isotope').filteredItems.length) {
                $('.isoGrid .no-results').fadeIn();
            }else{
                $('.isoGrid .no-results').hide();
            }

        },


        updateList: function(){

            if(window.location.hash !== '#/all') {

                let hashArr = window.location.hash.substring(2).split("&");

                Object.keys(hashArr).forEach(function (prop) {
                    let argArr = hashArr[prop].split("=");
                    let group = argArr[0];
                    let term = argArr[1];

                    let filterItem = $('.link-filter[data-filter-group="' + group + '"][data-filter="' + term + '"]');
                    let filterSelect = $('.filter-isotope .filter-list[data-filter-group="' + group + '"]');

                    if(filterItem.length > 0){
                        filterItem.click();
                    }
                    if(filterSelect.length > 0) {
                        filterSelect.val(term).change().blur().dropdown("update");
                    }

                });
            }else {

                let itemContainers = $('.filter-isotope ul');
                let selectContainers = $('.filter-isotope select.filter-list');

                if (itemContainers.length > 0){
                    itemContainers.each(function () {
                        let filterItem = $(this).find('.link-filter[data-filter="all"]');
                        filterItem.click();
                    });
                }

                if (selectContainers.length > 0){
                    selectContainers.each(function () {
                        $(this).val('all').change().blur().dropdown("update");
                    });
                }


            }

            // Filter the list with Isotope
            Drupal.behaviors.listing.filterList();

        },


        concatValues: function(obj){
            let result = '';
            Object.keys(obj).forEach(function(prop) {
                result += obj[prop];
            });
            return result;
        },


        createHashFilters: function(obj){

            let result = '#/';
            let size = Object.keys(obj).length;

            if (size !== 0){
                result += $.param(obj);
            }else{
                result += 'all';
            }

            return result;

        },


        cardHeight: function(){

            let _obj = Drupal.behaviors.listing;

            // Match heights for display
            let cardCopy = _obj.isoContainer.find('.node--view-mode-card.iso-item .copy');
            if($(window).width() >= 740){
                cardCopy.matchHeight(false);
            }else{
                cardCopy.css('height', 'auto');
            }

        }


    };


})(jQuery, Drupal, once);
