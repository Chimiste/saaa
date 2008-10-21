var notifier_message = new function()
{
	this.title = null;
	this.message = null;
	this.showtime = 30;
};

var mynotifier = 
{
	messages: new Array(),
	init: function()
	{
	},
	add: function(message)
	{
	},
	adjustWindow: function(){
		mynotifier.htmlLoader.stage.nativeWindow.height = this.messageList.length * this.messageHeight;	
	},
	showWindow: function() {
		if (mynotifier.htmlLoader) return;
		
		var visibleBounds = air.Screen.mainScreen.visibleBounds;
		air.trace(visibleBounds);
air.trace(visibleBounds.bottom );
		var bounds = new air.Rectangle(
			visibleBounds.right - mynotifier.width, //- this.margin, /* left */ 
			visibleBounds.bottom -  (mynotifier.margin + ((air.Capabilities.os.toLowerCase()=="windows")? 0 : 40)), /* top */ 
			mynotifier.width, /* width */ 
			mynotifier.height /* height */
		);
		air.trace(bounds);
		var options = new air.NativeWindowInitOptions();
		options.transparent = false;
		
		//transparent windows must have the systemChrome set to none
		options.systemChrome = air.NativeWindowSystemChrome.NONE;
		mynotifier.htmlLoader = air.HTMLLoader.createRootWindow( 
			true, //hidden 
			options, 
			false, //no scrollbars
			bounds
		); 
		mynotifier.htmlLoader.paintsDefaultBackground = false;
		var req = new air.URLRequest("notifybox.html"); 
		mynotifier.htmlLoader.load(req); 		
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
		mynotifier.htmlLoader.stage.nativeWindow.activate();
		//mynotifier.htmlLoader.addEventListener('click',mynotifier.onClick.bind(this));
	}
}
