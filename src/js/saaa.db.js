
/*
ADOBE SYSTEMS INCORPORATED
 Copyright 2007 Adobe Systems Incorporated
 All Rights Reserved.
 
NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
terms of the Adobe license agreement accompanying it.  If you have received this file from a 
source other than Adobe, then your use, modification, or distribution of it requires the prior 
written permission of Adobe.

*/


/*/================================================
 * DB class usage
 * ================================================
 		
 		var obj = {id:-7, idsrv:10};
 		
 		//deletes account 7
 		DB.saveAccount(obj);
 		
 		//and now isert it back
 		delete obj.id;	// save detects that there is no defined primary key
 		 				// and fires insert sql
 		DB.saveAccount(obj);

 		//and now you know last insert id
 		air.trace(obj.id);
 		
 		var data = AccountsDB.getAccountsByService(6);
 		
 		data[0].id *=-1;
 		data[1].title = 'modifc1';
 		DB.saveAccount(data[0]);
 		DB.saveAccount(data[1]);
 		
 		
 		//var obj = { id:-16, title : 'blog nr 2' };
 		
 		var data  = AccountsDB.getAccountsByService(2);
 		var obj = data[0];
 		
 		obj.title+=" blog vechi";
 		
 		DB.saveAccount(obj);
 		
 		
 		*/
