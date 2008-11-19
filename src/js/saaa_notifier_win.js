var saaa_notifier_win = 
{
	main_win: null,
	message_list: [],
	currrent_message_index: 0,
	showed: false,
	notify: function(message)
	{
		this.message_list.push(message);
		saaa_notifier_win.main_win.win_handle.visible = true;
		if (!saaa_notifier_win.showed)
			saaa_notifier_win.show_message();
		else
			saaa_notifier_win.update_message_info();
		
	},
	update_message_info: function()
	{
		$("#message_info").html((saaa_notifier_win.currrent_message_index + 1) + "/" + saaa_notifier_win.message_list.length);
	},
	show_message: function()
	{
		saaa_notifier_win.showed = true;
		saaa_notifier_win.update_message_info();
		saaa_notifier_win.hide_message_button();		
		$("#message-box").hide();
		$("#message-box").html(saaa_notifier_win.message_list[saaa_notifier_win.currrent_message_index].message);
		$("#message-box").inner_slide("#content", 'left', {duration: 'fast'}, function(){saaa_notifier_win.show_message_button();});				
	},
	init_main_win: function(parent_win, notifier)
	{
		saaa_notifier_win.main_win = new air_win(parent_win, "notify", $("#layout"));
		saaa_notifier_win.notifier = notifier;
		saaa_notifier_win.parent_win = parent_win;

		win = saaa_notifier_win.main_win;
		win.win_handle.visible = false;
		win.buttons.close = $("#close-btn");
		win.init();
		
		//win.add_event_listener("close",  function(){});
		win.show(function(layout){
			layout.slideDown(function(){$(this).fadeIn('slow');});
			$("#prev-msg-btn").click(function(){
				if (saaa_notifier_win.currrent_message_index > 0){
					saaa_notifier_win.currrent_message_index--;
					saaa_notifier_win.show_message();
				}
			});
			$("#next-msg-btn").click(function(){
				if (saaa_notifier_win.currrent_message_index < saaa_notifier_win.message_list.length - 1)
				{
					saaa_notifier_win.currrent_message_index++;
					saaa_notifier_win.show_message();				
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
