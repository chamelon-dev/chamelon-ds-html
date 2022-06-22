let link = $('.secondary_sidebar .vertical-menu li a');
function onScroll() {
    let sTop = $(window).scrollTop();
    $('section').each(function() {
        let id = $(this).attr('id'), offset = $(this).offset().top - 65, height = $(this).height();
        if(sTop >= offset && sTop < offset + height) {
            link.removeClass('active');
            $('.secondary_sidebar .vertical-menu').find('[href="#' + id + '"]').addClass('active');
        }
    });
}

(function($){
    $(window).on('load', function () {
        // https://codepen.io/avstorm/pen/WNrMqjG
        let t = localStorage.getItem('t')
        if(t === 'default') {
            $('body').removeClass('flavum ferrum')
            $('input[value="default"]').prop('checked', true).trigger('change')
        } else if(t === 'flavum') {
            $('body').removeClass('ferrum').addClass('flavum')
            $('input[value="flavum"]').prop('checked', true).trigger('change')
        } else if(t === 'ferrum') {
            $('body').removeClass('flavum').addClass('ferrum')
            $('input[value="ferrum"]').prop('checked', true).trigger('change')
        }
        $('.preloader').delay(250).fadeOut(200, function() {
            $(this).remove()
        });
        setTimeout(()=> {
            $('body').removeClass('show-loader')
        }, 250)

    });
    $(window).on('scroll', function(){
        onScroll();
    });
    $(document).ready(function () {
        onScroll();
        // Move to specific section when click on menu link
        link.on('click', function(e) {
            let target = $($(this).attr('href'));
            $('html, body').animate({
                scrollTop: target.offset().top - 64
            }, 600);
            $(this).addClass('active');
            e.preventDefault();
        });


        $('aside input[name=component_search]').on('input change', function() {
            let search = $(this).val().toLowerCase();
            let div = $('aside .vertical-menu li').hide();
            $('aside .no-results').removeClass('d-none')
            div.filter(function() {
                return $(this).text().toLowerCase().indexOf(search) >= 0;
            }).show(0, function(){
                $('aside .no-results').addClass('d-none')
            });
        });
        $('aside [data-clear-field]').on('click', function(){
            $('aside input[name=component_search]').val('').trigger('change')
            $('aside .no-results').addClass('d-none')
        })

        let activeSidebarMenuItem = $('.sidebar-middle a.active');
        let scrollableElem = $('aside .sidebar-middle');
        if(activeSidebarMenuItem.length && scrollableElem.length) {
            $(scrollableElem).animate({scrollTop: activeSidebarMenuItem.offset().top - $(scrollableElem).offset().top + $(scrollableElem).scrollTop()}, 100);
        }


        $('.scroll-top a').on('click', function(){
            $('html, body').animate({scrollTop: 0}, 300)
            return false
        })

        $('input[type=radio][name=ai]').on('change', function(){
            let css  = $(this).val()
            $('#align-items-test').css('align-items', css)
        })

        $('input[type=radio][name=jc]').on('change', function(){
            let css  = $(this).val()
            $('#justify-content-test').css('justify-content', css)
        })

        $('input[type=radio][name=fd]').on('change', function(){
            let css  = $(this).val()
            $('#flex-direction-test').css('flex-direction', css)
        })
    })
    // Switch theme
    $('input[name="theme"]').on('change', function() {
        let t = $(this).val()
        if(t === 'default') {
            $('body').removeClass('flavum ferrum')
        } else if(t === 'flavum') {
            $('body').removeClass('ferrum').addClass('flavum')
        } else if(t === 'ferrum') {
            $('body').removeClass('flavum').addClass('ferrum')
        }
        localStorage.setItem('t', t)
    })

    // Switch version
    function swithVersion (v) {
        let compTabContainer = $('.components-tabs')
        $(compTabContainer).find('.tabs-menu a').parent().removeClass('active')
        $(compTabContainer).find('.tabs-menu a[href^="#tab-' + v + '"]').parent().addClass('active')

        let t = $(compTabContainer).find('.tabs-content .tab').removeClass('active')
        $(compTabContainer).find('.tabs-content .tab[id^="tab-' + v + '"]').addClass('active')
    }

    let storedVersion = localStorage.getItem('v')
    if(storedVersion !== null) {
        if(storedVersion === 'react') {
            $('input[name="version"]').prop('checked', true)
        } else {
            $('input[name="version"]').prop('checked', false)
        }
        swithVersion(storedVersion)
    }

    $('input[name="version"]').on('change', function(){
        let v = $(this).is(':checked') ? 'react' : 'html'
        swithVersion(v)
        localStorage.setItem('v', v)
    })

    // Autocomplete example
    $('#autocomplete').autocomplete({
        serviceUrl: 'https://fias.dev.cgu.iac.mchs.ru/api/search',
        paramName: 'address',
        transformResult: function(response) {
            return {
                suggestions: $.map(response, function(dataItem) {
                    return { value: dataItem.address, data: dataItem.guid };
                })
            };
        }
    });

    // Sortable example
    let sortable_container = $('#demo-1')
    let new_item = '<div class="sortable-item">\n' +
        '        <i class="icon icon-dnd d-none"></i>\n' +
        '        <div class="field">\n' +
        '            <div class="field-icon field-icon-both">\n' +
        '                <i class="icon icon-search field-icon-start"></i>\n' +
        '                <input type="search" name="last_name" placeholder="Фамилия">\n' +
        '                <button class="field-button field-button-end d-none" data-clear-field>\n' +
        '                    <i class="icon icon-times"></i>\n' +
        '                </button>\n' +
        '                <button class="field-button field-button-end" data-sortable-remove>\n' +
        '                    <i class="icon icon-trash"></i>\n' +
        '                </button>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>'
    $('#sortableTest').on('click', function(e) {
        e.preventDefault()
        sortable_container.append(new_item)
        if(sortable_container.children().length > 1) {
            sortable_container.find(".icon-dnd").removeClass('d-none')
        }
    })

    $('body').on('click', '[data-sortable-remove]', function(){
        $(this).parents('.sortable-item').remove()
        if(sortable_container.children().length === 1) {
            $('#demo-1 .sortable-item').find('.icon-dnd').addClass('d-none')
        }
    })


    // Multiple demo
    let multiple_container = $('#demo-2')
    let new_select = '<div class="sortable-item">\n' +
    '                                    <i class="icon icon-dnd d-none"></i>\n' +
    '                                    <div class="field">\n' +
    '                                        <div class="field-group field-group-combo">\n' +
    '                                            <select class="no-js">\n' +
    '                                                <option value=""></option>\n' +
    '                                            </select>\n' +
    '                                            <div class="field-group-postfix">\n' +
    '                                                <button type="button" class="button button-icon" data-add>\n' +
    '                                                    <i class="icon icon-plus"></i>\n' +
    '                                                </button>\n' +
    '                                                <button type="button" class="button button-icon" data-multiple-remove>\n' +
    '                                                    <i class="icon icon-trash"></i>\n' +
    '                                                </button>\n' +
    '                                            </div>\n' +
    '                                        </div>\n' +
    '                                    </div>\n' +
    '                                </div>'
    $('#multipleTest').on('click', function(e) {
        e.preventDefault()
        multiple_container.append(new_select)
        let select = multiple_container.find('select')

        if(multiple_container.children().length > 1) {
            multiple_container.find(".icon-dnd").removeClass('d-none')
        }
        select.each(function() {
            $(this).select2({width: '100%', placeholder: 'Выберите из списка', minimumResultsForSearch: 15, dropdownParent: $(this).parent()})
            applySelect2Styles($(this))
        })
    })
    $('body').on('click', '[data-multiple-remove]', function(){
        let parent = $(this).parents('.sortable-item')
        let select = parent.find('select')
        parent.remove()
        select.select2('destroy')
        if(multiple_container.children().length === 1) {
            $('#demo-2 .sortable-item').find('.icon-dnd').addClass('d-none')
        }
    })
    $('body').on('click', '[data-add]', function(){
        let newOption = new Option('Пункт 1', '1', true, true);
        let select = $(this).parents('.field').find('select')
        select.append(newOption).trigger('change')
        $(this).removeAttr('data-add').attr('data-edit', '').find('.icon').removeClass('icon-plus').addClass('icon-pencil')
        $(this).trigger('blur')
        applySelect2Styles(select)
    })
    $('body').on('click', '[data-edit]', function(){
        let select = $(this).parents('.field').find('select')
        select.find('option[value="1"]').text('Edited')
        select.select2('destroy').select2({width: '100%', placeholder: 'Выберите из списка', minimumResultsForSearch: 15, dropdownParent: $(this).parent()})
        applySelect2Styles(select)
    })


})(jQuery)

