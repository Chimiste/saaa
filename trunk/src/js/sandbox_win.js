function sandbox_init()
{
    //air.trace("sandbox inited.");
    alert("inited");
}

$(document).ready(function() {
    var parent = sandbox_bridge.parent();
    parent.on_theme_change(function(theme){alert(theme);});
    
});