(function(exports){

	var ANIMATION_TIME = 1000;
	var FRAMES = ANIMATION_TIME / 50;

	/**
	 *
	 * @param {string} selector - selector for dom elements(only container required)
	 * @param {array} [options.animations] - array of animations between containers. contains: 'direction' & 'speed'
	 * @param {number} [options.numberOfContainers] - number of containers. will init default animations for containers
	 */
	exports.CarouselInit = function(seletor, options){
		removeScroll();

		var mainContainer = new Element(seletor);
		new Carousel(mainContainer, options);
	}

	var Carousel = function(element, options){
		if (window.addEventListener) {
			// IE9, Chrome, Safari, Opera
			window.addEventListener("mousewheel", MouseWheelHandler, false);
			// Firefox
			window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		} else {
			// IE 6/7/8
			window.attachEvent("onmousewheel", MouseWheelHandler);
		}
		
		var oldElem = new Element('.carousel-container[data-container="0"]');
		var newElem = new Element('.carousel-container[data-container="1"]');
		
		var animationInProcess = false;
		var previousPosition = 0;		
		
		function MouseWheelHandler(e) {
			if(!animationInProcess){
				animationInProcess = true;
				var delta = e.deltaY || e.detail || e.wheelDelta;
				if(delta + previousPosition > previousPosition){
					right(oldElem, newElem, 1366, ANIMATION_TIME, function(){
						animationInProcess = false;
						var temp = oldElem;
						oldElem = newElem;
						newElem = temp;
					});
				} else {
					left(oldElem, newElem, 1366, ANIMATION_TIME, function(){
						animationInProcess = false;
						var temp = oldElem;
						oldElem = newElem;
						newElem = temp;
					});
				}
				previousPosition += delta;
			}
		}

		function right(oldElem, newElem, width, time, callback){
			newElem.show().css('left', (-width) + 'px'); 
			oldElem.show().css('left', '0px');
			
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);

				var oldElemPosition = result*width;
				var newElemPosition = oldElemPosition - width;
				
				newElem.css('left', newElemPosition + 'px');
				oldElem.css('left', oldElemPosition + 'px');
				
				if(result > 0.99){
					newElem.css('left', '0px');
					oldElem.css('left', width + 'px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}

		function left(oldElem, newElem, width, time, callback){
			newElem.show();//.css('left', (width) + 'px'); 
			oldElem.show();//.css('left', '0px');
			
			var start = new Date().getTime();
			
			var timer = setInterval(function(){
				// difference in time from last call in percents
				var diff = (new Date().getTime() - start) / time;

				// calculate position in persents based on time difference
				var result = defaultEasing(diff);
				
				var oldElemPosition = -width*result;
				var newElemPosition = oldElemPosition + width;
				newElem.css('left', oldElemPosition + 'px');
				oldElem.css('left', newElemPosition + 'px');
				
				if(result > 0.99){
					oldElem.css('left', '0px');
					newElem.css('left', width + 'px');
					clearInterval(timer);
					callback();
				}
			}, FRAMES);
		}
	};

	function defaultEasing(value){
		return 1 - Math.cos(value);
	}

	var Element = function(selector){
		var elements;
		if(selector.constructor === String){
			elements = document.querySelectorAll(selector);
		} else if(selector.constructor === Array){
			elements = selector;
		}

		return {
			css: function(prop, value){
				if(value){
					elements.forEach(function(elem){
						elem.style[prop] = value;
					});
					return this;
				} else {
					return elements[0] ? elements[0].style[prop] : null;
				}
			},
			find: function(selector){
				var childrens = [];
				this.each(function(element, index){
					var currentElementChildrens = element.querySelectorAll(selector);
					currentElementChildrens.forEach(function(e){
						childrens.push(e);
					});
				});
				return new Element(childrens);
			},
			/**
			 *
			 * @param {function} callback - function for each element in DOM elements of object
			 */
			each: function(callback){
				callback = callback || function(){};
				elements.forEach(callback);
			},
			size: function(){
				return elements.length;
			},
			show: function(){
				this.each(function(element){
					element.style.display = 'block';
				});
				return this;
			}
		}
	}

	function removeScroll(){
		document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    	document.body.scroll = "no"; // ie only
	}

})(window);