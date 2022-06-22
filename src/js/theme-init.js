const $ = require('jquery');
global.$ = global.jQuery = $;

require('./wizard');
require('jstree/src/jstree');
require('select2');
require('select2/dist/js/i18n/ru')
require('./tableFixed.js');
require('./modal.js');
require('./datepicker');
require('./inputmask');
//require('./tooltip');
require('./scrolltofixed');
require('./colorpicker');
require('./autocomplete');

require( './sortable.min');
(function($) {

    $(document).ready(function() {
        // select2 extend /// https://stackoverflow.com/questions/45819164/how-make-select2-placeholder-for-search-input
        let Defaults = $.fn.select2.amd.require('select2/defaults');
        $.extend(Defaults.defaults, {
            searchInputPlaceholder: '',
        });
        let SearchDropdown = $.fn.select2.amd.require('select2/dropdown/search');

        let _renderSearchDropdown = SearchDropdown.prototype.render;
        SearchDropdown.prototype.render = function(decorated) {
            // invoke parent method
            let $rendered = _renderSearchDropdown.apply(this, Array.prototype.slice.apply(arguments));

            this.$search.attr('placeholder', this.options.get('searchInputPlaceholder'));

            return $rendered;
        };
        // select2
        $.fn.select2.defaults.set('language', 'ru');
        $.fn.select2.defaults.set('searchInputPlaceholder', 'Найти...');
        $('select').not('.no-js').each(function(){
            let searchable = ($(this).data('select2-search') === true) ? 0 : 15
            let width = ($(this).data('select2-width') === undefined) ? 'auto' : $(this).data('select2-width')
            let clear = ($(this).data('select2-clear') === undefined) ? false : $(this).data('select2-clear')
            $(this).select2({
                dropdownAutoWidth : false,
                minimumResultsForSearch: searchable,
                allowClear: clear,
                width: width,
                dropdownParent: $(this).parent(),

            })
            applySelect2Styles($(this))
        })
        function applySelect2Styles(select) {
            let isSelected = select.select2('val')
            select.on('select2:select', function() {
                select.parents('.field-group-combo').removeClass('select-open').addClass('select-selected');
                select.parent().find('.select2-container').addClass('select2-container--selected');

            })
            select.on('select2:clear', function(){
                select.parent().find('.select2-container').removeClass('select2-container--selected');
                select.parents('.field-group-combo').removeClass('select-open')
            })
            select.on('select2:open', function(){
                select.parents('.field-group-combo').addClass('select-open');
            })
            select.on('select2:close', function(){
                let isSelected1 = select.select2('val')
                select.parents('.field-group-combo').removeClass('select-open');
                select.parent().find('.select2-container').removeClass('select2-container--focus');
                if(select.attr('multiple')) {
                    if(isSelected1.length <= 0) {
                        select.parents('.field-group-combo').removeClass('select-selected');
                    }
                } else {
                    if(isSelected1 === '') {
                        select.parents('.field-group-combo').removeClass('select-selected');
                    }
                }
            })
            if(select.attr('multiple')) {
                if(isSelected.length > 0) {
                    select.parent().find('.select2-container').addClass('select2-container--selected');
                    select.parents('.field-group-combo').addClass('select-selected');
                }
            } else {
                if(isSelected !== '') {
                    select.parent().find('.select2-container').addClass('select2-container--selected');
                    select.parents('.field-group-combo').addClass('select-selected');
                }
            }
            select.on('select2:unselect', function(){
                let opts = select.select2('data')
                if(!opts.length) {
                    select.parent().find('.select2-container').removeClass('select2-container--selected');
                    select.parents('.field-group-combo').removeClass('select-open');
                }
            })

        }
        window.applySelect2Styles = applySelect2Styles

        // select2 accessibility
        $('label').on('click', function (e) {
            $(this).parent().children('select:enabled').select2('open');
        });
        $(document).on('focus', '.select2-selection.select2-selection--single', function () {
            $(this).closest(".select2-container").siblings('select:enabled').select2('open');
        });
        $('select.select2').on('select2:closing', function (e) {
            $(e.target).data('select2').$selection.one('focus focusin', function (e) {
                e.stopPropagation();
            });
        });

        //tree menu
        $('div[data-jstree]').each(function() {
            if($(this).data('treeAjax')){
                let root_url = $(this).data('urlRoot'), children_url = $(this).data('urlChildren')
                $(this).jstree({
                    'core' : {
                        'data': {
                            'url': function (node) {
                                return node.id === '#' ? root_url : children_url;
                            },
                            'data': function (node) {
                                return node.id === '#' ? '' : { 'id' : node.id };
                            }
                        }
                    }
                }).on('select_node.jstree', function(e, data){
                    let hreflink = data.node.a_attr;
                    if(hreflink.href !== '#') {
                        if(hreflink.target === '_blank') {
                            window.open(hreflink.href)
                        } else {
                            location.href = hreflink.href;
                        }
                    }
                });

            } else {
                $(this).jstree({
                    //dblclick_toggle : false,
                }).on('select_node.jstree', function(e, data){
                    let hreflink = data.node.a_attr;
                    if(hreflink.href !== '#') {
                        if(hreflink.target === '_blank') {
                            window.open(hreflink.href)
                        } else {
                            location.href = hreflink.href;
                        }
                    }
                })
            }
        });

        //  checkbox in table row
        $('td input[type="checkbox"]').on('change', function(){
            $(this).closest('tr').toggleClass('row-highlight', $(this).prop('checked'));
        })

        // tabs
        $('.tabs-menu a').on('click', function (e) {
            e.preventDefault();
            let target = $(this).attr('href')
            //let filter = $(this).data('toggle-filter')

            $(this).parents('.tabs-menu').find('li').removeClass('active');
            $(this).parent().addClass('active');

            $(this).parents('.tabs').find('.tab').removeClass('active');
            $('.tab' + target).addClass('active');

        });

        // clear fields
        const clearField = {
            clear: function(btn){
                this.hideBtn(btn)
                let input = $(btn).parents('.field').find('input')
                this.clearInput(input)
                $(input).trigger('focus')
            },
            clearInput: function(field){
                $(field).val('')
                $(field).parent().find('[data-sortable-remove]').removeClass('d-none')
            }
            ,
            showBtn: function(btn){
                $(btn).removeClass('d-none')
                //$('[data-sortable-remove]').addClass('d-none')
            },
            hideBtn: function(btn){
                $(btn).addClass('d-none')
            },
            check: function(field){
                let val = $(field).val()
                let btn = $(field).parents('.field').find('[data-clear-field]')
                if(val !== ''){
                    this.showBtn(btn)
                    $(field).parent().find('[data-sortable-remove]').addClass('d-none')
                } else {
                    this.hideBtn(btn)
                    $(field).parent().find('[data-sortable-remove]').removeClass('d-none')
                }
            }
        }
        $('input').not('[data-autocomplete]').each(function (){
            clearField.check($(this))
        })
        $('body').on('click', '[data-clear-field]', function(){
            clearField.clear($(this))
        })
        $('body').on('input', 'input', function(){
            clearField.check($(this))
        })
        $('input').on('focus', function(){
            $(this).parents('.field-group-combo').addClass('field-group-combo-focus')
        })
        $('input').on('blur', function(){
            $(this).parents('.field-group-combo').removeClass('field-group-combo-focus')
        })

        // header
        $('[data-toggle-header]').on('click', function (){
            let menu = $(this).parents('header').find('.horizontal-menu')
            let body = $('body')
            if(body.hasClass('mobile-menu-open')){
                $(this).find('.icon').removeClass('icon-times').addClass('icon-bars')
                $('body').removeClass('mobile-menu-open').find('.navbar-backdrop').remove()
            } else {
                $(this).find('.icon').removeClass('icon-bars').addClass('icon-times')
                $('body').addClass('mobile-menu-open')
                $('.navbar').append('<div class="navbar-backdrop" />')
            }
            //menu.toggleClass('horizontal-menu-open')
        })

        //wizard /// http://techlaboratory.net/jquery-smartwizard
        $('.wizard').each(function(){
            let showFooter = $(this).data('wizard-footer')
            $(this).smartWizard({
                showFooter: showFooter
            })
        })

        $('[data-wizard-next]').on('click', function(){
            const wizard = $(this).data('wizard');
            $(wizard).smartWizard('next')
        })
        $('[data-wizard-prev]').on('click', function(){
            const wizard = $(this).data('wizard');
            $(wizard).smartWizard('prev')
        })
        $('[data-wizard-finish]').on('click', function(){
            const wizard = $(this).data('wizard');
            $(wizard).smartWizard('reset')
        })
        $('[data-wizard-go]').on('click', function(){
            const wizard = $(this).data('wizard');
            const step = $(this).data('wizard-go')
            $(wizard).smartWizard('goToStep', step - 1)
        })

        // prevent
        $('[data-prevent]').on('click', function(e) {
            e.preventDefault()
        });


        // bottom
        $('.bottom-title').on('click', function(){
            if($(window).outerWidth() <= 576){
                $('.bottom ul').not( $(this).parent().find('ul') ).slideUp(200)
                $(this).parent().find('ul').slideToggle(200)
            }
        })


        // checked all checkbox in a table
        $('[data-select-all-rows]').on('change', function(e){
            let table = $(this).parents('table');
            $('td input:checkbox', table).prop('checked', e.target.checked).trigger('change');
        })

        function initTableFixCol(){
            $('table').each(function(){
                let fixLeftCol = ($(this).data('fix-left-col') === true) ? 1 : 0
                let fixRightCol = ($(this).data('fix-right-col') === true) ? 1 : 0
                $(this).tableFixer({
                    'right' : fixRightCol,
                    'left' : fixLeftCol,
                });
            })
        }
        initTableFixCol()


        // toggle-filter
        $('[data-toggle-filter]').on('click', function(){
            let filter = $(this).data('filter')
            $(this).toggleClass('button-active').trigger('blur')
            $(filter).toggleClass('d-none')
        })

        // sidebar
        $('[data-toggle-sidebar]').on('click', function(){
            //$(this).toggleClass('button-active').trigger('blur')
            $(this).parents('aside').toggleClass('sidebar-open')
        })


        // example
        $('table [type=checkbox]').on('change', function(){
            let btnContainer = $(this).parents('.table-container').parent().find('.show-selected-row')
           if($('[type=checkbox]:checked').length > 1){
               $(btnContainer).removeClass('d-none')
           } else {
              $(btnContainer).addClass('d-none')
           }
        })

        $('[data-wizard-next]').on('click', function(){
            let stepIndex = $('#wizard-1').smartWizard("getStepIndex")
            if(stepIndex == 2){
                $('.show-only-on-3-step').removeClass('d-none')
            }
        })
        $('[data-wizard-prev]').on('click', function(){
            let stepIndex = $('#wizard-1').smartWizard("getStepIndex");
            if(stepIndex != 2){
                $('.show-only-on-3-step').addClass('d-none')
            }
        })

        // fixed menu
        $('.fixed-menu > ul > li').on('click', function(){
            let aside = $(this).parents('aside')
            if(!aside.hasClass('sidebar-open')){
                aside.addClass('sidebar-open')
            }
        })

        // Uploader
        let dropzone = $('.uploader-area');
        $(dropzone).on('dragover dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        // Drag leave
        $(dropzone).on('dragleave dragend', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        $(dropzone).on('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            processedFiles(e, $(this), true)
        });

        function setError(message){
            $('.uploader-errors').text(message)
        }
        function handleImagePreview (file) {
            return (file instanceof File) ? URL.createObjectURL(file) : file.src
        }

        function validateFile (file,accept) {
            let type = file.type
            if(type !== ''){
                return (accept.includes(type))
            } else {
                return false
            }

        }
        function formatBytes (bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        function buildIconOrImagePreview(file){
            if(file.type.includes('image')){
                return '<div class="avatar avatar-24 avatar-rounded mv-4 mr-4"><img src="' + handleImagePreview(file)+ '" alt="' + file.name + '" title="' + file.name + '" /></div>'
            } else {
                return '<i class="icon icon-file"></i>'
            }
        }

        function  processedFiles(e, el, dnd = false) {
            let errorContainer = $(el).parents('.uploader').find('.uploader-errors')
            let inputField = (dnd) ? $(el).parents('.uploader').find('input[type="file"]') :  $(el)
            let accepted = ($(inputField).attr('accept')) ? $(inputField).attr('accept').slice(',') : false
            let multiple = !!$(inputField).attr('multiple')
            let max = (multiple && $(inputField).data('max')) ? $(inputField).data('max') : 1
            let fileListEl =  $(el).parents('.uploader').find('.uploader-filelist:not(.uploader-exist) ul')
            let originalFileList = (dnd) ? e.originalEvent.dataTransfer.files : e.target.files
            let id = $(inputField).attr('id')
            window['files_' + id] = []

            $(errorContainer).text('')
             $(fileListEl).empty()
            if(!multiple) window['files_' + id] = []
            $.each(originalFileList, function(index, file){
                if((multiple && originalFileList.length > Number(max))) {
                    $(errorContainer).text('Лимит на количество добавляемых файлов превышен')
                } else {
                    if(window['files_' + id].length < Number(max)){
                        if(accepted) {
                            if(validateFile(file, accepted)){
                                window['files_' + id].push(file)

                            } else {
                                $(errorContainer).text('Некоторые файлы не были добавлены')
                            }
                        } else {
                            window['files_' + id].push(file)
                        }

                    } else {
                        $(errorContainer).text('Лимит на количество добавляемых файлов превышен')
                    }

                }
                if(!multiple) {
                    if(index === 0) return false
                }

            })

            if( window['files_' + id].length) {
                window['files_' + id] = window['files_' + id].filter((file, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === file.name && t.name === file.name
                    ))
                )
            }
            $.each(window['files_' + id], function(index, file){
                $(fileListEl).append('<li>' + buildIconOrImagePreview(file) + '<span class="uploader-filename">' + file.name + '</span>&nbsp;<span class="uploader-filesize">(' + formatBytes(file.size) + ')</span><button type="button" class="button button-icon" data-tooltip title="Не прикреплять" data-file-remove="' + file.name + '" data-filelist="' + 'files_' + id + '"><i class="icon icon-trash"></i></button></li>')

            })

        }
        $('body').on('click', '[data-file-remove]', function(){
            $(this).parents('.uploader').find('.uploader-errors').text('')
            let deleted = $(this).data('file-remove')
            let filelist = $(this).data('filelist')
            window[filelist] = window[filelist].filter(file => file.name !== deleted )
            $(this).parents('li').fadeOut(200, () => $(this).remove())
            $(this).tooltip('hide')

        })

        function randId() {
            return 'uploader_' + Math.floor(Math.random() * 1000);
        }

        $('.uploader-input').each(function (){
            if(!$(this).attr('id')){
                let id = randId()
                $(this).attr('id', id)
            }

            $(this).on('change', function(e){
                processedFiles(e, $(this))
            })
        })

        // Datepicker
        $('[data-calendar]').each(function() {
            let format = $(this).data('calendar-format')
            $(this).datepicker({
                todayBtn: 'linked',
                format: format || 'dd.mm.yyyy'
            }) .on('show', function(){
                $(this).addClass('focus')
            })
            .on('hide', function(){
                $(this).removeClass('focus').trigger('focus')
            })
            .on('changeDate', function(){
                $(this).parent().find('[data-clear-field]').removeClass('d-none')
            });
            let mask = (format) ? format.replace(/[0-9A-z]/g, '9') : '99.99.9999'
            $(this).inputmask({'mask': mask})
        })
        $('[data-calendar-open]').on('click', function(){
            $(this).parents('.field').find('[data-calendar]').datepicker('show')

        })
        $('[data-calendar]').on('click', function(){
            $(this).datepicker('hide')
        })

        // Input mask
        $('[data-mask]').each(function(){
            let mask = $(this).data('mask')
            $(this).inputmask({'mask': mask})
        })

        // Number counter
        let quantityMinus = $('[data-decrease]');
        let quantityPlus = $('[data-increase]');

        $('input[type="number"]').on('focus', function(){
            $(this).parent('.number').addClass('focus')
        })
        $('input[type="number"]').on('blur', function(){
            $(this).parent('.number').removeClass('focus')
        })

        $(quantityMinus).on('click', function(){
            let field = $(this).parent().find('input[type="number"]')
            let min = parseInt($(field).attr('min'), 10) || 0
            let step = parseInt($(field).attr('step'), 10) || 1
            if(min > 0) {
                if ((parseInt($(field).val(), 10) - step) > min) {
                    $(field).val(parseInt($(field).val(), 10) - step);
                }
            } else {
                if (parseInt($(field).val(), 10) > 0) {
                    $(field).val(parseInt($(field).val(), 10) - step);
                } else {
                    $(field).val(min);
                }
            }
        });
        $(quantityPlus).on('click', function(){
            let field = $(this).parent().find('input[type="number"]')
            let max = parseInt($(field).attr('max'), 10) || Infinity
            let step = parseInt($(field).attr('step'), 10) || 1
            if(max) {
                if ((parseInt($(field).val(), 10) + step) <= max) {
                    $(field).val(parseInt($(field).val(), 10) + step);
                } else {
                    $(field).val(max);
                }
            } else {
                $(field).val(parseInt($(field).val(), 10) + step);
            }
        });

        // Alerts
        $('[data-close-alert]').on('click', function(){
            $(this).parents('.alert').remove()
        })

        // Range
        $('input[type="range"]').each(function(){
            let val = $(this).val();
            let min = $(this).prop('min');
            let max = $(this).prop('max');
            let percentage = ((val - min) * 100) / (max - min) + '%'

            $(this).attr('style', '--value: ' + percentage);
        })
        $('input[type="range"]').on('input', function(e){
            let output = $(this).parent('.range').find('input[type="number"]')
            $(output).val($(this).val())
            let val = $(this).val();
            let min = $(this).prop('min');
            let max = $(this).prop('max');
            let percentage = ((val - min) * 100) / (max - min) + '%'

            $(this).attr('style', '--value: ' + percentage);
        })
        $('.range input[type="number"]').on('input', function(){
            let range = $(this).parent('.range').find('input[type="range"]')
            $(range).val($(this).val()).trigger('input')
        })

        // Collapsible list
        $('.collapsible-button').on('click', function(){
            let collapsible = $(this).parents('.collapsible').find('.collapsible-expand');
            $(this).toggleClass('button-active').trigger('blur')
            $(collapsible).toggleClass('collapsible-hidden')

        })

        // Sticky form footer
        if($('.sticky-footer').length){
            $('.sticky-footer').scrollToFixed( {
                bottom: 0,
                limit: $('.sticky-footer').offset().top,
            });
        }

        // Tooltip
        // $('body').tooltip({
        //     selector: '[data-tooltip]',
        //     container: 'body'
        // })


        // Pure CSS version
        $('.tree li').on('click', function(e){
            e.stopPropagation()
            $('.tree li').removeClass('tree-selected')
            $(this).addClass('tree-selected')
        })


        // Login page
        $('[data-toggle-password]').on('click', function(){
            let field = $(this).parent().find('input');
            if($(field).attr('type') === 'password'){
                $(field).attr('type', 'text')
                $(this).find('i').removeClass('icon-eye').addClass('icon-hide')
                $(field).trigger('focus')
            } else {
                $(field).attr('type', 'password')
                $(this).find('i').removeClass('icon-hide').addClass('icon-eye')
                $(field).trigger('focus')
            }
        })

        // Accordion /// https://codepen.io/Ravyre/pen/bYQOMx
        $('.accordion-item.open').find('.accordion-content').slideDown(250)

        $('.accordion-header').on('click', function(j) {
            let dropDown = $(this).next('.accordion-content');
            $(this).closest('.accordion').find('.accordion-content').not(dropDown).slideUp(200)

            if ($(this).parent().hasClass('open')) {
                $(this).parent().removeClass('open');
            } else {
                $(this).closest('.accordion').find('.accordion-item.open').removeClass('open');
                $(this).parent().addClass('open');
            }
            dropDown.stop(false, true).slideToggle(200);
            j.preventDefault();
        });

        // Colorpicker
        $('[data-colorpicker]').spectrum().show();

        // Single fileuploader
        $('input[type="file"]').not('[multiple]').each(function(index, el){
            let filelist = $(this).parent().find('.upload-file')
            let clearBtn = $(this).parent().find('[data-clear-file]')

            $(this).on('change', function(e){
                let file = e.target.files[0]
                let html = '<span class="upload-filename">' + file.name + '</span> <span class="upload-filesize">(' + formatBytes(file.size)  + ')</span>'
                filelist.html(html)
                clearBtn.removeClass('d-none')
                clearBtn.on('click', function (){
                    filelist.html('')
                    clearBtn.addClass('d-none')
                    $(el).val(null)
                })

            })
        })

        // Autocomplete
        $('[data-autocomplete]').each(function(){
            $(this).on('change input', function (){
                $(this).parent().find('[data-clear-field]').addClass('d-none')
            })
        })

        // Sortable
        $('[data-sortable]').each(function (){
            new Sortable($(this).get(0), {
                handle: '.icon-dnd',
                swapThreshold: 1,
                animation: 150
            });
        })
    });



})(jQuery);

