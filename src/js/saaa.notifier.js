var saaa_notifier = function(parent,  height, width, margin, keeptime, nextshowdelay){
	this.height = height;
	this.width = width;
	this.margin = margin;
	this.parent_win = parent;
	this.html_loader = null;
	this.message_list = [];
	this.close_handle = null;
	this.init_handle = null;
	this.keeptime = keeptime;
	this.opened = false;
	this.opening = false;
	
	this.nextshowdelay = nextshowdelay;
	if (this.nextshowdelay == null)this.nextshowdelay = 0;
	
	
	
};

saaa_notifier.prototype.delay = function()
{
	if (this.nextshowdelay == 0)return;
	if (!this.delaying)
	{
		this.delaying = true;
		var self = this;
		var openfunc = function(){
			self.delaying = false;
			if (self.message_list.length > 0)self.open(function(html_loader){html_loader.window.notify();});
		}
		$(this).delay(this.nextshowdelay, openfunc);		
	}
	
};

saaa_notifier.prototype.notify = function(title, message){
		this.message_list.push({title: title, message: message});
		if (this.delaying) return;
		if (!this.opened && !this.opening)
		{
			this.open(function(html_loader){html_loader.window.notify();});
		}else if(this.opened)
		{
			this.html_loader.window.notify();
		}
		//air.trace("notifybox opened:" + this.opened + " opening" + this.opening);
};
saaa_notifier.prototype.close = function()
{
	this.opened = false;
	this.message_list.length = 0;
	this.opening = false;
};
saaa_notifier.prototype.open = function(callback) {
		this.opening = true;
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
			self.opened = true;
			callback(self.html_loader);			
		});

		var req = new air.URLRequest("notifybox.html"); 
		this.html_loader.load(req); 
		
};