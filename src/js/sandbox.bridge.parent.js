var sandbox_bridge = function(iframeid){
    this.iframe = document.getElementById(iframeid);
    this.child = this.iframe.contentWindow.childSandboxBridge;
};
sandbox_bridge.prototype.attach = function(exposed){
    var i = 0;
    for(var k in exposed)
    {
        this.iframe.contentWindow.parentSandboxBridge[k] = exposed[k];
        i++;
    }
    if (i == 0) this.iframe.contentWindow.parentSandboxBridge = exposed;
};
 