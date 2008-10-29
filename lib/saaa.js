var saaa = 
{
	main_win: null,
	notify_win: null,
	//initialize the main ui
	init_main_win: function()
	{
		saaa.main_win = new air_win(null, "main", $("#layout"));
		win = saaa.main_win;
		win.stateless = false;
		win.buttons.close = $("#close-btn");
		win.buttons.maximize = $("#max-btn");			
		win.buttons.minimize = $("#min-btn");;
		win.buttons.restore = $("#restore-btn");;
		win.buttons.always_on_top = $("#always-top-btn");;
		win.buttons.disable_always_on_top = $("#disable-always-top-btn");;
		win.buttons.resize = $("#resize-btn");;
		win.buttons.change_theme = $(".change-theme-btn");;
		win.buttons.move = $(".movable");

		
		//install tray service
		var tray_setting = new air_win_tray(null, {icon_16: "icons/icon16.png", icon_128:"icons/icon128.png"});
		tray_setting.add_menu_item("显示主窗口",  function(event){
			if(nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED){
				win.on_restore();
			}			
			win.win_handle.visible = true;
			win.win_handle.activate();				
			win.win_handle.orderToFront();			
		});
		tray_setting.add_menu_item("退出",  function(aw, event){
			air.NativeApplication.nativeApplication.icon.bitmaps = []; 
			air.NativeApplication.nativeApplication.exit(); 			
		});			
		
		win.install_tray(tray_setting);
		win.buttons.tray = $("#tray-btn");

		win.add_event_listener("close",  function(){air.trace("exit, bye.");air.NativeApplication.nativeApplication.exit();});
		$("#header a").mousedown(function(){return false;});
		win.init();		
		win.show();
		
	},
	
	versionCheckURL: "http://saaa.googlecode.com/files/versioning.xml",
	filename: "saaa.air", // nn.air
	updateURL: "http://saaa.googlecode.com/files/versioning.xml",
	//update
	update: function()
	{
		var updater = new saaa_updater(saaa.versionCheckURL, saaa.filename, saaa.updateURL);
		updater.errorHandler = function(e, msg)
		{
			air.trace(e + "(" + msg + ")");
		}
		updater.updateOkHandler = function(){air.trace("update ok");};
    	updater.updateCompleteHanlder = function(){air.trace("update complete");};
		updater.updateProcessHandler = function(percent){air.trace("update:" + percent);};
		updater.needUpdateOrNotHandler = function(needUpdate)
		{
			if (needUpdate) {
				updater.update();
			}else
			{
				air.trace('no update.');				
			}
		}
		air.trace('checking for newer version...')
		updater.check();
	},
	
	init_notify_win: function(parent_win)
	{

		saaa.notify_win = new air_win(parent_win, "notify", $("#layout"));
		win = saaa.notify_win;
		win.buttons.close = $("#close-btn");
		win.init();	
		win.show(function(layout){
// layout.show("drop", { direction: "down" }, 1000);
// layout.show("slide", { direction: "down" }, 1000);
//layout.myslide( {'container': $("body"), queue:false, direction: 'top', 'easing': "linear", 'duration': '200'});//,  'callback': function(){ $(this).effect("bounce", {  times: 3,direction: 'right' }, 300 ) } });						
layout.slideDown(function(){$(this).fadeIn('slow');});

		});		
		
	},	
}