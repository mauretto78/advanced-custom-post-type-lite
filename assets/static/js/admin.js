var $ = jQuery.noConflict();

$(function(){

    // list elements
    $('#list-add-element').on('click', function () {

        const $this = $(this);
        const $listWrapper = $this.prev('.list-wrapper');
        const $lastElement = $listWrapper.children('.list-element').last();
        const $nextId = $listWrapper.children('.list-element').length;
        const $baseId = $listWrapper.parent().find('input[type=hidden]:first-child').val();

        let $cloned = $lastElement.find('input').clone();
        $cloned.val('');
        $cloned.prop('id', $baseId  + '_' + $nextId);

        $listWrapper.append('<div class="list-element">' + $cloned.prop('outerHTML') + '<a class="list-remove-element" data-target-id="'+$cloned.prop('id')+'" href="#">Remove element</a></div>');
    });

    $('body').on('click', 'a.list-remove-element', function() {

        const $this = $(this);
        const $targetId = $this.data('target-id');

        $('#'+$targetId).parent().remove();
        $this.remove();
    });

    // post relationships
    $('.post-relationship').on("change", function () {

        let $val = $( this ).val();

        if(Array.isArray($val)){
            $val = $val.join(',');
        }

        $("#inversedBy").val($val);
    });

    // single file upload
    $('.file-delete-btn').on('click', function (e) {
        const $this = $( this );
        e.preventDefault();

        const target = $this.data('target-id');
        $('#'+target).val('');
        $this.parent('div').next( '.file-preview' ).html( '' );
    });

    $('.upload-file-btn').on('click',function(e) {
        const $this = $( this );
        e.preventDefault();

        const image = wp.media( {
            title: 'Upload a File',
            library: {
                type: [ 'application' ]
            },
            multiple: false
        } ).open()
            .on( 'select', function ( e ) {
                const uploaded_image = image.state().get( 'selection' ).first();
                const image_url = uploaded_image.toJSON().url;

                $this.prev( 'input' ).val( image_url );
                $this.parent('div').next( '.file-preview' ).html( '<div class="file"><a target="_blank" href="'+image_url+'">Download</a></div>' );
            } );
    });

    // single image and video upload
    $('.upload-delete-btn').on('click', function (e) {
        const $this = $( this );
        e.preventDefault();

        const target = $this.data('target-id');
        $('#'+target).val('');
        $('#'+target+'_copy').val('');
        $this.prev('button').prev( '.inputs-wrapper' ).html('');
        $this.parent('div').next( '.image-preview' ).html( '' );
        $this.addClass('hidden');
    });

    $('.upload-image-btn').on('click',function(e) {
        const $this = $( this );
        e.preventDefault();

        const image = wp.media( {
            title: 'Upload Image',
            library: {
                type: [ 'image' ]
            },
            multiple: false
        } ).open()
            .on( 'select', function ( e ) {
                const uploaded_image = image.state().get( 'selection' ).first();
                const image_url = uploaded_image.toJSON().url;
                const image_name = uploaded_image.toJSON().name;

                $this.prev( 'input' ).val( image_url );
                $this.parent('div').next( '.image-preview' ).html( '<div class="image"><img src="'+image_url+'" alt="'+image_name+'"/></div>' );
            } );
    });

    $('.upload-video-btn').on('click',function(e) {
        const $this = $( this );
        e.preventDefault();

        const video = wp.media( {
            title: 'Upload Video',
            library: {
                type: [ 'video' ]
            },
            multiple: false
        } ).open()
            .on( 'select', function ( e ) {
                const uploaded_video = video.state().get( 'selection' ).first();
                const video_url = uploaded_video.toJSON().url;

                $this.prev( 'input' ).val( video_url );
                $this.parent('div').next( '.image-preview' ).html( '<video controls><source src="'+video_url+'" type="video/mp4"></video>' );
            } );
    });

    // gallery upload
    $('.upload-gallery-btn').on('click',function(e) {
        const $this = $( this );
        e.preventDefault();

        const image = wp.media( {
            title: 'Select images',
            library: {
                type: [ 'video', 'image' ]
            },
            multiple: true
        } ).open()
            .on( 'select', function ( e ) {

                const imageUrls = [];
                const imageNames = [];

                image.state().get( 'selection' ).map(
                    function ( attachment ) {
                        attachment.toJSON();
                        imageUrls.push(attachment.attributes.url);
                        imageNames.push(attachment.attributes.name);
                    } );

                const $inputWrapper = $this.prev( '.inputs-wrapper' );
                const $target = $inputWrapper.data('target');
                const $placeholder = $('#'+$target+'_copy');
                const imagesUrls = [];
                $inputWrapper.html('');

                imageUrls.map((imageUrl) => {
                    $inputWrapper.append('<input name="'+$target+'[]" type="hidden" value="'+imageUrl+'">');
                    imagesUrls.push(imageUrl);
                });

                let preview = '';

                if(imageUrls.length > 0){
                    $this.next('button').removeClass('hidden');
                }

                imageUrls.map((imageUrl, index)=> {
                    preview += '<div class="image"><img src="'+imageUrl+'" alt="'+imageNames[index]+'"/></div>';
                });

                $this.parent('div').next( '.image-preview' ).html( preview );
                $placeholder.val(imagesUrls.join(','));
            } );
    });

    // coremirror
    if($('textarea.code').length ){
        const wpEditor = wp.codeEditor.initialize($('textarea.code'), {
            indentUnit: 2,
            tabSize: 2,
            mode: 'text/html',
            autoRefresh: true,
        });
        $(document).on('keyup', '.CodeMirror-code', function(){
            $('textarea.code').html(wpEditor.codemirror.getValue());
            $('textarea.code').trigger('change');
        });
    }

    // toggle input
    $('.wppd-ui-toggle').on( 'change', function () {
        const valId = $(this).attr('id');
        $('#'+valId).val(($(this).is(':checked')) ? 1 : 0 );
    });

    // currency selector
    $(".currency-selector").on("change", function () {

        const selected = $(this).find( "option:selected" );
        const amount = $(this).parent('div').prev();
        const symbol = amount.prev();

        symbol.text(selected.data("symbol"));
        amount.prop("placeholder", selected.data("placeholder"));
    });

    // select2
    function format(state) {

        if(!state.id || !state.text.includes("<-------->")){
            return state.text;
        }

        let explode = state.text.split("<-------->");

        return "<span class='acpt-badge'>"+explode[0]+"</span>" + explode[1];
    }

    $('.select2').select2({
        placeholder: "--Select--",
        allowClear: true,
        formatResult: format,
        formatSelection: format,
        escapeMarkup: function(m) { return m; }
    });

    // color picker
    $('.color-picker').wpColorPicker();
});