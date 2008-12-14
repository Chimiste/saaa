//$(document).ready(function() {
var sbwin = {
    parent: null,
    win: null,
    init: function()
    {
        this.parent = sandbox_bridge.parent()
        this.win = new sandbox_win( $("#layout"), this.parent);
        sandbox_bridge.attach(child_bridge);
    } ,
	debug: function(message)
	{
		sandbox_bridge.debug(message);
	}     
};

var child_bridge =
{
    // will call by parent when sandbox inited.
    sandbox_init: function(params){        
       sbwin.win.theme  = params.parent_win.theme;
       sbwin.win.init();
    }
}