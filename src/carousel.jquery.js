(function(exports){

	var BLOCKS = [];
	var DIRECTIONS = {
		left: 'left',
		right: 'right',
		up: 'up',
		down: 'down'
	}

	exports.carousel = function(options){
		var main_container = $(this);
		
		options = options || {};
		prepareAnimations(options.animations, main_container.find('.carousel-container').length);
		console.log(BLOCKS);

		main_container.find('.carousel-circle').click(function(){
			var container = $(this).data('bind');
			$('.carousel-container').removeClass('carousel-active');

			$('[data-container='+container+']').addClass('carousel-active');
			$('.carousel-circle').removeClass('carousel-active-circle');
			$('.carousel-circle[data-bind='+container+']').addClass('carousel-active-circle');
		});


	};

	function prepareAnimations(animations, numberOfContainers){
		if(animations){
			processAnimations(animations);
		} else {
			defaultAnimations(numberOfContainers);
		}
	}

	function processAnimations(animations){
		animations.forEach(function(anim){
			BLOCKS.push({
				direction: anim.direction ? DIRECTIONS[anim.direction.toLowerCase()] || DIRECTIONS.down : DIRECTIONS.down,
				speed: anim.speed || 'slow'
			});
		});
	}

	function defaultAnimations(number){
		var arr = [];
		for(var i = 0; i < number; ++i){
			arr.push({});
		}
		processAnimations(arr);
	}

	function error(messsage){
		throw new Error(messsage);
	}

})(jQuery.fn);