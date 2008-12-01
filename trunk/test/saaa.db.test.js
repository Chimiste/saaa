add_scripts(["../src/js/saaa.util.js", "../src/js/saaa.db.js"], function(){    
    new testcase("saaa.db", {
        setup: function(){
            this.file = 'test11.db';
			this.table =   "CREATE TABLE IF NOT EXISTS test (" +
            "	id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "	name TEXT," +
            "	type TEXT," +
            "	url TEXT" +
            ")";
			this.inserts = new Array;
			this.inserts.push({sql: "insert into test(name, type, url) values(:name, :type, :url)",
							  params: {name: 'pickerel', type: 'mytype', url: 'http://www.google.com'}
							});
			this.inserts.push({sql: "insert into test(name, type, url) values(:name, :type, :url)",
							  params: {name: 'yee', type: 'mytype', url: 'http://www.yahoo.com'}
							});
			
            try{saa_db_get_dbfile(this.file).deleteFile();}catch(e){}
        },
        test_get_dbfile: function()
        {        
        },
        async_test_open_async: function()
        {
            var self = this;
            var db = new saaa_db(this.file);
            db.event_handlers.opened.add( function()
            {
                self.assert_not_null(db.conn, "conn object not null");
                self.assert(db.opened, "opened status true");
                self.assert_null(db.get_schema(), "db shcema is null" );
                db.close();
            });
            db.event_handlers.closed.add( function(){
                self.assert(db.opened == false, "opened status false");
                self.complete();
            });
            db.open_async();
        },
		test_open: function()
		{
			var db = new saaa_db(this.file);
			db.open();
			this.assert_not_null(db.conn, 'conn not null');
			db.close();
		},
		async_test_execute: function(){
			var self = this;
			prepare_db(this, function(db){
				db.execute("select id, name,  url , type from test"		, {
					result: function(result){
						self.assert(result.complete, "count complete");
						self.assert_equal(0, result.rowsAffected, "1 row affected");
						self.assert_equal(2, result.data.length, 'two rows selected');
						self.assert_equal('pickerel', result.data[0].name, 'row 1 name:pickerel');
						self.assert_equal('yee', result.data[1].name, 'row 2 name: yee');			
						self.complete();
						}
				});
			});			
		},
		test_execute: function()
		{
			var db = new saaa_db(this.file);
			db.open();
			var result = db.execute(this.table);
			this.assert(result.complete, "create table complete");
			this.assert_equal(0, result.rowsAffected, "0 row affected");
			this.assert_null(result.data, 'data is null');
			
			for(var i = 0; i < this.inserts.length; i++)
			{
				result = db.execute(this.inserts[i]);
				this.assert(result.complete, "insert complete");
				this.assert_equal(1, result.rowsAffected, "1 row affected");
				this.assert_null(result.data, 'data is null');				
			}
			
			result = db.execute("select id, name,  url , type from test")

			this.assert(result.complete, "count complete");
			this.assert_equal(0, result.rowsAffected, "1 row affected");
			this.assert_equal(2, result.data.length, 'two rows selected');
			this.assert_equal('pickerel', result.data[0].name, 'row 1 name:pickerel');
			this.assert_equal('yee', result.data[1].name, 'row 2 name: yee');
			
			result = db.execute("select count(*) from test")
			this.assert_equal(2, result.data[0]["count(*)"], 'count result is 2');			
			db.execute("delete from test");
			db.close();
			
		},
		async_test_get_first: function(){
				var self = this;
				prepare_db(this, function(db){
					db.get_first("select name, type from test", {
						result: function(ret){self.assert_equal('pickerel', ret, 'first column field is pickerel');self.complete()},
						error: function(error){self.assert_null(error);self.complete();}
					});
			});
		},		
		test_get_first: function(){
				var self = this;
				prepare_db(this, function(db){
				self.assert_equal('pickerel', db.get_first("select name, type from test"), 'first column field is pickerel');
			});
		},
		async_test_count: function(){
				var self = this;
				prepare_db(this, function(db){
					db.count("select count(*) from test", {
						result: function(ret){self.assert_equal(2, ret, 'count result is 2');self.complete()},
						error: function(error){self.assert_null(error);self.complete();}
					});
			});
		},		
		test_count: function(){
			var self = this;
				prepare_db(this, function(db){
				self.assert_equal(2, db.count("select count(*) from test"), 'count result is 2');
			});		
		},
		async_test_insert: function(){
				var self = this;
				prepare_db(this, function(db){
					db.insert(self.inserts[0], {
						result: function(ret){self.assert_equal(3, ret, 'insert id is 3');self.complete()},
						error: function(error){self.assert_null(error);self.complete();}
					});
			});
		},		
		test_insert: function()
		{
			var self = this;
			prepare_db(this, function(db){
				self.assert_equal(3, db.insert(self.inserts[0]), 'insert id is 3');
			});					
		},
		async_test_select: function(){
				var self = this;
				prepare_db(this, function(db){
					db.select({sql:'select * from test where name=:name',params:{name: 'pickerel'}},
							   {
									result: function(rows){self.assert_equal('pickerel', rows[0]['name'], 'name is pickerel');self.complete()},
									error: function(error){self.assert_null(error);self.complete();}
								}
							);
			});
		},		
		test_select: function()
		{
			var self = this;
			prepare_db(this, function(db){
				var rows = db.select({sql:'select * from test where name=:name',params:{name: 'pickerel'}});
				self.assert_equal('pickerel', rows[0]['name'], 'name is pickerel');
			});					
		},
		test_update: function()
		{
			var self = this;
			prepare_db(this, function(db){
				var rows = db.select({sql:'select * from test where name=:name',params:{name: 'pickerel'}});
				self.assert_equal('pickerel', rows[0]['name'], 'name is pickerel');
			});			
		},
        teardown: function()
        {
            //this.db.destroy();
        }
	}).run();	
});

function prepare_db(test, callback)
{
	var db = new saaa_db(test.file);
	db.open();
	var result = db.execute(test.table);
	
	for(var i = 0; i < test.inserts.length; i++)
	{
		 db.execute(test.inserts[i]);
	}
	try{
		callback(db);
	}finally{
		db.execute("delete from test");			
		db.close();
	}
}