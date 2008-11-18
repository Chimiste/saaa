var bridgeInterface = {}
bridgeInterface.testProperty = "bridege engaged";
bridgeInterface.testFunction = function(){
	alert("twst");
};
function setupBridge()
{
	$(".sandbox").contentWindow.parentSandboxBridge = bridgeInterface;
}