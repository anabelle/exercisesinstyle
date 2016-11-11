$( document ).ready(function() {

	var camara_activa = null;
	var camara_loaded = null;
	var camaras = [];
	var clear_loader = null;
	var refresh_interlace_counter = 0;
	var refresh_interlace_interval = null;
	var refreshing = false;
	var zoom_level = 1;

	if( $('.refresh-bg').length > 0 ){
		var refresh_counter = 0;
		var bg = $('.refresh-bg').data('cam');
		var refresh_bg_interval = setInterval( function(){ refresh_bg() }, 1000 );
	}

	if( $('.refresh-interlace').length > 0 ){
		var refreshing = false;
		var refresh_interlace_counter = 0;
		var bg = $('.refresh-interlace').data('cam');
		var refresh_interlace_interval = setInterval( function(){ refresh_interlace() }, 1000 );
		objectFitImages('.frame');
	}

	// Bind arrow keys
	$(window).keydown(function (e) {
		var key = e.which;
		if(key == 13 || key == 39) { // the enter key code or right arrow
			switch_camera( 'next' );
			return false;  
		} else if(key == 37) { // left arrow
			switch_camera( 'prev' );
			return false;  
		} else if(key == 38) { // left arrow
			change_zoom('plus');
			return false;  
		} else if(key == 40) { // left arrow
			change_zoom('minus');
			return false;  
		}
	});

	// Bind Click
	$('#screen').on( 'click', function(){
		switch_camera( 'next' );
	});

	function refresh_bg(){
		$('#cam').imagesLoaded( function() {
			$('.refresh-bg').css('background-image', 'url(' + new_bg + ')' );
			refresh_counter = refresh_counter + 1;
		});
		var new_bg = bg + 'timed=' +refresh_counter;
		$('#nextframe').attr('src', new_bg );
	};

	function refresh_interlace(){
		if( refreshing == false ){	
			refreshing = true;
			if( $('#frame-even').hasClass('active') ){
				var evenodd = 'even';
				var evenoddnew = 'odd';
			}
			if( $('#frame-odd').hasClass('active') ){
				var evenodd = 'odd';
				var evenoddnew = 'even';
			}

			var new_bg = bg + 'timed=' + refresh_interlace_counter;
			// $('.refresh-interlace').css('background-image', 'url(' + bg + ')' );
			$('#frame-'+ evenoddnew ).attr( 'src', new_bg ).load( function() {
				$('#frame-'+ evenoddnew ).addClass('active');
				$('#frame-'+ evenodd ).removeClass('active');
				refresh_interlace_counter = refresh_interlace_counter + 1;
				refreshing = false;
			});
		}
	}

	function init_movie(){
		console.log( 'Initializing movie...' );
		get_cameras( load_camera , 0 );
	}

	function get_cameras( callback, which ){
		console.log('Getting cameras...')
		$.ajax({
			dataType: 'json',
			url: '/camaras.json',
			success: function( data ){
				camaras = data;
				console.log( 'Got cameras: ', camaras );
				callback( which );
			}
		});
	}

	function preload_camera( which ){
		var next_cam = camaras[ which ];
		console.log('Preloading camera: ', which );
		$('#preloader').addClass('loading');

		if( next_cam.type == 'image' ){
			var next_cam_url = next_cam.url + '?timed=' + refresh_interlace_counter;
		}

		if( next_cam.type == 'mjpg' ){
			var next_cam_url = next_cam.url;
		}

		if( next_cam.type == 'surfline' ){
			$('#preloader').removeClass('loading');
			console.log('Preloader cleared.');
			return load_camera( which );
		}
		
		$('#preloader_img').attr('src', next_cam_url ).load( function() { 
			console.log('Next camara reported done loading');
			load_camera( which );
			clear_loader = setTimeout( function(){ 
				$('#preloader_img').attr('src', '' );
				$('#preloader').removeClass('loading');
				console.log('Preloader cleared.');
			}, 100 );
		});
	}

	function load_camera( which ){
		if( clear_loader != null ){
			clearTimeout( clear_loader );
			clear_loader = null;
		}
		reset_screen();
		console.log('Loading camera: ', which );
		camara_activa = which;
		camara_loaded = camaras[ which ];
		console.log('Loaded camera: ', camara_loaded );
		if( camara_loaded.isZoomed == true ){
			set_zoom(1.25);
		}else{
			set_zoom(1);			
		}
		console.log('Playing camera of type: ', camara_loaded.type );
		play_camera( camara_loaded.type );
	}

	function play_camera( type ){
		if( type === 'image' ){

			if( refresh_interlace_interval == null ){
				console.log('Setting up refresh interval.')
				refresh_interlace_interval = setInterval( function(){ play_camera('image') }, 33 );
			}

			bg = camara_loaded.url;
			if( refreshing == false ){	

				if( !$('#frame-even').hasClass('active') && !$('#frame-odd').hasClass('active') ){
					console.log('No hay frame activo, iniciando...');
					$('#frame-even').addClass('active');
					var evenodd = 'even';
					var evenoddnew = 'odd';
				}

				refreshing = true;
				if( $('#frame-even').hasClass('active') ){
					var evenodd = 'even';
					var evenoddnew = 'odd';
				}
				if( $('#frame-odd').hasClass('active') ){
					var evenodd = 'odd';
					var evenoddnew = 'even';
				}

				var new_bg = bg + '?timed=' + refresh_interlace_counter;
				// $('.refresh-interlace').css('background-image', 'url(' + bg + ')' );
				$('#frame-'+ evenoddnew ).attr( 'src', new_bg ).load( function() {
					$('#frame-'+ evenoddnew ).addClass('active');
					$('#frame-'+ evenodd ).removeClass('active');
					objectFitImages('.frame');

					refresh_interlace_counter = refresh_interlace_counter + 1;
					refreshing = false;
				});
			}
		}else if( type === 'mjpg' ){
			console.log('Playing camera of type mjpg: ', camara_loaded );
			$('#frame-mjpg').addClass('active').attr('src', camara_loaded.url );

		}else if( type === 'surfline' ){
			console.log('Playing camera of type surfline: ', camara_loaded );
			if(Hls.isSupported()) {
				console.log('hello hls.js!');
				$('#frame-surfline').addClass('active');
				var video = document.getElementById('frame-surfline');
				var hls = new Hls();
				hls.loadSource('http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8');
				hls.attachMedia(video);
				hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        			console.log('video and hls.js are now bound together !');
					hls.on(Hls.Events.MANIFEST_PARSED,function() {
						console.log('manifest loaded, found ' + data.levels.length + ' quality level');
						video.play();
					});
				});
			}
		}else{
			console.log('Camera type not recognized: ', type )
		}
	}

	function reset_screen(){
		console.log('Resetting screen...')
		$('.frame').attr('src', '').removeClass('active');
		$('.cam').data( 'cam', 'null');
		if( refresh_interlace_interval != null ){		
			console.log('Clearing refresh interval.')
			clearInterval( refresh_interlace_interval );
		}
		refresh_interlace_interval = null;
		refreshing = false;
	}

	function set_zoom( level ){
		zoom_level = level;
		$('.frame').css('transform', 'scale('+ zoom_level +')');
		console.log('Changed zoom level to: ', zoom_level );
	}

	function change_zoom( plusminus ){
		if( plusminus == 'plus' ){
			zoom_level = Math.round(( zoom_level + 0.1) * 1e12) / 1e12;
		}

		if( plusminus == 'minus' ){
			zoom_level = Math.round(( zoom_level - 0.1) * 1e12) / 1e12;
		}

		if( zoom_level <  1 ){
			zoom_level = 1;
		}

		set_zoom( zoom_level );
	}

	function switch_camera( prevnext ){
		var cantidad_camaras = camaras.length - 1;
		var swith_to = null;

		if( prevnext === 'next' ){
			swith_to = camara_activa+1;
			if( swith_to > cantidad_camaras ){
				console.log('Se llegó al final de la lista de camaras.')
				swith_to = 0;
			}
			console.log('Loading next camera...', swith_to );
			preload_camera( swith_to );
		}

		if ( prevnext === 'prev' ){
			swith_to = camara_activa-1;
			if( swith_to < 0 ){
				console.log('Se llegó al inicio de la lista de camaras.')
				swith_to = cantidad_camaras;
			}
			console.log('Loading previous camera...', swith_to );
			preload_camera( swith_to );
		}
	}

	init_movie();
});