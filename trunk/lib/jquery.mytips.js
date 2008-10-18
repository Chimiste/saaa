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

	$.fn.mytips = function(options) {
		  var defaults = {
			tip_div: '',
			text: 'default tips'
		  };
		var opts = $.extend({}, defaults, options);
		return this.each(function() {
		  $this = $(this);
		  var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
		  $this.hover(
			  function () {
				o.tip_div.html(o.text);
				o.tip_div.fadeIn();
			  }, 
			  function () {
				o.tip_div.fadeOut();
				o.tip_div.html("");
			  }		  
		  );
		});
	};
})(jQuery);