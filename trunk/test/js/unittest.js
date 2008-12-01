/**
 * Flexible Javascript Unittest Framework
 *
 *http://code.google.com/p/flexible-javascript-unittest/
 *author:pickerel@gmail.com
 *
 * example:
 * 
	<script>
		function xhttp(url, callback)
		{
			if (typeof XMLHttpRequest != 'undefined') {
				httpRequest = new XMLHttpRequest();
			}
			else if (typeof ActiveXObject != 'undefined') {
				httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
			}
			httpRequest.open('GET', url, true);
			httpRequest.onreadystatechange = function () {
				if (httpRequest.readyState == 4) {
					callback(httpRequest.responseText);
				}
			};
			httpRequest.send(null);			
		}	
		window.onload = function(){
			var test1 = new testcase("my firest test", {
				setup: function(){this.val = "abc";},
				teardown: function(){this.val = null;alert("test completed.");},
				test_get_name: function(){
					this.assert_equal("abb", this.val, "test get name");
					this.assert_not_equal("abb", this.val);
				},
				test_get_name1: function(){
					this.assert(false);
					throw "this is an exception";
				},
				async_test_google: function()
				{
					var self = this;					
					xhttp("http://www.google.com", function(html){
						self.assert(html.indexOf("google") > 0);
						self.complete();
					});					
				},
				async_test_yahoo: function()
				{
					var self = this;					
					xhttp("http://www.yahoo.com", function(html){
						self.assert(html, "google");
						self.assert(html.indexOf("yahoo") > 0);
						self.complete();
					});					
				}			
			});
			
			var test2 = new testcase("my second test", {
				test_name: function()
				{
					this.assert(false);
				}
			});				
			test1.run();
			test2.run();
		};
	</script>
 */


// default ui to display the result
var testcase_ui = function(test){
	this.test = test;
	this.on_inited = function(){
		var body = document.getElementsByTagName("body")[0];
		var div = document.createElement('div');
		div.setAttribute("id", test.name);
		body.appendChild(div);
		div.innerHTML = "<h3'>[" + test.name +"]  -- Test Results</h3>" +
						"<ul id='" + test.name +"_results'></ul>";		
	};
	this.on_assert_success = function(assert_name, method_name, message){
        if (message == undefined || message == null)message = assert_name ;        
		var assert_results = this.get_or_create_method_div(method_name);
		var result = document.createElement('li');
		result.setAttribute("style", "color:green;");
		assert_results.appendChild(result);
		result.innerHTML = message + " success</font>";
	};
	this.on_assert_failed = function(assert_name, method_name, default_message, message){
		var assert_results = this.get_or_create_method_div(method_name);
		var result = document.createElement('li');
		result.setAttribute("style", "color:red;");
		assert_results.appendChild(result);
		result.innerHTML = (assert_name + " failed, " + default_message + this.get_message(message) +")</font>");			
	};
	this.on_error = function(name, e){
		var assert_results = this.get_or_create_method_div(name);
		var result = document.createElement('li');
		result.setAttribute("style", "color:red;");
		assert_results.appendChild(result);
		result.innerHTML = ("error<b>:" + e +"</font>");
	};
	this.on_completed = function(test){};	
	this.get_message =  function(msg)
	{
		if (msg == undefined || msg == null)return "";
		return "(" + msg + ")";
	};
	this.get_or_create_method_div = function(method_name)
	{
		var parent = document.getElementById(this.test.name + "_results");
		var e = document.getElementById(this.test.name + "_" + method_name);
		if (e == null)
		{
			var li = document.createElement("li");
			parent.appendChild(li);
			li.innerHTML = "<b>" +method_name + "</b><hr/>";
			
			var e = document.createElement("ol");
			e.setAttribute("id", this.test.name + "_" + method_name)
			li.appendChild(e);
		}
		return e;
	};
}

var testcase_assertion = function( test, method){this.test_method = method; this.test = test;};

testcase_assertion.prototype.failed = function(name, default_message, message){
	this.test.on_assert_failed(name, this.test_method, default_message, message);
};
testcase_assertion.prototype.success = function(name,  message){
	this.test.on_assert_success(name, this.test_method,  message);
};

