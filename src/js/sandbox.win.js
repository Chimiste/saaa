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
	this.parent.trace(message);
};
   
sandbox_win.prototype.apply_theme = function(theme)
{
	if(!this.layout)return;
	this.debug("apply theme " + theme);
	this.theme = theme;
	this.layout.attr("class", theme + "-theme");	
};

sandbox_win.prototype.init = function() {	
	this.apply_theme(this.theme);
	var self = this;
	this.parent.add_win_event_listener("theme_change", function(theme){self.apply_theme(theme);});
	this.debug("sandbox initialized.")
};