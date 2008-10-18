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
	
	var MyUI = 
	{
		DATA_FILE : 'my-ui.txt',
		application_name : "",
		application_vertion : "",
		theme : 'default',
		is_maximize : false,
		update : null,
		os : "win-os",
		position : {},
		init : function() {
			if (air.NativeApplication.supportsSystemTrayIcon) {
				MyUI.os = "win-os";
			}else	if (air.NativeApplication.supportsDockIcon) {
				MyUI.os = "mac-os";
			}			
			MyUI.configureForOS();
			var xmlobject    = (new DOMParser()).parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml");
			MyUI.application_name = xmlobject.getElementsByTagName("name")[0].childNodes[0].data;
			MyUI.application_version = xmlobject.getElementsByTagName("version")[0].childNodes[0].data;
			var pos;
			try{ 
				pos = MyUI.file.read(MyUI.DATA_FILE);
			}catch(e)
			{
				//alert(e);
			}
			var w = window.nativeWindow;
			if(pos) {
				
				w.x = pos.x;
				w.y = pos.y;
				w.width = pos.width;
				w.height = pos.height;
				MyUI.position.x = pos.x;
				MyUI.position.y = pos.y;
				MyUI.position.width = pos.width;
				MyUI.position.height = pos.height;
				MyUI.is_maximize = pos.is_maximize;
				MyUI.theme = pos.theme;
				window.nativeWindow.alwaysInFront = pos.is_always_top;
			}
			
			MyUI.set_position();

			if (MyUI.is_maximize)
			{
				$("#restore-btn").show();
				$("#max-btn").hide();
				window.nativeWindow.maximize();				
			}else
			{
				$("#restore-btn").hide();
				$("#max-btn").show();			
			}
			if (window.nativeWindow.alwaysInFront)
			{//总是在最前面
				$("#disable-always-top-btn").show();
				$("#always-top-btn").hide();
			}else
			{
				$("#disable-always-top-btn").hide();
				$("#always-top-btn").show();
			}

			//切换主题	
			$(".change-theme").click(function(){
				MyUI.set_theme($(this).attr("theme"));
				return false;				
			});
			//最小化窗口
			$("#min-btn a").click(function() {
					window.nativeWindow.minimize();
					return false;
			});
			//最大化窗口
			$("#max-btn a").click(function() {
				//MyUI.set_position();		
				window.nativeWindow.maximize();	
				$("#max-btn").hide();
				$("#restore-btn").show();
				MyUI.is_maximize = true;
		
				MyUI.save_ui_data();			
				return false;				
			});
			//还原窗口
			$("#restore-btn a").click(function() {
				window.nativeWindow.restore();

				var w = window.nativeWindow;
				w.x = MyUI.position.x;
				w.y = MyUI.position.y;
				w.width = MyUI.position.width;
				w.height = MyUI.position.height;
				
					

				$("#restore-btn").hide();
				$("#max-btn").show();
				MyUI.is_maximize = false;
				
				//MyUI.set_position();				
				MyUI.save_ui_data();			
				return false;				
			});		
			//关闭窗口
			$("#close-btn a").click(function() {
				window.nativeWindow.close();				
				air.NativeApplication.nativeApplication.exit();
				return false;
				
			});	
			$("#resize-btn").mousedown(function(){
				$("body").one("mouseup",function(){
					MyUI.set_position();								
					MyUI.save_ui_data();
				});						
				window.nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);		
				return false;
			});
			$("#header *").mousedown(function(){return false;});
			//移动窗口
			$("#header").mousedown(function(){
					$("body").one("mouseup",function(e){
						air.trace("move");
						MyUI.set_position();
						MyUI.save_ui_data();
					});				
				window.nativeWindow.startMove();		
				return false;				
			});		
			$("#always-top-btn").click(function(){
				window.nativeWindow.alwaysInFront = true;
				$("#always-top-btn").hide();
				$("#disable-always-top-btn").show();				
				MyUI.save_ui_data();				
				return false;				
			});
			$("#disable-always-top-btn").click(function(){
				window.nativeWindow.alwaysInFront = false;	
				$("#always-top-btn").show();
				$("#disable-always-top-btn").hide();
				MyUI.save_ui_data();	
				return false;
			});
			//最小化到托盘
			$("#tray-btn").click(function(){
			    window.nativeWindow.visible = false;
				return false;				

			});		
			add_tips_for_ctrl_btn(".toolbar li a");



			install_tray();
			
			MyUI.set_theme(MyUI.theme);			
		},
		configureForOS: function(){
			switch (MyUI.os) {
				case "mac-os":
					$('tray-btn').hide();
					break;
				case "win-os":
					
					break;
			}
		},		
		save_ui_data : function()
		{
			var w = window.nativeWindow;
			var p = MyUI.position;
			MyUI.file.write(MyUI.DATA_FILE,{x:p.x, y: p.y, width: p.width, height: p.height, is_maximize: MyUI.is_maximize, is_always_top: w.alwaysInFront, theme: MyUI.theme});				
		},	
		set_position : function()
		{
			var w = window.nativeWindow;
			MyUI.position.x =w.x;
			MyUI.position.y = w.y;
			MyUI.position.width = w.width;
			MyUI.position.height = w.height;	
				air.trace("x:" + MyUI.position.x);
				air.trace("y:" + MyUI.position.y);			
		},
		set_theme :function(theme)
		{
			MyUI.theme = theme;
			//$("#layout").hide();
			$("#layout").attr("class", theme + "-theme");
			$("#layout").fadeIn();
			
		},
		file : {
			write : function(fname,obj) {
				if(!air) return;
				var file = new air.FileStream();  
				file.open( new air.File( 'app-storage:/' + fname ), air.FileMode.WRITE );  
				file.writeObject(obj);  
				file.close();  				
			},
			read : function(fname) {
				if(!air) return "";
				var file = new air.FileStream();  
				file.open( new air.File( 'app-storage:/' + fname ), air.FileMode.READ );  
				var obj = file.readObject();  
				file.close();
				return obj;
			}
		}	
	}

