var myupdater = {
	versionCheckURL : null,
	filename : null, // nn.air
	updateOrNotHandler : null,
	errorHandler : null,
	updateOkHandler : null,
    completeHanlder : null,
	updateProcessHandler : null, //params: percentage
	lastestVersionInfo : {},//releasenodes,version
	currentVersionInfo : {},//name, version

	needUpdate : function () {
		var lastestVersion = parseFloat(myupdater.lastestVersionInfo.version);
		var currentVersion = parseFloat(myupdater.currentVersionInfo.version);
		air.trace(lastestVersion);
		air.trace(currentVersion);
		if (currentVersion < lastestVersion) {
			return true;
		}
		return false;
	},
	
	check : function()	
	{
		try
		{
			var xmlobject    = (new DOMParser()).parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml");
			myupdater.currentVersionInfo.name =  xmlobject.getElementsByTagName("name")[0].childNodes[0].data;
			myupdater.currentVersionInfo.version = xmlobject.getElementsByTagName("version")[0].childNodes[0].data;
			
			air.trace("current application version:" + myupdater.currentVersionInfo.version);
			
			$.get(myupdater.versionCheckURL, function(data){					
				xmlobject = (new DOMParser()).parseFromString(data, "text/xml");
				myupdater.lastestVersionInfo.releasenotes = xmlobject.getElementsByTagName("releasenotes")[0].childNodes[0].data;
				myupdater.lastestVersionInfo.version  = xmlobject.getElementsByTagName("latestversion")[0].childNodes[0].data;
				myupdater.updateURL  = xmlobject.getElementsByTagName("downloadurl")[0].childNodes[0].data;				
				air.trace("lastest application version:" + myupdater.lastestVersionInfo.version);
				
				if (myupdater.needUpdate())
				{
					air.trace("need update");
					if (myupdater.updateOrNotHandler != null)
					{
						if (myupdater.updateOrNotHandler())
						{//user confirmed
							myupdater.doUpdate();
						}else
						{
							if (myupdater.completeHandler)myupdater.completeHandler();
						}
						
					}else
					{
						myupdater.doUpdate();
					}
				}else{
					air.trace("not need update");
					if (myupdater.completeHandler)myupdater.completeHandler();
				}	
				
			});
		}catch(e)
		{throw( e);
			air.trace("update error");
			air.trace(e);
			if (myupdater.errorHandler != null) myupdater.errorHandler(e);			
		}
	},
	updateURL : null,
	doUpdate : function()
	{
		try
		{
		var updatingStatus = function (e) {
				var percentage = Math.round((e.bytesLoaded / e.bytesTotal) * 100);
				if (myupdater.updateProcessHandler != null) myupdater.updateProcessHandler(percentage);
			};
		var updateFile = air.File.applicationStorageDirectory.resolvePath(myupdater.filename);			
		var updateApplication = function () {
				var ba = new air.ByteArray();
				stream.readBytes(ba, 0, stream.bytesAvailable);
				fileStream = new air.FileStream();
				fileStream.addEventListener( air.Event.CLOSE, installUpdate );
				fileStream.openAsync(updateFile, air.FileMode.WRITE);
				fileStream.writeBytes(ba, 0, ba.length);
				fileStream.close();
			};
			var installUpdate = function () {
				var updater = new air.Updater();				
				updater.update(updateFile, myupdater.lastestVersionInfo.version);
				
				if (myupdater.updateOkHandler != null) myupdater.updateOkHandler();
				if (myupdater.completeHandler)myupdater.completeHandler();				
			};			
			stream = new air.URLStream();		
			stream.addEventListener(air.ProgressEvent.PROGRESS, updatingStatus);		
			stream.addEventListener(air.Event.COMPLETE, updateApplication);				
			stream.load( new air.URLRequest(myupdater.updateURL));


		}
		catch(e)
		{
			throw e;
			air.trace("do update failed:" + e);
			if (myupdater.errorHandler)myupdater.errorHandler(e);
		}
	}	
}


