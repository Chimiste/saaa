var saaa_notify = 
{
	main_win: null,
	message_list: [],
	currrent_message_index: 0,
	showed: false,
	notify: function(message)
	{
		this.message_list.push(message);
		if (!saaa_notify.showed)
			saaa_notify.show_message();
		else
			saaa_notify.update_message_info();
		
	},
	update_message_info: function()
	{
		$("#message_info").html((saaa_notify.currrent_message_index + 1) + "/" + saaa_notify.message_list.length);
	},
	show_message: function()
	{
		saaa_notify.showed = true;
		saaa_notify.update_message_info();
		saaa_notify.hide_message_button();		
		$("#message-box").hide();
		$("#message-box").html(saaa_notify.message_list[saaa_notify.currrent_message_index].message);
		$("#message-box").inner_slide("#content", 'left', {duration: 'fast'}, function(){saaa_notify.show_message_button();});				
	},
	init_main_win: function(parent_win)
	{
		saaa_notify.main_win = new air_win(parent_win, "notify", $("#layout"));
		win = saaa_notify.main_win;
		win.buttons.close = $("#close-btn");
		win.init();
		
		
		win.show(function(layout){
			layout.slideDown(function(){$(this).fadeIn('slow');});
			$("#prev-msg-btn").click(function(){
				if (saaa_notify.currrent_message_index > 0){
					saaa_notify.currrent_message_index--;
					saaa_notify.show_message();
				}
			});
			$("#next-msg-btn").click(function(){
				if (saaa_notify.currrent_message_index < saaa_notify.message_list.length - 1)
				{
					saaa_notify.currrent_message_index++;
					saaa_notify.show_message();				
				}			
			});
		});		
		
	},
	show_message_button: function()
	{
		$("#message-controller").show();
	},
	hide_message_button: function()
	{		
		$("#message-controller").hide();
	}	
	
}
