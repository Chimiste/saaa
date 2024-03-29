var saaa = 
{
	main_win: null,
	notify_win: null,
	main_sandbox: null,	
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
		
		$("#menu li").hide();
		win.show();
		
		saaa.notify_win =  new saaa_notifier(saaa.main_win,150, 200, 1, 10000, 5000);
	},
	
	start: function()
	{
		$(".update").hide();
		$("#menu li").show();

		$("#start").inner_slide("#content", 'left', {duration: 'normal'}, null);
	},
	processing: function(func)
	{
		this.spinner_show();
		var self = this;
		var complete = function(){self.spinner_hide();};		
		func(complete);
	},
	spinner_hide: function(){$("#spinner").hide();},
	spinner_show: function(){$("#spinner").show();},	
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
	update: function(completed_callback)
	{
		var updater = new saaa_updater(saaa.version_check_url, saaa.filename);
		updater.error_handle = function(e, msg)
		{
			saaa.spinner_hide();
			$("#updating").hide();
			$("#updating-error-msg").text(msg + ":" + e);
			$("#updating-error").inner_slide("#content", 'left', {duration: 'normal'}, function(){
				$("#update-link-error").click(function(){saaa.spinner_hide();$("#updating-error").hide();saaa.start();return false;});
			});	
		}
		updater.update_ok_handle = function(){$("#updating").hide();$("#update-completed").inner_slide("#content", 'left', {duration: 'normal'}, function(){$("#update-completed").hide();saaa.spinner_hide();saaa.start();});};
    	updater.update_complete_hanlde = function(){};
		updater.update_process_handle = function(percent){ 	$("#update-percent").text(percent);	};
		updater.need_update_or_not_handle = function(needUpdate)
		{			
			$("#update-checking").hide();
			if (needUpdate) {
				$("#update-newer-version").text(updater.lastest_version_info.version);
				$("#update-newer-releasenotes").text(updater.lastest_version_info.releasenotes);
				$("#update-ornot").inner_slide("#content", 'left', {duration: 'normal'}, function(){
						saaa.spinner_hide();
						$("#update-link-confirm").click(function(){
								saaa.spinner_show();$("#update-ornot").hide();$("#updating").inner_slide("#content", 'left', {duration: 'normal'}, function(){	saaa.spinner_show();updater.update();});								
							}
						);
						$("#update-link-ignore").click(function(){$("#update-ornot").hide();saaa.spinner_hide();saaa.start();return false;});						
				});							
			}
			else
			{
				$("#update-no-newer-version").inner_slide("#content", 'left', {duration: 'normal'}, function(){$("#update-no-newer-version").fadeOut("slow", function(){	saaa.spinner_hide();saaa.start();});});	
				
			}
		}
		saaa.spinner_show();	
		$("#update-checking").inner_slide("#content", 'left', {duration: 'normal'}, function(){
				saaa.spinner_hide();updater.check();			
		});

	}	
};

var parent_bridge = {
	add_win_event_listener: function(event, callback){
		saaa.main_win.add_event_listener(event, callback);
	},
	trace: function(msg){air.trace(msg)}
};


