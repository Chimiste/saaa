/**
* @author cybergib15
*/

/**
* Crear una ventana nueva
* @param {String} html Ruta del archivo html o pagina.
* @param {Int} width Ancho de la ventana.
* @param {Int} height Alto de la ventana.
* @param {Boolean} transparent
* @param {Boolean} resizable
* @param {Boolean} maximizable
* @param {Int} left
* @param {Int} top
* @return {Object} Retorna el objeto HTMLloader.
*/
function nuevaVentana(html,width,height,transparent,resizable,maximizable,left,top){
	var options = new air.NativeWindowInitOptions();
	options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
	if(transparent==true) options.systemChrome=air.NativeWindowSystemChrome.NONE;
	options.transparent = transparent;
	options.resizable=resizable;
	options.maximizable=maximizable;
	
	
	if(left==undefined)left=0;
	if(top==undefined)top=0;
	
	var windowBounds = new air.Rectangle(left,top);
	windowBounds.width=width;
	windowBounds.height=height;
	
	newHTMLLoader = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
	newHTMLLoader.load(new air.URLRequest(html));
	
	return newHTMLLoader;
} 
	