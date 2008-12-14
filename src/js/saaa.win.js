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

var WIN_STAT_FILE =  'saaa-win.txt'; 

var air_win = function(parent_win, win_id, layout)
{
	this.win_handle = window.nativeWindow;
	this.win_id = win_id;
	this.layout = layout;
	this.parent_win = parent_win;
	
	var xmlobject    = (new DOMParser()).parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml");
	this.application_name = xmlobject.getElementsByTagName("name")[0].childNodes[0].data;
	this.application_version = xmlobject.getElementsByTagName("version")[0].childNodes[0].data;
	this.application_id = xmlobject.getElementsByTagName("id")[0].childNodes[0].data;
	if (this.parent_win != null)
		this.parent_win.add_child(this);
};



//win control buttons define
var air_win_buttons =  function()
{
	this.maximize = null;
	this.minimize = null;
	this.restore = null;
	this.always_on_top = null;
	this.disable_always_on_top = null;
	this.tray = null;
	this.resize = null;
	this.change_theme = null;
	this.move = null;
	this.parent_win = null;
};

var air_win_event_handles =  function()
{
	this.maximize = new array_list();
	this.minimize = new array_list();
	this.restore = new array_list();
	this.always_on_top = new array_list();
	this.disable_always_on_top = new array_list();
	this.tray = new array_list();
	this.resize = new array_list();
	this.resized = new array_list();	
	this.theme_change = new array_list();
	this.move = new array_list();
	this.moved = new array_list();	
	this.close = new array_list();
};


// win properties
air_win.prototype = {
	win_handle: null,
	win_id: null,
	stateless: false,
	theme: 'default',
	// the layout for the theme.
	layout: null,
	buttons: new air_win_buttons(),
	event_listeners: new air_win_event_handles(),
	application_name: null,
	application_version: null,
	application_id: null,
	_position: {x: null, y: null, height: null, width: null},//x,y,width,height	
	always_on_to: false,
};
air_win.prototype.debug = function(message)
{
	air.trace(this.win_id + ":" + message);
};
// get  file name to store the state data.
air_win.prototype.get_state_file = function()
{
	return this.win_id + "." + this.application_id + "." + WIN_STAT_FILE ;
};
// restore win state from the state file.
air_win.prototype.restore_state = function()
{
	if (this.stateless) return;	
	var state_data;
	try
	{ 
		state_data = saaa_util.file.read(this.get_state_file());
	}
	catch(e)
	{
		this.debug("read position data failed:" + e);
	}
	
	if(state_data) 
	{					
		this._position.x = state_data.x;
		this._position.y = state_data.y;
		this._position.width = this.win_handle.width;
		this._position.height = this.win_handle.height;
		if(state_data.is_maximize)this.on_maximize();	
		this.win_handle.alwaysInFront = state_data.is_always_top;		
		this.theme = state_data.theme;
		this.set_position(this._position);

	};	
};
air_win.prototype.is_maximize = function(){
	return this.win_handle.displayState == air.NativeWindowDisplayState.MAXIMIZED;
};
air_win.prototype.is_minimize = function(){
	return this.win_handle.displayState == air.NativeWindowDisplayState.MINIMIZED;
};
air_win.prototype.set_position = function(position)
{
	this.debug("set position " + position.x + " " + position.y);
	var w = this.win_handle;
	w.x = position.x;
	w.y = position.y;
	w.height = position.height;
	w.width = position.width;
	//this.update_position();	
};
air_win.prototype.update_position = function()
{
	var w = this.win_handle;
	this._position.x = w.x;
	this._position.y = w.y;
	this._position.width = w.width;
	this._position.height = w.height;	
};
air_win.prototype.apply_theme = function(theme)
{
	if(!this.layout)return;
	this.debug("apply theme " + theme);
	this.theme = theme;
	this.layout.attr("class", theme + "-theme");
	
};
// save the state data.
air_win.prototype.store_state = function()
{
	if (this.stateless) return;
	var theme = this.theme;
	var w = this.win_handle;
	var p = this._position;
	this.debug("store state:x=" + p.x + " y=" + p.y + " width=" + p.width + " height=" + p.height + " maximize=" + this.is_maximize() + " always_top=" + w.alwaysInFront + " theme=" + theme);
	saaa_util.file.write(this.get_state_file(),{x:p.x, y: p.y, width: p.width, height: p.height, is_maximize: this.is_maximize(), is_always_top: w.alwaysInFront, theme: theme});				
};
//show buttons
air_win.prototype._show_buttons =  function()
{
	var w = this.win_handle;
	var btns = this.buttons;
	if(btns.minimize)btns.minimize.show();
	if(btns.close)btns.close.show();
	if(btns.resize)btns.resize.show();
	if(btns.move)btns.move.show();
	if(btns.change_theme)btns.change_theme.show();
	if(btns.always_on_top)btns.always_on_top.show();
	if(btns.disable_always_on_top)btns.disable_always_on_top.show();	
	if(btns.tray)btns.tray.show();	
		
	this.debug("this.max:" + this.is_maximize());
	if (btns.maximize && this.is_maximize())
	{		
		btns.restore.show();
		btns.maximize.hide();					
	}
	else if(btns.restore)
	{
		btns.restore.hide();
		btns.maximize.show();			
	}
 
	if (btns.always_on_top && w.alwaysInFront)
	{
		btns.disable_always_on_top.show();
		btns.always_on_top.hide();
	}else if(btns.disable_always_on_top && btns.disable_always_on_top)
	{
		btns.disable_always_on_top.hide();
		btns.always_on_top.show();
	}
	if (btns.change_theme)btns.change_theme.show();
};

	
air_win.prototype.init = function() {	

	if (!this.stateless)this.restore_state();
	if (!this.is_maximize() && !this.is_minimize) this.update_position();
		
	this.apply_theme(this.theme);
	this._show_buttons();
	this.attach_events();	
	this.debug("initialized.")
};
air_win.prototype.show = function(show_func)
{
	this.win_handle.visible = true;
	if (show_func == null)
	{
		this.layout.fadeIn();
	}else
	{
		show_func(this.layout);
	}
};

