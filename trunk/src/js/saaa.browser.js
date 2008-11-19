var saaa_browser = function(parent,  height, width){
	this.height = height;
	this.width = width;
	this.parent_win = parent;
	this.html_loader = null;
	this.close_handle = null;
	this.init_handle = null;
};

saaa_browser.prototype.ready = function(callback) {
		if (this.html_loader != undefined && this.html_loader != null) {callback(this.html_loader);return;}		
		
		var bounds = new air.Rectangle(
			0,
			0,
			this.width, /* width */ 
			this.height /* height */
		);
		var options = new air.NativeWindowInitOptions();
		options.transparent = true;
		options.type = air.NativeWindowType.LIGHTWEIGHT;
		
		options.systemChrome = air.NativeWindowSystemChrome.NONE;
		this.html_loader = air.HTMLLoader.createRootWindow( 
			true, //hidden 
			options, 
			false, //no scrollbars
			bounds
		); 

		var self = this;
		this.html_loader.addEventListener( air.Event.COMPLETE, function(event){
					air.trace("aaaaaaaaaaaa");
			self.html_loader.removeEventListener( air.Event.COMPLETE, arguments.callee );				
			self.html_loader.window.init(self.parent_win, self);
			self.html_loader.window.add_event_listener("close", function(){self.html_loader = null;});
			callback(self.html_loader);

		});

		var req = new air.URLRequest("browser.html"); 
		this.html_loader.load(req); 

};