function add_tips_for_ctrl_btn(div_target, tip_div)
{
	$(div_target).each(function(){
	$(this).mytips({tip_div: $("#btn-tooltip"), text: $(this).attr("title")});
	});	
}
//增加托盘支持
function install_tray()
{
				 var iconLoadComplete = function(event) 
					{ 
						air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData); 
					} 
     
					air.NativeApplication.nativeApplication.autoExit = false; 
					var iconLoad = new air.Loader(); 
					var iconMenu = new air.NativeMenu(); 

					var restoreCommand = iconMenu.addItem(new air.NativeMenuItem("显示主窗口")); 
					restoreCommand.addEventListener(air.Event.SELECT,function(event){ 
						if(nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED){
							nativeWindow.restore();
						}			
						nativeWindow.visible = true;
						nativeWindow.activate();
						
						nativeWindow.orderToFront();
					}); 
					var exitCommand = iconMenu.addItem(new air.NativeMenuItem("退出")); 
					exitCommand.addEventListener(air.Event.SELECT,function(event){ 
							air.NativeApplication.nativeApplication.icon.bitmaps = []; 
							air.NativeApplication.nativeApplication.exit(); 
					}); 

				if (MyUI.os == "win-os") { 
					air.NativeApplication.nativeApplication.autoExit = false; 
					iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
					iconLoad.load(new air.URLRequest("icons/icon16.png")); 
					air.NativeApplication.nativeApplication.icon.tooltip = MyUI.application_name + " " + MyUI.application_version;
					air.NativeApplication.nativeApplication.icon.menu = iconMenu; 

				} 			 
				if (MyUI.os == "mac-os") {
					iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
					iconLoad.load(new air.URLRequest("icons/icon128.png")); 
					air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
				} 
}
