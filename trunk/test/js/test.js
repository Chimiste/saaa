//var test_suite = new TestSuite();
var __includes__ = new Array;  
Array.prototype.indexOf = function(obj){ for(var i = 0; i < this.length; i++){if (this[i] == obj)return i;}return -1;}
Array.prototype.add = function(obj){this[this.length] = obj;}

function xhttp(url, callback)
{
    var request = null;
    if (typeof XMLHttpRequest != 'undefined') {
        request = new XMLHttpRequest();
    }
    else if (typeof ActiveXObject != 'undefined') {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            callback(request.responseText);
        }
    };
    request.send(null);			
}

 
function add_scripts(jss, callback)
{
    var func = function( jss, idx, callback){
        if (idx == jss.length) {callback();return};
        add_script(jss[idx], function(){func(jss, ++idx, callback);});
    }
    func(jss, 0, callback);
}
function add_script(js, callback)
{
    if (__includes__.indexOf(js) > -1){callback();return;}
    __includes__.add(js);    
    xhttp(js, function(js_content){
        var head = document.getElementsByTagName('head')[0];	
        script = document.createElement('script');
        head.appendChild(script);
        script.innerHTML = js_content;
        callback();
    });
}

function include_js(js)
{
    if (__includes__.indexOf(js) > -1)return;
    __includes__.add(js);
    var head = document.getElementsByTagName('head')[0];	
    script = document.createElement('script');
    script.src = js;
    script.type = 'text/javascript';
    air.trace("include " + js);
    head.appendChild(script);
}	
window.onload = function(){
    var test_dir = new air.File(air.File.applicationDirectory.nativePath + air.File.separator + "test" );
    var files = test_dir.getDirectoryListing()
    for (i = 0; i < files.length; i++) {
        var file = files[i];
        var ext = ".test.js";
        var path = file.nativePath.toLowerCase();
        if (path.lastIndexOf(ext) == path.length - ext.length)
        {
            var f = path.substring(path.lastIndexOf(air.File.separator) + 1);
            include_js(f);
        }
    }
}