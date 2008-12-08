//$(document).ready(function() {
var sbwin = {
    parent: null,
    win: null,
    init: function()
    {
        this.parent = sandbox_bridge.parent()
        this.win = new sandbox_win( $("#layout"), this.parent);
        sandbox_bridge.attach(child_bridge);
     }       
};

var child_bridge =
{
    // will call by parent when sandbox inited.
    sandbox_init: function(params){
        
       sbwin.win.theme  = params.saaa.main_win.theme;
       sbwin.win.init();
    }
}