var saaa_util = {
  file: {
  	write: function(fname, obj){
  		if (!air) 
  			return;
  		var file = new air.FileStream();
  		file.open(new air.File('app-storage:/' + fname), air.FileMode.WRITE);
  		file.writeObject(obj);
  		file.close();
  	},
  	read: function(fname){
  		if (!air) 
  			return "";
  		var file = new air.FileStream();
  		file.open(new air.File('app-storage:/' + fname), air.FileMode.READ);
  		var obj = file.readObject();
  		file.close();
  		return obj;
  	}
  },
  inherits:	function (base, extension)
  {
	for ( var property in base )
	{
	  try
	  {
	     extension[property] = base[property];
	  }
	  catch( e ){
	  	air.trace(e);
	  }
	}
  }  
};
function urlencode(text)
{
  return encodeURIComponent(text);
}

function array_list()
{
   this.list = []; //initialize with an empty array

}
        
array_list.prototype.count = function()
{
   return this.list.length;
};
        
array_list.prototype.add = function( object )
{
   //Object are placed at the end of the array

   return this.list.push( object );
};

array_list.prototype.get_at = function( index ) //Index must be a number
{
   if( index > -1 && index < this.list.length )
      return this.list[index];
   else
      return undefined; //Out of bound array, return undefined

};
        
array_list.prototype.clear = function()
{
   this.list = [];
};

array_list.prototype.remove_at = function ( index ) // index must be a number

{
   var m_count = this.list.length;
            
   if ( m_count > 0 && index > -1 && index < this.list.length ) 
   {
      switch( index )
      {
         case 0:
            this.list.shift();
            break;
         case m_count - 1:
            this.list.pop();
            break;
         default:
            var head   = this.list.slice( 0, index );
            var tail   = this.list.slice( index + 1 );
            this.list = head.concat( tail );
            break;
      }
   }
};

array_list.prototype.insert = function ( object, index )
{
   var m_count       = this.list.length;
   var ret = -1;

   if ( index > -1 && index <= m_count ) 
   {
      switch(index)
      {
         case 0:
            this.list.unshift(object);
            ret = 0;
            break;
         case m_count:
            this.list.push(object);
            ret = m_count;
            break;
         default:
            var head      = this.list.slice(0, index - 1);
            var tail      = this.list.slice(index);
            this.list    = this.list.concat(tail.unshift(object));
            ret = index;
            break;
      }
   }
            
   return ret;
};

array_list.prototype.index_of = function( object, start_index )
{
   var m_count       = this.list.length;
   var ret = - 1;
            
   if ( start_index > -1 && start_index < m_count ) 
   {
      var i = start_index;

      while( i < m_count )
      {
         if ( this.list[i] == object )
         {
            ret = i;
            break;
         }
                    
         i++;
      }
   }
            
   return ret;
};
        
        
array_list.prototype.Last_index_of = function( object, start_index )
{
   var m_count       = this.list.length;
   var ret = - 1;
            
   if ( start_index > -1 && start_index < m_count ) 
   {
      var i = m_count - 1;
                
      while( i >= start_index )
      {
         if ( this.list[i] == object )
         {
            ret = i;
            break;
         }
                    
         i--;
      }
   }
            
   return ret;
};

escape_html = function (str) {                                       
        return(                                                                 
            str.replace(/&/g,'&amp;').                                         
                replace(/>/g,'&gt;').                                           
                replace(/</g,'&lt;').                                           
                replace(/"/g,'&quot;')                                         
        );                                                                     
    };