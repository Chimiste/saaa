var saaa_notifier = function(parent,  height, width, margin, keeptime){
	this.height = height;
	this.width = width;
	this.margin = margin;
	this.parent_win = parent;
	this.html_loader = null;
	this.message_list = [];
	this.close_handle = null;
	this.init_handle = null;
	this.keeptime = keeptime;
};


saaa_notifier.prototype.notify = function(title, message){
	//this.load_win(function(html_loader){
		this.html_loader.window.add_message({title: title, message: message});
		//});
	
	};
	
saaa_notifier.prototype.ready = function(callback) {
	
		if (this.html_loader != undefined && this.html_loader != null) {callback(this.html_loader);return;}		
		var visible_bounds = air.Screen.mainScreen.visibleBounds;
		var bounds = new air.Rectangle(
			visible_bounds.right - this.width - this.margin, /* left */ 
			visible_bounds.bottom -  ( this.height + this.margin + ((air.Capabilities.os.toLowerCase().indexOf("windows") != -1)? 0 : 40)), /* top */ 
			this.width, /* width */ 
			this.height /* height */
		);
		//air.Introspector.Console.dump(bounds);
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
		//this.html_loader.paintsDefaultBackground = false;

		var self = this;
		this.html_loader.addEventListener( air.Event.COMPLETE, function(event){
			self.html_loader.removeEventListener( air.Event.COMPLETE, arguments.callee );				
			self.html_loader.window.init(self.parent_win, self);
			self.html_loader.window.add_event_listener("close", function(){self.html_loader = null;});
			callback(self.html_loader);

		});

		var req = new air.URLRequest("notifybox.html"); 
		this.html_loader.load(req); 

};