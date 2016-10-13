$( document ).ready(function() {
	if( $('.refresh-bg').length > 0 ){
		var refresh_counter = 0;
		var bg = $('.refresh-bg').data('cam');
		var refresh_bg_interval = setInterval( function(){ refresh_bg() }, 1000 );
	}

	if( $('.refresh-interlace').length > 0 ){
		var refresh_interlace_counter = 0;
		var bg = $('.refresh-interlace').data('cam');
		var refresh_interlace_interval = setInterval( function(){ refresh_interlace() }, 1000 );
	}

	function refresh_bg(){
		$('#cam').imagesLoaded( function() {
			$('.refresh-bg').css('background-image', 'url(' + new_bg + ')' );
			refresh_counter = refresh_counter + 1;
		});
		var new_bg = bg + 'timed=' +refresh_counter;
		$('#nextframe').attr('src', new_bg );
	};

	function refresh_interlace(){
		if( $('#frame-even').is(':visible') ){
			var evenodd = 'even';
			var evenoddnew = 'odd';
		}
		if( $('#frame-odd').is(':visible') ){
			var evenodd = 'odd';
			var evenoddnew = 'even';
		}
		evenodd = evenodd || 'even';
		evenoddnew = evenoddnew || 'odd';

		var new_bg = bg + 'timed=' +refresh_interlace_counter;
		$('#frame-'+ evenoddnew ).attr( 'src', new_bg );
		$('#cam').imagesLoaded( function() {
			$('#frame-'+ evenoddnew ).show();
			$('#frame-'+ evenodd ).fadeOut('100');
			refresh_interlace_counter = refresh_interlace_counter + 1;
		});
	}
});