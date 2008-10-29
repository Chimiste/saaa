/**

The MIT License

Copyright (c) 2008 Pickere Yee(pickerel@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

;(function($) { 

	$.fn.myslide = function(options) {
		  var defaults = {
			container: null,
			params: {},
			direction: "right", //right left top bottom
			duration: "normal", //"slow", "normal", or "fast"
			easing: "linear", //The name of the easing effect that you want to use (plugin required). There are two built-in values, "linear" and "swing".			
			callback: null
		  };
		var opts = $.extend({}, defaults, options);
		return this.each(function() {
				$this = $(this);
				var o = $.meta ? $.extend({}, opts, $this.data()) : opts;			
				$(this).hide();
				
				//$(this).hide("explode", { pieces: 25 }, 1000);

				$(this).css("top", "0px");
				$(this).css("left", "0px");	

				switch(o.direction)
				{
					case "right":
						$(this).css("right", 0 - o.container.width() + "px");
						o.params.left = "+=" + o.container.width();
						break;			
					case "left":
						$(this).css("left",  o.container.width() + "px");
						o.params.left = "-=" + o.container.width();
						break;
					case "bottom":
						$(this).css("top",  0 - o.container.height() + "px");
						o.params.top = "+=" + o.container.height();
						break;	
					default:
					case "top":
						$(this).css("top", o.container.height() + "px");
						o.params.top = "-=" + o.container.height() ;
						break;
				}
				$(this).show();
				
				$(this).animate(o.params, o.duration, o.easing, function(){if (o.callback)o.callback.call($(this)); });
		});
	};
})(jQuery);