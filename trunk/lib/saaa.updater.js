var saaa_updater = function(versionCheckURL, filename, updateURL)
{
	this.versionCheckURL = versionCheckURL;
	this.filename = filename; // nn.air
	this.updateURL = updateURL;
	this.needUpdateOrNotHandler = null;
	this.errorHandler = null;
	this.updateOkHandler = null;
	this.updateProcessHandler = null; //params: percentage
	
	this._lastestVersionInfo = {};//releasenodes,version
	this._currentVersionInfo = {};//name, version	
};
saaa_updater.prototype.needUpdate = function()
{
	var lastestVersion = parseFloat(this._lastestVersionInfo.version);
	var currentVersion = parseFloat(this._currentVersionInfo.version);
	if ( lastestVersion - currentVersion > 0.00000001) {
		return true;
	}
	return false;	
};


saaa_updater.prototype.check = function()	
{
	try
	{
		var xmlobject  = (new DOMParser()).parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml");
		this._currentVersionInfo.name =  xmlobject.getElementsByTagName("name")[0].childNodes[0].data;
		this._currentVersionInfo.version = xmlobject.getElementsByTagName("version")[0].childNodes[0].data;
		
		air.trace("current application version:" + this._currentVersionInfo.version);
		var self = this;
		$.get(this.versionCheckURL, function(data){	
			xmlobject = (new DOMParser()).parseFromString(data, "text/xml");
			self._lastestVersionInfo.releasenotes = xmlobject.getElementsByTagName("releasenotes")[0].childNodes[0].data;
			self._lastestVersionInfo.version  = xmlobject.getElementsByTagName("latestversion")[0].childNodes[0].data;
			self._updateURL  = xmlobject.getElementsByTagName("downloadurl")[0].childNodes[0].data;				
			air.trace("lastest application version:" + self._lastestVersionInfo.version);
			
			//if (myupdater.needUpdate())
			//{
				//air.trace("need update");
				if (self.needUpdateOrNotHandler != null) self.needUpdateOrNotHandler(self.needUpdate());
				//{
				//	if (myupdater.updateOrNotHandler())
				//	{//user confirmed
				//		myupdater.doUpdate();
				//	}else
				//	{
				//		if (myupdater.completeHandler)myupdater.completeHandler();
				//	}
					
				//}else
				//{
				//	myupdater.doUpdate();
				//}
			//}else{
			//	air.trace("not need update");
			//	if (myupdater.completeHandler)myupdater.completeHandler();
			//}	
			
		});
	}catch(e)
	{
		air.trace("update error:" + e);
		if (this.errorHandler != null) this.errorHandler(e, "");			
	}
};

saaa_updater.prototype.update = function()
{
	try
	{
		air.trace("updating...");
 		var updatingStatus = function (e) {
			var percentage = Math.round((e.bytesLoaded / e.bytesTotal) * 100);
			if (this.updateProcessHandler != null) this.updateProcessHandler(percentage);
		};
		var updateFile = air.File.applicationStorageDirectory.resolvePath(this.filename);			
		var updateApplication = function () {
			var ba = new air.ByteArray();
			stream.readBytes(ba, 0, stream.bytesAvailable);
			fileStream = new air.FileStream();
			fileStream.addEventListener( air.Event.CLOSE, installUpdate );
			fileStream.openAsync(updateFile, air.FileMode.WRITE);
			fileStream.writeBytes(ba, 0, ba.length);
			fileStream.close();
		};
		var self = this;
		var installUpdate = function () {
			var updater = new air.Updater();				
			updater.update(updateFile, self._lastestVersionInfo.version);
			
			if (self.updateOkHandler != null) self.updateOkHandler();
			if (self.updateCompleteHandler)self.updateCompleteHandler();				
		};			
		stream = new air.URLStream();		
		stream.addEventListener(air.ProgressEvent.PROGRESS, updatingStatus);		
		stream.addEventListener(air.Event.COMPLETE, updateApplication);				
		stream.load( new air.URLRequest(this.updateURL));


	}
	catch(e)
	{
		air.trace("update failed:" + e);
		if (this.errorHandler)this.errorHandler(e, "");
	}
};


