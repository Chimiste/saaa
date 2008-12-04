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
saaa_db.prototype.open = function(mode){
    this.conn = new air.SQLConnection();
    if (mode == 'async')
    {
        var self = this;
        this.conn.addEventListener(air.SQLEvent.OPEN, function(){  self.opened = true; self.on_opened();});
        this.conn.addEventListener(air.SQLErrorEvent.ERROR, function(){self.on_open_failed();});
        this.conn.addEventListener(air.SQLEvent.CLOSE, function(){self.opened=false;self.on_closed();});        
        this.conn.openAsync(this.dbfile);
    }else
    {
        this.conn.open();                
    }
};
saaa_db.prototype.open_async = function(){
    this.open('async');
    
}
saaa_db.prototype.close = function(){
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
saaa_db.prototype.commit = function(){	this.conn.commit();};
// execute synchronize
saaa_db.prototype.execute = function(sql, callback){
    if (callback != null)
    {
        this.execute_async(sql, callback);
    }else{
        var stat = this.create_statement(sql);
        stat.sqlConnection = this.conn;
        stat.execute();
        return stat.getResult();
    }
};
saaa_db.prototype.execute_async = function(sql, callback)
{
    var stat = this.create_statement(sql);
    stat.sqlConnection = this.conn;
    if (callback.result != null)
    {
        var func = function(event){callback.result(stat.getResult());  stat.removeEventListener(air.SQLEvent.RESULT, func);};
        stat.addEventListener(air.SQLEvent.RESULT, func);
    }
    if (callback.error != null)
    {
        var func = function(event){callback.error(event.error);  stat.removeEventListener(air.SQLEvent.RESULT, func);};        
        stat.addEventListener(air.SQLErrorEvent.ERROR, callback.error);
    }
    stat.execute();
};
saaa_db.prototype.create_statement = function(sql)
{
    var stat = new air.SQLStatement();
    if (typeof sql == 'string')
        stat.text = sql;
    else{
        stat.text = sql.sql;
        if (sql.params == undefined || sql.params == null )return stat;
        for (var p in sql.params)
        {
            var key = ":" + p;
            var value = sql.params[p];
            stat.parameters[key] = value;
        }
    }
    return stat;
};
saaa_db.prototype.select = function(sql, callback){
    if (callback == null)
    {
        var result = this.execute(sql);
        return result.data;
    }
    else
    {
        var self = this;
        this.execute_async(sql, {result: function(result){callback.result(result.data);},
                                 error: callback.error
            });
    }    
};
saaa_db.prototype.insert = function(sql, callback){
    if (callback == null)
    {
        var result = this.execute(sql);
        return result.lastInsertRowID;
    }
    else
    {
        var self = this;
        this.execute_async(sql, {result: function(result){callback.result(result.lastInsertRowID);},
                                 error: callback.error
            });
    }    
};
saaa_db.prototype.count = function(sql, callback){
    return (this.get_first(sql, callback));
}
saaa_db.prototype.get_first = function(sql, callback){
    if (callback == null)
    {
        return this._get_first(this.execute(sql));
    }else{
        var self = this;
        this.execute_async(sql, {result: function(result){callback.result(self._get_first(result));},
                                 error: callback.error
            });
    }
    
};
saaa_db.prototype._get_first = function(result){
    var data = result.data;
    
    if (data.length == 0) return null;
    
    for (var key in data[0])
    {
        return data[0][key];
    }
    return null;
};
saaa_db.prototype.query = function(sql)
{
    
    var stat = this.create_statement(sql);
    stat.sqlConnection = this.conn;
    stmt.execute(this.maxResults);
    return this.readResults(stmt.getResult());
};

var saaa_model = function(){};
saaa_model.prototype.prepared = function(){};
saaa_model.prototype.add = function(table, obj){};
saaa_model.prototype.update = function(table, obj){};
