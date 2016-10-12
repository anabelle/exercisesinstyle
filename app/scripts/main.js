$( document ).ready(function() {
	if( $('.refresh-bg').length > 0 ){
		var refresh_counter = 0;
		var bg = $('.refresh-bg').data('cam');
		var refresh_bg_interval = setInterval( function(){ refresh_bg() }, 1000 );
		console.log( 'interval set', bg );
	}

	function refresh_bg(){
		console.log('refreshing', refresh_counter);
		var new_bg = bg + 'timed=' +refresh_counter;
		$('#nextframe').attr('src', new_bg );
		$('#nextframe').on('load', function(){
			$('.refresh-bg').css('background-image', 'url(' + new_bg + ')' );
			refresh_counter = refresh_counter + 1;
		});
	}
});