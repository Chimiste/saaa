var saaa_notify_manager = {
	notify_windows: new array_list(),
	notify: function(notify_win){
		saaa_notify_manager.notify_windows.add(notify_win);
		notify_win.show();
	}
};
var saaa_notify_message =  function(title, message, showtime)
{
	this.title = null;
	this.message = null;
	this.showtime = 30;
};

var saaa_notifier = function(parent, message, height, width, margin){
	this.height = height;
	this.width = width;
	this.margin = margin;
	this.parent_win = parent;
	this.html_loader = null;
	this.message = message;
	this.close_handle = null;
	this.init_handle = null;
};

saaa_notifier.prototype.add = function(message){};

saaa_notifier.prototype.show = function() {
		if (this.html_loader) return;		
		var visible_bounds = air.Screen.mainScreen.visibleBounds;
		var bounds = new air.Rectangle(
			visible_bounds.right - this.width - this.margin, /* left */ 
			visible_bounds.bottom -  ( this.height + this.margin + ((air.Capabilities.os.toLowerCase().indexOf("windows") != -1)? 0 : 40)), /* top */ 
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
		//this.html_loader.paintsDefaultBackground = false;

		var self = this;
		this.html_loader.addEventListener( air.Event.COMPLETE, function(event){
			self.html_loader.removeEventListener( air.Event.COMPLETE, arguments.callee );				
			self.html_loader.window.init(self.parent_win);

		});		
		//this.html_loader.window.proxy = this.proxy;
		//this.html_loader.window.opener = window;		
		var req = new air.URLRequest("notifybox.html"); 
		this.html_loader.load(req); 
		//this.html_loader.stage.nativeWindow.activate()
	/*	mynotifier.htmlLoader.loadString(
		   "<html>" +
				"<head><script src=\"lib/ui/mootools-beta-1.2b2.js\" type=\"text/javascript\" charset=\"utf-8\"></script>"+
				"<style> .notification {opacity:0;background:url(img/notification.png);width:280px;height:80px; padding:10px; margin-bottom:-20px;} </style>"+
				"<script> function fIn(name) { var e = new Fx.Tween($(name),'opacity', {duration:500});e.set(0);e.start(0.92); } "+
				" function fOut(name) { var e = new Fx.Tween($(name),'opacity', {duration:500});e.set(1);e.start(0); } "+
				"</script>"+
				"</head>" + 
				"<body><div id='list' style='width:300px;'>sss</div></body>"+ 
		   "</html>"
		);*/
		//mynotifier.htmlLoader.stage.nativeWindow.activate();
		//mynotifier.htmlLoader.addEventListener('click',mynotifier.onClick.bind(this));
};