air_win.prototype.on_minimize = function(){
	var minimizing = 
		new air.NativeWindowDisplayStateEvent(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
     									  true, true,
       									  this.win_handle.displayState,
       									  air.NativeWindowDisplayState.MINIMIZED);
	this.win_handle.dispatchEvent(minimizing);
	if(!minimizing.isDefaultPrevented()){		
		this.win_handle.minimize();
	}
	this._call_event_listeners(this.event_listeners.minimize, function(fn){fn()});
	this.debug("event - minimize.")	
	return false;
};

air_win.prototype.on_maximize = function(){
	var maximizing =  
		new air.NativeWindowDisplayStateEvent(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
     									  true, true,
       									  this.win_handle.displayState,
       									  air.NativeWindowDisplayState.MAXIMIZED);
	this.win_handle.dispatchEvent(maximizing);
	if(!maximizing.isDefaultPrevented()){
		this.win_handle.maximize();
	}

	this._call_event_listeners(this.event_listeners.maximize, function(fn){fn()});	
	this.debug("event - maximize.")
	return false;
};

air_win.prototype.on_restore = function(event){
	var restoring =  
		new air.NativeWindowDisplayStateEvent(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
     									  true, true,
       									  this.win_handle.displayState,
       									  air.NativeWindowDisplayState.NORMAL);
	this.win_handle.dispatchEvent(restoring);
	if(!restoring.isDefaultPrevented())
				this.win_handle.restore();

	this._call_event_listeners(this.event_listeners.restore, function(fn){fn()});		
	this.debug("event - restore.")		
	return false;	
};


