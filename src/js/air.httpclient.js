var httpclient = function(url, options){
	var defaults = {method: air.URLRequestMethod.GET,
					data: null,
					headers: [], 
					before_send:null, 
					completed:null, 
					error:null,
					http_status: null,
					auto_redirect: true,
					format: air.URLLoaderDataFormat.TEXT
		};
	if(options == null)options = {};
	saaa_util.inherits(options, defaults);
	this.options = defaults;
	this.url = url;
};
httpclient.prototype.send = function(redirect_times)
{
	try {
		var self = this;
		var loader = new air.URLLoader();	
		//loader.dataFormat = this.options.format;
		var request = new air.URLRequest(this.url);				
		if(this.options.completed)
		{
			loader.addEventListener(air.Event.COMPLETE, function(event){
				//var html = loader.readMultiByte(loader.bytesAvailable, "UTF-8");
				var html = event.target.data;
				self.options.completed(html);
				}
			);
		}
		
		air.trace("request url " + this.url);
		if(this.options.error)loader.addEventListener("ioError", this.options.error);
		
		
		loader.addEventListener("httpResponseStatus", function(event){
			var status = event.status;
			var response = event.responseHeaders;
			var response_url = event.responseURL;
			air.trace("http status:" + status);
			air.trace("response url:" + response_url);
			if (self.options.auto_redirect && status == 302)
			{
				airt("redirect:" + redirect_times);				
				if (redirect_times == null)redirect_times = 0;
				redirect_times++;
				if (redirect_times > 255)throw "too many redirects";
				self.headers.push(["Referer", response_url]);
				self.url = response["Location"];
				self.method = air.URLRequestMethod.GET;
				self.send(redirect_times);
			}
			else
			{
				air.trace("http status event");
				if (self.http_status)self.http_status(event);
			}

		});

		for(var i = 0; i < this.options.headers.length; i++)
		{
			request.requestHeaders.push(new air.URLRequestHeader(this.options.headers[i][0], this.options.headers[i][1]));
		}		
		if(this.options.data != null)request.data = this.options.data;			
		request.method = this.options.method;			
		if(this.options.before_senderror)this.options.before_send(request, loader);		
		loader.load(request);
	} catch (e) {
		if(this.options.error != null)this.options.error(e);
		air.trace(e);
	}	
}


function http_get(url, headers, callback)
{
	var hc = new httpclient(url, {
		headers: headers,
		completed: callback.completed,
		before_send: callback.before_send,
		error: callback.error,
		http_status: callback.status
	});
	hc.send(10);
}
function http_post(url, headers, data, callback )
{
	var hc = new httpclient(url, {
		headers: headers,
		method: air.URLRequestMethod.POST,
		completed: callback.completed,
		before_send: callback.before_send,
		error: callback.error,
		http_status: callback.status
	});
	hc.send(10);
}