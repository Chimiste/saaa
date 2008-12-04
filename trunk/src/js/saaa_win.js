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
		win.buttons.minimize = $("#min-btn");
		win.buttons.restore = $("#restore-btn");
		win.buttons.always_on_top = $("#always-top-btn");
		win.buttons.disable_always_on_top = $("#disable-always-top-btn");
		win.buttons.resize = $("#resize-btn");;
		win.buttons.change_theme = $(".change-theme-btn");
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
		
		saaa.notify_win =  new saaa_notifier(saaa.main_win,150, 200, 1, 10000, 0);
		
		
	},
	
	start: function()
	{
		$(".update").hide();

		$("#start").inner_slide("#content", 'left', {duration: 'normal'}, null);


	},
	get_base_httpclient: function(url, completed, error)
	{
		return new httpclient(url, {
			headers:[				 
					 ["User-Agent",	"Mozilla/5.0 AppleWebKit/523+ (KHTML, like Gecko) MyApp/1.1"],
					 ["Accept-Encoding",	"text/html"]

					 ],
			completed: completed,
			before_send: null,
			error: error
		});
	},
	version_check_url: "http://dorame.zduo.net/lastest/versioning.xml",
	filename: "saaa.air", // nn.air
	//update
	update: function()
	{
		var updater = new saaa_updater(saaa.version_check_url, saaa.filename);
		updater.error_handle = function(e, msg)
		{
			$("#updating").hide();
			$("#updating-error-msg").text(msg + ":" + e);
			$("#updating-error").inner_slide("#content", 'left', {duration: 'normal'}, function(){
						$("#update-link-error").click(function(){$("#updating-error").hide();saaa.start();return false;});
			});	
		}
		updater.update_ok_handle = function(){$("#status-icon").hide();$("#updating").hide();$("#update-completed").inner_slide("#content", 'left', {duration: 'normal'}, function(){$("#update-completed").hide();saaa.start();});};
    	updater.update_complete_hanlde = function(){};
		updater.update_process_handle = function(percent){ 	$("#update-percent").text(percent);	};
		updater.need_update_or_not_handle = function(needUpdate)
		{
			$("#status-icon").hide();			
			$("#update-checking").hide();
			if (needUpdate) {
				$("#update-newer-version").text(updater.lastest_version_info.version);
				$("#update-newer-releasenotes").text(updater.lastest_version_info.releasenotes);
				$("#update-ornot").inner_slide("#content", 'left', {duration: 'normal'}, function(){
						$("#update-link-confirm").click(function(){
								$("#update-ornot").hide();$("#updating").inner_slide("#content", 'left', {duration: 'normal'}, function(){$("#status-icon").fadeIn();	updater.update();});								
							}
						);
						$("#update-link-ignore").click(function(){$("#update-ornot").hide();saaa.start();return false;});						
				});							
			}
			else
			{
				$("#update-no-newer-version").inner_slide("#content", 'left', {duration: 'normal'}, function(){$("#update-no-newer-version").fadeOut("slow", function(){	saaa.start();});});	
				
			}
		}
		$("#status-icon").fadeIn();		
		$("#update-checking").inner_slide("#content", 'left', {duration: 'normal'}, function(){
				updater.check();			
		});

	}
}