testcase_assertion.prototype.do_assert = function(name, bool, message, default_message)
{
	try
	{
		if (bool)this.success(name,  message);
			
		else
		{
			this.failed(name, default_message, message);
		}		
	}
	catch(e)
	{
		this.failed(name, e, message);
	}
};
testcase_assertion.prototype.assert = function(bool, msg)
{
	var default_msg = "expected:true, actual:"  + bool;
	//if(msg != null)
	//{
	//	default_msg = msg;
	//	msg = null;
	//}
	this.do_assert("assert", bool,  msg, default_msg);
};
testcase_assertion.prototype.assert_equal = function(expect, actual, msg)
{
	var default_msg =  expect + " != " + actual;
	var bool = (expect == actual);
	this.do_assert("assert_equal", bool, msg, default_msg);	
};
testcase_assertion.prototype.assert_not_equal = function(expect, actual, msg)
{
	var default_msg =  expect + " == " + actual;
	var bool = (expect != actual);
	this.do_assert("assert_not_equal", bool, msg, default_msg);	
};
testcase_assertion.prototype.assert_null = function(actual, msg)
{
	var default_msg =  "actual is not null";
	var bool = (actual == null);
	this.do_assert("assert_null", bool, msg, default_msg);	
};
testcase_assertion.prototype.assert_not_null = function(actual, msg)
{
	var default_msg =  "actual is null";
	var bool = (actual != null);
	this.do_assert("assert_not_null", bool, msg, default_msg);	
};
testcase_assertion.prototype.assert_match = function(value, pattern, msg)
{
	var default_msg = "value " + value + " not match with regex " + pattern;
	var bool = (new RegExp(pattern).exec(value) );
	this.do_assert("assert_match", bool, msg, default_msg);	
};
testcase_assertion.prototype.assert_not_match = function(value, pattern, msg)
{
	var default_msg = "value " + value + " match with regex " + pattern;
	var bool = !(new RegExp(pattern).exec(value) );
	this.do_assert("assert_not_match", bool, msg, default_msg);	
}; 
  

var testcase_context = function(global_context, test, method_name){
	//attach assert methods to the test method.
	var astn = new testcase_assertion();
	for (var m in astn)
	{
		var mt = astn[m];
		if (typeof mt == 'function' && m.indexOf("assert") == 0)
		{
			var f = function(){};
			f.mt = mt;
			f.mn = method_name;
			f.m = m;
			var self = this;
			var tmpfunc = function()
			{
				var telf = this;
				self[telf.m] = function(){
					var a = new testcase_assertion(test, telf.mn);				
					telf.mt.apply(a, arguments);
				}
			};
			tmpfunc.apply(f, arguments);
		}
	}
	for (var f in global_context)
	{
		this[f] = global_context[f];
	}
};

var testcase = function(name, opts, ui){
	this.name = name;
	this.setup = null;
	this.teardown = null;
	this.failed = 0;
	this.passed = 0;
	for (var f in opts)
	{
		this[f] = opts[f];
	}
	if (ui == null)	this.ui = new testcase_ui(this);
};
testcase.prototype.get_name = function(){return "["  + this.name + "]";};
testcase.prototype.run = function()
{
	if (this.ui.on_inited != null)this.ui.on_inited();
	var global_context = {};
	if ( this.setup != undefined && this.setup != null){
		try
		{
			this.setup.apply(global_context, arguments)
		}catch(e)
		{		
			this.on_error("setup", e);
			return;
		}
	};			
	var test_funcs = [];
	var async_test_funcs = [];

	for(var m in this)
	{
		if (typeof this[m] == 'function')
		{
			var minfo = {name: m, method: this[m]};
			if (m.indexOf("async_test_")  == 0)
				async_test_funcs.push(minfo);
			else if (m.indexOf("test_") == 0 )
				test_funcs.push(minfo);
		}			
	}
	// run the async tests.
	var async_test_idx = 0;
	var teardowned = false;
	var self = this;
	var run_async_tests = function()
	{
		var f = async_test_funcs[async_test_idx];			
		var ctx = new testcase_context(global_context, self, f.name);		
		//add complete method for the async test.
		ctx["complete"] = function(){
			if (async_test_idx == async_test_funcs.length - 1)
			{
				self._run_test(test_funcs, global_context);
				self._run_teardown(global_context);	
			}
			else
			{
				async_test_idx++;
				run_async_tests();
				self.ui.on_completed(self);
			}
		}
		try
		{
			f.method.call(ctx);			
		}
		catch(e)
		{
			self.on_error(f.name, e);
			ctx.complete();
		}
	}
	if (async_test_funcs.length > 0)
		run_async_tests();
	else
	{		
		this._run_test(test_funcs, global_context);
		this._run_teardown(global_context);
		this.ui.on_completed(this);		
	}
};

testcase.prototype._run_test = function(test_funcs, global_context){
	for(var i = 0; i < test_funcs.length; i++)
	{
		var f = test_funcs[i]
		try{
			var ctx = new testcase_context(global_context, this, f.name);
			f.method.call(ctx);
		}
		catch(e){
			this.on_error(f.name, e);
		}
	}
};
testcase.prototype._run_teardown = function(global_context){
	if (this.teardown != undefined && this.teardown != null){
		try
		{
			this.teardown.call(global_context);
			return;
		}catch(e)
		{
			this.on_error("teardown", e);
		}
	};	
};
testcase.prototype.on_assert_success = function(assert_name, method_name, message){
	this.ui.on_assert_success(assert_name, method_name, message);
	};
testcase.prototype.on_assert_failed = function(assert_name, method_name, default_message, message){
	this.ui.on_assert_failed(assert_name, method_name, default_message, message);
	};
testcase.prototype.on_error = function(name, e){
	this.ui.on_error(name, e);
};