air_win.prototype.on_change_theme = function(obj)
{
	this.theme = $(obj).attr("theme");
	this.debug("theme is " + this.theme);
	this.apply_theme(this.theme);
	this.store_state();		
	var theme = this.theme;	
	this._call_event_listeners(this.event_listeners.theme_change, function(fn){fn(theme)});			
	this.debug("event - change theme to " + this.theme);
};
air_win.prototype.on_moved = function(){
	if(this.is_maximize())return false;
	this.update_position();			
	this._call_event_listeners(this.event_listeners.moved, function(fn){fn()});				
	this.store_state();
	return false;
};
air_win.prototype.on_move = function(){
	if(this.is_maximize())return false;
	this.win_handle.startMove();			
	this._call_event_listeners(this.event_listeners.move, function(fn){fn()});					
	return false;
};
air_win.prototype.on_resized = function(){
	if(this.is_maximize())return false;	
	this.update_position();	
	this._call_event_listeners(this.event_listeners.resized, function(fn){fn()});						
	this.store_state()
	return false;
};
air_win.prototype.on_always_top = function(){
	this.win_handle.alwaysInFront = true;
	this.buttons.disable_always_on_top.show();
	this.buttons.always_on_top.hide();	
	this._call_event_listeners(this.event_listeners.always_on_top, function(fn){fn()});							
	this.store_state();
	return false;	
};
air_win.prototype.on_disable_always_top = function(){
	this.win_handle.alwaysInFront = false;
	this.buttons.disable_always_on_top.hide();
	this.buttons.always_on_top.show();		
	this._call_event_listeners(this.event_listeners.disable_always_on_top, function(fn){fn()});								
	this.store_state();
	return false;	
};
air_win.prototype.on_resize = function(){
	if(this.is_maximize())return false;	
	var dir;
	switch(this.buttons.resize.attr("direction"))
	{
		case "top_left":
			dir = air.NativeWindowResize.TOP_LEFT;
			break;
		case "top_right":
			dir = air.NativeWindowResize.TOP_RIGHT;
			break;
		case "bottom_left":
			dir = air.NativeWindowResize.BOTTOM_LEFT;
			break;			
		default:
		case "bottom_right":
			dir  = air.NativeWindowResize.BOTTOM_RIGHT;
			break;
	}
	this.win_handle.startResize(dir);
	this._call_event_listeners(this.event_listeners.resize, function(fn){fn(dir)});									
	return false;	
};

