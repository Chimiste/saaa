var saa_db_get_dbfile = function(file)
{
    if (typeof file == 'string')
    {
        if (file.indexOf(":/") > -1)
          return new File(file);
        else
          return air.File.applicationStorageDirectory.resolvePath(file);
    }
    return file;
};
var saaa_db = function(file){
    this.dbfile = saa_db_get_dbfile(file);
    this.conn = null;
    this.schema = null;
    this.dbfile = null;
    this.opened = false;
    this.event_handlers = {opened:new array_list, open_failed: new array_list, closed:new array_list, destroyed: new array_list};
};

saaa_db.prototype.on_opened = function(){var self=this;self._call_listeners(self.event_handlers.opened, function(listener){listener()});};
saaa_db.prototype.on_open_failed = function(){var self=this;self._call_listeners(self.event_handlers.open_failed, function(listener){listener()});};
saaa_db.prototype.on_closed = function(){var self=this;self._call_listeners(self.event_handlers.closed, function(listener){listener()});};
saaa_db.prototype.on_destroyed = function(){var self=this;self._call_listeners(self.event_handlers.destroyed, function(listener){listener()});};
saaa_db.prototype._call_listeners = function(listeners, callback){
        for(var i = 0; i < listeners.count(); i++)
        {
            var listener = listeners.get_at(i)	;
            callback(listener);
        }
    };
saaa_db.prototype.get_schema = function(){
        return this.conn.getSchemaResult();       
    };
saaa_db.prototype.open = function(){	
        this.conn = new air.SQLConnection();
        var self = this;
        this.conn.addEventListener(air.SQLEvent.OPEN, function(){  self.opened = true; self.on_opened();});
        this.conn.addEventListener(air.SQLErrorEvent.ERROR, function(){self.on_open_failed();});
        this.conn.addEventListener(air.SQLEvent.CLOSE, function(){self.opened=false;self.on_closed();});        
        this.conn.openAsync(this.dbfile);
    };
saaa_db.prototype.close = function(){
    this.conn.conn.clean()
        this.conn.close();
        air.trace("db closed");
    };
saaa_db.prototype.destroy = function(){
        var self = this;
        var delfunc = function(){
            if(self.dbfile.exists)self.dbfile.deleteFile();
            self.on_destroyed();
        };
        if (this.opened)
        {
            this.event_handlers.closed.add(function(){delfunc(); });
            this.close();
        }else{
            delfunc();
        }      
};
saaa_db.prototype.begin = function(){this.conn.begin();};
saaa_db.prototype.commit = function(){	this._db.commit();};

saaa_db.prototype.execute(sql, result_callback, error_callback)
{
    var stat = this.create_statement(sql);
    stat.sqlConnection = this.conn;
    stat.addEventListener(air.SQLEvent.RESULT, result_callback);
    stat.addEventListener(air.SQLErrorEvent.ERROR, error_callback);    
    stat.execute();
};
saaa_db.prototype.create_statement = function(sql)
{
    var stat = new air.SQLStatement();
    if (typeof sql == 'string')
        stat.text = sql;
    else{
        stat.text = sql.sql;
        if (sql.arams == undefined || sql.params == null )return stat;
        for (var p in sql.params)
        {
            var key = ":" + p;
            var value = sql.params[key];
            stat.parameters[key] = value;
        }
    }
    return stat;
};
saaa_db.prototype.query = function(sql)
{
    
    var stat = this.create_statement(sql);
    stat.sqlConnection = this.conn;
    stmt.execute(this.maxResults);
    return this.readResults(stmt.getResult());
};
/*
saaa_db.prototype.import_sql = function(sql){
    var stat = new air.SQLStatement();
    stat.sqlConnection = this.conn;
    var file = new air.File(sqlfile);
    var fs = new air.FileStream() ;		
    fs.open( file , air.FileMode.READ ); 	
    var sql = fs.readUTFBytes(file.size); 		
    fs.close(); 	
    var lines = sql.split('\n');
    air.trace("read schema file ok.");
    for(var i=0;i<lines.length;i++)
    {
       var line = String(lines[i]).trim();
        if(line.length==0) continue;
        if(line.substring(0,2) == '//') continue; 			
        command.text = lines[i];	 		
        command.execute();
    }  
}
*/