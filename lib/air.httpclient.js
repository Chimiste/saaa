var httpclient = function(url, options){
	var defaults = {method: air.URLRequestMethod.GET, 
					headers: [], 
					before_send:null, 
					completed:null, 
					error:null,
					format: air.URLLoaderDataFormat.TEXT
		};
	if(options == null)options = {};
	saaa_util.inherits(options, defaults);
	this.options = options;
	

	this.url = url;
	this.request = new air.URLRequest(url);
	alert(this.options);
	for(var i = 0; i < this.options.headers.length; i++)
	{
		this.request.requestHeaders.push(new air.URLRequestHeader(this.options.headers[0][0], this.options.headers[0][1]));
	}
	this.loader = new air.URLLoader();
	this.loader.dataFormat = this.options.format;
	if(this.options.completed)this.loader.addEventListener(air.Event.COMPLETE, this.options.completed);//(completed(event))	
	
};
httpclient.prototype.send = function()
{	
	try {
		if(this.options.before_senderror)this.options.before_send(this.request, this.loader);		
		this.loader.load(this.request);
	} catch (e) {
		if(this.options.error)this.options.error(e);
		air.trace(e);
	}	
}