air_win.prototype.attach_events = function()
{
	var w = this.win_handle;
	var btns = this.buttons;
	var self = this;	
    w.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE,  function(event){
		if (self.is_maximize()) {
			btns.restore.show();
			btns.maximize.hide();
		}
		else {
			btns.restore.hide();
			btns.maximize.show();
		}
		if (!self.is_minimize() && !self.is_maximize())			self.update_position();
		self.store_state();
		self.debug("event - display state changed.")
	});	
	//切换主题	
	if(btns.change_theme)btns.change_theme.click(function(){return self.on_change_theme(this);});
	if(btns.minimize)btns.minimize.click(function() {return self.on_minimize();});
	if(btns.maximize) btns.maximize.click(function() {return self.on_maximize();});
	if(btns.restore)btns.restore.click(function() {	return self.on_restore();});		
	if(btns.close)btns.close.click(function() {	return self.on_close();});		

	if(btns.resize)btns.resize.mousedown(
		function() {	
			$("body").one("mouseup",function(){
					self.on_resized();
				});	
			return self.on_resize();
		});				
	if(btns.move)btns.move.mousedown(
		function() {	
			$("body").one("mouseup",function(){
					self.on_moved();
				});	
			return self.on_move();
		});				
	if(btns.always_on_top)btns.always_on_top.click(function() {	return self.on_always_top();});			
	if(btns.disable_always_on_top)btns.disable_always_on_top.click(function() {	return self.on_disable_always_top();});						
	if(btns.tray)	btns.tray.click(function(){	return self.on_tray();	});		

};
air_win.prototype.on_tray = function(){
	this.win_handle.visible = false;
	this._call_event_listeners(this.event_listeners.tray, function(fn){fn()});		
	return false;	
};
air_win.prototype.on_close = function(){
	this.debug("closing...");
	var closing = new air.Event(air.Event.CLOSING, true, true);	
	this.win_handle.dispatchEvent(closing);
	this._call_event_listeners(this.event_listeners.close, function(fn){fn(closing)});				
	if(!closing.isDefaultPrevented()){
		this.win_handle.close();
		this.debug("closed");
	}									
	return false;
};
var air_win_tray = function(text, icons){
	this.text = null;
	this.icons = icons;//icon_16, icon_128
	this.menu_items = new Array();
	this.add_menu_item = function(text, callback)
	{
		this.menu_items.push({text: text, callback: callback});
	};
};
//增加托盘支持
air_win.prototype.install_tray = function(tray_data)
{
	var iconLoadComplete = function(event) 
	{ 
		air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData); 
	} 

	air.NativeApplication.nativeApplication.autoExit = false; 
	var iconLoad = new air.Loader(); 
	var iconMenu = new air.NativeMenu(); 
	
	var self = this;
	for( i = 0; i < tray_data.menu_items.length; i++)
	{
		var menu = tray_data.menu_items[i];
		var item = iconMenu.addItem(new air.NativeMenuItem(menu.text)); 		
		item.addEventListener(air.Event.SELECT, menu.callback);
	}

	var text = tray_data.text;
	if (text == null)text =  this.application_name + " " + this.application_version;

	if (air.NativeApplication.supportsSystemTrayIcon) { 
		air.NativeApplication.nativeApplication.autoExit = false; 
		iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		iconLoad.load(new air.URLRequest(tray_data.icons.icon_16)); 
		air.NativeApplication.nativeApplication.icon.tooltip = text;
		air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
	} 			 
	
	if (air.NativeApplication.supportsDockIcon) {
		iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		iconLoad.load(new air.URLRequest(tray_data.icons.icon_128)); 
		air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
	} 
};
air_win.prototype.add_event_listener = function(event, listener){
	switch(event){
		case "maximize":
		    this.event_listeners.maximize.add(listener);
			break;
		case "minimize":
		    this.event_listeners.minimize.add(listener);		
			break;
		case "restore":
		    this.event_listeners.restore.add(listener);		
			break;
		case "always_on_top":
		    this.event_listeners.always_on_top.add(listener);		
			break;
		case "disable_always_on_top":
		    this.event_listeners.disable_always_on_top.add(listener);		
			break;
		case "tray":
		    this.event_listeners.tray.add(listener);		
			break;
		case "resize":
		    this.event_listeners.resize.add(listener);		
			break;
		case "resized":
		    this.event_listeners.resized.add(listener);		
			break;
		case "theme_change":
		    this.event_listeners.theme_change.add(listener);		
			break;
		case "move":
		    this.event_listeners.move.add(listener);		
			break;
		case "moved":
		    this.event_listeners.moved.add(listener);		
			break;
		case "close":
		    this.event_listeners.close.add(listener);		
			break;			
		default:
			this.debug("unknown event");
			break;
	}
};
air_win.prototype.remove_event_listener = function(event, listener_handle){
	var listeners;
	switch(event){
		case "maximize":
		    listeners = this.event_listeners.maximize;
			break;
		case "minimize":
		    listeners = this.event_listeners.minimize;		
			break;
		case "restore":
		    listeners = this.event_listeners.restore;		
			break;
		case "always_on_top":
		    listeners = this.event_listeners.always_on_top;		
			break;
		case "disable_always_on_top":
		    listeners = this.event_listeners.disable_always_on_top;		
			break;
		case "tray":
		    listeners = this.event_listeners.tray;		
			break;
		case "resize":
		    listeners = this.event_listeners.resize;		
			break;
		case "resized":
		    listeners = this.event_listeners.resized;		
			break;
		case "theme_change":
		    listeners = this.event_listeners.theme_change;		
			break;
		case "move":
		    listeners = this.event_listeners.move;		
			break;
		case "moved":
		    listeners = this.event_listeners.moved;		
			break;
		case "close":
		    listeners = this.event_listeners.close;		
			break;						
		default:
			this.debug("unknown event");
			break;
	}
	if (listeners != null ) listeners.remove_at(listeners.index_of( listener_handle, 0 ));
		

};
air_win.prototype.exit = function()
{
	air.NativeApplication.nativeApplication.icon.bitmaps = []; 
	air.NativeApplication.nativeApplication.exit(); 		
};
air_win.prototype._call_event_listeners = function(event, callback)
{
	for(var i = 0; i < event.count(); i++)
	{
		var listener = event.get_at(i)	;
		callback(listener);
	}
};
air_win.prototype.add_child = function(child_win){
		var self = this;	
		child_win.theme = this.theme;
		var change_theme_func =  function(theme){
			child_win.apply_theme(theme);
		};
		this.add_event_listener("theme_change", change_theme_func);	
		child_win.add_event_listener("close", function(){
			self.remove_event_listener("theme_change", change_theme_func);
		});
};
air_win.prototype.load_sandbox = function(parent, id, url, domain, document_root, ondominitialize, onloaded, init_child_params)
{
	var html = 	'<iframe id="' + id + '" sandboxRoot="' + domain + '" documentRoot="' + document_root + '"></iframe>';
	parent.html(html);	
	var jid = $("#" + id);
	jid.attr("src", url);
	var sbridge = new sandbox_bridge(id);		
	jid.attr("ondominitialize", function(){
		sbridge.init();
		sbridge.attach(parent_bridge);
		if(ondominitialize != null)ondominitialize(jid, sbridge);
	});
	if (init_child_params == null) init_child_params = {};
	init_child_params.parent_win = this;
	jid.one("load", function(){
		if (!sbridge.inited)sbridge.init();
		sbridge.init_child(init_child_params);					
		if(onloaded != null)onloaded(jid, sbridge);			
	});
}