//var username = air.EncryptedLocalStore.getItem("username");
//var password = air.EncryptedLocalStore.getItem("password");
var saaa_db = function(){ };
saaa_db.prototype = {
	conn: null,
	schema: null,
	event_handlers: {opened:new array_list, open_failed: new array_list},  
	on_opened: function(){var self=this;self._call_listeners(self.event_handlers.opened, function(listener){listener()});},
	on_open_failed: function(){var self=this;self._call_listeners(self.event_handlers.open_failed, function(listener){listener()});},
	_call_listeners: function(listeners, callback)
	{
		for(var i = 0; i < listeners.count(); i++)
		{
			var listener = listeners.get_at(i)	;
			callback(listener);
		}
	},
	init: function(file)
	{	
		this.conn = new air.SQLConnection();
		if (typeof file == 'string')
		{
			if (file.indexOf(":/") > -1)
			  file = new File(file);
			else
			  file = air.File.applicationStorageDirectory.resolvePath(file);
		}
		this.conn.open(file);
	
		this.conn.addEventListener(air.SQLEvent.OPEN, function(){air.trace("db opened");});
		this.conn.addEventListener(air.SQLErrorEvent.ERROR, function(){air.trace("db open failed");});
		var schema = this.conn.getSchemaResult();
		if(schema == null)
		{
			this.create_tables();
			this.conn.loadSchema();
			schema = this.conn.getSchemaResult();	  
		}
		air.trace("schema:" + schema);
		this.schema = schema;
	  
	},
	create_tables: function()
	{
		var accounts = "CREATE TABLE IF NOT EXISTS base_accounts (" +
		"	id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"	name TEXT," +
		"	type TEXT," +
		"	url TEXT" +
		")";
		
		var settings = "CREATE TABLE IF NOT EXISTS base_settings (" +
		"	id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"	key TEXT," +
		"	content TEXT" +
		")";
		
		var folders = "CREATE TABLE IF NOT EXISTS folders (" +
		"	id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"	name TEXT," +
		"	parent INTEGER," +
		"	account INTEGER," +
		"	views TEXT," +
		"	type TEXT," +
		"	section TEXT" +
		")";
		
		var items = "CREATE TABLE IF NOT EXISTS items (" +
		"	id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"	title TEXT," +
		"	content TEXT," +
		"	folder INTEGER," +
		"	dates TEXT," +
		"	hasa BOOLEAN," +
		"	attachments TEXT," +
		"	author TEXT," +
		"	section TEXT," +
		"	member TEXT," +
		"	meta TEXT," +
		"	read INTEGER," +
		"	flag INTEGER," +
		"	sortable TEXT" +
		")";
		var tables = [accounts, settings, folders, items];
		for(var i = 0; i < tables.length; i++)
		{
			var table = tables[i];
			var stat = new air.SQLStatement();			
			stat.text = table;
			stat.sqlConnection = this.conn;
			
			//if (index == (this.tables.length - 1))
			//	tableSQL.addEventListener('result', this._ready.bind(this));
			
			stat.execute();			
		}
		
	},
	import_sql: function(sqlfile)
	{
		air.trace("preparing to import sql " + sqlfile + "...");
		var command = new air.SQLStatement();
		command.sqlConnection = this.conn;
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
		air.trace("sql data imported.");
	},	
	close: function()
	{
	  this.conn.clear();
	  this.conn.close();
	},
	
 	//run sql with params
 	//className not supported 
 	execute : function(sql, params, className)
	{ 			 		
 		var command = new air.SQLStatement(); 		
 		command.sqlConnection = this.conn; 		
 		command.text = sql; 		
 		if((typeof className != 'undefined') && className!=null)
 			command.itemClass =  className;
 		
 		if(typeof params!='undefined'){
 			if(params.size)
			{
 				for (var i = 0; i < params.length;i ++ )
				{
				  if(params[i] instanceof Date)				
					  command.parameters[i+1] = params[i].toString();
				  else
					  command.parameters[i+1] = params[i]; 					
				}
			}
 			else
			{
 				for( var j in params)
				{
 					var param = params[j];
 					if(param instanceof Date)
	 					command.parameters[j] = param.toString();
	 				else
	 					command.parameters[j] = param;
	 			} 			   				 				
 			}
 			
 		}
 		
 		try{
 		command.execute(); 		
		  return command.getResult();
 		}
		catch(e){
		  air.trace("execute sql failed:" + sql);
		  throw e;
 			
 		} 		
 	},
 	//striping last 4 chars in field names
 	//if you use field names like {id_acc, name_acc} it will be usefull to remove last 4 chars
 	table_strip : function(e){
 		if(e==null) return [];
 		
 		for(var r=0;r<e.length;r++){
 			
 			var row = e[r];
 			
 			for (var i in row)
 			{
 				row[i.substr(0, i.length-4)] = row[i];
 				delete row[i];
 								
 			}
 			
 		}
 		
 		return e;
 		
 	},
 	//update obj row in table
 	update: function (obj, tbl){
 		var sql = 'UPDATE `'+ tbl.name + '` SET ';
 		var primary = ' WHERE ';
 		var j = 0;
 		for(var i = 0; i < tbl.columns.length; i++){
 			if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)] != 'undefined'){
	 			//if(tbl.columns[i].primaryKey) //AIRBUG 
	 			if(tbl.columns[i].name.substr(0, tbl.columns[i].name.length-4)=='id')
					primary += '`'+tbl.columns[i].name+'`=?';
				else{					
					if(j++) sql+=',';
	 				sql+='`'+tbl.columns[i].name+'`=?';	 			
				}
 			}
 		} 		
 		sql += primary; 	
 		var command = new air.SQLStatement(); 		
 		command.sqlConnection = this.conn; 		
 		command.text = sql;
 		var j = 0; 		
 		for(var i=0;i<tbl.columns.length;i++)
 			//if(tbl.columns[i].primaryKey) //AIRBUG 
	 		if(tbl.columns[i].name.substr(0, tbl.columns[i].name.length-4) != 'id')
 				if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]!='undefined')
 					command.parameters[++j]=obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)];
 		
 		for(var i=0;i<tbl.columns.length;i++)
 			//if(tbl.columns[i].primaryKey) //AIRBUG 
	 		if(tbl.columns[i].name.substr(0, tbl.columns[i].name.length-4)=='id')
 				if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]!='undefined')
 					command.parameters[++j]=obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)];
 					
 		command.execute();
 		
 		return true;		
 		
 	},
	

 	//insert new row in table tbl with values from obj
 	insert: function (obj, tbl){
 		var sql = 'INSERT INTO `'+ tbl.name +'` (';
 		//var sufix = tbl.name.substr(tbl.name.length-4, 4);
 		var params = '';
 		
 		var j = 0;
 		
 		for(var i = 0; i < tbl.columns.length; i++){
 			if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]!='undefined'){
	 			if(j++) {sql+=',';params+=',';}
	 			sql+='`'+tbl.columns[i].name+'`';
				params+='?';
 			}
 		}
 		
 		sql = sql + ') values ('+params+')';
 		var command = new air.SQLStatement(); 		
 		command.sqlConnection = this.conn; 		
 		command.text = sql;
 		j = 0; 		
 		for(var i=0;i<tbl.columns.length;i++)
 			if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]!='undefined')
 				command.parameters[++j]=obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)];
 		
 		command.execute(); 		
 		var result = command.getResult(); 		
 		for(var i=0; i< tbl.columns.length; i++)
 			 //if(tbl.columns[i].primaryKey) //AIRBUG 
	 		if(tbl.columns[i].name.substr(0, tbl.columns[i].name.length-4)=='id'){
 			 	obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)] = result.lastInsertRowID;
 			 	break;
 			}
 		
 		return true;
 		
 	},
 	//return table schema from cache
 	get_table : function (table){
 		for(var i=0; i < this.schema.tables.length;i++)
 			if(table == this.schema.tables[i].name)
 				return this.schema.tables[i];
 		return null;
 	},
 	//save obj in table
 	save: function (obj, table){
 		var tbl = this.get_table(table);
 	
 		if(tbl==null) return;
 		
 		var isinsert = false;
 		var isremove = false;
 		var primaryName = '';
 		var primaryValue = 0;
 		for(var i=0;i<tbl.columns.length;i++){
 			//TODO: restore primaryKey detection
 			 //if(tbl.columns[i].primaryKey) //AIRBUG 
	 		if(tbl.columns[i].name.substr(0, tbl.columns[i].name.length-4)=='id'){
 			 	if(typeof obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]=='undefined')
 			 		isinsert = true;
 			 	else if(obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)]<0){
 			 		primaryName=tbl.columns[i].name;
 			 		primaryValue = -obj[tbl.columns[i].name.substr(0,tbl.columns[i].name.length-4)];
 			 		isremove = true;
 			 	}
 			 	break;
 			}
 		}
 		
 		if(isinsert){
 			return this.insert(obj, tbl);
 		}else if(isremove){
 			return this.remove (tbl.name, tbl.columns[i].name,primaryValue );
 		}else{
 			return this.update(obj, tbl);
 		}
 		
 	},	
}

 	

  
 
 	

 	

	
	//delete row from table
 	remove : function(table, column, id){
 		var sql='DELETE FROM `'+table+'` WHERE `'+column+'`=?';
 		var result = DB.execute(sql, [id]);
 		return true;
 	},
	
	///table related shortcuts to save objects
	 	
 	saveAccount : function (obj){
 		return DB.save(obj, 'accounts_acc');
 	},
 	
 	saveService: function (obj){
 		
 		return DB.save(obj, 'services_srv');
 		
 	},
 	
 	savePending:function (obj){
 		
 		return DB.save(obj, 'pending_pnd');
 		
 	},
 	
 	savePhoto:function (obj){
 		
 		return DB.save(obj, 'photos_pho');
 		
 	},
 	savePhotoPhc : function (obj){
 		
 		return DB.save(obj, 'photophc_pct');
 		
 	},
	saveBlog : function (obj){
 		
 		return DB.save(obj, 'blogs_blg');
 		
 	},
 	savePndToPnd : function (obj){
 		
 		return DB.save(obj, 'pnttopnd_ptp');
 		
 	},
 	
 	savePosToPoc : function (obj){
 		
 		return DB.save(obj, 'postopoc_psc');
 		
 	},
 	savePostCategory:function(obj){
 		
 		return DB.save(obj, 'postcategories_poc');
 	},
 	savePhotoCategory:function(obj){
 		
 		return DB.save(obj, 'photocategories_phc');
 	},
 	
 	savePost : function (obj){
 		return DB.save(obj, 'posts_pos');
 	}
 	
 
 	
 };
 

 //====================================
 //sql shortcuts for accounts
 var AccountsDB= {
 	
 	getAccountsByService : function(service){
 		var result = DB.execute('SELECT * FROM accounts_acc WHERE idsrv_acc=:idsrv', {":idsrv":service});
 		return DB.tableStrip(result.data);
 		
 	},
	
	getAccount : function(id){
 		var result = DB.execute('SELECT * FROM accounts_acc where id_acc=?', [id]);
 		
 		var data = DB.tableStrip(result.data);
 		if(data.length)
	 		return data[0];
	 	return null;
 		
 	},
 	
 	getAccountByTitle : function( title ){
 		var result = DB.execute('SELECT * FROM accounts_acc where title_acc=?', [title]);
 		
 		var data = DB.tableStrip(result.data);
 		if(data.length)
	 		return data[0];
	 	return null;
 	},
	
	getService : function(id){
 		var result = DB.execute('SELECT * FROM services_srv where id_srv=?', [id]);
 		
 		var data = DB.tableStrip(result.data);
 		if(data.length)
	 		return data[0];
	 	return null;
 		
 	},
	

 	
 	getAccounts : function(){
 		var result = DB.execute('SELECT * FROM accounts_acc');
 		return DB.tableStrip(result.data);
 	},
 	
 	getServices : function(){
 		
 		var result = DB.execute('SELECT * FROM services_srv');
 		return DB.tableStrip(result.data);
 		
 	},
 	
 	getServicesByType : function (class_srv){
 		
 		var result = DB.execute('SELECT * FROM services_srv WHERE class_srv=:class_srv', {":class_srv":class_srv});
 		return DB.tableStrip(result.data);
 	},
 	
 /*	insertAccount : function (account){
 		with(account){
 			var result = DB.execute('INSERT INTO accounts_acc (idsrv_acc, title_acc, rules_acc) VALUES (?, ?, ?)', 
 					[idsrv, title, rules]);
 			account.id = result.lastInsertRowID;
 		}
 		return account;
 	},
 	
 	updateAccount : function (account){
 		with(account){
 			var result = DB.execute('UPDATE accounts_acc SET idsrv_acc=?, title_acc=?, rules_acc=? WHERE id=?', 
 					[idsrv, title, rules, id]);
 		}
 		return account;
 	},
 	
 	removeAccount : function (id){
 		var result = DB.execute('DELETE FROM accounts_acc WHERE id_acc=?', 
 					[id]);
 	}
 	*/
 }
 //====================================
 //sql shortcuts for blogs
 BlogDB  = {
 	
 	getPosts : function(){
 		var result = DB.execute('SELECT * FROM posts_pos WHERE (ifnull(serverid_pos, 0)>=0) ORDER BY isdraft_pos desc, date(date_pos) desc');
 		return DB.tableStrip(result.data);
 		
 		
 	},
	
	getBlogPosts : function(id){
 		var result = DB.execute('SELECT * FROM posts_pos WHERE (ifnull(serverid_pos, 0)>=0) and idblg_pos=? ORDER BY isdraft_pos desc, date(date_pos) DESC', [id]);
 		return DB.tableStrip(result.data);
 		
 		
 	},

	getBlogPostsDrafts : function(id){
 		var result = DB.execute('SELECT * FROM posts_pos WHERE (ifnull(serverid_pos, 0)>=0) and isdraft_pos=1 and idblg_pos=? ORDER BY date(date_pos) DESC', [id]);
 		return DB.tableStrip(result.data);
 		
 		
 	},

	getBlogPostsFilter : function(id, cat){
 		var result = DB.execute('SELECT posts_pos.* FROM postopoc_psc , posts_pos WHERE id_pos = idpos_psc AND idblg_pos=? AND idpoc_psc = ? ORDER BY isdraft_pos desc, date(date_pos) DESC', [id, cat]);
 		return DB.tableStrip(result.data);
 		
 		
 	},

 	
 	getBlogCats : function(id){
 		var result = DB.execute('SELECT * FROM postcategories_poc WHERE idblg_poc=? ORDER BY name_poc', [id]);
 		return DB.tableStrip(result.data);
 		
 		
 	},
	
	deleteBlogPosts : function(id){
 		var result = DB.execute('DELETE FROM posts_pos WHERE idblg_pos=?', [id]);
 		
 	},
 	
 	getAllPosts: function(){
 		var result = DB.execute('SELECT * FROM posts_pos');
 		return DB.tableStrip(result.data);
 	
 	},
 	
 	getUploadPosts: function (blogid){
 		var result = DB.execute('SELECT * FROM posts_pos WHERE ispublished_pos=0 AND isdraft_pos=0 AND idblg_pos=?', [blogid]);
 		return DB.tableStrip(result.data);
 	
 	},
 	
 	getDownloadPosts : function(blogid){
 		var result = DB.execute('SELECT * FROM posts_pos  WHERE idblg_pos=?', [blogid]);
 		return DB.tableStrip(result.data);
 		
 		
 	},
 	
 	getPost : function(id){
 		var result = DB.execute('SELECT * FROM posts_pos where id_pos=?', [id]);
 		
 		var data = DB.tableStrip(result.data);
 		if(data.length)
	 		return data[0];
	 	return null;
 		
 	},
 	
 	getPostCats : function(id){
 		var result = DB.execute('SELECT idpoc_psc FROM postopoc_psc WHERE idpos_psc=?', [id]);
		var res =  DB.tableStrip(result.data); 
		var ret = {};
		for(var i=0;i<res.length;i++)
			ret[res[i].idpoc] = true;
		
 		return ret;
 	},
 	
 	
 	
 	
 	getPostCatNames : function(id){
 		var result = DB.execute('SELECT name_poc FROM postcategories_poc, postopoc_psc WHERE id_poc=idpoc_psc and idpos_psc = ?', [id]);
		var res =  DB.tableStrip(result.data); 

		var ret = [];
		for(var i=0;i<res.length;i++)
			ret.push(res[i].name);

 		return ret;
 	},
 	
 	getPostCatString: function (id){
 		var result = DB.execute('SELECT name_poc FROM postcategories_poc, postopoc_psc WHERE id_poc=idpoc_psc and idpos_psc = ?', [id]);
		var res =  DB.tableStrip(result.data); 

		var ret = "";
		for(var i=0;i<res.length;i++){
			if(ret.length) ret+=", ";
			ret+=res[i].name;
		}
 		return ret;
 	},
 	
	//unlink all cats from a post
	unlinkPost: function (id){
		var result = DB.execute('DELETE FROM postopoc_psc where idpos_psc=?', [id]);
	},
	
	//link a post to a category
	linkPost: function(id, cat){
		var result = DB.execute('INSERT INTO postopoc_psc (idpos_psc, idpoc_psc) values (?,?)', [id, cat]);
	},
	
	getBlogs : function(id){
 		var result = DB.execute('SELECT * FROM blogs_blg where idacc_blg=?', [id]);
 		

	 	return DB.tableStrip(result.data);
 		
 	},


	
	getBlog : function(id){
 		var result = DB.execute('SELECT * FROM blogs_blg where id_blg=?', [id]);
 		
 		var data = DB.tableStrip(result.data);
 		if(data.length)
	 		return data[0];
	 	return null;
 		
 	},
	
	
	//upload posts to wordpress
	upload : function(blogObj, callback){
		var atom = new Bee.Net.AsyncAtom();
		
		var posts = BlogDB.getUploadPosts(blogObj.blogRules.blogId);
		atom.addHandler('edit', function(i, result, err){
							if(result){
								posts[i].ispublished = 1;
								DB.savePost({id : posts[i].id, ispublished: posts[i].ispublished});
							}
					});
					
		atom.addHandler('insert', function(i,result, err){
							if(result){
								posts[i].ispublished = 1;
								DB.savePost({id : posts[i].id, serverid:posts[i].serverid,  ispublished: posts[i].ispublished});
							}
					});
					

		atom.onfinish = function(){
			if(callback) callback();
		}
		
		
		for (var i=0;i<posts.length;i++){
				if(posts[i].serverid){
					posts[i]['date']=Date.parse(posts[i]['date']);
					posts[i].categories = BlogDB.getPostCatNames(posts[i].id);
					blogObj.editPost(posts[i], atom.getHandler('edit',i));					
				
				}else{
					posts[i]['date']=Date.parse(posts[i]['date']);
					posts[i].categories = BlogDB.getPostCatNames(posts[i].id);				
					blogObj.newPost(posts[i], atom.getHandler('insert', i));
				}
		}
		
		atom.finish();
	},
	
	
	
	//download posts from wordpress
	download : function(blogObj, callback){	
		blogObj.isConnected(function (connected){
			try{
			if(!connected){
				 callback(false);
				 return;				 
				}
			
		    var sqldata = BlogDB.getDownloadPosts(blogObj.blogRules.blogId);


		    var cats = BlogDB.getBlogCats(blogObj.blogRules.blogId);
			   
	
		    var catsHash = {}; 
		    var catsHashId = {};
		    
		    for(var i =0;i<cats.length;i++){
		    	 catsHash[cats[i].name]=cats[i];
		    	 catsHashId[cats[i].id]=cats[i];
		    	}

		    var posts = {};
		    var deleted = {};
			
			
		    for(var i=0;i<sqldata.length;i++) 	{
		    	if(sqldata[i].serverid>=0)
		    		posts[sqldata[i].serverid] = sqldata[i];
		    	else
			    	deleted[-sqldata[i].serverid] = sqldata[i];
		    	}
				
				
		 		blogObj.getPosts(function(data, err){
						if(err){
							var ok = err.faultString.indexOf('there are no posts')>0;
							if(ok){
								for(var i in posts) 
									if(posts[i].ispublished)
										DB.savePost({id:-posts[i]['id']});
							}
							
							callback(ok);
						
						}else{
							var nCatsHash = {};
							var atom = new Bee.Net.AsyncAtom();
					
							atom.addHandler('delete', function(obj, result, err){
								if(result)
									DB.savePost({id:-obj['id']});
								delete this.deleted[obj.serverid];
							});
							
							atom.addHandler('cats', function (obj, result, err){
								
								if(!err){
									for(var i=0;i<result.length;i++)
										if(result[i].name!='Blogroll'){
											var obj = catsHash[result[i].name];
											var shouldSave = true;
											if(obj){
												 result[i].id = obj.id;
												 
												 shouldSave = false;
												 if(result[i].name!=obj.name ||
												 	result[i].serverid!=obj.serverid)
												 		shouldSave=true;
												 	
												 delete catsHashId[result[i].id];
												 //DB.savePostCategory({id:-obj.id});
											}
											if(shouldSave){
												result[i].idblg = blogObj.blogRules.blogId;
												DB.savePostCategory(result[i]);
												nCatsHash[result[i].name] = result[i].id;
											}else{
												nCatsHash[result[i].name] = obj.id;
											}
										}
									
									
									for(var i in catsHashId){
											
											DB.savePostCategory({id:-i});									
									}
									
								}
								
								
								for(var i=0; i<data.length; i++){
				
									data[i].ispublished = 1;
									data[i].isdraft = 0;
									data[i].idblg = blogObj.blogRules.blogId;
									
									var saved = true;
									
									var sqlobj = posts[data[i].serverid];
									
									if(sqlobj){
											if(sqlobj.ispublished){
												data[i].id=sqlobj['id'];
												
												if(data[i].title!=sqlobj.title ||
													data[i].content!=sqlobj.content ||	
														data[i].textmore!=sqlobj.textmore ||
															Date.parse(data[i].date) != Date.parse(sqlobj.date) ){
															DB.savePost(data[i]);
													}
													
											}
											delete posts[data[i].serverid];
									}else{
									
										var delobj = deleted[data[i].serverid];
										
										if(delobj){
											  blogObj.deletePost(data[i].serverid, atom.getHandler('delete', delobj));
											  saved = false;
										}else{
									 		DB.savePost(data[i]);
										}
										
									}
									
									
									
									if(saved){
											if(data[i].categories){
												var dCats = BlogDB.getPostCats(data[i].id);
												var pCats = data[i].categories;
												var sCats = {};
												
												//BlogDB.unlinkPost(data[i].id);
												for(var j=0;j<pCats.length;j++){
													var cat = nCatsHash[pCats[j]];
													if(cat)
													{
														sCats[cat] = true;
														if(!dCats[cat])
															BlogDB.linkPost(data[i].id, cat);
													}
												}
												
												for(var j in dCats){
													if(!sCats[j])
													{
														BlogDB.unlinkPost(data[i].id, j);
													}
												}
											}
									}	
										
										
									
								}
						
							for(var i in posts) 
								if(posts[i].ispublished){
									DB.savePost({id:-posts[i]['id']});
								}
							});
							
							blogObj.getCats( atom.getHandler('cats', null) );

							atom.deleted = deleted;
							
							atom.onfinish=function(){
								var deleted = this.deleted;
								for(var i in deleted) {
									DB.savePost({id:-deleted[i]['id']});
								}		
								callback(true);
							}
							
					
						atom.finish();
						}
				});
					
			}catch(e){ }		
		});

	},

 	
 }
 
 
 Bee.Storage.Db = DB;
 Bee.Storage.Db.Accounts = AccountsDB;
 Bee.Storage.Db.Blog = BlogDB;		
 
 