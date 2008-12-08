var sandbox_win = function(layout, parent)
{
	this.layout = layout;
	this.parent = parent;
};

// win properties
sandbox_win.prototype = {
	theme: 'default',
	layout: null
};
sandbox_win.prototype.debug = function(message)
{
	parent.trace(this.win_id + ":" + message);
};
   
air_win.prototype.apply_theme = function(theme)
{
	if(!this.layout)return;
	this.debug("apply theme " + theme);
	this.theme = theme;
	this.layout.attr("class", theme + "-theme");
	
};

air_win.prototype.init = function() {	
	this.apply_theme(this.theme);
	var self = this;
	parent.add_win_event_listener("theme_change", function(theme){self.apply_theme(theme);});
	this.debug("sandbox initialized.")
};