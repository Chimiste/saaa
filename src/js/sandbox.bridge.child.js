if (window.childSandboxBridge == null)window.childSandboxBridge = {};
var sandbox_bridge =
{
    attach: function(exposed){
        var i = 0;        
        
   
        for(var k in exposed)
        {
            window.childSandboxBridge[k] = exposed[k];
            i++;
        }
        if (i == 0) window.childSandboxBridge = exposed;     
    },
    parent: function(){ return window.parentSandboxBridge;},    
    debug: function(message)  {  	this.parent().trace(message);  } 
}

