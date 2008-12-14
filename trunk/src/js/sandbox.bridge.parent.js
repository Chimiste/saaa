var sandbox_bridge = function(iframeid){
    this.iframeid = iframeid;
    this.inited = false;
    
};

sandbox_bridge.prototype.init = function()
{
    this.iframe = document.getElementById(this.iframeid);
    this.iframe.contentWindow.parentSandboxBridge = {};    
    this.inited = true;
}

sandbox_bridge.prototype.init_child = function(params)
{
    this.child = this.iframe.contentWindow.childSandboxBridge;    
    if(this.child.sandbox_init != null)this.child.sandbox_init(params);
}


sandbox_bridge.prototype.attach = function(exposed){
    var i = 0;
    for(var k in exposed)
    {
        this.iframe.contentWindow.parentSandboxBridge[k] = exposed[k];
        i++;
    }
    if (i == 0) this.iframe.contentWindow.parentSandboxBridge = exposed;
};
