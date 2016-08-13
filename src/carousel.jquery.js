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
		
		var carousel = new Carousel(options);

		main_container.find('.carousel-circle').click(function(){
			var container = $(this).data('bind');
			$('.carousel-container').removeClass('carousel-active');

			var elem = $('[data-container='+container+']');//.addClass('carousel-active');
			$('.carousel-circle').removeClass('carousel-active-circle');
			$('.carousel-circle[data-bind='+container+']').addClass('carousel-active-circle');
			var width = $(window).width();

			left(elem, width, 1000);
		});

		function left(elem, width, time){
			elem.show().css('left', (width) + 'px'); 
			var start = new Date().getTime();
			var timer = setInterval(function(){
				var diff = (new Date().getTime() - start) / time;
				console.log(diff);
				var result = defaultEasing(diff);
				console.log(result);
				elem.css('left', (width - result*width) + 'px');
				if(result > 0.98){
					elem.css('left', '0px');
					clearInterval(timer);
				}
			}, time / 20);
		}

		function right(elem, width, time){
			elem.show().css('left', (-width) + 'px'); 
			var start = new Date().getTime();
			var timer = setInterval(function(){
				var diff = (new Date().getTime() - start) / time;
				console.log(diff);
				var result = defaultEasing(diff);
				console.log(result);
				elem.css('left', (result*width - width) + 'px');
				if(result > 0.99){
					elem.css('left', '0px');
					clearInterval(timer);
				}
			}, time / 20);
		}

		function defaultEasing(value){
			return Math.sin(value);
		}

	};

})(jQuery.fn);