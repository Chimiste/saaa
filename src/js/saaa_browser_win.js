var saaa_browser_win = 
{
	main_win: null,
	browser: null,
	init_main_win: function(parent_win, browser)
	{
		saaa_browser_win.main_win = new air_win(parent_win, "main", $("#layout"));
		saaa_browser_win.browser = browser;
		win = saaa_browser_win.main_win;
		win.stateless = true;
		win.buttons.close = $("#close-btn");
		win.buttons.maximize = $("#max-btn");			
		win.buttons.minimize = $("#min-btn");
		win.buttons.restore = $("#restore-btn");
		win.buttons.resize = $("#resize-btn");;		
		//win.buttons.move = $(".movable");

		win.add_event_listener("close",  function(){air.trace("exit, bye.");air.NativeApplication.nativeApplication.exit();});
		$("#header a").mousedown(function(){return false;});
		win.init();		
		win.show();				
	},
	

}
