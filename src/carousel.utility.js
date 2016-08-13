(function(exports){

	exports.DIRECTIONS = {
		left: 'left',
		right: 'right',
		up: 'up',
		down: 'down'
	}	

	/**
	 *
	 * @param {array} [options.animations] - array of animations between containers. contains: 'direction' & 'speed'
	 * @param {number} [options.numberOfContainers] - number of containers. will init default animations for containers
	 */
	exports.Carousel = function(options){
		var BLOCKS = [];
		options = options || {};

		prepareAnimations(options.animations, options.numberOfContainers);

		function prepareAnimations(animations, numberOfContainers){
			if(animations){
				processAnimations(animations);
			} else {
				var arr = [];
				for(var i = 0; i < number; ++i){
					arr.push({});
				}
				processAnimations(arr);
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
	};

})(window);