var saaa_updater = function(version_check_url, filename)
{
	this.version_check_url = version_check_url;
	this._update_url = null;
	this.filename = filename; // nn.air
	this.need_update_or_not_handle = null;
	this.error_handle = null;
	this.update_ok_handle = null;
	this.update_process_handle = null; //params: percentage
	
	this.lastest_version_info = {};//releasenodes,version
	this._currentVersionInfo = {};//name, version	
};
saaa_updater.prototype.need_update = function()
{
	var lastestVersion = parseFloat(this.lastest_version_info.version);
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
		air.trace("checking the url:" + this.version_check_url);
		$.ajax({
		  type: "GET",
		  url: this.version_check_url,
		  dataType: "text",
		  success:   function(data){	
					air.trace("lastest version xml:" + data);
					xmlobject = (new DOMParser()).parseFromString(data, "text/xml");
					self.lastest_version_info.releasenotes = xmlobject.getElementsByTagName("releasenotes")[0].childNodes[0].data;
					self.lastest_version_info.version  = xmlobject.getElementsByTagName("latestversion")[0].childNodes[0].data;
					self._update_url  = xmlobject.getElementsByTagName("downloadurl")[0].childNodes[0].data;				
					air.trace("lastest application version:" + self.lastest_version_info.version);
					
					if (self.need_update_or_not_handle != null) self.need_update_or_not_handle(self.need_update());
			},
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				if (textStatus == 'error')
				{
					if (self.error_handle)self.error_handle("", "establishing connection with update site");
				}
				else
				{
					if (self.error_handle)self.error_handle("", "retrieving data from update site");
				}
			}
		});
	}catch(e)
	{
		air.trace("update error:" + e);
		if (this.error_handle != null) this.error_handle(e, "checking for newer version");			
	}
};

saaa_updater.prototype.update = function()
{
	try
	{
		var self = this;
		air.trace("updating...");
 		var updatingStatus = function (event) {
			var percentage = Math.round((event.bytesLoaded / event.bytesTotal) * 100);
			air.trace("updating:" + percentage);
			if (self.update_process_handle != null) self.update_process_handle(percentage);
		};
		var updateFile = air.File.applicationStorageDirectory.resolvePath(this.filename);			
		var updateApplication = function () {
			try
			{
				var ba = new air.ByteArray();
				stream.readBytes(ba, 0, stream.bytesAvailable);
				fileStream = new air.FileStream();
				fileStream.addEventListener( air.Event.CLOSE, installUpdate );
				fileStream.openAsync(updateFile, air.FileMode.WRITE);
				fileStream.writeBytes(ba, 0, ba.length);
				fileStream.close();
			}
			catch (e)
			{
				air.trace(e);
				if (self.error_handle)self.error_handle(e, "updating");
			}

		};
		var installUpdate = function () {
			try
			{
				var updater = new air.Updater();				
				updater.update(updateFile, self.lastest_version_info.version);
				
				if (self.update_ok_handle != null) self.update_ok_handle();
				if (self.updateCompletehandle)self.updateCompletehandle();								
			}
			catch (e)
			{
				air.trace(e);
				if (self.error_handle)self.error_handle(e, "installing");
			}

		};			
		stream = new air.URLStream();		
		stream.addEventListener(air.ProgressEvent.PROGRESS, updatingStatus);		
		stream.addEventListener(air.Event.COMPLETE, updateApplication);	
		air.trace("updating from url:" + this._update_url);
		stream.load( new air.URLRequest(this._update_url));


	}
	catch(e)
	{
		air.trace("update failed:" + e);
		if (self.error_handle)self.error_handle(e, "processing update");
	}
};