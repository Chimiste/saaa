add_scripts(["../src/js/saaa.util.js", "../src/js/air.httpclient.js"], function(){

	new testcase("air.httpclient", {
		   async_test_send: function()
		   {
			   var self = this;					
				var hc = new httpclient("http://www.google.com", {
					completed: function(html){self.assert(html.indexOf("google") > 0);self.complete();},
					http_status: function(event){self.assert_equal(200, event.status);}
				});
				hc.send();
		   },
		   async_test_send_error: function()
		   {
			   var self = this;					
				var hc = new httpclient("http1://www.google.com", {
					error: function(e){self.assert_not_null(e);self.complete();}
				});
				hc.send();
		   }		   
	   }).run();	
});